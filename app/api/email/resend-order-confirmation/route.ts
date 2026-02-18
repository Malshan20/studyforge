import { createClient } from '@supabase/supabase-js';
import { sendOrderConfirmationEmail } from '@/lib/email/mailersend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: Request) {
  try {
    const { email, orderId } = await request.json();

    if (!email || !orderId) {
      return Response.json({ error: 'Missing email or orderId' }, { status: 400 });
    }

    // Fetch the order from database
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderId)
      .eq('customer_email', email)
      .single();

    if (fetchError || !order) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    // Send the confirmation email
    await sendOrderConfirmationEmail({
      to: {
        email: order.customer_email,
        name: order.customer_name || undefined,
      },
      subject: `Order Confirmation - Your StudyForge Purchase (${order.order_number})`,
      htmlContent: '',
      orderId: order.id,
      orderNumber: order.order_number,
      productName: order.product_name,
      amount: order.amount,
      currency: order.currency,
    });

    return Response.json({
      success: true,
      message: 'Confirmation email resent successfully',
    });
  } catch (error) {
    console.error('Error resending email:', error);
    return Response.json({ error: 'Failed to resend email' }, { status: 500 });
  }
}
