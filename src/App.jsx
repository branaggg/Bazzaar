import { useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import LandingPage from './LandingPage.jsx'
import TradePage from './TradePage.jsx'
import FoodPage from './FoodPage.jsx'
import { FoodDetailPage, TradeDetailPage } from './ProductDetailPage.jsx'
import RecipesPage from './RecipesPage.jsx'
import ChatPage from './ChatPage.jsx'
import LoginPage from './LoginPage.jsx'
import SignupPage from './SignupPage.jsx'
import { languages, makeTranslator } from './translations.js'

function AppShell() {
  const { user, isAuthenticated, logout } = useAuth()
  const [language, setLanguage] = useState('en')
  const [cart, setCart] = useState([])
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
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

        {isAuthenticated ? (
          <>
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
              {messages.length === 0 ? (
                <p>{t('No messages yet')}</p>
              ) : (
                messages.map((message) => (
                  <p key={message.id}><strong>{message.from}:</strong> {message.text}</p>
                ))
              )}
            </details>

            <details className="utility-panel">
              <summary>{t('Notifications')} ({notifications.length})</summary>
              {notifications.length === 0 ? (
                <p>{t('No notifications yet')}</p>
              ) : (
                notifications.map((notification) => (
                  <p key={notification}>{notification}</p>
                ))
              )}
            </details>

            <details className="utility-panel account-panel">
              <summary>{user.name.split(' ')[0]}</summary>
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
              <button type="button" className="reset-button" onClick={logout}>
                {t('Log out')}
              </button>
            </details>
          </>
        ) : (
          <div className="auth-nav">
            <Link to="/login" className="nav-auth-link">{t('Log in')}</Link>
            <Link to="/signup" className="button nav-signup">{t('Sign up')}</Link>
          </div>
        )}
      </nav>

      {isAuthenticated && (
        <section className="profile-strip" aria-label="Profile summary">
          <article className="mini-profile">
            <strong>{user.name}</strong>
            <span>{user.city} | {user.languagesSpoken}</span>
            <div>
              <span>{user.rating} {t('rating')}</span>
              <span>{user.verified ? t('Verified seller') : t('New member')}</span>
            </div>
          </article>
        </section>
      )}

      <main className="page">
        <Routes>
          <Route path="/" element={<LandingPage t={t} />} />
          <Route path="/login" element={<LoginPage t={t} />} />
          <Route path="/signup" element={<SignupPage t={t} />} />
          <Route path="/trade" element={<TradePage t={t} addToCart={addToCart} addMessage={addMessage} addNotification={addNotification} />} />
          <Route path="/trade/:id" element={<TradeDetailPage t={t} addToCart={addToCart} addMessage={addMessage} addNotification={addNotification} />} />
          <Route path="/food" element={<FoodPage t={t} addToCart={addToCart} addNotification={addNotification} />} />
          <Route path="/food/:id" element={<FoodDetailPage t={t} addToCart={addToCart} addNotification={addNotification} />} />
          <Route path="/food/recipes" element={<RecipesPage t={t} />} />
          <Route path="/chat" element={<ChatPage t={t} addNotification={addNotification} />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </Router>
  )
}
