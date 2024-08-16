import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const EmailForm = () => {
    const [fromName, setFromName] = useState('');
    const [toName, setToName] = useState('');
    const [toEmail, setToEmail] = useState('');
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const templateParams = {
            from_name: fromName,
            to_name: toName,
            to_email: toEmail,
            message: message,
            subject: 'You have a new message!',
        };

        emailjs.send('service_tnol3rn', 'template_xmp0xlp', templateParams, 'VLvH9rCa8-byzYIJ-')
            .then((response) => {
                console.log('Email sent successfully:', response);
                setResponseMessage('Email sent successfully!');
                // Reset the form fields
                setFromName('');
                setToName('');
                setToEmail('');
                setMessage('');
            })
            .catch((error) => {
                console.error('Error sending email:', error);
                setResponseMessage('Failed to send email. Please try again.');
            });
    };

    return (
        <div className="form-container">
            <h2>Contact Us</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="from_name">Your Name</label>
                    <input
                        type="text"
                        id="from_name"
                        value={fromName}
                        onChange={(e) => setFromName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="to_name">Recipient Name</label>
                    <input
                        type="text"
                        id="to_name"
                        value={toName}
                        onChange={(e) => setToName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="to_email">Recipient Email</label>
                    <input
                        type="email"
                        id="to_email"
                        value={toEmail}
                        onChange={(e) => setToEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <button type="submit">Send Email</button>
                </div>
                {responseMessage && <div className="message">{responseMessage}</div>}
            </form>
        </div>
    );
};

export default EmailForm;
