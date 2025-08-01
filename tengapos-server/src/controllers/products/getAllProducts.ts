import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async function getAllProducts(c: Context) {
    try {
        // Get the business's id
        const id = c.req.query("id");
        const productId = c.req.query("productId");

        if (productId) {
            // Find the individual product 
            const product = await prisma.product.findUnique({
                where: {
                    id: productId
                },
                include: {
                    _count: {
                        select: {
                            sales: true
                        }
                    }
                }
            });

            // Return an error if the product cannot be found
            if (!product) {
                return c.json({
                    message: "Product does not exist"
                }, 400);
            }

            // Return the product data
            return c.json(product);
        }

        // Find the business with that id
        const business = await prisma.business.findUnique({
            where: {
                id
            }
        });

        // Throw an error if the business doesn't exist
        if (!business) {
            return c.json({
                message: "This business doesn't exist"
            }, 400);
        }

        // Otherwise....get the business' products
        const products = await prisma.product.findMany({
            where: {
                businessId: id
            },
            include: {
                _count: {
                    select: {
                        sales: true
                    }
                }
            }
        });

        // Return the products
        return c.json(products);
    } catch (e) {
        console.log("An error occured while getting business's products: ", e);

        return c.json({
            message: "An error occured while getting your products: "
        }, 500)
    }
}