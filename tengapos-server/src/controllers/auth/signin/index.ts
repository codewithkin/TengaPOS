import { Context } from "hono";
import { prisma } from "../../../helpers/prisma";

export default async function signIn(c: Context) {
    try {
        // Get the business email and password
        const {
            businessEmail,
            password
        } = await c.req.json();

        // Find the business
        const business = await prisma.business.findFirst({
            where: {
                businessEmail
            }
        });

        if (!business) {
            return c.json({
                message: "Business does not exist",
                success: false
            }, 400);
        }

        // Check if the password is correct
        const correctPassword = await Bun.password.verify(password, business?.password);

        if (!correctPassword) {
            return c.json({
                message: "Password is incorrect",
                success: false
            }, 400);
        };

        const safeData = await prisma.business.findFirst({
            where: {
                id: business.id
            },
            select: {
                ownerName: true,
                businessName: true,
                businessEmail: true,
                businessLogo: true,
                verificationTokens: true,
                verified: true,
                plan: true,
                phoneNumber: true,
                location: true,
                isActive: true,
                slug: true,
                createdAt: true
            }
        })

        // Return business data
        return c.json({
            business: safeData,
            message: "Success",
            success: true
        }, 200);
    } catch (e) {
        console.log("An error occured while signing you in: ", e);

        return c.json({
            message: "An error occured while signing user in",
        }, 500)
    }
}