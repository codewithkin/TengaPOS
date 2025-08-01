import { Context } from "hono";
import { prisma } from "../../helpers/prisma";
import { uploadToSevalla } from "../../helpers/uploadToSevalla";

export default async function editProduct(c: Context) {
    try {
        const {
            productName,
            productDescription,
            price,
            quantity,
            zigPrice,
            imageBase64,
            productId: id
        } = await c.req.json();

        // Find the product
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return c.json({ message: "Product not found" }, 404);
        }

        // Handle image upload if a new base64 string is provided
        let imageUrl = product.imageUrl; // default to current image
        if (imageBase64 && imageBase64 !== "") {
            imageUrl = await uploadToSevalla(imageBase64);
        }

        // Update the product
        const updated = await prisma.product.update({
            where: { id },
            data: {
                name: productName,
                description: productDescription,
                price,
                quantity,
                zigPrice,
                imageUrl,
            },
        });

        return c.json({
            message: `Product "${updated.name}" updated successfully!`,
            product: updated,
        });
    } catch (e) {
        console.error("Error updating product:", e);
        return c.json(
            { message: "An error occurred while updating the product" },
            500
        );
    }
}