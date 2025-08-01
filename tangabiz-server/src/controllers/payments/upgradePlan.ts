import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async function upgradePlan(c: Context) {
    try {
        // Get the business' emailand the plan
        const {
            businessEmail,
            plan
        } = await c.req.json();


        // Check if the business exists (not really necessary but good to prevent errors)
        const business = await prisma.business.findFirst({
            where: {
                businessEmail
            }
        });

        // Throw an error if the business doesn't exist
        if (!business) {
            return c.json({
                message: "This business doesn't exist"
            }, 400);
        }

        // Update the business' plan
        await prisma.business.updateMany({
            // We're using many cause "update" only works for unique inputs and I'm too lazy to set email to unique

            where: {
                businessEmail
            },
            data: {
                plan
            }
        });

        return c.json({
            message: "Plan upgraded successfully !"
        });
    } catch (e) {
        console.log("An error occured while upgrading plan: ", e);

        return c.json({
            message: "An error occured while upgrading your plan"
        }, 400)
    }
}