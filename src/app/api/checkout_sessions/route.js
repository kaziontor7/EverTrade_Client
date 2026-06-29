import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '../../../lib/stripe'

export async function POST(req) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const { cartItems, customerEmail, userId } = await req.json()

    // Map raw prices dynamically on-the-fly
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'usd', // Set your currency code here (lowercase)
        unit_amount: item.price * 100, // Convert raw price to subunits (e.g. 60 -> 6000)
        product_data: {
          name: item.title || item.name, // Displayed directly on Stripe checkout page
        },
      },
      quantity: item.cartQuantity || item.quantity || 1,
    }))

    const session = await stripe.checkout.sessions.create({
      customer_email: customerEmail || undefined,
      metadata: { userId },
      line_items: line_items,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      
      // Inline shipping fee ($15 -> 1500 subunits)
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 15 * 100, 
              currency: 'usd',
            },
            display_name: 'Standard Shipping',
          },
        },
      ],
      // Disabled automatic tax calculation as it requires head office address in test mode
      automatic_tax: { enabled: false }, 
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}