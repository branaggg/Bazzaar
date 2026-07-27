import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function CartPage({
  t,
  cart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
}) {
  const { isAuthenticated, ready } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!ready) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' }, replace: true })
    }
  }, [isAuthenticated, navigate, ready])

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [cart],
  )

  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cart],
  )

  if (!ready || !isAuthenticated) return null

  return (
    <section className="cart-page">
      <div className="page-header rose-line cart-header">
        <div>
          <p className="eyebrow">{t('Cart')}</p>
          <h1>{t('Your cart')}</h1>
          <p className="cart-count">
            {itemCount} {itemCount === 1 ? t('item') : t('items')}
          </p>
        </div>
        <div className="header-actions">
          <Link to="/trade" className="button secondary-button">{t('Continue shopping')}</Link>
          {cart.length > 0 && (
            <button type="button" className="reset-button" onClick={clearCart}>
              {t('Clear cart')}
            </button>
          )}
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state cart-empty">
          <h2>{t('Your cart is empty')}</h2>
          <p>{t('Browse the marketplace or food bazaar to add something you love.')}</p>
          <div className="cart-empty-actions">
            <Link to="/trade" className="button">{t('Explore Marketplace')}</Link>
            <Link to="/food" className="button secondary-button">{t('Taste the Culture')}</Link>
          </div>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => {
              const quantity = item.quantity || 1
              const lineTotal = item.price * quantity

              return (
                <article key={item.id} className="cart-item">
                  <div className="cart-item-image" aria-hidden="true">
                    {(item.name || '?').slice(0, 1)}
                  </div>

                  <div className="cart-item-body">
                    <div className="cart-item-heading">
                      <h2>{t(item.name)}</h2>
                      <p className="price">${lineTotal.toFixed(2)}</p>
                    </div>
                    {item.seller && <p>{t('Seller')}: {item.seller}</p>}
                    {item.category && <p>{t(item.category)}</p>}
                    <p className="cart-unit-price">${item.price} {t('each')}</p>

                    <div className="cart-item-actions">
                      <label className="cart-qty">
                        <span>{t('Qty')}</span>
                        <select
                          value={quantity}
                          onChange={(event) => updateCartQuantity(item.id, Number(event.target.value))}
                        >
                          {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
                            <option key={value} value={value}>{value}</option>
                          ))}
                        </select>
                      </label>
                      <button
                        type="button"
                        className="reset-button"
                        onClick={() => removeFromCart(item.id)}
                      >
                        {t('Remove')}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className="cart-summary">
            <h2>{t('Order summary')}</h2>
            <div className="cart-summary-row">
              <span>{t('Subtotal')}</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="cart-summary-row">
              <span>{t('Pickup / delivery')}</span>
              <strong>{t('Set at checkout')}</strong>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>{t('Total')}</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <button
              type="button"
              className="cart-checkout-button"
              onClick={() => navigate('/checkout')}
            >
              {t('Proceed to checkout')}
            </button>
            <p className="cart-summary-note">
              {t('Checkout will collect pickup details and payment next.')}
            </p>
          </aside>
        </div>
      )}
    </section>
  )
}
