
import User from '../../models/User';
import { Request, Response } from 'express';
import { JwtPayload } from '../../types/types';
import { passwordRegex } from '../../utils/constant';
import { jsonwebtoken_decoded } from '../../lib/jsonwebtoken_';
import { createHashedPassword } from '../../utils/utils';



const forgotPassword = async (req: Request, res: Response) => {
    const { password } = req.body;


    try {

        const decoded = await jsonwebtoken_decoded(req, res) as JwtPayload

        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ success: false, msg: 'Password is not strong enough. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).' });
        }

        // Find user from token payload
        const user = await User.findById(decoded.id);

        if (!user || user.status !== 'active') {
            return res.status(200).json({
                success: true,
                msg: 'Account with that email not exists'
            });
        }


        const hashedPassword = await createHashedPassword(password)
        user.password = hashedPassword

        await user.save()

        return res.status(200).json({
            success: true,
            msg: 'Password has been reset successfully. Login Using New Password'
        });

    } catch (err: any) {
        console.error("Forgot Password Error:", err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

export default forgotPassword;