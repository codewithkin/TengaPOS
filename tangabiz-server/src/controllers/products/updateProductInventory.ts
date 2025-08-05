import { prisma } from "../../helpers/prisma"
import { HTTPException } from "hono/http-exception"
import { Context } from "hono"

// Update product inventory
const updateProductInventory = async (c: Context) => {
    const { productId, adjustment, businessId } = await c.req.json()
  
    if (!businessId) {
      throw new HTTPException(400, { message: 'Business ID is required' })
    }
  
    if (typeof adjustment !== 'number') {
      throw new HTTPException(400, { message: 'Invalid adjustment value' })
    }
  
    try {
      // Verify product belongs to business
      const product = await prisma.product.findFirst({
        where: { 
          id: productId,
          businessId 
        }
      })
  
      if (!product) {
        throw new HTTPException(404, { message: 'Product not found' })
      }
  
      // Update inventory
      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          inventory: {
            increment: adjustment
          }
        },
        include: {
          _count: {
            select: {
              sales: true
            }
          }
        }
      })
  
      // Return consistent format
      return c.json({
        id: updatedProduct.id,
        name: updatedProduct.name,
        inventory: updatedProduct.inventory,
        totalSales: updatedProduct._count.sales
      })
    } catch (error) {
      console.error('Inventory update error:', error)
      throw new HTTPException(500, { message: 'Failed to update inventory' })
    }
}

export default updateProductInventory;