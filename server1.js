const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🛡️ Set your Delta Exchange API keys here
const API_KEY = "IPe4EIBhyOn0W2w1CuOp7zWvA9BFpf";
const API_SECRET = "lt1Tyq7IgI5M0EkRXq3zIy3ONLmdj0iSenWMGMBwpaAZZ86x6CKryN7FPwHg";

const PLACE_ORDER_URL = "https://api.delta.exchange/orders";

app.post("/", async (req, res) => {
  const { action, symbol, quantity, order_type } = req.body;

  try {
    const side = action.toLowerCase(); // "buy" or "sell"

    const orderData = {
      product_id: 1, // You'll need to get the correct product ID for your pair
      size: quantity,
      side: side,
      order_type: order_type || "market"
    };

    const response = await axios.post(PLACE_ORDER_URL, orderData, {
      headers: {
        "api-key": API_KEY,
        "Content-Type": "application/json"
        // Optionally add timestamp and signature
      }
    });

    console.log("Order Placed:", response.data);
    res.status(200).send("✅ Order received and placed.");
  } catch (error) {
    console.error("❌ Error placing order:", error.response?.data || error.message);
    res.status(500).send("❌ Failed to place order.");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
