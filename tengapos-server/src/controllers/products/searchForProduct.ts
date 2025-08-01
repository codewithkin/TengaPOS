import { Context } from "hono"
import { prisma } from "../../helpers/prisma";

async function searchForProduct(c: Context) {
    const searchTerm = c.req.param("searchTerm");
    const businessId = c.req.param("id");

    if (!businessId) {
        return c.json({ error: 'Missing business id (id)' }, 400);
    }

    try {
        const products = await prisma.product.findMany({
            where: {
                businessId,
                name: {
                    contains: searchTerm,
                    mode: 'insensitive'
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return c.json(products);
    } catch (error) {
        console.error('[PRODUCT_SEARCH_ERROR]', error);
        return c.json({ error: 'Failed to search products' }, 500);
    }
}

export default searchForProduct
