import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready to send messages');
  }
});

// Generic email sender
export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Facility Booking System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Booking notification email
export const sendBookingNotification = async (user, booking, status) => {
  const statusMessages = {
    pending: {
      title: 'Booking Request Received',
      message: 'Your booking request has been received and is pending review.',
      color: '#f59e0b',
      icon: '⏳'
    },
    approved: {
      title: 'Booking Approved!',
      message: 'Great news! Your booking has been approved.',
      color: '#10b981',
      icon: '✅'
    },
    rejected: {
      title: 'Booking Rejected',
      message: `Unfortunately, your booking has been rejected. Reason: ${booking.rejectionReason || 'Not specified'}`,
      color: '#ef4444',
      icon: '❌'
    },
    confirmed: {
      title: 'Booking Confirmed',
      message: 'Your booking is now confirmed after payment.',
      color: '#3b82f6',
      icon: '🎉'
    },
    completed: {
      title: 'Booking Completed',
      message: 'Your booking has been marked as completed. Thank you for using our service!',
      color: '#8b5cf6',
      icon: '🏁'
    }
  };

  const config = statusMessages[status] || statusMessages.pending;
  const facilityName = booking.facility?.name || 'Facility';
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${config.title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          padding: 20px;
        }
        .card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background-color: ${config.color};
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 24px;
        }
        .icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          color: #1f2937;
          margin-bottom: 20px;
        }
        .booking-details {
          background-color: #f9fafb;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid ${config.color};
        }
        .detail-row {
          display: flex;
          margin-bottom: 12px;
          font-size: 14px;
        }
        .detail-label {
          width: 100px;
          font-weight: 600;
          color: #4b5563;
        }
        .detail-value {
          flex: 1;
          color: #1f2937;
        }
        .message {
          color: #4b5563;
          line-height: 1.6;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          background-color: ${config.color};
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 8px;
          margin-top: 20px;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background-color: #f9fafb;
          font-size: 12px;
          color: #6b7280;
        }
        @media (max-width: 480px) {
          .container {
            margin: 20px auto;
          }
          .detail-row {
            flex-direction: column;
          }
          .detail-label {
            width: auto;
            margin-bottom: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="card">
          <div class="header">
            <div class="icon">${config.icon}</div>
            <h1>${config.title}</h1>
          </div>
          <div class="content">
            <div class="greeting">
              Dear ${user.fullName},
            </div>
            <div class="message">
              ${config.message}
            </div>
            <div class="booking-details">
              <div class="detail-row">
                <div class="detail-label">Facility:</div>
                <div class="detail-value">${facilityName}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Date:</div>
                <div class="detail-value">${bookingDate}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Time:</div>
                <div class="detail-value">${booking.startTime} - ${booking.endTime}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Purpose:</div>
                <div class="detail-value">${booking.purpose}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Attendees:</div>
                <div class="detail-value">${booking.expectedAttendees} people</div>
              </div>
              ${booking.equipmentNeeded && booking.equipmentNeeded.length > 0 ? `
                <div class="detail-row">
                  <div class="detail-label">Equipment:</div>
                  <div class="detail-value">${booking.equipmentNeeded.join(', ')}</div>
                </div>
              ` : ''}
              ${booking.totalAmount > 0 ? `
                <div class="detail-row">
                  <div class="detail-label">Amount:</div>
                  <div class="detail-value">$${booking.totalAmount}</div>
                </div>
              ` : ''}
            </div>
            ${status === 'approved' && booking.totalAmount > 0 && user.userType === 'external' ? `
              <div style="background-color: #fef3c7; border-radius: 12px; padding: 15px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <strong style="color: #92400e;">💰 Payment Required</strong>
                <p style="color: #92400e; margin-top: 8px;">Please complete payment of <strong>$${booking.totalAmount}</strong> to confirm your booking.</p>
              </div>
            ` : ''}
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-bookings" class="button">
                View My Bookings
              </a>
            </div>
          </div>
          <div class="footer">
            <p>This is an automated message from Facility Booking System.</p>
            <p>If you have any questions, please contact support.</p>
            <p>&copy; 2024 Facility Booking System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(user.email, `${config.icon} ${config.title} - Facility Booking`, html);
};

// Payment instructions email for external users
export const sendPaymentInstructions = async (user, booking) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Payment Instructions</title>
    </head>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 40px auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0;">Payment Required</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 16px 16px;">
          <p style="font-size: 16px;">Dear ${user.fullName},</p>
          <p>Your booking has been approved. Please complete the payment to confirm your booking.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Booking Details:</h3>
            <p><strong>Facility:</strong> ${booking.facility.name}</p>
            <p><strong>Date:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${booking.startTime} - ${booking.endTime}</p>
            <p><strong>Amount Due:</strong> $${booking.totalAmount}</p>
          </div>
          <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #92400e;">📋 Payment Instructions:</h3>
            <p><strong>Bank:</strong> Example Bank</p>
            <p><strong>Account Name:</strong> Facility Booking System</p>
            <p><strong>Account Number:</strong> 1234567890</p>
            <p><strong>Reference:</strong> BOOKING-${booking._id}</p>
          </div>
          <p>After payment, an admin will confirm your booking within 24 hours.</p>
          <div style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-bookings" style="display: inline-block; background-color: #3b82f6; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
              View Booking Status
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(user.email, '💰 Payment Instructions - Facility Booking', html);
};