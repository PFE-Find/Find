import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'bienvenue.a.find@gmail.com',
        pass: 'momd larx olud esax' 
    },
});

export async function sendMail(to, subject, html, text) { 
    try {
        const info = await transporter.sendMail({
            from: '"Find Team" <bienvenue.a.find@gmail.com>', 
            to,
            subject,
            html,
            text 
        });

        console.log('Message sent: %s', info.messageId);
        
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        return info; 
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}