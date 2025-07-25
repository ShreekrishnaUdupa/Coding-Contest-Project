const nodemailer = require ('nodemailer');

const sendMail = async () => {

    const transporter = nodemailer.createTransport (
    {
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'shreekrishnaudupa@gmail.com',
            pass: ''
        }
    });

    await transporter.sendMail ({
        from: 'Shreekrishna shreekrishnaudupa@gmail.com',
        to: 'udupashreekrishna@gmail.com',
        subject: 'Mail from Shreekrishna',
        html: 'Hello, if you are seeing this, it means it worked'
    });

    console.log('Email sent');
};

sendMail ();