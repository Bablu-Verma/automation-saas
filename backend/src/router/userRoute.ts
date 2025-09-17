import express from 'express'
import getUserProfile from '../controllers/frontend/internal/user/userProfile';
import { loginCheck } from '../middlewares/loginCheck';
import updateUserProfile from '../controllers/frontend/internal/user/updateUser';
import AccountDeleteRequest from '../controllers/frontend/internal/user/deleteRequest';

const userRoute = express.Router();



userRoute.post('/get-profile',loginCheck, getUserProfile);
userRoute.post('/update-profile',loginCheck, updateUserProfile);
userRoute.post('/delete-request',loginCheck, AccountDeleteRequest);




export default userRoute;