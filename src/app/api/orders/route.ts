import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs/promises";
import path from "path";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, tableNumber, mobileNumber, items, subtotal, gst, serviceCharge, grandTotal, paymentMode, paymentDetails } = body;

    if (!customerName || !tableNumber || !mobileNumber || !items || !items.length) {
      return NextResponse.json(
        { message: "Missing required order details" },
        { status: 400 }
      );
    }

    const calculatedGst = gst !== undefined ? gst : Math.round(subtotal * 0.18);
    const calculatedService = serviceCharge !== undefined ? serviceCharge : 0;
    const calculatedGrandTotal = grandTotal !== undefined ? grandTotal : subtotal + calculatedGst;

    const orderId = `ET-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Generate Order Items HTML & Text
    const itemsListHtml = items
      .map(
        (item: any) => `
      <tr style="border-bottom: 1px solid #1f1f1f;">
        <td style="padding: 12px 0; color: #ffffff; font-size: 14px;">${item.name}</td>
        <td style="padding: 12px 0; color: #a1a1aa; font-size: 14px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; color: #c5a880; font-size: 14px; text-align: right; font-weight: bold;">₹${item.numericPrice * item.quantity}</td>
      </tr>`
      )
      .join("");

    const itemsListText = items
      .map((item: any) => `- ${item.name} x ${item.quantity} (₹${item.numericPrice * item.quantity})`)
      .join("\n");

    const paymentLabel =
      paymentMode === "online"
        ? "Online Payment (Razorpay Paid)"
        : paymentMode === "bill"
        ? "Get Table Bill"
        : "Pay on Counter";

    // Setup Owner Email Contents
    const ownerEmailHtml = `
      <div style="background-color: #070707; color: #e4e4e7; font-family: 'Inter', Helvetica, Arial, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border: 1px solid #c5a880;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ffffff; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; letter-spacing: 3px; margin: 0; text-transform: uppercase;">L'ÉTOILE</h1>
          <p style="color: #c5a880; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px;">Luxury Dining Room Docket</p>
        </div>
        
        <div style="border-top: 1px solid #c5a880; border-bottom: 1px solid #c5a880; padding: 20px 0; margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; padding-bottom: 8px;">Order Reference</td>
              <td style="color: #ffffff; font-size: 12px; text-align: right; font-weight: bold; padding-bottom: 8px;">#${orderId}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; padding-bottom: 8px;">Dining Table</td>
              <td style="color: #c5a880; font-size: 14px; text-align: right; font-weight: bold; padding-bottom: 8px;">Table ${tableNumber}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; padding-bottom: 8px;">Customer Name</td>
              <td style="color: #ffffff; font-size: 12px; text-align: right; padding-bottom: 8px;">${customerName}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; padding-bottom: 8px;">Mobile Phone</td>
              <td style="color: #ffffff; font-size: 12px; text-align: right; padding-bottom: 8px;">${mobileNumber}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase;">Placed At</td>
              <td style="color: #ffffff; font-size: 12px; text-align: right;">${timestamp}</td>
            </tr>
          </table>
        </div>

        <h3 style="color: #ffffff; font-family: 'Playfair Display', serif; font-size: 16px; text-transform: uppercase; margin-bottom: 15px; letter-spacing: 1px;">Selected Creations</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="border-bottom: 2px solid #c5a880;">
              <th style="color: #a1a1aa; font-size: 11px; text-align: left; text-transform: uppercase; padding-bottom: 8px;">Dish</th>
              <th style="color: #a1a1aa; font-size: 11px; text-align: center; text-transform: uppercase; padding-bottom: 8px;">Qty</th>
              <th style="color: #a1a1aa; font-size: 11px; text-align: right; text-transform: uppercase; padding-bottom: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsListHtml}
          </tbody>
        </table>

        <div style="background-color: #0c0c0c; border: 1px solid #1f1f1f; padding: 20px; margin-bottom: 30px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; padding-bottom: 8px;">Subtotal</td>
              <td style="color: #ffffff; font-size: 12px; text-align: right; padding-bottom: 8px;">₹${subtotal}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; padding-bottom: 8px;">GST (18%)</td>
              <td style="color: #ffffff; font-size: 12px; text-align: right; padding-bottom: 8px;">₹${calculatedGst}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; font-size: 12px; text-transform: uppercase; padding-bottom: 8px;">Service Charge</td>
              <td style="color: #ffffff; font-size: 12px; text-align: right; padding-bottom: 8px;">₹${calculatedService}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; font-size: 13px; text-transform: uppercase; border-top: 1px solid #1f1f1f; padding-top: 8px;">Grand Total</td>
              <td style="color: #ffffff; font-size: 16px; text-align: right; font-family: 'Playfair Display', serif; font-weight: bold; border-top: 1px solid #1f1f1f; padding-top: 8px;">₹${calculatedGrandTotal}</td>
            </tr>
            <tr>
              <td style="color: #a1a1aa; font-size: 13px; text-transform: uppercase; padding-top: 8px;">Settlement Mode</td>
              <td style="color: #c5a880; font-size: 13px; text-align: right; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding-top: 8px;">${paymentLabel}</td>
            </tr>
            ${
              paymentDetails?.razorpayPaymentId
                ? `
            <tr>
              <td style="color: #71717a; font-size: 10px; text-transform: uppercase; padding-top: 10px;">Payment ID</td>
              <td style="color: #71717a; font-size: 10px; text-align: right; padding-top: 10px; font-family: monospace;">${paymentDetails.razorpayPaymentId}</td>
            </tr>`
                : ""
            }
          </table>
        </div>

        <div style="text-align: center; color: #71717a; font-size: 10px; border-top: 1px solid #1f1f1f; padding-top: 20px;">
          This is an automated order docket generated by L'Étoile Kitchen System.
        </div>
      </div>
    `;

    // Terminal Logging for instant visual check
    console.log("==========================================");
    console.log(`NEW ORDER RECEIVED: #${orderId}`);
    console.log(`Table: ${tableNumber} | Customer: ${customerName} (${mobileNumber})`);
    console.log(`Items:\n${itemsListText}`);
    console.log(`Subtotal: ₹${subtotal} | GST (18%): ₹${calculatedGst} | Service: ₹${calculatedService}`);
    console.log(`Grand Total: ₹${calculatedGrandTotal} | Payment: ${paymentLabel}`);
    if (paymentDetails?.razorpayPaymentId) {
      console.log(`Razorpay Payment ID: ${paymentDetails.razorpayPaymentId}`);
    }
    console.log("==========================================");

    // Email configuration
    const ownerEmail = process.env.OWNER_EMAIL || "owner@letoilerestaurant.com";
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"L'Étoile Kitchen" <${smtpUser}>`,
        to: ownerEmail,
        subject: `[KITCHEN DOCKET] Table ${tableNumber} - Order #${orderId}`,
        text: `New Order #${orderId} from Table ${tableNumber}\nCustomer: ${customerName}\nMobile: ${mobileNumber}\n\nItems:\n${itemsListText}\n\nSubtotal: ₹${subtotal}\nGST (18%): ₹${calculatedGst}\nService Charge: ₹${calculatedService}\nGrand Total: ₹${calculatedGrandTotal}\nPayment Mode: ${paymentLabel}`,
        html: ownerEmailHtml,
      });
      
      console.log(`[Email] Notification sent to ${ownerEmail}`);
    } else {
      console.log("[Email] SMTP configuration missing. Order notification printed to console only (Mock Mode).");
    }

    // Persist order in orders.json
    const ordersPath = path.join(process.cwd(), "src/data/orders.json");
    let ordersList = [];
    try {
      const ordersData = await fs.readFile(ordersPath, "utf-8");
      ordersList = JSON.parse(ordersData);
    } catch (e) {
      ordersList = [];
    }

    const orderObj = {
      id: orderId,
      customerName,
      tableNumber,
      mobileNumber,
      items: items.map((i: any) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      subtotal,
      gst: calculatedGst,
      serviceCharge: calculatedService,
      grandTotal: calculatedGrandTotal,
      paymentMode,
      status: paymentMode === "online" ? "paid" : "pending",
      timestamp,
    };

    ordersList.push(orderObj);
    await fs.writeFile(ordersPath, JSON.stringify(ordersList, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: orderObj,
    });
  } catch (error) {
    console.error("Error processing order route:", error);
    return NextResponse.json(
      { message: "Internal server error while processing order" },
      { status: 500 }
    );
  }
}
