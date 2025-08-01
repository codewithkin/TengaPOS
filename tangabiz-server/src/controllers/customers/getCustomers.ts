import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async function getCustomers(c: Context) {
    try {
        // Get the business's id
        const id = c.req.query("id");

        // Check if an individual customer Id was provided (this means the user wants to fetch a single customer)
        const customerId = c.req.query("customerId");

        // If a customerId was provided, fetch the customer
        if (customerId) {
            const customer = await prisma.customer.findUnique({
                where: {
                    id: customerId
                }
            });

            return c.json(customer);
        };

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