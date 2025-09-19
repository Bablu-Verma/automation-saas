import express from 'express'
import getUserProfile from '../controllers/frontend/dashboard/user/userProfile';
import { loginCheck } from '../middlewares/loginCheck';
import updateUserProfile from '../controllers/frontend/dashboard/user/updateUser';
import AccountDeleteRequest from '../controllers/frontend/dashboard/user/deleteRequest';

const userRoute = express.Router();



userRoute.post('/get-profile',loginCheck, getUserProfile);
userRoute.post('/update-profile',loginCheck, updateUserProfile);
userRoute.post('/delete-request',loginCheck, AccountDeleteRequest);




export default userRoute;