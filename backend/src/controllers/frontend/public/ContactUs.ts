import { Response, Request } from "express";
import ContactUs from "../../../models/ContactUs";
import { emailRegex, phoneRegex } from "../../../utils/constant";
import { contact_form_submission_email } from "../../../email/contact_form_submission_email";

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, message, number, subject } = req.body;

    if (!name || !email || !message|| !number || !subject) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

     if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ success: false, msg: 'Please enter a valid email address.' });
      }

       if (!number || !phoneRegex.test(number)) {
            return res.status(400).json({ success: false, msg: 'Please enter a valid email number.' });
      }

    const contact = await ContactUs.create({ name, email, message, number:Number(number), subject });

   await contact_form_submission_email(email, name, subject)

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
