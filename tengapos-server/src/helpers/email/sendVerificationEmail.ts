import nodemailer from "nodemailer";

type SendVerificationEmailOptions = {
    to: string;
    name: string;
    token: string;
    type: string
};

export async function sendVerificationEmail({ to, name, token, type }: SendVerificationEmailOptions) {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_PROVIDER,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const verificationUrl = `${process.env.BACKEND_URL}/verify-email?token=${token}&type=${type}`;

    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        to,
        subject: "Verify your email address",
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to TengaPOS, ${name}!</h2>
        <p>Please verify your email address to activate your account.</p>
        <p>
          <a href="${verificationUrl}" style="
            display: inline-block;
            padding: 10px 20px;
            color: white;
            background-color: #007BFF;
            text-decoration: none;
            border-radius: 4px;
          ">
            Verify Email
          </a>
        </p>
        <p>If the button above doesn't work, copy and paste this link into your browser:</p>
        <p>${verificationUrl}</p>
        <br />
        <p>Thank you,<br />The TengaPOS Team</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${to}`);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email");
    }
}
