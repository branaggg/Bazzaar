import { Link, useParams } from 'react-router-dom'
import { foodItems } from './FoodPage.jsx'
import { tradeItems } from './TradePage.jsx'

export function TradeDetailPage({ t, addToCart, addMessage, addNotification }) {
  const { id } = useParams()
  const item = tradeItems.find((product) => product.id === Number(id))

  if (!item) return <MissingProduct t={t} backTo="/trade" />

  function sendTradeOffer() {
    addMessage?.({
      from: item.seller,
      text: `Trade offer started for ${item.name}.`,
    })
    addNotification?.(`Trade offer started with ${item.seller}`)
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
      seller={item.seller}
      rating={item.rating}
      badge={item.badge}
      details={[
        ['Condition', item.condition],
        ['Style', item.style],
        ['Occasion', item.occasion],
        ['Size', item.size],
        ['Location', item.location],
      ]}
      ctas={
        <>
          <button type="button" className="trade-button" onClick={sendTradeOffer}>{t('Offer Trade')}</button>
          <button type="button" className="buy-button" onClick={() => addToCart?.(item)}>{t('Buy')}</button>
        </>
      }
    />
  )
}

export function FoodDetailPage({ t, addToCart, addNotification }) {
  const { id } = useParams()
  const item = foodItems.find((product) => product.id === Number(id))

  if (!item) return <MissingProduct t={t} backTo="/food" />

  function reserveItem() {
    addToCart?.({ name: item.title, price: item.price })
    addNotification?.(`${item.title} reserved from ${item.vendor}`)
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
      seller={item.vendor}
      rating={item.rating}
      badge={item.method}
      details={[
        ['Diet', item.diet],
        ['Method', item.method],
        ['Ready', item.ready],
        ['Distance', `${item.distance} mi`],
        ['Condition', 'Freshly prepared'],
      ]}
      ctas={
        <>
          <button type="button" className="save-food-button">{t(item.saved ? 'Saved' : 'Save')}</button>
          <button type="button" onClick={reserveItem}>{t('Reserve')}</button>
        </>
      }
    />
  )
}

function ProductShell({ t, backTo, backLabel, imageText, eyebrow, title, price, seller, rating, badge, details, ctas }) {
  return (
    <section className="detail-page">
      <Link to={backTo} className="back-link">{t(backLabel)}</Link>

      <div className="detail-layout">
        <div className="detail-photo">
          <span>{imageText}</span>
        </div>

        <article className="detail-info">
          <p className="eyebrow">{t(eyebrow)}</p>
          <h1>{t(title)}</h1>
          <p className="detail-price">${price}</p>

          <div className="seller-panel">
            <div>
              <p className="eyebrow">{t('Seller')}</p>
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
