

import { Request, Response } from 'express';
import { jsonwebtoken_decoded } from '../../../lib/jsonwebtoken_';
import { JwtPayload } from '../../../types/types';
import User from '../../../models/User';
import { NEW_OTP } from '../../../utils/utils';
import { user_verify_email } from '../../../email/user_verify';



const resendOtpController = async (req: Request, res: Response) => {

    try {

        const decoded = await jsonwebtoken_decoded(req, res) as JwtPayload

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found. The account may have been deleted.",
                action: "REGISTER",
            });
        }


        if (user.status === "active") {
            return res.status(400).json({
                success: false,
                msg: "This account is already verified. Please log in.",
                action: "LOGIN",
            });
        }

        // Check for other non-verifiable statuses
        if (user.status === "banned" || user.status === "deleted") {
            return res.status(403).json({
                success: false,
                msg: "This account cannot be verified.",
                action: "CONTACT_SUPPORT",
            });
        }


       let OTP = NEW_OTP()

        // Save the newly generated OTP to the user's document
        user.otp = Number(OTP);
        await user.save();

        // 5. --- Send the New OTP via Email ---
        await user_verify_email(OTP, user.email);

        // 6. --- Send Success Response ---
        res.status(200).json({
            success: true,
            msg: 'A new verification OTP has been successfully sent to your email.',
        });

    } catch (err: any) {
        // Handle token expiration or other verification errors
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, msg: 'Invalid or expired token. Please try registering again.' });
        }
        console.error("Resend OTP Error:", err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

export default resendOtpController;