import { Request, Response } from "express";
import Newsletter from "../../../models/Newsletter";
import { send_newsletter_subscription_email } from "../../../email/send_newsletter_subscription_email";


// ✅ Subscribe (POST /newsletter/subscribe)
export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // find if exists
    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {
      if (subscriber.status === "UNSUBSCRIBED") {
        subscriber.status = "SUBSCRIBED";
        await subscriber.save();
        return res.status(200).json({
          success: true,
          message: "Resubscribed successfully.",
          data: subscriber,
        });
      }
      return res.status(200).json({
        success: true,
        message: "Already subscribed.",
        data: subscriber,
      });
    }

    // create new subscriber
    subscriber = await Newsletter.create({ email });

    await  send_newsletter_subscription_email(email)

    
    return res.status(201).json({
      success: true,
      message: "Subscribed successfully.",
      data: subscriber,
    });
  } catch (error) {
    console.error("Error subscribing:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while subscribing.",
    });
  }
};


export const unsubscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const subscriber = await Newsletter.findOneAndUpdate(
      { email },
      { status: "UNSUBSCRIBED" },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: "Subscriber not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Unsubscribed successfully.",
      data: subscriber,
    });
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while unsubscribing.",
    });
  }
};