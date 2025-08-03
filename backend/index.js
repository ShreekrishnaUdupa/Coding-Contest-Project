const dotenv = require ('dotenv').config();
const express = require ('express');
const cors = require ('cors');
const cookieParser = require ('cookie-parser');

const RegisterRoute = require ('./routes/register.route');
const OTPVerificationRoute = require ('./routes/otp-verification.route');
const loginRoute = require ('./routes/login.route');
const refreshTokensRoute = require ('./routes/refresh-tokens.route');
const contestsRoute = require ('./routes/contests.route');

const app = express ();

app.use(cors({origin: '*', credentials: true}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use(RegisterRoute);
app.use(OTPVerificationRoute);
app.use(loginRoute);
app.use(refreshTokensRoute);
app.use(contestsRoute);

app.listen(4000, () => {
    console.log('Server running on port 4000');
});