import { Router } from "express";
import { RegisterController } from "../controllers/register.controller";

export class registerRoute {
    static registerRoute() {
        const router = Router();
        router.route("/sign-up").post(RegisterController.signUp);
        router.route("/verify-email").get(RegisterController.verifyEmail);
        router.route("/verify-from-super-admin").post(RegisterController.verifyFromSuperAdmin);
        router.route("/login").post(RegisterController.login);
        return router;
    }
}