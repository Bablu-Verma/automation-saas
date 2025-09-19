import { Request, Response } from "express";
import { jsonwebtoken_create, jsonwebtoken_decoded } from "../../../lib/jsonwebtoken_";
import { JwtPayload } from "../../../types/types";
import User from "../../../models/User";


const verifyUser = async (req: Request, res: Response) => {
  const { otp } = req.body;

  try {
  
    const decoded = await jsonwebtoken_decoded(req, res) as JwtPayload
  
    const user = await User.findById(decoded.id).select('+otp');

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found. Please register first.",
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

    if (user.status === "banned" || user.status === "deleted") {
      return res.status(403).json({
        success: false,
        msg: "This account cannot be verified.",
        action: "CONTACT_SUPPORT",
      });
    }

    // Check if OTP expired (30 min since last update)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (user.updatedAt < thirtyMinutesAgo) {
      return res.status(400).json({
        success: false,
        msg: "OTP has expired. Please request a new one.",
        action: "RESEND_OTP",
      });
    }


    // OTP check
    if (user.otp?.toString() !== otp.toString()) {
      return res.status(400).json({
        success: false,
        msg: "Invalid OTP. Please try again.",
      });
    }

    // Mark account as active
    user.status = "active";
    user.otp = undefined;
    await user.save();

    // Issue fresh JWT token
    const newToken = jsonwebtoken_create(
      {
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      "5d" // verified users get longer expiry
    );

    return res.status(200).json({
      success: true,
      msg: "Account verified successfully.",
      action: "LOGIN",
      token: newToken,
    });
  } catch (err: any) {
    console.error("error", err.message);
    return res.status(401).json({
      success: false,
      msg: "Invalid or expired token.",
    });
  }
};

export default verifyUser;
