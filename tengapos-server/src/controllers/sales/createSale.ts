import { Context } from "hono";
import { prisma } from "../../helpers/prisma";
import { Product } from "../../generated/prisma";

export default async function createSale(c: Context) {
    try {
        // Get the business's id
        const businessId = c.req.query("businessId") || "";

        // Get the sale data
        const {
            productIds,
            name,
            phone,
            total,
            zigTotal,
            paymentType,
        } = await c.req.json();

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
        let customer = await prisma.customer.findFirst({
            where: {
                name
            }
        });

        if (!customer) {
            // Create the customer and update the customer to match this
            customer = await prisma.customer.create({
                data: {
                    name,
                    phone,
                    businessId
                }
            });
        }

        // Get the products
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        }) as any[];

        // Create the sale
        const sale = await prisma.sale.create({
            data: {
                total,
                zigTotal,
                businessId,
                customerId: customer.id,
                items: {
                    connect: productIds.map((id: string) => ({ id })),
                },
                paymentType
            },
        });

        return c.json({
            message: "Sale completed !",
            sale
        })
    } catch (e) {
        console.log("An error occured while creating the sale: ", e);

        return c.json({
            message: "An error occured while creating the sale"
        }, 500)
    }
}