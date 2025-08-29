const fetch = require('node-fetch'); // Netlify includes this automatically

exports.handler = async (event) => {
  console.log('Checkout function triggered');
  console.log('Event body:', event.body);

  try {
    const cart = JSON.parse(event.body); // Get cart array from frontend
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL; // Set in Netlify dashboard

    // Format order info
    const itemsList = cart.map(item => `${item.name} ($${item.price.toFixed(2)})`).join(', ');
    const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);

    const message = {
      content: `🛒 **New Order Received!**\n` +
               `Items: ${itemsList}\n` +
               `Total: $${total}`
    };

    // Send to Discord webhook
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    return {
      statusCode: 200,
      body: 'Checkout processed and Discord notified.'
    };
  } catch (err) {
    console.error('Checkout error:', err);
    return {
      statusCode: 500,
      body: 'Failed to process checkout.'
    };
  }
};
