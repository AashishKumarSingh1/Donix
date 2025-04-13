import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { User } from "../models/userModel";
import sendVerificationEmail from "../utils/sendVerificationEmail";
import connectDatabase from "../config/db";
import { Notification } from "../models/notificationModel";
export class RegisterController{
    static async signUp(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const {name,email,password,phone,address,role}=req.body;
            if (!name || !email || !password || !phone || !address || !role) {
                res.status(400).json({ error: "All fields are required!" });
                return;
            }

            const token=jwt.sign(
                {email,name,password,role,address,phone},
                process.env.JWT_SECRET as string,
                {expiresIn:"15m"}
            );

            const verificationUrl=`${process.env.FRONTEND_ENDPOINT}/auth/verify-email?token=${token}`;

            await sendVerificationEmail(email,verificationUrl);

            res.status(200).json({
                message:"Verification email sent successfully!",
                verificationUrl:verificationUrl,
            });

        }catch (err: any) {
            console.error("Error in signup route:", err);
            res.status(500).json({ error: "Internal Server Error", details: err.message });
        }
    }

    static async verifyEmail(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const token=req.query.token as string;
            // console.log(token)
            if (!token){
                res.status(400).json({error:"Invalid token"});
                return ;
            }

            const decoded=jwt.verify(token,process.env.JWT_SECRET as string) as {
                name:string;
                email:string;
                password:string;
                phone:string;
                address:string;
                role:string;
                blockchainAddress: string;
            };
            await connectDatabase();
            
            const hashedPassword = await bcrypt.hash(decoded.password,10);
            const user=await User.create({
                name:decoded.name,
                email:decoded.email,
                password:hashedPassword,
                phone:decoded.phone,
                address:decoded.address,
                role:decoded.role,
                blockchainAddress: decoded.blockchainAddress,
            });

            // const newNotification = await Notification.create({
            //     sender: "system",
            //     receiver: "super-admin",
            //     forAll: false,
            //     title: "Granting Access",
            //     message: `New User Created with role ${user.role} having id as ${user._id}`,
            //     link: `<a href="${process.env.FRONTEND_ENDPOINT}/api/isVerified" target="_blank">Verify User</a>`,
            // });

            // io.emit("super-admin-user-verification",newNotification._id);

            res.status(201).json({message:"User created successfully!",user});
        }catch(err:any){
            console.error("Error in verification route:", err);
            res.status(500).json({ error: "Internal Server Error", details: err.message });
        }
    }

    static async verifyFromSuperAdmin(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const {userId,verificationStatus}=req.body;
            if(!userId|| !verificationStatus){
                res.status(400).json({error:"User Id and Verification Status are required!"});
                return ;
            }

            const user=await User.findById(userId);
            if(!user){
                res.status(404).json({error:"User not found"});
                return;
            }

            if(user.isVerified){
                res.status(400).json({error:"User is already verified!"});
                return;
            }

            user.isVerified = true;
            await user.save();

            await Notification.create({
                sender: "super-admin",
                receiver: userId,
                forAll: false,
                title: "Account Verified",
                message: `Your account has been successfully verified by the super admin.`,
                link: `${process.env.FRONTEND_ENDPOINT}/dashboard`,
            });

            res.status(200).json({ message: "User verified successfully!", user });
        }catch (error: any) {
            console.error("Error in verifying user from super admin:", error);
            res.status(500).json({ error: "Internal Server Error", details: error.message });
        }
    }

    static async login(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
            const {email,password}=req.body;

            if(!email || !password){
                res.status(400).json({error:"Email and password are required!"});
                return;
            }
            await connectDatabase();
            const user=await User.findOne({email});
            if(!user){
                res.status(404).json({error:"User not found!"});
                return;
            }

            const isMatch=await bcrypt.compare(password,user.password);
            if(!isMatch){
                res.status(400).json({error:"Invalid credentials!"});
                return;
            }

            // if(!user.isVerified){

            // }

            const token=jwt.sign(
                {
                    id:user._id,
                    name:user.name,
                    role:user.role,
                    isVerified:user.isVerified,
                },
                process.env.JWT_SECRET as string,
                {expiresIn:"7d"}
            );
            res.status(200).json({
                message:"Login Successfull!",
                token,
                user:{
                    id:user._id,
                    name:user.name,
                    role:user.role,
                    isVerified:user.isVerified,
                },
            });
        }catch(error:any){
            console.log("Error in login route:",error);
            res.status(500).json({error:"Internal Server Error",details:error.message})
        }
    }
}