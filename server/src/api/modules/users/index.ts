import { Router } from "express";
import { UserController } from "./controller";
import { validateRequest } from "../../middlewares";
import { LoginValidationSchema, RegisterValidationSchema } from "./validations";

export const userRouter = Router();

userRouter.route("/")
.get(UserController.getAll);

userRouter.route("/me")
.get(UserController.getMe);

userRouter.route("/login")
.post(
  [validateRequest(LoginValidationSchema)],
  UserController.login
);

userRouter.route("/register")
.post(
  [validateRequest(RegisterValidationSchema)],
  UserController.register
);