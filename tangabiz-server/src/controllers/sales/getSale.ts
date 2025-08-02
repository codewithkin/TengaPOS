import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async function getSale(c: Context) {
    const { saleId } = c.req.query();

    const sale = await prisma.sale.findUnique({
        where: { id: saleId },
        include: {
            customer: true,
            business: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    return c.json(sale);
}