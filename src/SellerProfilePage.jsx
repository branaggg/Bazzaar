import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import { useRequireAuth } from './auth/useRequireAuth.js'
import { tradeItems } from './TradePage.jsx'
import { foodItems } from './FoodPage.jsx'

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

function formatEmail(name) {
  return `${name.trim().toLowerCase().replace(/\s+/g, '.')}@bazaar.com`
}

function formatPhone(name) {
  const digits = Array.from(name.trim().toLowerCase()).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const last = String(1000 + (digits % 9000)).slice(-4)
  return `+1 408 555-${last}`
}

export default function SellerProfilePage({ t, addMessage, addNotification, addToCart }) {
  const { name } = useParams()
  const sellerKey = normalizeName(decodeURIComponent(name || ''))
  const tradeListings = useMemo(
    () => tradeItems.filter((item) => normalizeName(item.seller) === sellerKey),
    [sellerKey],
  )
  const foodListings = useMemo(
    () => foodItems.filter((item) => normalizeName(item.vendor) === sellerKey),
    [sellerKey],
  )
  const listings = [...tradeListings, ...foodListings]

  if (listings.length === 0) {
    return (
      <section className="empty-state">
        <h2>{t('No matching items')}</h2>
        <p>{t('No seller was found with that name.')}</p>
        <Link to="/trade" className="button secondary-button">{t('Browse sellers')}</Link>
      </section>
    )
  }

  const sellerName = tradeListings[0]?.seller || foodListings[0]?.vendor || sellerKey.replace(/-/g, ' ')
  const sellerRating = (
    listings.reduce((sum, item) => sum + (item.rating || 0), 0) / listings.length
  ).toFixed(1)
  const sellerBadge = tradeListings[0]?.badge || foodListings[0]?.badge || t('Top seller')
  const sellerLocation = tradeListings[0]?.location || t('Bay Area')
  const listingCount = listings.length

  function contactSeller() {
    if (!addMessage) return
    addMessage({
      from: sellerName,
      text: `Hi ${sellerName}, I'm interested in your listings.`,
      outbound: true,
    })
    addNotification?.(`Message sent to ${sellerName}`)
  }

  return (
    <section className="seller-profile-page">
      <div className="seller-profile-hero">
        <div>
          <p className="eyebrow">{t('Seller profile')}</p>
          <h1>{sellerName}</h1>
          <p className="seller-meta">
            {listingCount} {t('listings')} · {sellerRating} {t('rating')} · {sellerLocation}
          </p>
        </div>
        <div className="seller-contact-panel">
          <div>
            <p>{t('Contact')}</p>
            <strong>{formatEmail(sellerName)}</strong>
            <strong>{formatPhone(sellerName)}</strong>
            <span>{sellerBadge}</span>
          </div>
          <button type="button" className="button" onClick={contactSeller}>
            {t('Message seller')}
          </button>
        </div>
      </div>

      <div className="seller-summary-grid">
        <div className="seller-summary-card">
          <p>{t('Average rating')}</p>
          <strong>{sellerRating} / 5</strong>
        </div>
        <div className="seller-summary-card">
          <p>{t('Listings')}</p>
          <strong>{listingCount}</strong>
        </div>
        <div className="seller-summary-card">
          <p>{t('Location')}</p>
          <strong>{sellerLocation}</strong>
        </div>
      </div>

      <section className="seller-listings">
        <div className="seller-listings-header">
          <h2>{t('Active listings')}</h2>
          <p>{t('Browse current items available from this seller.')}</p>
        </div>

        <div className="seller-card-grid">
          {listings.map((item) => {
            const isTrade = item.seller === sellerName
            const title = isTrade ? item.name : item.title
            const detailPath = isTrade ? `/trade/${item.id}` : `/food/${item.id}`
            const subtitle = isTrade
              ? `${t(item.condition)} · ${item.location}`
              : `${t(item.method)} · ${item.ready}`
            const badgeText = isTrade ? item.badge : item.method

            return (
              <article key={`${isTrade ? 'trade' : 'food'}-${item.id}`} className="seller-card seller-listing-card">
                <div className="seller-card-preview">
                  <span>{title.slice(0, 1)}</span>
                </div>

                <div className="seller-card-details">
                  <p className="eyebrow">{t(item.category)}</p>
                  <h3>{t(title)}</h3>
                  <p className="seller-listing-meta">{subtitle}</p>
                </div>

                <div className="seller-card-summary">
                  <p className="seller-card-price">${item.price}</p>
                  <span>{item.rating} {t('rating')}</span>
                  <span className="seller-card-badge">{t(badgeText)}</span>
                </div>

                <div className="seller-card-actions">
                  <Link to={detailPath} className="detail-link">{t('View details')}</Link>
                  <button
                    type="button"
                    onClick={() => addToCart?.(
                      isTrade
                        ? item
                        : {
                            name: item.title,
                            price: item.price,
                            seller: item.vendor,
                            category: item.category,
                          },
                    )}
                  >
                    {t('Add to cart')}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </section>
  )
}
