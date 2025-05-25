import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'bienvenue.a.find@gmail.com',
        pass: 'qdrt kxjm cqid kgqr' // Consider storing this securely (environment variables)
    },
});

export async function sendMail(to, subject, html, text) { // Added text parameter
    try {
        const info = await transporter.sendMail({
            from: '"Find Team" <bienvenue.a.find@gmail.com>', // Use a friendly "from" name
            to,
            subject,
            html,
            text // Include the plain text version
        });

        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return info; // Return the info object for potential logging or error handling
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to be handled in the calling function
    }
}