

import { Request, Response } from 'express';
import { emailRegex, passwordRegex } from '../../../utils/constant';
import User from '../../../models/User';
import { createHashedPassword, NEW_OTP } from '../../../utils/utils';
import { jsonwebtoken_create } from '../../../lib/jsonwebtoken_';
import { user_verify_email } from '../../../email/user_verify';


const registerUser = async (req: Request, res: Response) => {


    const { name, email, password } = req.body;

    // --- Start of Validation Logic ---
    if (!name || name.trim().length < 2) {
        return res.status(400).json({ success: false, msg: 'Name must be at least 2 characters long.' });
    }

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ success: false, msg: 'Please enter a valid email address.' });
    }

    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ success: false, msg: 'Password is not strong enough. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).' });
    }




    try {
        let user = await User.findOne({ email });

        // Logic for a user that already exists
        if (user) {
            if (user.status === 'active') {
                return res.status(400).json({
                    success: false,
                    msg: 'This email is already registered and active. Please log in to your account.',
                    action: 'LOGIN'
                });
            } else if (user.status === 'inactive') {
                // An inactive account is found, update their details and send a new OTP

                const hashedPassword = await createHashedPassword(password)
                let OTP = NEW_OTP()


                user.name = name;
                user.password = hashedPassword;
                user.otp = Number(OTP)
                await user.save();


                const token = jsonwebtoken_create(
                    {
                        _id: user._id.toString(),
                        email: user.email,
                        role: user.role,
                    },
                    "30m"
                );

                

                await user_verify_email(OTP, email)
                return res.status(200).json({
                    success: true,
                    msg: 'An account with this email exists but is not verified. A new OTP has been sent to your email to continue registration.',
                    action: 'VERIFY_OTP',
                    token
                });
            } else if (user.status === 'banned') {
                return res.status(403).json({
                    success: false,
                    msg: 'This email is associated with a banned account and is not eligible for registration.',
                    action: 'CONTACT_SUPPORT'
                });
            } else if (user.status === 'deleted') {
                return res.status(403).json({
                    success: false,
                    msg: 'This email is associated with a permanently deleted account.',
                    action: 'NOT_APPLICABLE'
                });
            }
        }


        const hashedPassword = await createHashedPassword(password)
         let OTP = NEW_OTP()

        user = new User({
            name,
            email,
            password: hashedPassword,
            otp: OTP,
            status: 'inactive'
        });

        await user.save();
        // TODO: Email sending logic 



        const token = jsonwebtoken_create(
            {
                _id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            "30m"
        );


        await user_verify_email(OTP, email)
        res.status(201).json({
            success: true,
            msg: 'Registration successful. A verification OTP has been sent to your email.',
            action: 'VERIFY_OTP',
            token
        });

    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};


export default registerUser