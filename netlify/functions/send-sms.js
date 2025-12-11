const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, phone, investment_level, message } = JSON.parse(event.body);

    // Get Twilio credentials from environment variables
    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    const NOTIFICATION_PHONE = process.env.NOTIFICATION_PHONE || '+14696698878';

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
      console.error('Missing Twilio credentials in environment variables');
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Format SMS message
    const smsBody = `🚨 NEW INVESTMENT INQUIRY

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Package: ${investment_level || 'Not specified'}
Message: ${message || 'None'}

Reply to schedule meeting!`;

    // Send SMS via Twilio
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;

    const params = new URLSearchParams();
    params.append('To', NOTIFICATION_PHONE);
    params.append('From', TWILIO_PHONE_NUMBER);
    params.append('Body', smsBody);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error('Twilio error:', twilioData);
      throw new Error(`Twilio API error: ${twilioData.message || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        message: 'SMS notification sent successfully',
        sid: twilioData.sid
      })
    };

  } catch (error) {
    console.error('SMS function error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
