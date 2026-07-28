import { useState } from 'react'

export default function AddToCartControls({
  t,
  requireAuth,
  onAdd,
  label = 'Add to cart',
  className = '',
}) {
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  function changeQuantity(next) {
    const value = Math.max(1, Math.min(10, Number(next) || 1))
    setQuantity(value)
  }

  function handleAdd() {
    requireAuth(() => {
      onAdd?.(quantity)
      setJustAdded(true)
      window.setTimeout(() => setJustAdded(false), 1400)
    })
  }

  return (
    <div className={`add-to-cart-controls ${className}`.trim()}>
      <div className="cart-qty-stepper" role="group" aria-label={t('Qty')}>
        <button
          type="button"
          className="cart-qty-btn"
          aria-label={t('Decrease quantity')}
          onClick={() => changeQuantity(quantity - 1)}
        >
          −
        </button>
        <input
          className="cart-qty-input"
          type="number"
          min="1"
          max="10"
          value={quantity}
          aria-label={t('Qty')}
          onChange={(event) => changeQuantity(event.target.value)}
        />
        <button
          type="button"
          className="cart-qty-btn"
          aria-label={t('Increase quantity')}
          disabled={quantity >= 10}
          onClick={() => changeQuantity(quantity + 1)}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className={`buy-button add-to-cart-button ${justAdded ? 'is-added' : ''}`}
        onClick={handleAdd}
      >
        {justAdded ? t('Added') : t(label)}
      </button>
    </div>
  )
}
