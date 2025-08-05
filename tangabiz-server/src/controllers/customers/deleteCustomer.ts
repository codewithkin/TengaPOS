import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async function deleteCustomer(c: Context) {
    try {
        // Get the Customer's id
        const { id } = await c.req.json();

        // Find out if it exists
        const Customer = await prisma.customer.findUnique({
            where: {
                id
            }
        });

        // Throw an error if the Customer does not exist (for whatever reason) 
        if (!Customer) {
            return c.json({
                message: "Customer does not exist"
            }, 404);
        }

        // Now delete the Customer
        await prisma.customer.delete({
            where: {
                id
            }
        });

        return c.json({
            message: "Customer deleted successfully"
        });
    } catch (e) {
        console.log("An error occured while deleting Customer: ", e);

        return c.json({
            message: "An error occured while deleting your Customer "
        })
    }
}