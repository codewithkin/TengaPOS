import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async (c: Context) => {
    const { businessId } = c.req.query();

    const sales = await prisma.sale.findMany({
        where: {
            businessId
        },
        take: 5,
        include: {
            customer: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return c.json(sales);
}