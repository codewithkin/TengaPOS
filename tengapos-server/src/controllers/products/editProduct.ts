import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async function editProduct(c: Context) {
    try {
        // Get the product data and business data
        const {
            id: businessId,
            productId,
            productName,
            productDescription,
            price,
            imageUrl,
            quantity,
            zigPrice
        } = await c.req.json();

        // Check if the business exists (not really necessary but good to prevent errors)
        const business = await prisma.business.findUnique({
            where: {
                id: businessId
            }
        });

        // Throw an error if the business doesn't exist
        if (!business) {
            return c.json({
                message: "This business doesn't exist"
            }, 400);
        }

        // edit the product
        await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                businessId,
                name: productName,
                description: productDescription,
                price,
                imageUrl,
                quantity,
                zigPrice
            }
        });

        // Return a success message
        return c.json({
            message: "editd product " + productName + " successfully !"
        });
    } catch (e) {
        console.log("An errror occured while creating this product: ", e);

        return c.json({
            message: "An errror occured while creating your product"
        }, 500);
    }
}