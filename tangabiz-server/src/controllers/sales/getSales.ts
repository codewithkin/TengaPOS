import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

// Updated backend controller with pagination
export default async function getSales(c: Context) {
    const { businessId, page = 1, limit = 10 } = c.req.query();
    const skip = (Number(page) - 1) * Number(limit);
  
    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where: { businessId },
        include: {
          customer: true,
          items: { include: { product: true } }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.sale.count({ where: { businessId } })
    ]);
  
    return c.json({
      data: sales,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  }