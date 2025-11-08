"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../../../models/User"));
const constant_1 = require("../../../../utils/constant");
const jsonwebtoken_1 = require("../../../../lib/jsonwebtoken_");
const user_profile_update_email_1 = require("../../../../email/user_profile_update_email");
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { company, phoneNumber, address } = req.body || {};
        const updateData = {};
        if (phoneNumber) {
            if (constant_1.phoneRegex.test(phoneNumber)) {
                updateData['profile.phoneNumber'] = phoneNumber;
            }
            else {
                return res.status(404).json({ success: false, msg: 'Add Valid Phone Number.' });
            }
        }
        if (company)
            updateData['profile.company'] = company;
        if (address)
            updateData['profile.address'] = address;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, msg: 'No profile data provided to update.' });
        }
        const updatedUser = await User_1.default.findByIdAndUpdate(userId, { $set: updateData }, { new: true, runValidators: true }).select('-password -otp -__v');
        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }
        await (0, user_profile_update_email_1.user_profile_update_email)(updatedUser.email, updatedUser.name);
        const token = (0, jsonwebtoken_1.jsonwebtoken_create)({
            _id: updatedUser._id.toString(),
            email: updatedUser.email,
            role: updatedUser.role,
        }, "5d");
        return res.status(200).json({
            success: true,
            msg: 'Profile updated successfully.',
            token,
            user: updatedUser
        });
    }
    catch (err) {
        console.error("Update User Profile Error:", err.message);
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
};
exports.default = updateUserProfile;
