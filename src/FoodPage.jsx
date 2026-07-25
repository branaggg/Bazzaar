import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'

const foodItems = [
  { id: 1, title: 'Homemade Mango Pickle', vendor: "Aunty's Kitchen", category: 'Pickles', diet: 'Vegetarian', method: 'Pickup', price: 12, rating: 4.9, distance: 1.8, ready: 'Today', saved: true },
  { id: 2, title: 'Premium Saffron Threads', vendor: 'SpiceRoute', category: 'Spices', diet: 'Vegetarian', method: 'Shipping', price: 30, rating: 4.8, distance: 6.4, ready: 'Ships Tomorrow', saved: false },
  { id: 3, title: 'Fresh Mathri Box', vendor: 'Delhi Delights', category: 'Snacks', diet: 'Vegetarian', method: 'Pickup', price: 15, rating: 4.7, distance: 3.2, ready: 'Today', saved: true },
  { id: 4, title: 'Idli Batter Family Pack', vendor: 'Lakshmi Foods', category: 'Meal Prep', diet: 'Vegan', method: 'Pickup', price: 10, rating: 4.9, distance: 2.4, ready: 'Tomorrow', saved: false },
  { id: 5, title: 'Gulab Jamun Party Tray', vendor: 'Mithai Corner', category: 'Sweets', diet: 'Vegetarian', method: 'Delivery', price: 28, rating: 4.6, distance: 4.5, ready: 'Today', saved: false },
  { id: 6, title: 'Hyderabadi Biryani Box', vendor: 'Deccan Table', category: 'Meals', diet: 'Non-Vegetarian', method: 'Delivery', price: 18, rating: 4.8, distance: 5.1, ready: 'Today', saved: false },
  { id: 7, title: 'Chai Masala Blend', vendor: 'SpiceRoute', category: 'Spices', diet: 'Vegan', method: 'Shipping', price: 9, rating: 4.7, distance: 6.4, ready: 'Ships Tomorrow', saved: false },
  { id: 8, title: 'Mini Samosa Platter', vendor: 'Punjabi Bites', category: 'Snacks', diet: 'Vegetarian', method: 'Pickup', price: 22, rating: 4.5, distance: 2.9, ready: 'Today', saved: false },
]

const categories = ['All Categories', 'Meals', 'Snacks', 'Sweets', 'Spices', 'Pickles', 'Meal Prep']
const diets = ['Any Diet', 'Vegetarian', 'Vegan', 'Non-Vegetarian']
const methods = ['Any Method', 'Pickup', 'Delivery', 'Shipping']

export default function FoodPage({ t, addToCart, addNotification }) {
  const [items, setItems] = useState(foodItems)
  const [filters, setFilters] = useState({
    search: '',
    category: 'All Categories',
    diet: 'Any Diet',
    method: 'Any Method',
    sort: 'recommended',
  })

  const filteredItems = useMemo(() => {
    const query = filters.search.trim().toLowerCase()
    const results = items.filter((item) => {
      const searchableText = `${item.title} ${item.vendor} ${item.category} ${item.diet}`.toLowerCase()

      return (
        (!query || searchableText.includes(query)) &&
        (filters.category === 'All Categories' || item.category === filters.category) &&
        (filters.diet === 'Any Diet' || item.diet === filters.diet) &&
        (filters.method === 'Any Method' || item.method === filters.method)
      )
    })

    return [...results].sort((a, b) => {
      if (filters.sort === 'price-low') return a.price - b.price
      if (filters.sort === 'price-high') return b.price - a.price
      if (filters.sort === 'rating') return b.rating - a.rating
      if (filters.sort === 'distance') return a.distance - b.distance
      return b.rating - a.rating || a.distance - b.distance
    })
  }, [filters, items])

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function toggleSave(itemId) {
    setItems((currentItems) =>
      currentItems.map((item) => item.id === itemId ? { ...item, saved: !item.saved } : item),
    )
  }

  function clearFilters() {
    setFilters({
      search: '',
      category: 'All Categories',
      diet: 'Any Diet',
      method: 'Any Method',
      sort: 'recommended',
    })
  }

  return (
    <section className="bazaar-page">
      <aside className="bazaar-filter-sidebar">
        <div className="filter-heading">
          <p className="eyebrow">{t('Food Bazaar')}</p>
          <h1>{t('Fresh & Homemade')}</h1>
        </div>

        <label>
          {t('Search')}
          <input
            type="search"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            placeholder={t('Search snacks, sweets, spices, vendors...')}
          />
        </label>

        <label>
          {t('Category')}
          <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
            {categories.map((category) => <option key={category} value={category}>{t(category)}</option>)}
          </select>
        </label>

        <label>
          {t('Diet')}
          <select value={filters.diet} onChange={(event) => updateFilter('diet', event.target.value)}>
            {diets.map((diet) => <option key={diet} value={diet}>{t(diet)}</option>)}
          </select>
        </label>

        <label>
          {t('Method')}
          <select value={filters.method} onChange={(event) => updateFilter('method', event.target.value)}>
            {methods.map((method) => <option key={method} value={method}>{t(method)}</option>)}
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
        <Link to="/food/recipes" className="recipes-link">{t('View Recipes')}</Link>
      </aside>

      <div className="bazaar-market">
        <div className="market-toolbar">
          <div>
            <p className="eyebrow">{t('Marketplace')}</p>
            <h2>{filteredItems.length} {t('items found')}</h2>
          </div>
          <Link to="/food/recipes" className="button recipe-nav-button">{t('Recipes')}</Link>
        </div>

        {filteredItems.length > 0 ? (
          <div className="food-card-grid bazaar-grid">
            {filteredItems.map((item) => (
              <article key={item.id} className="market-food-card">
                <div className="food-image">{item.title.slice(0, 1)}</div>
                <div>
                  <p className="food-chip">{t(item.category)}</p>
                  <h2>{t(item.title)}</h2>
                  <p>{item.vendor}</p>
                </div>
                <div className="food-details">
                  <span>${item.price}</span>
                  <span>{item.rating} {t('rated')}</span>
                  <span>{item.distance} mi</span>
                  <span>{t(item.ready)}</span>
                </div>
                <div className="food-actions">
                  <button type="button" className="save-food-button" onClick={() => toggleSave(item.id)}>
                    {item.saved ? t('Saved') : t('Save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart?.({ name: item.title, price: item.price })
                      addNotification?.(`${item.title} reserved from ${item.vendor}`)
                    }}
                  >
                    {t('Reserve')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>{t('No matching items')}</h2>
            <p>{t('Try changing your filters.')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
