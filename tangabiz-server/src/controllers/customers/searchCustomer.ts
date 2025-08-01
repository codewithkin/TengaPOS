import { Context } from 'hono'
import { prisma } from '../../helpers/prisma'

export const searchCustomer = async (c: Context) => {
    let searchTerm = c.req.query('searchTerm')?.trim()
    const id = c.req.query('id')

    if (!searchTerm) {
        console.log("SearchTerm is required");
        searchTerm = "/";
    }

    try {
        const customers = await prisma.customer.findMany({
            where: {
                businessId: id,
                AND: [
                    {
                        name: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    }
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return c.json(customers)
    } catch (error) {
        console.error('Error searching customers:', error)
        return c.json({ error: 'Internal server error' }, 500)
    }
}