import express from 'express'
import registerUser from '../controllers/auth/registerUser'
import verifyUser from '../controllers/auth/verifyUser';
import loginUser from '../controllers/auth/login';
import resendOtpController from '../controllers/auth/resendOTP';
import forgotPasswordRequest from '../controllers/auth/forgotPasswordrequest';
import forgotPassword from '../controllers/auth/forgotPassword';

const authRoute = express.Router();



authRoute.post('/register', registerUser);
authRoute.post('/verify-user', verifyUser);
authRoute.post('/login', loginUser);
authRoute.post('/resend-otp', resendOtpController);
authRoute.post('/forgot-password-request', forgotPasswordRequest);
authRoute.post('/forgot-password', forgotPassword);



export default authRoute;