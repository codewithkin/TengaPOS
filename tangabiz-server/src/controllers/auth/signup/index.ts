import { Context } from "hono";
import { prisma } from "../../../helpers/prisma";
import { randomUUIDv7 } from "bun";
import { sendVerificationEmail } from "../../../helpers/email/sendVerificationEmail";

export default async function signUp(c: Context) {
    try {
        // Get the user's data
        const {
            ownerName,
            businessName,
            businessEmail,
            businessLogo,
            password
        } = await c.req.json();

        const data: any = {};

        const businessExists = await prisma.business.findFirst({
            where: {
                businessEmail
            }
        });

        if (businessExists) {
            return c.json({
                message: "Business already exists, please sign in",
                success: false
            }, 400);
        }

        const hashedPassword = await Bun.password.hash(password);

        if (businessLogo) {
            data.ownerName = ownerName;
            data.businessName = businessName;
            data.businessEmail = businessEmail;
            data.businessLogo = businessLogo;
            data.password = hashedPassword;
        } else {
            data.ownerName = ownerName;
            data.businessName = businessName;
            data.businessEmail = businessEmail;
            data.password = hashedPassword;
        }

        // Create a new user in the db
        const business = await prisma.business.create({
            data
        });

        // generate a token
        const verificationToken = randomUUIDv7();

        // Create a new business verification token
        await prisma.verificationTokenBusiness.create({
            data: {
                token: verificationToken,
                business: {
                    connect: {
                        id: business.id
                    }
                }
            }
        });

        // Send verification email
        await sendVerificationEmail({
            to: businessEmail,
            name: businessName,
            token: verificationToken,
            type: "business"
        });

        // Return a success message
        return c.json({
            message: "User created successfully",
            success: true
        }, 200);
    } catch (e) {
        console.log("An error occured while signing user up: ", e);

        return c.json({
            message: "An error occured while signing you up",
            success: false
        }, 500);
    }
}