
import { Request, Response } from "express"
import admin from "../../../config/firebase_admin"
import User from "../../../models/User"
import { jsonwebtoken_create } from "../../../lib/jsonwebtoken_"




const loginWithGoogle = async (req: Request, res: Response) => {
    const { google_token } = req.body

    if (!google_token) {
        return res
            .status(400)
            .json({ success: false, msg: "google_token is required." })
    }

    try {
        // 1. Verify token with Firebase Admin
        const decoded = await admin.auth().verifyIdToken(google_token)
        const { email, name } = decoded

        if (!email) {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid Google token (no email found)." })
        }

        let user = await User.findOne({ email })

        // 2. If user exists → LOGIN
        if (user) {
            if (user.status === "banned") {
                return res.status(403).json({
                    success: false,
                    msg: "Your account is banned. Contact support.",
                    action: "CONTACT_SUPPORT",
                })
            }
            if (user.status === "deleted") {
                return res.status(403).json({
                    success: false,
                    msg: "This account has been permanently deleted.",
                    action: "NOT_APPLICABLE",
                })
            }
            if (user.status === "delete_request") {
                return res.status(403).json({
                    success: false,
                    msg: "This account has been request deleted.",
                    action: "NOT_APPLICABLE",
                })
            }


            if (user.status === "inactive") {
                user.status = 'active'
                await user.save()
                const token = jsonwebtoken_create(
                    {
                        _id: user._id.toString(),
                        email: user.email,
                        role: user.role,
                    },
                    "15d"
                )

                return res.status(200).json({
                    success: true,
                    msg: "Login successful",
                    action: "LOGIN",
                    token,
                    user: user
                })
            }


            if(user.status === "active"){
            const token = jsonwebtoken_create(
                {
                    _id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                },
                "15d"
            )

            return res.status(200).json({
                success: true,
                msg: "Login successful",
                action: "LOGIN",
                token,
                user: user
            })

            }

           
        }

        // 3. If no user → REGISTER
        user = new User({
            name: name || "Google User",
            email,
            password: "GOOGLE_REGISTER", 
            status: "active",
            role: "user",
        })

        await user.save()

        const token = jsonwebtoken_create(
            {
                _id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            "15d"
        )

        return res.status(201).json({
            success: true,
            msg: "Registration successful",
            action: "REGISTER",
            token,
            user: user
        })
    } catch (err: any) {
        console.error("Google login error:", err.message)
        return res
            .status(500)
            .json({ success: false, msg: "Server error during Google login." })
    }
}

export default loginWithGoogle
