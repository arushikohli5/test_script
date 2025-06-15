const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // used to send HTTP requests to exchange API
require('dotenv').config(); // loads API_KEY and API_SECRET from .env file
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Load your API credentials from environment variables


// Step 1: Create endpoint to receive alerts from TradingView
app.post('/', async (req, res) => {
  const data = req.body;

  console.log('Webhook received:', data);

  // Step 2: Validate and parse webhook data
  const { action, symbol, quantity } = data;

  if (!action || !symbol || !quantity) {
    return res.status(400).send('Invalid data');
  }

  try {
    // Step 3: Place order on exchange (e.g., Delta)
    const result = await placeOrder(symbol, quantity, action);
    console.log('Order response:', result);
    res.status(200).send('Order placed');
  } catch (err) {
    console.error('Error placing order:', err.message);
    res.status(500).send('Order failed');
  }
});

async function placeOrder(symbol, quantity, side) {
  const url = 'https://api.delta.exchange/v2/orders'; // change this for your exchange

  const timestamp = Date.now().toString();
  const body = {
    product_id: symbol,
    size: quantity,
    side: side.toUpperCase(), // BUY or SELL
    order_type: 'market'
  };

  const payload = JSON.stringify(body);

  const signature = crypto
    .createHmac('sha256', API_SECRET)
    .update(timestamp + payload)
    .digest('hex');

  const headers = {
    'api-key': API_KEY,
    'timestamp': timestamp,
    'signature': signature,
    'Content-Type': 'application/json'
  };

  const response = await axios.post(url, body, { headers });
  return response.data;
}

app.listen(PORT, () => console.log(`🚀 Webhook server running on port ${PORT}`));
