import { Context } from "hono";
import { prisma } from "../../helpers/prisma";
import { Product } from "../../generated/prisma";

// Items are not getting saved properly

export default async function createSale(c: Context) {
  try {
    const { businessId, products, customerId, total, zigTotal, paymentMethod } = await c.req.json();

    // Validate business
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) {
      return c.json({ message: "Business does not exist" }, 400);
    }

    // Validate customer
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      return c.json({ message: "Customer not found" }, 400);
    }

    // Update customer total spent
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        totalSpent: { increment: Number(total) },
        totalSpentZig: { increment: Number(zigTotal) },
      },
    });

    // Create sale
    const sale = await prisma.sale.create({
      data: {
        total: Number(total),
        zigTotal: Number(zigTotal),
        businessId,
        customerId,
        paymentType: paymentMethod,
      },
    });

    // Get sale items
    const saleItems = await prisma.saleItem.findMany({
      where: { saleId: sale.id }
    });

    // Create sale items
    const saleItemsData = products.map((p: { product: Product; quantity: number }) => ({
      productId: p.product.id,
      quantity: p.quantity,
      saleId: sale.id,
    }));

    // Update the sale with the sale items
    await prisma.sale.update({
      where: { id: sale.id },
      data: {
        items: { connect: saleItems.map((item: any) => ({ id: item.id })) }
      }
    });

    // Update product inventories individually
    await Promise.all(
      products.map(({ product, quantity }: { product: Product; quantity: number }) =>
        prisma.product.update({
          where: { id: product.id },
          data: {
            inventory: { decrement: quantity },
          },
        })
      )
    );

    return c.json({
      message: "Sale completed!",
      saleId: sale.id,
    });
  } catch (error) {
    console.error("An error occurred while creating the sale:", error);
    return c.json(
      { message: "An error occurred while creating the sale" },
      500
    );
  }
}