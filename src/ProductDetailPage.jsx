import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useRequireAuth } from './auth/useRequireAuth.js'
import AddToCartControls from './AddToCartControls.jsx'
import { foodItems } from './FoodPage.jsx'
import { tradeItems } from './TradePage.jsx'

export function TradeDetailPage({ t, addToCart, addMessage, addNotification }) {
  const { id } = useParams()
  const requireAuth = useRequireAuth()
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
          <AddToCartControls
            t={t}
            requireAuth={requireAuth}
            className="detail-add-to-cart"
            onAdd={(quantity) => addToCart?.({ ...item, quantity })}
          />
          <button type="button" className="trade-button" onClick={() => requireAuth(sendTradeOffer)}>{t('Offer Trade')}</button>
          <button type="button" className="message-button" onClick={() => requireAuth(() => addMessage?.({ from: item.seller, text: `Message started about ${item.name}.` }))}>{t('Message Seller')}</button>
        </>
      }
    />
  )
}

export function FoodDetailPage({ t, addToCart, addNotification }) {
  const { id } = useParams()
  const requireAuth = useRequireAuth()
  const item = foodItems.find((product) => product.id === Number(id))

  if (!item) return <MissingProduct t={t} backTo="/food" />

  return (
    <ProductShell
      t={t}
      backTo="/food"
      backLabel="Back to Food Bazaar"
      imageText={item.title.slice(0, 1)}
      imageUrl={item.image}
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
          <AddToCartControls
            t={t}
            requireAuth={requireAuth}
            className="detail-add-to-cart"
            onAdd={(quantity) => addToCart?.({
              name: item.title,
              title: item.title,
              price: item.price,
              vendor: item.vendor,
              category: item.category,
              method: item.method,
              quantity,
            })}
          />
        </>
      }
    />
  )
}

function ProductShell({ t, backTo, backLabel, imageText, imageUrl, eyebrow, title, price, sellerLabel, seller, rating, badge, description, details, ctas }) {
  const [ratingInput, setRatingInput] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [reviews, setReviews] = useState([])

  const averageRating = reviews.length > 0
    ? ((rating + reviews.reduce((sum, review) => sum + review.stars, 0)) / (reviews.length + 1)).toFixed(1)
    : rating.toFixed(1)

  function submitReview(event) {
    event.preventDefault()
    if (!ratingInput) return
    setReviews((current) => [
      ...current,
      { id: Date.now(), stars: ratingInput, text: reviewText.trim() },
    ])
    setRatingInput(0)
    setReviewText('')
  }

  return (
    <section className="detail-page">
      <Link to={backTo} className="back-link">{t(backLabel)}</Link>

      <div className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-photo">
            {imageUrl ? <img src={imageUrl} alt={title} /> : <span>{imageText}</span>}
          </div>
          <div className="detail-thumbnails" aria-label="Product photos">
            {imageUrl ? (
              [0, 1, 2].map((index) => (
                <div key={index}>
                  <img src={imageUrl} alt={`${title} ${index + 1}`} />
                </div>
              ))
            ) : (
              [1, 2, 3].map((index) => <div key={index}>{imageText}</div>)
            )}
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
              <h2>
                <Link to={`/seller/${encodeURIComponent(seller)}`} className="seller-link">
                  {seller}
                </Link>
              </h2>
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

          <div className="review-panel">
            <div className="review-summary">
              <h3>{t('Reviews')}</h3>
              <p>{t('Share a rating from 1 to 5 stars')}</p>
              <strong>{averageRating} / 5</strong>
            </div>

            <form className="review-form" onSubmit={submitReview}>
              <div className="star-picker" role="radiogroup" aria-label={t('Select rating')}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-button${ratingInput >= star ? ' is-selected' : ''}`}
                    onClick={() => setRatingInput(star)}
                    aria-pressed={ratingInput === star}
                    aria-label={`${star} ${t('star')}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                className="review-text"
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                placeholder={t('Add a short review...')}
                rows="3"
              />
              <button type="submit" className="button review-submit" disabled={ratingInput === 0}>
                {t('Submit rating')}
              </button>
            </form>

            {reviews.length > 0 && (
              <div className="review-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div>
                      <span>{'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}</span>
                      {review.text && <p>{review.text}</p>}
                    </div>
                    <small>{t('New rating')}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

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
