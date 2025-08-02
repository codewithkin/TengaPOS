import { Context } from "hono";
import { prisma } from "../helpers/prisma";

export default async function getAllData(c: Context) {
    try {
        // Get the businessId from query params
        const businessId = c.req.query("businessId");

        // Find the business with the matching ID
        const business = await prisma.business.findUnique({
            where: {
                id: businessId
            }
        });

        // Throw an error if the business does not exist (highly unlikely but meh..)
        if (!business) {
            return c.json({
                message: "Business does not exist"
            }, 400);
        }

        // Sale number
        const sales = await prisma.sale.count({
            where: {
                businessId
            }
        });

        // Customer count
        const customers = await prisma.customer.count({
            where: {
                businessId
            }
        });
        
        // Products
        const products = await prisma.product.count({
            where: {
                businessId
            }
        });

        // Return the business's data
        return c.json({
            sales,
            customers,
            products
        });
    } catch (e) {
        console.log("An error occured while getting data: ", e);

        return c.json({
            message: "An error occured while getting your data"
        }, 500);
    }
}