import express from 'express'
import registerUser from '../controllers/auth/registerUser'
import verifyUser from '../controllers/auth/verifyUser';
import loginUser from '../controllers/auth/login';
import resendOtpController from '../controllers/auth/resendOTP';
import forgotPassword from '../controllers/auth/forgotPassword';
import changePassword from '../controllers/auth/changePassword';

const authRoute = express.Router();



authRoute.post('/register', registerUser);
authRoute.post('/verify-user', verifyUser);
authRoute.post('/login', loginUser);
authRoute.post('/resend-otp', resendOtpController);
authRoute.post('/forgot-password', forgotPassword);
authRoute.post('/change-password', changePassword);



export default authRoute;