import User from '../../../../models/User';
import { Response } from 'express';
import { AuthenticatedRequest } from '../../../../middlewares/loginCheck';
import { user_delete_request_email } from '../../../../email/user_delete';

const AccountDeleteRequest = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // 1. Get the user ID from the authenticated token
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, msg: 'Unauthorized: User ID not found.' });
        }

        // 2. Find the user and update their status to 'inactive'
        // This is a "soft delete" - the user data remains but the account is disabled.
        const deactivatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { status: 'delete_request' } }, // Set the status to inactive
            { new: true } // This option is not strictly needed here but is good practice
        );

        // 3. Check if a user was found and deactivated
        if (!deactivatedUser) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }

        await  user_delete_request_email(deactivatedUser.email, deactivatedUser.name)

        // 4. Send a success confirmation message
        return res.status(200).json({
            success: true,
            msg: 'Your account has been successfully deactivated. We are working your account on close'
        });

    } catch (err: any) {
        console.error("Account Delete Error:", err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

export default AccountDeleteRequest;