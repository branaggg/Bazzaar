import { useMemo, useState } from 'react'
import { useRequireAuth } from './auth/useRequireAuth.js'

const services = [
  { id: 1, title: 'Blouse Stitching & Alterations', provider: 'Neha Tailors', category: 'Tailoring', area: 'San Jose', priceFrom: 25, rating: 4.9, distance: 2.1, availability: 'This week', languages: 'Hindi, English' },
  { id: 2, title: 'Bridal Mehendi Artist', provider: 'Henna by Rhea', category: 'Mehendi', area: 'Fremont', priceFrom: 120, rating: 4.8, distance: 5.4, availability: 'Weekends', languages: 'Gujarati, English' },
  { id: 3, title: 'Home Makeup for Functions', provider: 'Glow by Ananya', category: 'Beauty', area: 'Sunnyvale', priceFrom: 85, rating: 4.7, distance: 3.8, availability: 'Evenings', languages: 'Tamil, English' },
  { id: 4, title: 'Festival Catering for 20', provider: 'Amma\'s Table', category: 'Catering', area: 'Cupertino', priceFrom: 180, rating: 4.9, distance: 4.2, availability: 'Book ahead', languages: 'Telugu, English' },
  { id: 5, title: 'Sangeet Photography', provider: 'Frame & Folklore', category: 'Photography', area: 'San Jose', priceFrom: 250, rating: 4.6, distance: 1.9, availability: 'Weekends', languages: 'English, Hindi' },
  { id: 6, title: 'Hindi Tutoring for Kids', provider: 'Pathshala Home', category: 'Tutoring', area: 'Fremont', priceFrom: 35, rating: 4.8, distance: 6.0, availability: 'Weekdays', languages: 'Hindi, English' },
  { id: 7, title: 'Puja Setup & Coordination', provider: 'Sacred Circle', category: 'Events', area: 'Sunnyvale', priceFrom: 90, rating: 4.7, distance: 3.1, availability: 'This week', languages: 'Sanskrit, Hindi, English' },
  { id: 8, title: 'Lehenga Steam & Care', provider: 'Silk Care Co.', category: 'Tailoring', area: 'Cupertino', priceFrom: 40, rating: 4.5, distance: 4.7, availability: 'Same day', languages: 'English' },
]

const categories = ['All Services', 'Tailoring', 'Mehendi', 'Beauty', 'Catering', 'Photography', 'Tutoring', 'Events']
const areas = ['Any Area', 'San Jose', 'Fremont', 'Sunnyvale', 'Cupertino']
const availabilityOptions = ['Any Time', 'This week', 'Weekends', 'Weekdays', 'Evenings', 'Same day', 'Book ahead']

export default function ServicesPage({ t, addMessage, addNotification }) {
  const requireAuth = useRequireAuth()
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Services',
    area: 'Any Area',
    availability: 'Any Time',
    sort: 'recommended',
  })

  const filteredServices = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    const results = services.filter((service) => {
      const searchableText = `${service.title} ${service.provider} ${service.category} ${service.area} ${service.languages}`.toLowerCase()

      return (
        (!query || searchableText.includes(query)) &&
        (filters.category === 'All Services' || service.category === filters.category) &&
        (filters.area === 'Any Area' || service.area === filters.area) &&
        (filters.availability === 'Any Time' || service.availability === filters.availability)
      )
    })

    return [...results].sort((a, b) => {
      if (filters.sort === 'price-low') return a.priceFrom - b.priceFrom
      if (filters.sort === 'price-high') return b.priceFrom - a.priceFrom
      if (filters.sort === 'rating') return b.rating - a.rating
      if (filters.sort === 'distance') return a.distance - b.distance
      return b.rating - a.rating || a.distance - b.distance
    })
  }, [filters])

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function clearFilters() {
    setFilters({
      search: '',
      category: 'All Services',
      area: 'Any Area',
      availability: 'Any Time',
      sort: 'recommended',
    })
  }

  function contactProvider(service) {
    requireAuth(() => {
      addMessage?.({
        from: service.provider,
        text: `Inquiry started about ${service.title} in ${service.area}.`,
      })
      addNotification?.(`Message started with ${service.provider}`)
    })
  }

  return (
    <section className="bazaar-page services-page">
      <aside className="bazaar-filter-sidebar services-sidebar">
        <div className="filter-heading">
          <p className="eyebrow">{t('Services')}</p>
          <h1>{t('General Services Finder')}</h1>
        </div>

        <label>
          {t('Search')}
          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder={t('Search tailoring, mehendi, tutors...')}
          />
        </label>

        <label>
          {t('Category')}
          <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
            {categories.map((category) => <option key={category} value={category}>{t(category)}</option>)}
          </select>
        </label>

        <label>
          {t('Area')}
          <select value={filters.area} onChange={(event) => updateFilter('area', event.target.value)}>
            {areas.map((area) => <option key={area} value={area}>{t(area)}</option>)}
          </select>
        </label>

        <label>
          {t('Availability')}
          <select value={filters.availability} onChange={(event) => updateFilter('availability', event.target.value)}>
            {availabilityOptions.map((option) => <option key={option} value={option}>{t(option)}</option>)}
          </select>
        </label>

        <label>
          {t('Sort')}
          <select value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
            <option value="recommended">{t('Recommended')}</option>
            <option value="price-low">{t('Price: Low to High')}</option>
            <option value="price-high">{t('Price: High to Low')}</option>
            <option value="rating">{t('Highest Rated')}</option>
            <option value="distance">{t('Nearest First')}</option>
          </select>
        </label>

        <button type="button" className="reset-button" onClick={clearFilters}>{t('Clear Filters')}</button>
      </aside>

      <div className="bazaar-market">
        <div className="market-toolbar services-toolbar">
          <div>
            <p className="eyebrow">{t('Local help')}</p>
            <h2>{filteredServices.length} {t('services found')}</h2>
          </div>
        </div>

        {filteredServices.length > 0 ? (
          <div className="food-card-grid bazaar-grid">
            {filteredServices.map((service) => (
              <article key={service.id} className="market-food-card service-card">
                <div className="service-image">{service.title.slice(0, 1)}</div>
                <div>
                  <p className="service-chip">{t(service.category)}</p>
                  <h2>{t(service.title)}</h2>
                  <p>{service.provider}</p>
                </div>
                <div className="food-details">
                  <span>{t('From')} ${service.priceFrom}</span>
                  <span>{service.rating} {t('rated')}</span>
                  <span>{service.distance} mi</span>
                  <span>{t(service.availability)}</span>
                </div>
                <p className="service-meta">{service.area} · {service.languages}</p>
                <div className="food-actions">
                  <button
                    type="button"
                    className="save-food-button service-contact"
                    onClick={() => contactProvider(service)}
                  >
                    {t('Contact')}
                  </button>
                  <button
                    type="button"
                    onClick={() => requireAuth(() => addNotification?.(`${service.title} saved from ${service.provider}`))}
                  >
                    {t('Save')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>{t('No matching services')}</h2>
            <p>{t('Try changing your filters.')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
