import express from 'express'
import registerUser from '../controllers/frontend/auth/registerUser';
import verifyUser from '../controllers/frontend/auth/verifyUser';
import loginUser from '../controllers/frontend/auth/login';
import resendOtpController from '../controllers/frontend/auth/resendOTP';
import forgotPassword from '../controllers/frontend/auth/forgotPassword';
import changePassword from '../controllers/frontend/auth/changePassword';
import loginWithGoogle from '../controllers/frontend/auth/loginWithGoogle';


const authRoute = express.Router();



authRoute.post('/register', registerUser);
authRoute.post('/verify-user', verifyUser);
authRoute.post('/login', loginUser);
authRoute.post('/resend-otp', resendOtpController);
authRoute.post('/forgot-password', forgotPassword);
authRoute.post('/change-password', changePassword);
authRoute.post('/google-login', loginWithGoogle);



export default authRoute;