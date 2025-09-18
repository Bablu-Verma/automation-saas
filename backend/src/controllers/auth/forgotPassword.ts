
import User from '../../models/User';
import { Request, Response } from 'express';
import { send_password_reset_email } from '../../email/forgot_password';
import { jsonwebtoken_create } from '../../lib/jsonwebtoken_';
import { emailRegex } from '../../utils/constant';


const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ success: false, msg: 'Please enter a valid email address.' });
    }

    try {

        const user = await User.findOne({ email });

        if (!user || user.status !== 'active') {
            return res.status(200).json({
                success: true,
                msg: 'Account with that email not exists'
            });
        }

        const token = jsonwebtoken_create(
            {
                _id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            "30m"
        );


        let resetURL = `${process.env.CLIENT_URL}/change-password?userid=${token}`

         await send_password_reset_email(resetURL, user.email)

        return res.status(200).json({
            success: true,
            msg: 'Check your email password reset link has been sent.'
        });

    } catch (err: any) {
        console.error("Forgot Password Error:", err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

export default forgotPassword;