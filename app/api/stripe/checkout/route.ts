import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

export async function POST(request: Request) {
  try {
    const { productId, productName, price, quantity } = await request.json();

    if (!productId || !productName || !price || !quantity) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              metadata: {
                productId,
              },
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop`,
      metadata: {
        productId,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
