import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const OWNER_EMAIL = process.env.OWNER_EMAIL ?? "";

function createTransport() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, eventType, eventDate, eventDateEnd, location, guests, message } =
    body;

  if (!name || !email || !eventType || !eventDate || !location) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const quote = await prisma.quoteRequest.create({
    data: {
      name,
      email,
      phone: phone || null,
      eventType,
      eventDate: new Date(eventDate),
      eventDateEnd: eventDateEnd ? new Date(eventDateEnd) : null,
      location,
      guests: guests ? parseInt(guests, 10) : null,
      message: message || null,
    },
  });

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const transporter = createTransport();
    const from = `"Emilia B. Hairstylist" <${process.env.GMAIL_USER}>`;

    await Promise.allSettled([
      transporter.sendMail({
        from,
        to: OWNER_EMAIL || process.env.GMAIL_USER,
        subject: `New Quote Request — ${eventType} · ${location}`,
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          <p><strong>Event Type:</strong> ${eventType}</p>
          <p><strong>Event Date:</strong> ${eventDate}${eventDateEnd && eventDateEnd !== eventDate ? ` → ${eventDateEnd}` : ""}</p>
          <p><strong>Location:</strong> ${location}</p>
          ${guests ? `<p><strong>Guests:</strong> ${guests}</p>` : ""}
          ${message ? `<p><strong>Message:</strong><br/>${message}</p>` : ""}
        `,
      }),
      transporter.sendMail({
        from,
        to: email,
        subject: "Your quote request has been received — Emilia B. Hairstylist",
        html: `
          <p>Dear ${name},</p>
          <p>Thank you for reaching out! I have received your quote request for a <strong>${eventType}</strong> on <strong>${eventDate}${eventDateEnd && eventDateEnd !== eventDate ? ` → ${eventDateEnd}` : ""}</strong> in <strong>${location}</strong>.</p>
          <p>I will review your request and get back to you within 24 hours to discuss the details.</p>
          <br/>
          <p>Kind regards,<br/><strong>Emilia</strong><br/>Emilia B. Hairstylist</p>
        `,
      }),
    ]);
  }

  return NextResponse.json({ success: true, id: quote.id });
}
