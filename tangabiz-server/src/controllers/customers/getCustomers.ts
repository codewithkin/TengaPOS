import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async function getCustomers(c: Context) {
    try {
        // Get the business's id
        const id = c.req.query("id");

        // Find out if the business exists
        const business = await prisma.business.findUnique({
            where: {
                id
            }
        });

        // If the business does not exist...
        if (!business) {
            // ..throw an error
            return c.json({
                message: "Business does not exist"
            }, 400);
        }

        // Get the customers
        const customers = await prisma.customer.findMany({
            where: {
                businessId: id
            }
        });

        return c.json(customers);
    } catch (e) {
        console.log("An error occured while getting customers: ", e);

        return c.json({
            message: "An error occured while getting your customers"
        }, 500)
    }
}