import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

const categories = [
  'Saree',
  'Lehenga Choli',
  'Salwar Kameez',
  'Anarkali',
  'Kurta Set',
  'Sharara/Gharara',
  'Half-Saree',
  'Indo-Western',
  'Jewelry',
]

const conditions = ['Brand New', 'Like New', 'Used - Good', 'Used - Fair']

export default function AddListingPage({ t, setMarketItems, addNotification }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [listing, setListing] = useState({
    title: '',
    price: '',
    category: categories[0],
    condition: conditions[1],
    description: '',
    imagePreviews: [],
  })

  useEffect(() => {
    return () => {
      listing.imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [listing.imagePreviews])

  const isValid = useMemo(
    () => listing.title.trim() && Number(listing.price) > 0 && listing.description.trim(),
    [listing.title, listing.price, listing.description],
  )

  function handleImageChange(event) {
    const files = Array.from(event.target.files || []).slice(0, 10)
    const previews = files.map((file) => URL.createObjectURL(file))
    setListing((current) => ({ ...current, imagePreviews: previews }))
  }

  function submitListing(event) {
    event.preventDefault()
    if (!isValid) return

    setMarketItems((current) => [
      {
        id: Date.now(),
        name: listing.title,
        category: listing.category,
        style: listing.condition,
        occasion: 'New Arrival',
        size: 'One Size',
        price: Number(listing.price),
        condition: listing.condition,
        seller: user.name,
        location: user.city || 'Local',
        rating: 5,
        badge: 'New listing',
        description: listing.description,
        image: listing.imagePreviews[0] || '',
      },
      ...current,
    ])

    addNotification?.('Listing created successfully')
    navigate('/trade')
  }

  return (
    <section className="page listing-page">
      <div className="page-header rose-line marketplace-header">
        <div>
          <p className="eyebrow">{t('Marketplace')}</p>
          <h1>{t('Create listing')}</h1>
        </div>
        <Link to="/trade" className="button reset-button">
          {t('Back to marketplace')}
        </Link>
      </div>

      <div className="listing-layout">
        <form className="listing-form" onSubmit={submitListing}>
          <div className="listing-section">
            <p className="section-title">{t('Item for sale')}</p>
            <label>
              {t('Title')}
              <input
                value={listing.title}
                onChange={(event) => setListing((current) => ({ ...current, title: event.target.value }))}
                placeholder={t('Be as descriptive as possible')}
              />
            </label>

            <label>
              {t('Price')}
              <input
                type="number"
                min="1"
                value={listing.price}
                onChange={(event) => setListing((current) => ({ ...current, price: event.target.value }))}
                placeholder={t('Enter the sale price')}
              />
            </label>

            <label>
              {t('Category')}
              <select
                value={listing.category}
                onChange={(event) => setListing((current) => ({ ...current, category: event.target.value }))}
              >
                {categories.map((option) => (
                  <option key={option} value={option}>{t(option)}</option>
                ))}
              </select>
            </label>

            <label>
              {t('Condition')}
              <select
                value={listing.condition}
                onChange={(event) => setListing((current) => ({ ...current, condition: event.target.value }))}
              >
                {conditions.map((option) => (
                  <option key={option} value={option}>{t(option)}</option>
                ))}
              </select>
            </label>

            <label className="listing-textarea">
              {t('Description')}
              <textarea
                value={listing.description}
                onChange={(event) => setListing((current) => ({ ...current, description: event.target.value }))}
                placeholder={t('Add details that help buyers understand the item')}
                rows="6"
              />
            </label>

            <label>
              {t('Upload images')} ({t('up to')} 10)
              <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            </label>

            <button type="submit" className="button listing-submit" disabled={!isValid}>
              {t('Publish listing')}
            </button>
          </div>
        </form>

        <aside className="listing-preview">
          <div className="listing-preview-card">
            <div className="preview-header">
              <p className="eyebrow">{t('Preview')}</p>
              <h2>{listing.title || t('Title')}</h2>
            </div>
            {listing.imagePreviews.length > 0 ? (
              <>
                <img src={listing.imagePreviews[0]} alt={listing.title || t('Listing preview')} />
                {listing.imagePreviews.length > 1 && (
                  <div className="image-thumbnails">
                    {listing.imagePreviews.map((preview, index) => (
                      <img
                        key={preview}
                        className="image-thumb"
                        src={preview}
                        alt={`${t('Preview')} ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="listing-preview-placeholder">
                {t('Image preview')}
              </div>
            )}
            <div className="listing-preview-body">
              <p className="price">{listing.price ? `$${listing.price}` : t('Price')}</p>
              <p>{listing.description || t('Nice purple saree with golden details')}</p>
              <div className="listing-preview-meta">
                <span>{listing.category}</span>
                <span>{listing.condition}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
