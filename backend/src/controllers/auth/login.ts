import bcrypt from 'bcryptjs'
import User from '../../models/User'
import { Request, Response } from 'express';
import { jsonwebtoken_create } from '../../lib/jsonwebtoken_';
import { emailRegex, passwordRegex } from '../../utils/constant';


const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ success: false, msg: 'Please enter a valid email address.' });
    }

    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({ success: false, msg: 'Password is not strong enough. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*).' });
    }
    try {

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, msg: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: 'Invalid credentials.' });
        }

        if (user.status === 'active') {
            const token = jsonwebtoken_create(
                {
                    _id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                },
                "5d"
            );

            return res.status(200).json({
                success: true,
                msg: 'Login successful.',
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }

        else if (user.status === 'inactive') {
            return res.status(403).json({
                success: false,
                msg: 'Your account is not verified. Please check your email for the verification OTP.',
                action: 'VERIFY_OTP'
            });
        }
        // c) User is 'banned': Account is suspended.
        else if (user.status === 'banned') {
            return res.status(403).json({
                success: false,
                msg: 'Your account has been banned. Please contact support for assistance.',
                action: 'CONTACT_SUPPORT'
            });
        }
        // d) User is 'deleted': Account is permanently gone. Treat as invalid credentials.
        else if (user.status === 'deleted') {
            return res.status(401).json({
                success: false,
                msg: 'Invalid credentials.'
            });
        }

        else {
            return res.status(500).json({ success: false, msg: 'An unexpected account error occurred. Please contact support.' });
        }

    } catch (err: any) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

export default loginUser;