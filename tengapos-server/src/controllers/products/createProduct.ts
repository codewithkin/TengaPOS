import { Context } from "hono";
import { prisma } from "../../helpers/prisma";
import { uploadToSevalla } from "../../helpers/uploadToSevalla";

export default async function createProduct(c: Context) {
    try {
        const {
            id: businessId,
            productName,
            productDescription,
            price,
            quantity,
            zigPrice,
            imageBase64,
        } = await c.req.json();

        // Check if the business exists
        const business = await prisma.business.findUnique({
            where: { id: businessId },
        });

        if (!business) {
            return c.json(
                { message: "This business doesn't exist" },
                400
            );
        }

        // Upload the image to Sevalla if base64 string is provided
        let imageUrl = "";
        if (imageBase64) {
            imageUrl = await uploadToSevalla(imageBase64);
        }

        // Create the product with uploaded image URL
        const newProduct = await prisma.product.create({
            data: {
                businessId,
                name: productName,
                description: productDescription,
                price,
                quantity,
                zigPrice,
                imageUrl,
            },
        });

        return c.json({
            message: `Created product ${productName} successfully!`,
            productId: newProduct.id
        });
    } catch (e) {
        console.error("Error creating product:", e);
        return c.json(
            { message: "An error occurred while creating your product" },
            500
        );
    }
}