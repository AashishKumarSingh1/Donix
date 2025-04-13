import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class userRoute{
    static userRoute(){
        const router = Router();
        router.route("/get-all").get(UserController.getAllUsers);
        router.route("/chat-history").get(UserController.getChatHistory);
        router.route('/message-send').post(UserController.messageStore);
        return router;
    }
}