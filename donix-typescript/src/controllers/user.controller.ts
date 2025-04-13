import { Request,Response,NextFunction } from "express";
import { User } from "../models/userModel";
import { Chat } from "../models/chatModel";
import { io ,onlineUsers} from "..";
import connectDatabase from "../config/db";
import mongoose from "mongoose";
interface TotalUsersList {
    userId: string;
    name: string;
    online: boolean;
    type: string;
  }
  
  interface Message {
    message: string;
    senderId: string;
    receiverId: string;
    dateAndTimeSend: string;
    senderName: string;
  }

export class UserController {
    static async getAllUsers(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            await connectDatabase();
            const users = await User.find();

            const userList = users.map(user => ({
                userId: user._id.toString(),
                name: user.name,
                type: user.role || "User",
                online: !!onlineUsers[user._id.toString()],
            }));
            res.json(userList);
        } catch (err: any) {
            console.error("Error in getAllUsers method", err);
            res.status(500).json({ error: "Internal Server Error", details: err.message });
        }
    }

    static async getChatHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { senderId, receiverId } = req.query as { senderId: string; receiverId: string };

            console.log("sender id , ", senderId,"receiver id : ",receiverId)
    
          if (!senderId || !receiverId) {
            res.status(400).json({ error: "Both senderId and receiverId are required" });
            return;
          }
    
          await connectDatabase();
    
          const messages = await Chat.find({
            $or: [
              { sender: new mongoose.Types.ObjectId(senderId), receiver: new mongoose.Types.ObjectId(receiverId) },
              { sender: new mongoose.Types.ObjectId(receiverId), receiver: new mongoose.Types.ObjectId(senderId) },
            ],
          }).sort({ timestamp: 1 });
    
          res.status(200).json({
            history: messages,
          });
        } catch (error) {
          console.error("Error fetching chat history:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }

      static async messageStore(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        try {
          await connectDatabase();
          
          const { senderId, receiverId, dateAndTimeSend, message } = req.body;
      
          if (!senderId || !receiverId || !message) {
            res.status(400).json({ error: "Missing required fields." });
            return;
          }
      
          const newMessage = await Chat.create({
            sender: senderId,
            receiver: receiverId,
            timestamp: dateAndTimeSend || new Date().toISOString(),
            message: message,
          });
      
          io.to(receiverId).emit("receiveMessage", newMessage);
      
          res.status(201).json({ success: true, message: "Message stored successfully", data: newMessage });
        } catch (error: any) {
          console.error("Error storing message:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
      
}
