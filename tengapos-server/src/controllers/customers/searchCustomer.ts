import { Context } from 'hono'
import { prisma } from '../../helpers/prisma'

export const searchCustomer = async (c: Context) => {
    const searchTerm = c.req.query('searchTerm')?.trim()
    const id = c.req.query('id')

    if (!searchTerm) {
        return c.json({ error: 'searchTerm is required' }, 400)
    }

    try {
        const customers = await prisma.customer.findMany({
            where: {
                ...(id && { id }),
                OR: [
                    {
                        name: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        phone: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return c.json({ customers }, 200)
    } catch (error) {
        console.error('Error searching customers:', error)
        return c.json({ error: 'Internal server error' }, 500)
    }
}