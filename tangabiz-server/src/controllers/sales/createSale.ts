import { Context } from "hono";
import { prisma } from "../../helpers/prisma";


export default async function createSale(c: Context) {
    try {
        // Get the business's id

        // Get the sale data
        const data = await c.req.json();

        const businessId = data.businessId;

        let { productIds, customerId, total, zigTotal, paymentMethod } = data;

        console.log(data);

        total = Number(total);
        zigTotal = Number(zigTotal);

        // Find out if the business exists
        const business = await prisma.business.findUnique({
            where: {
                id: businessId
            }
        });

        // If the business does not exist...
        if (!business) {
            // ..throw an error
            return c.json({
                message: "Business does not exist"
            }, 400);
        }

        // Find out if the customer is registered, if not....create an entry for them
        let customer = await prisma.customer.findUnique({
            where: {
                id: customerId
            }
        });

        // Update the customer's total spent values
        await prisma.customer.update({
            where: { id: customerId },
            data: {
                totalSpent: {
                    increment: total,
                },
                totalSpentZig: {
                    increment: zigTotal,
                },
            },
        });

        // Create the sale
        const sale = await prisma.sale.create({
            data: {
                total,
                zigTotal,
                businessId,
                customerId: customerId,
                items: {
                    connect: productIds.map((id: string) => ({ id })),
                },
                paymentType: paymentMethod
            },
        });

        // Return the sale id
        return c.json({
            message: "Sale completed !",
            saleId: sale.id
        })
    } catch (e) {
        console.log("An error occured while creating the sale: ", e);

        return c.json({
            message: "An error occured while creating the sale"
        }, 500)
    }
}