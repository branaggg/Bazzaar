import { useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import './App.css'
import LandingPage from './LandingPage.jsx'
import TradePage from './TradePage.jsx'
import FoodPage from './FoodPage.jsx'
import RecipesPage from './RecipesPage.jsx'
import ChatPage from './ChatPage.jsx'
import { languages, makeTranslator } from './translations.js'

export default function App() {
  const [language, setLanguage] = useState('en')
  const [cart, setCart] = useState([])
  const [messages, setMessages] = useState([
    { id: 1, from: 'Priya K.', text: 'The saree is still available for pickup this weekend.' },
    { id: 2, from: 'Delhi Delights', text: 'Your mathri box is reserved for 5-7 PM.' },
  ])
  const [notifications, setNotifications] = useState([
    'Rhea B. replied in Fashion Advice',
    'SpiceRoute restocked chai masala',
  ])
  const t = useMemo(() => makeTranslator(language), [language])

  function addNotification(message) {
    setNotifications((current) => [message, ...current].slice(0, 5))
  }

  function addMessage(message) {
    setMessages((current) => [{ id: Date.now(), ...message }, ...current])
  }

  function addToCart(item) {
    setCart((current) => [...current, { id: Date.now(), ...item }])
    addNotification(`${item.name} added to cart`)
  }

  return (
    <Router>
      <div className="app-shell" lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'}>
        <nav className="site-nav">
          <Link to="/" className="brand">Bazzaar</Link>
          <div className="nav-links">
            <NavLink to="/trade">{t('Marketplace')}</NavLink>
            <NavLink to="/food">{t('Food Bazaar')}</NavLink>
            <NavLink to="/chat">{t('Community Chat')}</NavLink>
          </div>
          <label className="language-picker">
            <span>{t('Language')}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              {languages.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <details className="utility-panel">
            <summary>{t('Cart')} ({cart.length})</summary>
            {cart.length === 0 ? (
              <p>{t('Your cart is empty')}</p>
            ) : (
              <>
                {cart.map((item) => (
                  <p key={item.id}>{item.name} - ${item.price}</p>
                ))}
                <button type="button">{t('Checkout')}</button>
              </>
            )}
          </details>

          <details className="utility-panel">
            <summary>{t('Inbox')} ({messages.length})</summary>
            {messages.map((message) => (
              <p key={message.id}><strong>{message.from}:</strong> {message.text}</p>
            ))}
          </details>

          <details className="utility-panel">
            <summary>{t('Notifications')} ({notifications.length})</summary>
            {notifications.map((notification) => (
              <p key={notification}>{notification}</p>
            ))}
          </details>
        </nav>

        <section className="profile-strip" aria-label="Profile summary">
          <article className="mini-profile">
            <strong>Anika Sharma</strong>
            <span>San Jose | Hindi, Tamil, English</span>
            <div>
              <span>4.9 rating</span>
              <span>Verified seller</span>
            </div>
          </article>
        </section>

        <main className="page">
          <Routes>
            <Route path="/" element={<LandingPage t={t} />} />
            <Route path="/trade" element={<TradePage t={t} addToCart={addToCart} addMessage={addMessage} addNotification={addNotification} />} />
            <Route path="/food" element={<FoodPage t={t} addToCart={addToCart} addNotification={addNotification} />} />
            <Route path="/food/recipes" element={<RecipesPage t={t} />} />
            <Route path="/chat" element={<ChatPage t={t} addNotification={addNotification} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
