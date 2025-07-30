import { Hono } from "hono";
import signUp from "../controllers/auth/signup";
import VerifyEmail from "../controllers/auth/verify-email";
import signIn from "../controllers/auth/signin";
import getAllProducts from "../controllers/products/getAllProducts";
import createProduct from "../controllers/products/createProduct";
import getCustomers from "../controllers/customers/getCustomers";
import createCustomer from "../controllers/customers/createCustomer";
import createSale from "../controllers/sales/createSale";
import deleteCustomer from "../controllers/customers/deleteCustomer";
import upgradePlan from "../controllers/payments/initializePayment";
import initializePayment from "../controllers/payments/initializePayment";
export const routes = new Hono();

/* Auth routes */
routes.post("/auth/signup", signUp);
routes.post("/auth/signin", signIn);
routes.get("/auth/verify-email", VerifyEmail);

/* Product routes */
// Get all products
routes.get("/products", getAllProducts);

// Create a new product
routes.post("/products", createProduct);

// Edit product
routes.put("/products", createProduct);

// Delete product
routes.delete("/products", createProduct);

/* Customer routes */
routes.get("/customers", getCustomers);
routes.delete("/customers", deleteCustomer);
routes.post("/customers", createCustomer);

// Sale routes
routes.post("/sale", createSale);

// Payment routes
routes.post("/payments/initialize", initializePayment);

routes.post("/payments/upgrade", upgradePlan);