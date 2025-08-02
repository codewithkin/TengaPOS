import { Context } from 'hono';
import { prisma } from '../../helpers/prisma';

export const getTopSellingProducts = async (c: Context) => {
  try {
    const { businessId, period, limit } = c.req.query();

    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    if (period === 'this-month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'last-month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else { // this-year
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    // Get top selling products
    const topProducts = await prisma.product.findMany({
      where: {
        businessId,
        sales: {
          some: {
            sale: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
        },
      },
      include: {
        sales: {
          where: {
            sale: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
            },
          },
          select: {
            quantity: true,
          },
        },
      },
      take: Number(limit),
    });

    // Calculate total sales and format response
    const formattedProducts = topProducts.map((product) => {
      const totalSold = product.sales.reduce((sum, item) => sum + item.quantity, 0);
      const totalRevenue = totalSold * product.price;
      
      return {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        totalSold,
        totalRevenue,
      };
    }).sort((a, b) => b.totalRevenue - a.totalRevenue);

    // Calculate percentage change from previous period
    let previousPeriodTotal = 0;
    let percentageChange = 0;

    if (period === 'this-month') {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const lastMonthSales = await prisma.saleItem.aggregate({
        where: {
          product: {
            businessId,
          },
          sale: {
            createdAt: {
              gte: lastMonthStart,
              lte: lastMonthEnd,
            },
          },
        },
        _sum: {
          quantity: true,
        },
      });

      previousPeriodTotal = (lastMonthSales._sum.quantity || 0);
      const currentTotal = formattedProducts.reduce((sum, p) => sum + p.totalSold, 0);
      
      if (previousPeriodTotal > 0) {
        percentageChange = ((currentTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
      }
    }

    return c.json({
      success: true,
      data: {
        products: formattedProducts,
        totalRevenue: formattedProducts.reduce((sum, p) => sum + p.totalRevenue, 0),
        percentageChange,
        period,
      },
    });
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    return c.json({
      success: false,
      message: 'Failed to fetch top selling products',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
};