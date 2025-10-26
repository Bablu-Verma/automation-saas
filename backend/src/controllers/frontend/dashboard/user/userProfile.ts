

import User from '../../../../models/User';
import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../../../../middlewares/loginCheck';


const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
       
        const requestuser = req.user
        const userId = req.user?.id 
  
         const user = await User.findById(userId).select('-password -otp -__v');


        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }

        // 4. Agar user active nahi hai
        if (user.status !== 'active') {
            return res.status(403).json({ success: false, msg: 'Access denied. User account is not active.' });
        }

        // 5. Safalta-purvak user data bhejein
        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (err: any) {
        console.error("Get User Profile Error:", err.message);
        // Database error ya anya server error ke liye
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

export default getUserProfile;