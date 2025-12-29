import { NextResponse } from "next/server";
import { headers } from "next/headers";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req) {
  try {
    // ---------------------------------------------------------
    // 1. SECURITY: Rate Limiting
    // ---------------------------------------------------------
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    
    if (!rateLimit(ip).success) {
      return NextResponse.json(
        { message: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    // ---------------------------------------------------------
    // 2. INPUT VALIDATION
    // ---------------------------------------------------------
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // ---------------------------------------------------------
    // 3. CONFIGURE TRANSPORTER
    // ---------------------------------------------------------
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS.replace(/\s+/g, ''),
      },
    });

    // ---------------------------------------------------------
    // 4. PREPARE EMAILS
    // ---------------------------------------------------------

    // EMAIL 1: To YOU (Admin)
    // FIX: Removed 'replyTo' to prevent Yahoo 550 Block.
    // We put the user's email in the body instead.
    const adminMail = {
      from: process.env.YAHOO_USER, 
      to: process.env.YAHOO_USER,
      subject: `[Portfolio] ${subject}`,
      text: `You have a new message!\n\nFrom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #2563eb;">New Portfolio Message</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `
    };

    // EMAIL 2: To VISITOR (Welcome)
    const visitorMail = {
      from: process.env.YAHOO_USER,
      to: email,
      replyTo: process.env.YAHOO_USER,
      subject: `Received: ${subject}`,
      text: `Hi ${name},\n\nI have received your message regarding "${subject}". I will get back to you shortly.\n\nBest,\nMutasim Fuad Rimu`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Message Received</h2>
          <p>Hi ${name},</p>
          <p>Thanks for reaching out! I've received your message regarding <strong>"${subject}"</strong>.</p>
          <p>I usually respond within 24 hours.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>Mutasim Fuad Rimu</strong></p>
        </div>
      `
    };

    // ---------------------------------------------------------
    // 5. SEND SEQUENTIALLY (Safer for Yahoo)
    // ---------------------------------------------------------
    
    // Step A: Send to Admin (Most Important)
    try {
      await transporter.sendMail(adminMail);
      console.log("✅ Admin email sent");
    } catch (adminError) {
      console.error("❌ Admin Email Failed:", adminError);
      throw new Error("Could not save message."); // Stop here if Admin fails
    }

    // Step B: Wait 1 second (Prevents mailbox locking)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step C: Send to Visitor (Optional - don't crash if this fails)
    try {
      await transporter.sendMail(visitorMail);
      console.log("✅ Visitor email sent");
    } catch (visitorError) {
      console.warn("⚠️ Visitor Auto-reply failed (Non-critical):", visitorError.message);
      // We do NOT throw error here. It's okay if the visitor email fails 
      // as long as YOU got the message.
    }

    return NextResponse.json({ message: "Message sent successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Final Error:", error);
    return NextResponse.json(
      { message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}