interface EmailRecipient {
  email: string;
  name?: string;
}

interface SendEmailParams {
  to: EmailRecipient;
  subject: string;
  htmlContent?: string;
  orderId: string;
  orderNumber: string;
  productName: string;
  amount: number;
  currency: string;
}

const generateEmailHTML = (params: SendEmailParams): string => {
  const { orderNumber, productName, amount, currency, orderId } = params;
  const googleDriveLink = process.env.GOOGLE_DRIVE_LINK || '#';
  const amountInDollars = (amount / 100).toFixed(2);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; }
    .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: white; padding: 30px; text-align: center; font-weight: bold; font-size: 24px; }
    .content { background: white; padding: 30px; border: 2px solid #1a1a1a; }
    .order-info { background: #f0f0f0; padding: 20px; margin: 20px 0; border-left: 4px solid #1a1a1a; }
    .label { font-weight: bold; color: #1a1a1a; font-size: 12px; text-transform: uppercase; }
    .value { font-size: 16px; margin-bottom: 15px; }
    .cta-button { 
      display: inline-block; 
      background: #1a1a1a; 
      color: white; 
      padding: 14px 32px; 
      text-decoration: none; 
      font-weight: bold; 
      margin: 20px 0;
      border: 2px solid #1a1a1a;
      cursor: pointer;
    }
    .cta-button:hover { background: white; color: #1a1a1a; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">STUDYFORGE</div>
    
    <div class="content">
      <h2 style="color: #1a1a1a; margin-top: 0;">ORDER CONFIRMATION</h2>
      
      <p>Thank you for your purchase! Your order has been successfully processed.</p>
      
      <div class="order-info">
        <div class="value">
          <div class="label">Order Number</div>
          <div>${orderNumber}</div>
        </div>
        
        <div class="value">
          <div class="label">Product</div>
          <div>${productName}</div>
        </div>
        
        <div class="value">
          <div class="label">Amount Paid</div>
          <div>${currency.toUpperCase()} $${amountInDollars}</div>
        </div>
        
        <div class="value">
          <div class="label">Order ID</div>
          <div style="font-family: monospace; font-size: 12px;">${orderId}</div>
        </div>
      </div>
      
      <h3 style="color: #1a1a1a;">DOWNLOAD YOUR DIGITAL PLANNER</h3>
      <p>Your digital study planner is ready to download. Click the button below to access your files:</p>
      
      <center>
        <a href="${googleDriveLink}" class="cta-button" target="_blank">DOWNLOAD NOW</a>
      </center>
      
      <h3 style="color: #1a1a1a;">WHAT'S INCLUDED</h3>
      <ul style="list-style: none; padding: 0;">
        <li>✓ 150+ Pages of Planning Templates</li>
        <li>✓ Weekly & Monthly Planning Pages</li>
        <li>✓ Digital PDF Format (Print or Use Digitally)</li>
        <li>✓ Mobile & Tablet Friendly</li>
        <li>✓ Assignment Tracking System</li>
        <li>✓ Academic Achievement Log</li>
      </ul>
      
      <h3 style="color: #1a1a1a;">NEED HELP?</h3>
      <p>If you have any questions or issues with your download, please contact us at support@studyforge.app</p>
      
      <p style="margin-top: 30px;">Happy studying!<br><strong>The StudyForge Team</strong></p>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} StudyForge. All rights reserved.</p>
      <p>This email was sent to ${params.to.email}</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const sendOrderConfirmationEmail = async (params: SendEmailParams): Promise<void> => {
  const apiKey = process.env.MAILERSEND_API_KEY;
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL;
  const fromName = process.env.MAILERSEND_FROM_NAME || 'StudyForge';

  if (!apiKey) {
    console.error('[v0] MAILERSEND_API_KEY is not set');
    throw new Error('Email service not configured');
  }

  if (!fromEmail) {
    console.error('[v0] MAILERSEND_FROM_EMAIL is not set');
    throw new Error('Email sender not configured');
  }

  const htmlContent = generateEmailHTML(params);

  const payload = {
    from: {
      email: fromEmail,
      name: fromName,
    },
    to: [
      {
        email: params.to.email,
        name: params.to.name || 'Valued Customer',
      },
    ],
    subject: params.subject,
    html: htmlContent,
    reply_to: {
      email: 'support@studyforge.app',
      name: 'StudyForge Support',
    },
  };

  console.log('[v0] Sending email payload:', {
    to: params.to.email,
    from: fromEmail,
    subject: params.subject,
  });

  try {
    const response = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(payload),
    });

    console.log('[v0] MailerSend response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[v0] MailerSend error response:', errorData);
      throw new Error(`MailerSend API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const responseData = await response.json();
    console.log('[v0] Email sent successfully:', responseData);
  } catch (error) {
    console.error('[v0] Error sending email:', error);
    throw error;
  }
};
