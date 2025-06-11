import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(email: string, resetLink: string) {
    try {
        const response = await resend.emails.send({
            from: 'no-reply@finance-tracker.semindi.me',
            to: email,
            subject: 'Reset Your Password',
            html: `
                <p>You requested a password reset for your account.</p>
                <p>Click this link to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `,
        });
        return response;  // <-- return the response here
    } catch (error) {
        console.error('Error sending email:', error);
        return null;      // or throw error if you want to handle it outside
    }
}
