import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail } from '@/lib/email/mailersend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const { sessionId, email } = await request.json();

    if (!sessionId || !email) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return Response.json({ error: 'Payment not completed' }, { status: 400 });
    }

    // Get payment intent for additional verification
    const paymentIntent = session.payment_intent as string;
    const paymentIntentDetails = await stripe.paymentIntents.retrieve(paymentIntent);

    if (paymentIntentDetails.status !== 'succeeded') {
      return Response.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Generate a unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Store the order in Supabase
    // Insert a new order following the table schema.
    // 'id' is omitted to allow default UUID generation.
    // 'order_number' should be unique and present.
    // Save amount in integer cents, as per schema.
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const productId = session.metadata?.productId || 'digital-planner';
    const productName = session.metadata?.productName || 'Digital Study Planner & Journal';
    const amountCents = session.amount_total ?? 0; // Stripe always uses cents (integer)
    const currency = (session.currency || 'usd').toLowerCase();
    const status = 'completed'; // Schema enforces allowed statuses

    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        stripe_session_id: sessionId,
        stripe_payment_intent_id: paymentIntent,
        customer_email: email,
        customer_name: session.customer_details?.name || null,
        product_id: productId,
        product_name: productName,
        amount: amountCents,
        currency: currency,
        status: status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // download_url and download_count left null/default for now
      }]);

    if (error) {
      console.error('Database error:', error);
      return Response.json({ error: 'Failed to store order' }, { status: 500 });
    }

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail({
        to: {
          email: email,
          name: session.customer_details?.name || undefined,
        },
        subject: `Order Confirmation - Your StudyForge Purchase (${orderNumber})`,
        htmlContent: '', // The function generates this
        orderId,
        orderNumber,
        productName,
        amount: amountCents,
        currency: currency,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the entire response if email fails, but log it
    }

    return Response.json({
      success: true,
      orderId,
      orderNumber,
      message: 'Order verified and stored successfully',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return Response.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
