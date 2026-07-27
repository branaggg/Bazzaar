import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useRequireAuth } from './auth/useRequireAuth.js'
import { foodItems } from './FoodPage.jsx'
import { tradeItems } from './TradePage.jsx'

export function TradeDetailPage({ t, addToCart, addMessage, addNotification }) {
  const { id } = useParams()
  const requireAuth = useRequireAuth()
  const [isAdded, setIsAdded] = useState(false)
  const item = tradeItems.find((product) => product.id === Number(id))

  if (!item) return <MissingProduct t={t} backTo="/trade" />

  function sendTradeOffer() {
    addMessage?.({
      from: item.seller,
      text: `Trade offer started for ${item.name}.`,
    })
    addNotification?.(`Trade offer started with ${item.seller}`)
  }

  function handleAddToCart() {
    addToCart?.(item)
    setIsAdded(true)
    window.setTimeout(() => setIsAdded(false), 1000)
  }

  return (
      <ProductShell
      t={t}
      backTo="/trade"
      backLabel="Back to Marketplace"
      imageText={item.name.slice(0, 1)}
      eyebrow={item.category}
      title={item.name}
      price={item.price}
      sellerLabel="Seller"
      seller={item.seller}
      rating={item.rating}
      badge={item.badge}
      description={`${item.style} ${item.category} for ${item.occasion.toLowerCase()} wear. Listed in ${item.condition.toLowerCase()} condition with local pickup options in ${item.location}.`}
      details={[
        ['Condition', item.condition],
        ['Style', item.style],
        ['Occasion', item.occasion],
        ['Size', item.size],
        ['Location', item.location],
      ]}
      ctas={
        <>
          <button type="button" className="trade-button" onClick={() => requireAuth(sendTradeOffer)}>{t('Offer Trade')}</button>
          <button type="button" className={`buy-button add-cart-button ${isAdded ? 'is-added' : ''}`} onClick={() => requireAuth(handleAddToCart)}>{isAdded ? 'Added ✓' : t('Buy')}</button>
          <button type="button" className="message-button" onClick={() => requireAuth(() => addMessage?.({ from: item.seller, text: `Message started about ${item.name}.` }))}>{t('Message Seller')}</button>
        </>
      }
    />
  )
}

export function FoodDetailPage({ t, addToCart, addNotification }) {
  const { id } = useParams()
  const requireAuth = useRequireAuth()
  const [isAdded, setIsAdded] = useState(false)
  const item = foodItems.find((product) => product.id === Number(id))

  if (!item) return <MissingProduct t={t} backTo="/food" />

  function addFoodToCart() {
    addToCart?.({
      name: item.title,
      price: item.price,
      seller: item.vendor,
      category: item.category,
      method: item.method,
    })
    addNotification?.(`${item.title} added to cart`)
    setIsAdded(true)
    window.setTimeout(() => setIsAdded(false), 1000)
  }

  return (
    <ProductShell
      t={t}
      backTo="/food"
      backLabel="Back to Food Bazaar"
      imageText={item.title.slice(0, 1)}
      eyebrow={item.category}
      title={item.title}
      price={item.price}
      sellerLabel="Vendor"
      seller={item.vendor}
      rating={item.rating}
      badge={item.method}
      description={`${item.title} from ${item.vendor}. Available by ${item.method.toLowerCase()} and marked ${item.ready.toLowerCase()}.`}
      details={[
        ['Diet', item.diet],
        ['Method', item.method],
        ['Ready', item.ready],
        ['Distance', `${item.distance} mi`],
        ['Condition', 'Freshly prepared'],
      ]}
      ctas={
        <>
          <button type="button" className={`add-cart-button ${isAdded ? 'is-added' : ''}`} onClick={() => requireAuth(addFoodToCart)}>{isAdded ? 'Added ✓' : t('Add to cart')}</button>
        </>
      }
    />
  )
}

function ProductShell({ t, backTo, backLabel, imageText, eyebrow, title, price, sellerLabel, seller, rating, badge, description, details, ctas }) {
  return (
    <section className="detail-page">
      <Link to={backTo} className="back-link">{t(backLabel)}</Link>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-photo">
            <span>{imageText}</span>
          </div>
          <div className="detail-thumbnails" aria-label="Product photos">
            <div>{imageText}</div>
            <div>{imageText}</div>
            <div>{imageText}</div>
          </div>
        </div>

        <article className="detail-info">
          <p className="eyebrow">{t(eyebrow)}</p>
          <h1>{t(title)}</h1>
          <p className="detail-price">${price}</p>
          <p className="detail-description">{t(description)}</p>

          <div className="seller-panel">
            <div>
              <p className="eyebrow">{t(sellerLabel)}</p>
              <h2>{seller}</h2>
            </div>
            <span>{rating} {t('rating')}</span>
            <strong>{t(badge)}</strong>
          </div>

          <dl className="detail-list">
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{t(label)}</dt>
                <dd>{t(value)}</dd>
              </div>
            ))}
          </dl>

          <div className="detail-actions">
            {ctas}
          </div>
        </article>
      </div>
    </section>
  )
}

function MissingProduct({ t, backTo }) {
  return (
    <section className="empty-state">
      <h2>{t('No matching items')}</h2>
      <p>{t('This listing could not be found.')}</p>
      <Link to={backTo} className="button">{t('Back to Marketplace')}</Link>
    </section>
  )
}
