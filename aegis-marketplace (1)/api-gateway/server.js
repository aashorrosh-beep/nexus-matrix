require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: process.env.STRIPE_API_VERSION
});

app.use(cors());
app.use(express.json());

// DBA Routing Middleware: Identifies which of the 10 storefronts is active
app.use((req, res, next) => {
  const host = req.headers.host || 'unknown.nexus.com';
  req.storefront = host.split('.')[0]; 
  next();
});

// System Health Check
app.get('/health', (req, res) => {
  res.json({ 
    system: 'Nexus API Gateway', 
    status: 'Online', 
    active_storefront: req.storefront 
  });
});

// Nexus Escrow Engine: Stripe Connect Destination Charge
app.post('/api/escrow/lock', async (req, res) => {
  try {
    const { amount, vendorAccountId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      capture_method: 'manual', // Locks funds without capturing immediately
      transfer_data: {
        destination: vendorAccountId, // Routes principal to 3rd party seller
      },
      application_fee_amount: Math.round(amount * 0.05), // Nexus retains a 5% platform fee
    });
    
    res.json({ 
      status: 'Escrow Locked',
      paymentIntentId: paymentIntent.id 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`[Nexus API Gateway] Traffic routing online - Port ${PORT}`);
});
