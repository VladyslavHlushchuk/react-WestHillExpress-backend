const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📨 Contact Form — проста форма
app.post('/send-contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: 'Message from West Hill Express website',
      html: `
        <div style="background: #ffffff; padding: 2rem; font-family: Arial, sans-serif; color: #111827; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 600px; margin: auto;">
          <h2 style="border-bottom: 1px solid #e5e7eb; padding-bottom: 0.5rem;">New Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <div style="margin-top: 1rem;">
            <p><strong>Message:</strong></p>
            <div style="background: #f9fafb; padding: 1rem; border-left: 4px solid #3b82f6; border-radius: 6px;">
              ${message}
            </div>
          </div>
        </div>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

// 🚚 Quote Form — детальна форма
app.post('/send-quote', async (req, res) => {
  const {
    name, email, phone, from, to, distance,
    vin, carType, condition, year, make,
    model, pickupDate, transportType, notes
  } = req.body;

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: 'New Quote Request',
      html: `
        <div style="background: #ffffff; padding: 2rem; font-family: Arial, sans-serif; color: #111827; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); max-width: 700px; margin: auto;">
          <h2 style="border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; color: #1f2937;">Quote Request</h2>

          <h3 style="margin-top: 1.5rem;">Route</h3>
          <p><strong>From:</strong> ${from}</p>
          <p><strong>To:</strong> ${to}</p>
          <p><strong>Distance:</strong> ${distance} mi</p>

          <h3 style="margin-top: 1.5rem;">Client Info</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>

          <h3 style="margin-top: 1.5rem;">Vehicle Details</h3>
          <p><strong>VIN:</strong> ${vin}</p>
          <p><strong>Car Type:</strong> ${carType}</p>
          <p><strong>Condition:</strong> ${condition}</p>
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>Make:</strong> ${make}</p>
          <p><strong>Model:</strong> ${model}</p>
          <p><strong>Pickup Date:</strong> ${pickupDate}</p>
          <p><strong>Transport Type:</strong> ${transportType}</p>

          <h3 style="margin-top: 1.5rem;">Notes</h3>
          <div style="background: #f3f4f6; padding: 1rem; border-left: 4px solid #6366f1; border-radius: 6px;">
            ${notes}
          </div>
        </div>
      `
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
