import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Search for orders by email
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return Response.json({ error: 'Failed to search orders' }, { status: 500 });
    }

    return Response.json({ orders: data || [] });
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
