import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async function createCustomer(c: Context) {
    try {
        // Get the business id
        const businessId = c.req.query("businessId");

        // get the customer's data
        const {
            name,
            phone
        } = await c.req.json();

        // Find out if the business exists
        const business = await prisma.business.findUnique({
            where: {
                id: businessId
            }
        });

        // If the business does not exist....
        if (!business) {
            // ...throw an error
            return c.json({
                message: "Business does not exist"
            }, 400)
        }

        // Otherwise create the data object
        const customerData: any = {};

        customerData.name = name;

        if (phone) {
            customerData.phone = phone
        }

        // Create the customer 
        const customers = await prisma.customer.create({
            data: customerData
        });

        return c.json({
            message: "Customer created successfully !"
        })

    } catch (e) {
        console.log("An error cocured while creating customer: ", e);

        return c.json({
            message: "An error cocured while creating customer"
        }, 500)
    }
}