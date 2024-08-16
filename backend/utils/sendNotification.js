const axios = require('axios');

// Function to send email using EmailJS
const sendEmail = (email, fromName, toName, message) => {
    const templateParams = {
        from_name: fromName,
        to_name: toName,
        to_email: email,
        message: message,
        subject: 'You have a new message!'
    };

    return axios.post('https://api.emailjs.com/api/v1.0/email/send', {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: templateParams
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Email sent successfully:', response.data);
        return response.data;
    })
    .catch(error => {
        console.error('Error sending email:', error);
        throw error;
    });
};

module.exports = sendEmail;
