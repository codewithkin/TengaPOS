import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async function deleteProduct(c: Context) {
    try {
        // Get the product's id
        const productId = c.req.query("productId");

        // Find out if it exists
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        });

        // Throw an error if the product does not exist (for whatever reason) 
        if (!product) {
            return c.json({
                message: "Product does not exist"
            }, 404);
        }

        // Now delete the product
        await prisma.product.delete({
            where: {
                id: productId
            }
        });

        return c.json({
            message: "Product deleted successfully"
        });
    } catch (e) {
        console.log("An error occured while deleting product: ", e);

        return c.json({
            message: "An error occured while deleting your product "
        })
    }
}