import { prisma } from "../../helpers/prisma"
import { HTTPException } from "hono/http-exception"
import { Context } from "hono"

// Get all products with inventory data (including products with zero sales)
const getAllProducts = async (c: Context) => {
  const businessId = c.req.query('id')
  
  if (!businessId) {
    throw new HTTPException(400, { message: 'Business ID is required' })
  }

  try {
    // First verify business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId }
    })

    if (!business) {
      throw new HTTPException(404, { message: 'Business not found' })
    }

    // Get all products including sales count
    const products = await prisma.product.findMany({
      where: { businessId },
      include: {
        _count: {
          select: {
            sales: true
          }
        },
        sales: {
          select: {
            quantity: true
          },
          take: 1 // Just need one to calculate if needed
        }
      },
      orderBy: {
        inventory: 'desc'
      }
    })

    // Transform products to include total sales
    const productsWithSales = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      inventory: product.inventory,
      price: product.price,
      zigPrice: product.zigPrice,
      imageUrl: product.imageUrl,
      totalSales: product._count.sales,
      // Calculate total quantity sold if needed
      totalQuantitySold: product.sales.reduce((sum, sale) => sum + sale.quantity, 0)
    }))

    return c.json(productsWithSales)
  } catch (error) {
    console.error('Inventory fetch error:', error)
    throw new HTTPException(500, { message: 'Failed to fetch inventory' })
  }
    }

    export default getAllProducts;