import { Hono } from "hono";
import signUp from "../controllers/auth/signup";
import VerifyEmail from "../controllers/auth/verify-email";
export const routes = new Hono();

routes.post("/auth/signup", signUp);
routes.get("/auth/verify-email", VerifyEmail);