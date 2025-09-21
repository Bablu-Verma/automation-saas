import { Response, Request } from "express";
import ContactUs from "../../../models/ContactUs";
import { emailRegex } from "../../../utils/constant";

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

     if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ success: false, msg: 'Please enter a valid email address.' });
      }

    const contact = await ContactUs.create({ name, email, message });

    return res.status(201).json({
      success: true,
      message: "Contact submitted successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating contact.",
    });
  }
};
