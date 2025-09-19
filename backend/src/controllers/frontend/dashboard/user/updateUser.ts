
import { AuthenticatedRequest } from '../../../../middlewares/loginCheck';
import User from '../../../../models/User';
import { Response } from 'express';
import { phoneRegex } from '../../../../utils/constant';



const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
    
        const userId = req.user?.id 
      
        const { company, phoneNumber, address } = req.body || {}; 
        
        const updateData: { [key: string]: any } = {};
        
        if(phoneNumber){
            if(phoneRegex.test(phoneNumber)){
              updateData['profile.phoneNumber'] = phoneNumber; 
            }else{
             return res.status(404).json({ success: false, msg: 'Add Valid Phone Number.' });
            }
           
        }
        if (company) updateData['profile.company'] = company;
        if (address) updateData['profile.address'] = address;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, msg: 'No profile data provided to update.' });
        }

       
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData }, 
            { new: true, runValidators: true } 
        ).select('-password -otp -__v');

       
        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            msg: 'Profile updated successfully.',
            data: updatedUser
        });

    } catch (err: any) {
        console.error("Update User Profile Error:", err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};

export default updateUserProfile;