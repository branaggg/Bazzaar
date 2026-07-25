import { useMemo, useState } from 'react'
import { useAuth } from './auth/AuthContext.jsx'
import { useRequireAuth } from './auth/useRequireAuth.js'

const items = [
  {
    id: 1,
    name: 'Banarasi Silk Saree',
    category: 'Saree',
    style: 'Banarasi',
    occasion: 'Wedding',
    size: 'One Size',
    price: 120,
    condition: 'Like New',
    seller: 'Priya K.',
    location: 'San Jose',
    rating: 4.9,
    badge: 'Verified seller',
  },
  {
    id: 2,
    name: 'Kundan Choker Set',
    category: 'Jewelry',
    style: 'Kundan',
    occasion: 'Wedding',
    size: 'One Size',
    price: 85,
    condition: 'Brand New',
    seller: 'Anita S.',
    location: 'Fremont',
    rating: 4.8,
    badge: 'Fast responder',
  },
  {
    id: 3,
    name: 'Embroidered Lehenga Choli',
    category: 'Lehenga Choli',
    style: 'Embroidered',
    occasion: 'Sangeet',
    size: 'M',
    price: 250,
    condition: 'Worn Once',
    seller: 'Meera V.',
    location: 'Sunnyvale',
    rating: 4.7,
    badge: 'Community trusted',
  },
  {
    id: 4,
    name: 'Cotton Kurta Palazzo Set',
    category: 'Kurta Set',
    style: 'Cotton',
    occasion: 'Everyday',
    size: 'S',
    price: 42,
    condition: 'Good',
    seller: 'Nisha R.',
    location: 'San Jose',
    rating: 4.6,
    badge: 'Pickup friendly',
  },
  {
    id: 5,
    name: 'Floor-Length Anarkali Suit',
    category: 'Anarkali',
    style: 'Chikankari',
    occasion: 'Festival',
    size: 'L',
    price: 95,
    condition: 'Like New',
    seller: 'Farah A.',
    location: 'Fremont',
    rating: 4.9,
    badge: 'Verified seller',
  },
  {
    id: 6,
    name: 'Punjabi Salwar Kameez',
    category: 'Salwar Kameez',
    style: 'Phulkari',
    occasion: 'Everyday',
    size: 'M',
    price: 58,
    condition: 'Good',
    seller: 'Simran G.',
    location: 'Cupertino',
    rating: 4.5,
    badge: 'Fast responder',
  },
  {
    id: 7,
    name: 'Pastel Sharara Set',
    category: 'Sharara/Gharara',
    style: 'Georgette',
    occasion: 'Mehendi',
    size: 'M',
    price: 135,
    condition: 'Worn Once',
    seller: 'Zoya H.',
    location: 'San Jose',
    rating: 4.8,
    badge: 'Community trusted',
  },
  {
    id: 8,
    name: 'Kerala Kasavu Saree',
    category: 'Saree',
    style: 'Kasavu',
    occasion: 'Puja',
    size: 'One Size',
    price: 70,
    condition: 'Like New',
    seller: 'Lakshmi P.',
    location: 'Fremont',
    rating: 4.9,
    badge: 'Verified seller',
  },
  {
    id: 9,
    name: 'Pattu Pavadai Half-Saree',
    category: 'Half-Saree',
    style: 'Silk',
    occasion: 'Festival',
    size: 'XS',
    price: 88,
    condition: 'Good',
    seller: 'Divya M.',
    location: 'Sunnyvale',
    rating: 4.4,
    badge: 'Pickup friendly',
  },
  {
    id: 10,
    name: 'Indo-Western Cape Set',
    category: 'Indo-Western',
    style: 'Fusion',
    occasion: 'Reception',
    size: 'L',
    price: 160,
    condition: 'Brand New',
    seller: 'Rhea B.',
    location: 'Cupertino',
    rating: 4.8,
    badge: 'Fast responder',
  },
  {
    id: 11,
    name: 'Chanderi Co-Ord Set',
    category: 'Co-Ord Set',
    style: 'Chanderi',
    occasion: 'Office',
    size: 'S',
    price: 65,
    condition: 'Like New',
    seller: 'Tanvi D.',
    location: 'San Jose',
    rating: 4.7,
    badge: 'Verified seller',
  },
  {
    id: 12,
    name: 'Ready-to-Wear Draped Saree',
    category: 'Saree',
    style: 'Pre-Stitched',
    occasion: 'Reception',
    size: 'M',
    price: 110,
    condition: 'Brand New',
    seller: 'Isha C.',
    location: 'Fremont',
    rating: 4.6,
    badge: 'Community trusted',
  },
]

const categories = [
  'All Clothing',
  'Saree',
  'Lehenga Choli',
  'Salwar Kameez',
  'Anarkali',
  'Kurta Set',
  'Sharara/Gharara',
  'Half-Saree',
  'Co-Ord Set',
  'Indo-Western',
  'Jewelry',
]

const occasions = ['All Occasions', 'Everyday', 'Office', 'Puja', 'Festival', 'Mehendi', 'Sangeet', 'Wedding', 'Reception']
const sizes = ['All Sizes', 'XS', 'S', 'M', 'L', 'One Size']
const conditions = ['Any Condition', 'Brand New', 'Like New', 'Worn Once', 'Good']
const locations = ['Any Location', 'San Jose', 'Fremont', 'Sunnyvale', 'Cupertino']

export default function TradePage({ t, addToCart, addMessage, addNotification }) {
  const { user } = useAuth()
  const requireAuth = useRequireAuth()
  const [marketItems, setMarketItems] = useState(items)
  const [listingOpen, setListingOpen] = useState(false)
  const [tradeTarget, setTradeTarget] = useState(null)
  const [listing, setListing] = useState({
    name: '',
    category: 'Saree',
    occasion: 'Everyday',
    size: 'M',
    price: '',
    location: 'San Jose',
  })
  const [filters, setFilters] = useState({
    category: 'All Clothing',
    occasion: 'All Occasions',
    size: 'All Sizes',
    condition: 'Any Condition',
    location: 'Any Location',
    sort: 'featured',
  })

  const filteredItems = useMemo(() => {
    const results = marketItems.filter((item) => {
      return (
        (filters.category === 'All Clothing' || item.category === filters.category) &&
        (filters.occasion === 'All Occasions' || item.occasion === filters.occasion) &&
        (filters.size === 'All Sizes' || item.size === filters.size) &&
        (filters.condition === 'Any Condition' || item.condition === filters.condition) &&
        (filters.location === 'Any Location' || item.location === filters.location)
      )
    })

    return [...results].sort((a, b) => {
      if (filters.sort === 'price-low') return a.price - b.price
      if (filters.sort === 'price-high') return b.price - a.price
      if (filters.sort === 'name') return a.name.localeCompare(b.name)
      return a.id - b.id
    })
  }, [filters, marketItems])

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function resetFilters() {
    setFilters({
      category: 'All Clothing',
      occasion: 'All Occasions',
      size: 'All Sizes',
      condition: 'Any Condition',
      location: 'Any Location',
      sort: 'featured',
    })
  }

  function submitListing(event) {
    event.preventDefault()
    if (!requireAuth()) return
    if (!listing.name || !listing.price) return

    setMarketItems((current) => [
      {
        id: Date.now(),
        name: listing.name,
        category: listing.category,
        style: 'Community Listed',
        occasion: listing.occasion,
        size: listing.size,
        price: Number(listing.price),
        condition: 'Like New',
        seller: user.name,
        location: listing.location,
        rating: user.rating,
        badge: user.verified ? 'Verified seller' : 'New member',
      },
      ...current,
    ])
    setListing({ name: '', category: 'Saree', occasion: 'Everyday', size: 'M', price: '', location: 'San Jose' })
    setListingOpen(false)
    addNotification?.('Your clothing listing is live')
  }

  function submitTrade(event) {
    event.preventDefault()
    if (!requireAuth()) return
    const formData = new FormData(event.currentTarget)
    addMessage?.({
      from: tradeTarget.seller,
      text: `Trade offer sent for ${tradeTarget.name}: ${formData.get('offer')}`,
    })
    addNotification?.(`Trade offer sent to ${tradeTarget.seller}`)
    setTradeTarget(null)
  }

  return (
    <section>
      <div className="page-header rose-line marketplace-header">
        <div>
          <p className="eyebrow">{t('Buy, sell, trade')}</p>
          <h1>{t('Marketplace')}</h1>
        </div>
        <div className="header-actions">
          <p>{filteredItems.length} {t('items found')}</p>
          <button
            type="button"
            onClick={() => requireAuth(() => setListingOpen((isOpen) => !isOpen))}
          >
            {listingOpen ? t('Hide Listing Form') : t('Sell / Trade Item')}
          </button>
        </div>
      </div>

      {listingOpen && (
        <form className="create-listing" onSubmit={submitListing}>
          <input value={listing.name} onChange={(event) => setListing((current) => ({ ...current, name: event.target.value }))} placeholder={t('Item name')} />
          <select value={listing.category} onChange={(event) => setListing((current) => ({ ...current, category: event.target.value }))}>
            {categories.filter((category) => category !== 'All Clothing').map((category) => <option key={category} value={category}>{t(category)}</option>)}
          </select>
          <select value={listing.occasion} onChange={(event) => setListing((current) => ({ ...current, occasion: event.target.value }))}>
            {occasions.filter((occasion) => occasion !== 'All Occasions').map((occasion) => <option key={occasion} value={occasion}>{t(occasion)}</option>)}
          </select>
          <select value={listing.size} onChange={(event) => setListing((current) => ({ ...current, size: event.target.value }))}>
            {sizes.filter((size) => size !== 'All Sizes').map((size) => <option key={size} value={size}>{t(size)}</option>)}
          </select>
          <input type="number" min="1" value={listing.price} onChange={(event) => setListing((current) => ({ ...current, price: event.target.value }))} placeholder={t('Price')} />
          <select value={listing.location} onChange={(event) => setListing((current) => ({ ...current, location: event.target.value }))}>
            {locations.filter((location) => location !== 'Any Location').map((location) => <option key={location} value={location}>{t(location)}</option>)}
          </select>
          <button type="submit">{t('Publish Listing')}</button>
        </form>
      )}

      <div className="filter-panel" aria-label="Marketplace filters">
        <label>
          {t('Clothing Type')}
          <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>{t(category)}</option>
            ))}
          </select>
        </label>

        <label>
          {t('Occasion')}
          <select value={filters.occasion} onChange={(event) => updateFilter('occasion', event.target.value)}>
            {occasions.map((occasion) => (
              <option key={occasion} value={occasion}>{t(occasion)}</option>
            ))}
          </select>
        </label>

        <label>
          {t('Size')}
          <select value={filters.size} onChange={(event) => updateFilter('size', event.target.value)}>
            {sizes.map((size) => (
              <option key={size} value={size}>{t(size)}</option>
            ))}
          </select>
        </label>

        <label>
          {t('Condition')}
          <select value={filters.condition} onChange={(event) => updateFilter('condition', event.target.value)}>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>{t(condition)}</option>
            ))}
          </select>
        </label>

        <label>
          {t('Location')}
          <select value={filters.location} onChange={(event) => updateFilter('location', event.target.value)}>
            {locations.map((location) => (
              <option key={location} value={location}>{t(location)}</option>
            ))}
          </select>
        </label>

        <label>
          {t('Sort')}
          <select value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
            <option value="featured">{t('Featured')}</option>
            <option value="price-low">{t('Price: Low to High')}</option>
            <option value="price-high">{t('Price: High to Low')}</option>
            <option value="name">{t('Name: A to Z')}</option>
          </select>
        </label>

        <button type="button" className="reset-button" onClick={resetFilters}>
          {t('Reset')}
        </button>
      </div>

      {filteredItems.length > 0 ? (
        <div className="product-grid">
          {filteredItems.map((item) => (
            <article key={item.id} className="product-card">
              <div className="product-image">{item.name.slice(0, 1)}</div>
              <div className="product-body">
                <div className="product-heading">
                  <h2>{t(item.name)}</h2>
                  <p className="price">${item.price}</p>
                </div>
                <p>{t(item.category)} | {t(item.style)}</p>
                <p>{t('Occasion')}: {t(item.occasion)}</p>
                <p>{t('Size')}: {t(item.size)}</p>
                <p>{t('Condition')}: {t(item.condition)}</p>
                <p>{t('Seller')}: {item.seller} | {item.rating} rating</p>
                <p>{t('Location')}: {t(item.location)}</p>
                <p className="trust-badge">{t(item.badge)}</p>
                <div className="product-actions">
                  <button
                    type="button"
                    className="trade-button"
                    onClick={() => requireAuth(() => setTradeTarget(item))}
                  >
                    {t('Offer Trade')}
                  </button>
                  <button
                    type="button"
                    className="buy-button"
                    onClick={() => requireAuth(() => addToCart?.(item))}
                  >
                    {t('Buy')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>{t('No matching items')}</h2>
          <p>{t('Try changing the clothing type, occasion, size, or condition.')}</p>
          <button type="button" onClick={resetFilters}>{t('Show All Items')}</button>
        </div>
      )}

      {tradeTarget && (
        <div className="modal-backdrop">
          <form className="trade-modal" onSubmit={submitTrade}>
            <h2>{t('Offer Trade')}</h2>
            <p>{t('Send a trade offer for')} {tradeTarget.name}</p>
            <textarea name="offer" placeholder={t('Describe what you want to trade...')} required></textarea>
            <div className="modal-actions">
              <button type="button" className="reset-button" onClick={() => setTradeTarget(null)}>{t('Cancel')}</button>
              <button type="submit">{t('Send Offer')}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  )
}
