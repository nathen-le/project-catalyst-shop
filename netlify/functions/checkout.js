const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function(event) {
  try {
    const cart = JSON.parse(event.body);

    const itemsList = cart.map(item => `${item.name} - $${item.price.toFixed(2)}`).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    await sgMail.send({
      to: 'your-email@example.com',
      from: 'your-verified-email@example.com',
      subject: 'New Order from Your Shop',
      text: `You have a new order:\n\n${itemsList}\n\nTotal: $${total.toFixed(2)}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
