const dotenv = require('dotenv');
dotenv.config();

const sendEmail = async (to, subject, htmlContent) => {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { name: 'EventBooker', email: process.env.EMAIL_USER },
            to: [{ email: to }],
            subject: subject,
            htmlContent: htmlContent
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Brevo error: ${JSON.stringify(error)}`);
    }
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
            : 'EventBooker Booking Verification';
        const msg = type === 'account_verification'
            ? 'Use the OTP below to verify your new EventBooker account.'
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