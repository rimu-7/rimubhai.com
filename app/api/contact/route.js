import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { rateLimit } from "@/lib/rateLimit";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";

    if (!rateLimit(ip).success) {
      return NextResponse.json(
        { message: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch (e) {
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASS,
      },
    });

    // --- SHARED STYLES ---
    const mainContainer = `
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f4f5;
      padding: 40px 20px;
      color: #18181b;
    `;

    const cardStyle = `
      background-color: #ffffff;
      max-width: 600px;
      margin: 0 auto;
      border: 1px solid #e4e4e7;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    `;

    const headerStyle = `
      background-color: #18181b;
      padding: 24px 32px;
      border-bottom: 3px solid #3f3f46;
    `;

    const codeBlockStyle = `
      background-color: #f4f4f5;
      border-left: 4px solid #18181b;
      padding: 16px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 14px;
      color: #3f3f46;
      margin: 20px 0;
      white-space: pre-wrap;
    `;

    const footerStyle = `
      text-align: center;
      padding: 24px;
      font-size: 12px;
      color: #71717a;
      font-family: 'Courier New', Courier, monospace;
    `;

    // --- EMAIL 1: ADMIN NOTIFICATION ---
    const adminMail = {
      from: process.env.YAHOO_USER,
      to: process.env.YAHOO_USER,
      subject: `[Portfolio] Contact: ${subject}`,
      text: `New Message from ${name} (${email})\n\n${message}`,
      html: `
        <div style="${mainContainer}">
          <div style="${cardStyle}">
            <div style="${headerStyle}">
              <h2 style="color: #ffffff; margin: 0; font-family: 'Courier New', monospace; font-size: 20px;">
                > New Inquiry Received
              </h2>
            </div>
            <div style="padding: 32px;">
              <p style="margin: 0 0 10px; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Sender Details</p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5; width: 80px; font-weight: 600;">Name:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5;">
                    <a href="mailto:${email}" style="color: #18181b; text-decoration: none; border-bottom: 1px dotted #18181b;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5; font-weight: 600;">Subject:</td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #f4f4f5;">${subject}</td>
                </tr>
              </table>

              <p style="margin: 0 0 10px; font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Message Content</p>
              <div style="${codeBlockStyle}">${message}</div>
            </div>
          </div>
        </div>
      `,
    };

    // --- EMAIL 2: VISITOR AUTO-REPLY ---
    const visitorMail = {
      from: process.env.YAHOO_USER,
      to: email,
      replyTo: process.env.YAHOO_USER,
      subject: `Received: ${subject}`,
      text: `Hi ${name},\n\nI have received your message regarding "${subject}". I will get back to you shortly.\n\nBest,\nMutasim Fuad Rimu`,
      html: `
        <div style="${mainContainer}">
          <div style="${cardStyle}">
            <div style="${headerStyle}">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: -0.5px;">
                Mutasim Fuad Rimu
              </h1>
              <p style="color: #a1a1aa; margin: 4px 0 0; font-size: 13px; font-family: 'Courier New', monospace;">
                Full-Stack Developer & Researcher
              </p>
            </div>
            
            <div style="padding: 32px;">
              <p style="font-size: 16px; margin-bottom: 24px; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="font-size: 16px; margin-bottom: 24px; line-height: 1.6;">
                Thank you for reaching out. I have successfully received your inquiry regarding <strong>"${subject}"</strong>.
              </p>
              
              <div style="${codeBlockStyle}">
                <span style="display: block; margin-bottom: 4px;">> STATUS: QUEUED</span>
                <span style="display: block;">> EXPECTED REPLY: Within 24 Hours</span>
              </div>

              <p style="font-size: 16px; margin-bottom: 0; line-height: 1.6;">
                I review all correspondence personally and will get back to you as soon as possible.
              </p>
            </div>

            <div style="${footerStyle}">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} Mutasim Fuad Rimu</p>
              <p style="margin: 5px 0 0;">Changchun, Jilin, China</p>
            </div>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(adminMail);
      console.log("✅ Admin email sent");
    } catch (adminError) {
      console.error("❌ Admin Email Failed:", adminError);
      throw new Error("Could not save message.");
    }

    // Add a small delay to prevent SMTP race conditions
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await transporter.sendMail(visitorMail);
      console.log("✅ Visitor email sent");
    } catch (visitorError) {
      console.warn(
        "⚠️ Visitor Auto-reply failed (Non-critical):",
        visitorError.message
      );
    }

    return NextResponse.json(
      { message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Final Error:", error);
    return NextResponse.json(
      { message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
