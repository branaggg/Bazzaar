import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

const paymentMethods = [
  { id: 'card', label: 'Credit or debit card', detail: 'Pay now with a saved or new card.' },
  { id: 'cash', label: 'Cash at pickup', detail: 'Bring exact cash when you meet the seller.' },
  { id: 'zelle', label: 'Zelle or Venmo', detail: 'Coordinate payment details after confirmation.' },
]

export default function CheckoutPage({ t, cart, clearCart, addNotification }) {
  const { user, isAuthenticated, ready } = useAuth()
  const navigate = useNavigate()
  const [fulfillment, setFulfillment] = useState('pickup')
  const [payment, setPayment] = useState('card')
  const [confirmedOrder, setConfirmedOrder] = useState(null)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: user?.city || 'San Jose',
    pickupNote: '',
  })

  useEffect(() => {
    if (!ready) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' }, replace: true })
    }
  }, [isAuthenticated, navigate, ready])

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: current.name || user?.name || '',
      city: current.city || user?.city || 'San Jose',
    }))
  }, [user])

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [cart],
  )

  const serviceFee = cart.length > 0 ? 1.99 : 0
  const deliveryFee = fulfillment === 'delivery' && cart.length > 0 ? 4.99 : 0
  const total = subtotal + serviceFee + deliveryFee
  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function placeOrder(event) {
    event.preventDefault()

    const order = {
      id: `BZ-${Date.now().toString().slice(-6)}`,
      itemCount,
      total,
      fulfillment,
      payment: paymentMethods.find((method) => method.id === payment)?.label || 'Payment method',
    }

    setConfirmedOrder(order)
    clearCart?.()
    addNotification?.(`Order ${order.id} confirmed`)
  }

  if (!ready || !isAuthenticated) return null

  if (confirmedOrder) {
    return (
      <section className="checkout-page">
        <div className="checkout-confirmation">
          <p className="eyebrow">{t('Confirmation')}</p>
          <h1>{t('Order confirmed')}</h1>
          <p>
            {t('Your order is set. The seller will follow up with pickup or delivery details.')}
          </p>
          <div className="confirmation-details">
            <div>
              <span>{t('Order')}</span>
              <strong>{confirmedOrder.id}</strong>
            </div>
            <div>
              <span>{t('Items')}</span>
              <strong>{confirmedOrder.itemCount}</strong>
            </div>
            <div>
              <span>{t('Total')}</span>
              <strong>${confirmedOrder.total.toFixed(2)}</strong>
            </div>
            <div>
              <span>{t('Payment')}</span>
              <strong>{t(confirmedOrder.payment)}</strong>
            </div>
          </div>
          <div className="checkout-actions">
            <Link to="/trade" className="button">{t('Keep shopping')}</Link>
            <Link to="/inbox" className="button secondary-button">{t('Open inbox')}</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="checkout-page">
      <div className="page-header rose-line cart-header">
        <div>
          <p className="eyebrow">{t('Checkout')}</p>
          <h1>{t('Checkout')}</h1>
          <p className="cart-count">
            {t('Address or pickup, payment method, order summary, and confirmation.')}
          </p>
        </div>
        <Link to="/cart" className="button secondary-button">{t('Back to cart')}</Link>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state cart-empty">
          <h2>{t('Your cart is empty')}</h2>
          <p>{t('Add items from the marketplace or food bazaar before checkout.')}</p>
          <div className="cart-empty-actions">
            <Link to="/trade" className="button">{t('Explore Marketplace')}</Link>
            <Link to="/food" className="button secondary-button">{t('Taste the Culture')}</Link>
          </div>
        </div>
      ) : (
        <form className="checkout-layout" onSubmit={placeOrder}>
          <div className="checkout-main">
            <section className="checkout-card">
              <div className="checkout-section-heading">
                <span>1</span>
                <div>
                  <h2>{t('Address / pickup')}</h2>
                  <p>{t('Choose how you want to receive the items.')}</p>
                </div>
              </div>

              <div className="segmented-control" aria-label={t('Fulfillment method')}>
                <button
                  type="button"
                  className={fulfillment === 'pickup' ? 'is-selected' : ''}
                  onClick={() => setFulfillment('pickup')}
                >
                  {t('Pickup')}
                </button>
                <button
                  type="button"
                  className={fulfillment === 'delivery' ? 'is-selected' : ''}
                  onClick={() => setFulfillment('delivery')}
                >
                  {t('Delivery')}
                </button>
              </div>

              <div className="checkout-fields">
                <label>
                  {t('Full name')}
                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                  />
                </label>
                <label>
                  {t('Phone')}
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    placeholder="(555) 555-0123"
                  />
                </label>
                {fulfillment === 'delivery' && (
                  <label className="checkout-wide">
                    {t('Delivery address')}
                    <input
                      required
                      value={form.address}
                      onChange={(event) => updateField('address', event.target.value)}
                      placeholder={t('Street address, apartment, gate code')}
                    />
                  </label>
                )}
                <label>
                  {t('City')}
                  <input
                    required
                    value={form.city}
                    onChange={(event) => updateField('city', event.target.value)}
                  />
                </label>
                <label className="checkout-wide">
                  {t('Pickup note')}
                  <input
                    value={form.pickupNote}
                    onChange={(event) => updateField('pickupNote', event.target.value)}
                    placeholder={t('Preferred time, landmark, or seller note')}
                  />
                </label>
              </div>
            </section>

            <section className="checkout-card">
              <div className="checkout-section-heading">
                <span>2</span>
                <div>
                  <h2>{t('Payment method')}</h2>
                  <p>{t('Select how you want to pay for this order.')}</p>
                </div>
              </div>

              <div className="payment-options">
                {paymentMethods.map((method) => (
                  <label key={method.id} className="payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={payment === method.id}
                      onChange={() => setPayment(method.id)}
                    />
                    <span>
                      <strong>{t(method.label)}</strong>
                      <small>{t(method.detail)}</small>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <aside className="cart-summary checkout-summary">
            <h2>{t('Order summary')}</h2>
            <div className="checkout-mini-list">
              {cart.map((item) => (
                <div key={item.id} className="checkout-mini-item">
                  <span>{t(item.name)} x {item.quantity || 1}</span>
                  <strong>${(item.price * (item.quantity || 1)).toFixed(2)}</strong>
                </div>
              ))}
            </div>
            <div className="cart-summary-row">
              <span>{t('Subtotal')}</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="cart-summary-row">
              <span>{t('Service fee')}</span>
              <strong>${serviceFee.toFixed(2)}</strong>
            </div>
            <div className="cart-summary-row">
              <span>{t('Pickup / delivery')}</span>
              <strong>{deliveryFee ? `$${deliveryFee.toFixed(2)}` : t('Free pickup')}</strong>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>{t('Total')}</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <button type="submit" className="cart-checkout-button">
              {t('Place order')}
            </button>
            <p className="cart-summary-note">
              {t('You will review confirmation immediately after placing the order.')}
            </p>
          </aside>
        </form>
      )}
    </section>
  )
}
