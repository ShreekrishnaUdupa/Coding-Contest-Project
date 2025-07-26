const nodemailer = require ('nodemailer');

require('dotenv').config({path: '../.env'});

const sendMail = async () => {

    const transporter = nodemailer.createTransport (
    {
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.AUTH_USER,
            pass: process.env.AUTH_PASSWORD
        }
    });

    await transporter.sendMail ({
        from: `Shreekrishna ${process.env.AUTH_USER}`,
        to: 'x0857432@gmail.com',
        subject: 'Mail from Shreekrishna',
        html: 'Hello, if you are seeing this, it means it worked'
    });

    console.log('Email sent');
};

sendMail ();