import { prisma } from "../../helpers/prisma";
import { Context } from "hono";

export default async function editCustomer(c: Context) {
    try {
        const { id, ...data } = await c.req.json();

        const customer = await prisma.customer.update({
            where: { id },
            data
        });

        return c.json(customer);
    } catch (error) {
        return c.json({ error: "Failed to edit customer" }, 500);
    }
}