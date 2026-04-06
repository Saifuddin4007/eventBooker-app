const Brevo = require('@getbrevo/brevo');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Brevo API client
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY;

const sendEmail = async (to, subject, htmlContent) => {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();

        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;
        sendSmtpEmail.sender = {
        name: 'EventBooker',
        email: process.env.EMAIL_USER  // must be verified in Brevo
    };
    sendSmtpEmail.to = [{ email: to }];

    await apiInstance.sendTransacEmail(sendSmtpEmail);
};

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        await sendEmail(
            userEmail,
            `Booking Confirmed: ${eventTitle}`,
            `
                <h2>Hi ${userName}!</h2>
                <p>Your booking for <strong>${eventTitle}</strong> is confirmed.</p>
                <p>Thank you for choosing Eventora.</p>
            `
        );
        console.log('Booking email sent to', userEmail);
    } catch (error) {
        console.error('Error sending booking email:', error);
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification'
            ? 'Verify your Eventora Account'
            : 'Eventora Booking Verification';
        const msg = type === 'account_verification'
            ? 'Use the OTP below to verify your new Eventora account.'
            : 'Use the OTP below to confirm your event booking.';

        await sendEmail(
            userEmail,
            title,
            `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold;
                                background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">
                        Expires in 5 minutes. If you didn't request this, ignore this email.
                    </p>
                </div>
            `
        );
        console.log(`OTP sent to ${userEmail} for ${type}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };