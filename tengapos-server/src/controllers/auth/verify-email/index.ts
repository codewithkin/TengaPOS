import { Context } from "hono";
import { prisma } from "../../../helpers/prisma";

export default async function VerifyEmail(c: Context) {
    try {
        // Get the token
        const token = c.req.query("token");
        const type = c.req.query("type");

        if (type === "business") {
            // Find the verification token
            const verificationTokenBusiness = await prisma.verificationTokenBusiness.findFirst({
                where: {
                    token
                }
            });

            // Verify the business
            const verified = await prisma.business.update({
                where: {
                    id: verificationTokenBusiness?.businessId
                },
                data: {
                    verified: true
                }
            });

            return c.redirect("TengaPOS://");
        }

        // Find the verification token
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                token
            }
        });

        // Verify the user
        const verified = await prisma.user.update({
            where: {
                id: verificationToken?.userId
            },
            data: {
                verified: true
            }
        });

        return c.redirect("TengaPOS://");
    } catch (e) {
        console.log("An error occured while verfying the user's email: ", e);

        return c.json({
            message: "An error occured while verfying your email",
            success: false
        }, 500);
    }
}