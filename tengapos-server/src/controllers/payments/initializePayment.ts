import { Context } from "hono";
import { Paynow } from "paynow";

export default async function initializePayment(c: Context) {
    try {
        // Get the plan and price
        const {
            plan,
            price,
            businessEmail
        } = await c.req.json() as {
            plan: string,
            price: string,
            businessEmail: string
        }

        const numberPrice = parseInt(price);

        const paynow = new Paynow(process.env.PAYNOW_INTEGRATION_ID, process.env.PAYNOW_INTEGRATION_KEY);

        let payment = paynow.createPayment("Invoice 35");

        // Add the items to the cart
        payment.add(plan, numberPrice);

        paynow.returnUrl = `${process.env.FRONTEND_URL}/payments?success=true&email=${businessEmail}&plan=${plan}`;
        paynow.resultUrl = `${process.env.FRONTEND_URL}/payments`;

        // Save the response from paynow in a variable
        const res = await paynow.send(payment);
        console.log(res);

        if (res?.status === "ok") {
            console.log("Success");

            // Get the link to redirect the user to
            let link = res?.redirectUrl;

            console.log("Link: ", link);

            return c.json({
                message: "Success",
                link
            });
        }

        console.log("An error occured", res);

        return c.json({
            message: "An error occured"
        }, 400)
    } catch (e) {
        console.log("An error occured while upgrading plan: ", e);

        return c.json({
            message: "An error occured while upgrading your plan"
        }, 500)
    }
}