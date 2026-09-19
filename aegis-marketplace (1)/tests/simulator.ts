import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY as string, { apiVersion: '2024-06-20' });
async function runSimulation() {
  try {
    console.log('[1/3] Generating Dummy Buyer Account...');
    const buyer = await stripe.customers.create({ email: 'buyer-sandbox@test.com' });
    console.log('[2/3] Authorizing Dummy Buyer Card...');
    const pi = await stripe.paymentIntents.create({ amount: 15000, currency: 'usd', customer: buyer.id, capture_method: 'manual', payment_method: 'pm_card_visa', confirm: true, automatic_payment_methods: { enabled: true, allow_redirects: 'never' } });
    console.log('  -> Escrow Locked! PaymentIntent: ' + pi.id);
    console.log('[3/3] Simulating Match & Capturing Funds...');
    await stripe.paymentIntents.capture(pi.id, { amount_to_capture: 15000 });
    console.log('  -> Match Executed. Escrow Captured. SUCCESS!');
  } catch (error: any) { console.error('[ERROR]', error.message); }
}
runSimulation();
