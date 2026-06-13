import twilio from 'twilio';

const client = process.env.TWILIO_SID && process.env.TWILIO_TOKEN 
  ? twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
  : null;

export const sendSMS = async (to, message) => {
  try {
    if (!client) {
      console.log('SMS would be sent:', { to, message });
      return true;
    }
    
    await client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    return true;
  } catch (error) {
    console.error('SMS error:', error);
    return false;
  }
};

export const sendBookingSMS = async (user, booking, status) => {
  const message = `Facility Booking: Your booking for ${booking.facility.name} on ${new Date(booking.bookingDate).toLocaleDateString()} is ${status}. Login to view details.`;
  return await sendSMS(user.phone, message);
};