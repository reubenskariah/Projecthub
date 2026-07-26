/**
 * Admin Notification Service
 * Dispatches real-time alerts to admins when new projects are submitted.
 * Supports Telegram (individual or multi-chat lists/groups) and WhatsApp fallbacks.
 */

export async function sendAdminNotification(projectTitle: string, dept: string, callerName: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Build a neat text block for messaging
  const message = `🔔 *New Project Approval Waiting* 🔔\n\n` +
                  `A new project call has been submitted:\n` +
                  `• *Title*: ${projectTitle}\n` +
                  `• *Department*: ${dept}\n` +
                  `• *Creator*: ${callerName}\n\n` +
                  `Please visit the Admin Portal to review:\n` +
                  `${appUrl}/admin`;

  // 1. Telegram (Preferred & Chosen Option)
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChatId = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChatId) {
    // Split by comma to support multiple recipient chat IDs
    const chatIds = tgChatId.split(',').map((id) => id.trim()).filter(Boolean);
    const results = await Promise.all(
      chatIds.map(async (chatId) => {
        try {
          const res = await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
              parse_mode: 'Markdown'
            })
          });
          return res.ok;
        } catch (e) {
          console.error(`Telegram send failed for chat ID ${chatId}:`, e);
          return false;
        }
      })
    );
    const successCount = results.filter(Boolean).length;
    return { 
      success: successCount > 0, 
      provider: 'telegram',
      details: `Delivered to ${successCount}/${chatIds.length} Telegram chats.`
    };
  }

  // 2. Callmebot (WhatsApp free tier)
  const callmebotPhone = process.env.CALLMEBOT_PHONE;
  const callmebotKey = process.env.CALLMEBOT_API_KEY;
  if (callmebotPhone && callmebotKey) {
    try {
      // Callmebot requires encoding text parameter; replace * with _ for WhatsApp formatting compatibility
      const encodedMsg = encodeURIComponent(message.replace(/\*/g, '_'));
      const url = `https://api.callmebot.com/whatsapp.php?phone=${callmebotPhone}&text=${encodedMsg}&apikey=${callmebotKey}`;
      const res = await fetch(url);
      return { success: res.ok, provider: 'callmebot' };
    } catch (e) {
      console.error('Callmebot send failed:', e);
      return { success: false, error: String(e) };
    }
  }

  // 3. Twilio WhatsApp Business API
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_FROM;
  const twilioTo = process.env.ADMIN_WHATSAPP_NUMBER;
  if (twilioSid && twilioToken && twilioFrom && twilioTo) {
    try {
      const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64');
      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: twilioFrom.startsWith('whatsapp:') ? twilioFrom : `whatsapp:${twilioFrom}`,
          To: twilioTo.startsWith('whatsapp:') ? twilioTo : `whatsapp:${twilioTo}`,
          Body: message
        })
      });
      return { success: res.ok, provider: 'twilio' };
    } catch (e) {
      console.error('Twilio send failed:', e);
      return { success: false, error: String(e) };
    }
  }

  // 4. UltraMsg API
  const ultraMsgInstance = process.env.ULTRAMSG_INSTANCE_ID;
  const ultraMsgToken = process.env.ULTRAMSG_TOKEN;
  const ultraMsgTo = process.env.ADMIN_WHATSAPP_NUMBER;
  if (ultraMsgInstance && ultraMsgToken && ultraMsgTo) {
    try {
      const url = `https://api.ultramsg.com/${ultraMsgInstance}/messages/chat`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: ultraMsgToken,
          to: ultraMsgTo,
          body: message
        })
      });
      return { success: res.ok, provider: 'ultramsg' };
    } catch (e) {
      console.error('UltraMsg send failed:', e);
      return { success: false, error: String(e) };
    }
  }

  // 5. Green API instance
  const greenApiInstance = process.env.GREENAPI_ID_INSTANCE;
  const greenApiToken = process.env.GREENAPI_API_TOKEN_INSTANCE;
  const greenApiTo = process.env.ADMIN_WHATSAPP_NUMBER;
  if (greenApiInstance && greenApiToken && greenApiTo) {
    try {
      const formattedTo = greenApiTo.replace(/[^0-9]/g, '') + '@c.us';
      const url = `https://api.green-api.com/waInstance${greenApiInstance}/sendMessage/${greenApiToken}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: formattedTo,
          message: message
        })
      });
      return { success: res.ok, provider: 'greenapi' };
    } catch (e) {
      console.error('Green API send failed:', e);
      return { success: false, error: String(e) };
    }
  }

  // 6. Generic Webhook URL
  const webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
  const webhookTo = process.env.ADMIN_WHATSAPP_NUMBER;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: webhookTo || 'admin',
          message: message
        })
      });
      return { success: res.ok, provider: 'webhook' };
    } catch (e) {
      console.error('Webhook send failed:', e);
      return { success: false, error: String(e) };
    }
  }

  console.warn('No admin notification credentials configured in environment variables.');
  return { success: false, error: 'No notification provider configured' };
}

export function getNotificationConfigStatus() {
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    const chatIds = process.env.TELEGRAM_CHAT_ID.split(',').map((id) => id.trim()).filter(Boolean).length;
    return { configured: true, type: `Telegram (${chatIds} Admin${chatIds > 1 ? 's' : ''})` };
  }
  if (process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_API_KEY) {
    return { configured: true, type: 'Callmebot (WhatsApp)' };
  }
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM &&
    process.env.ADMIN_WHATSAPP_NUMBER
  ) {
    return { configured: true, type: 'Twilio (WhatsApp)' };
  }
  if (process.env.ULTRAMSG_INSTANCE_ID && process.env.ULTRAMSG_TOKEN && process.env.ADMIN_WHATSAPP_NUMBER) {
    return { configured: true, type: 'UltraMsg (WhatsApp)' };
  }
  if (process.env.GREENAPI_ID_INSTANCE && process.env.GREENAPI_API_TOKEN_INSTANCE && process.env.ADMIN_WHATSAPP_NUMBER) {
    return { configured: true, type: 'Green API (WhatsApp)' };
  }
  if (process.env.WHATSAPP_WEBHOOK_URL) {
    return { configured: true, type: 'Webhook' };
  }
  return { configured: false, type: null };
}
