import { Hono } from "hono";
import signUp from "../controllers/auth/signup";
import VerifyEmail from "../controllers/auth/verify-email";
import signIn from "../controllers/auth/signin";
export const routes = new Hono();

/* Auth routes */
routes.post("/auth/signup", signUp);
routes.post("/auth/signin", signIn);
routes.get("/auth/verify-email", VerifyEmail);

/* Product routes */
// Get all products
routes.get("/products", );