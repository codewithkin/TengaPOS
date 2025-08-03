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
import getAllData from "../controllers";
import editProduct from "../controllers/products/editProduct";
import searchForProduct from "../controllers/products/searchForProduct";
import { searchCustomer } from "../controllers/customers/searchCustomer";
import getSale from "../controllers/sales/getSale";
import downloadSale from "../controllers/sales/downloadSale";
import getRecentSales from "../controllers/sales/getRecentSales";
import getSalesAnalytics from "../controllers/sales/getSalesAnalytics";
import { getTopSellingProducts } from "../controllers/products/topSellingProducts";
import getSales from "../controllers/sales/getSales";
export const routes = new Hono();

// Get all data
routes.get("/", getAllData);

/* Auth routes */
routes.post("/auth/signup", signUp);
routes.post("/auth/signin", signIn);
routes.get("/auth/verify-email", VerifyEmail);

/* Product routes */
// Get all products
routes.get("/products", getAllProducts);

// Get top selling products
routes.get("/products/top-selling", getTopSellingProducts);

// Create a new product
routes.post("/products", createProduct);

// Search for a product
routes.get("/products/search", searchForProduct);

// Edit product
routes.put("/products", editProduct);

// Delete product
routes.delete("/products", createProduct);

/* Customer routes */
routes.get("/customers", getCustomers);
routes.get("/customers/search", searchCustomer);
routes.delete("/customers", deleteCustomer);
routes.post("/customers", createCustomer);

// Sale routes
routes.post("/sale", createSale);
routes.get("/sale", getSale);
routes.get("/sales", getSales);
routes.get("/sale/download", downloadSale);
routes.get("/sales/recent", getRecentSales);
routes.get("/sales/analytics", getSalesAnalytics);

// Payment routes
routes.post("/payments/initialize", initializePayment);

routes.post("/payments/upgrade", upgradePlan);