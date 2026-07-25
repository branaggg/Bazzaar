import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
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

function AccountFab({ user, cart, messages, notifications, logout, t }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const fabRef = useRef(null)

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  useEffect(() => {
    function handlePointerDown(event) {
      if (!fabRef.current?.contains(event.target)) {
        setMenuOpen(false)
        setActivePanel(null)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setActivePanel(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function triggerSpin() {
    setSpinning(true)
    window.setTimeout(() => setSpinning(false), 450)
  }

  function toggleMenu() {
    triggerSpin()
    setMenuOpen((open) => {
      if (open) {
        setActivePanel(null)
        return false
      }
      setActivePanel('profile')
      return true
    })
  }

  function openPanel(panel) {
    setActivePanel((current) => (current === panel ? null : panel))
  }

  return (
    <div
      ref={fabRef}
      className={`account-fab ${menuOpen ? 'is-open' : ''} ${spinning ? 'is-spinning' : ''}`}
    >
      <button
        type="button"
        className="account-avatar"
        aria-label={t('Account')}
        aria-expanded={menuOpen}
        title={user.name}
        onClick={toggleMenu}
      >
        {initials}
      </button>

      <div className="account-orbit" aria-hidden={!menuOpen}>
        <button
          type="button"
          className={`orbit-circle ${activePanel === 'cart' ? 'is-active' : ''}`}
          style={{ '--orbit-index': 0 }}
          aria-label={`${t('Cart')} (${cart.length})`}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => openPanel('cart')}
        >
          <span className="orbit-label">C</span>
          {cart.length > 0 && <span className="orbit-badge">{cart.length}</span>}
        </button>

        <button
          type="button"
          className={`orbit-circle ${activePanel === 'inbox' ? 'is-active' : ''}`}
          style={{ '--orbit-index': 1 }}
          aria-label={`${t('Inbox')} (${messages.length})`}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => openPanel('inbox')}
        >
          <span className="orbit-label">In</span>
          {messages.length > 0 && <span className="orbit-badge">{messages.length}</span>}
        </button>

        <button
          type="button"
          className={`orbit-circle ${activePanel === 'notifications' ? 'is-active' : ''}`}
          style={{ '--orbit-index': 2 }}
          aria-label={`${t('Notifications')} (${notifications.length})`}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => openPanel('notifications')}
        >
          <span className="orbit-label">N</span>
          {notifications.length > 0 && <span className="orbit-badge">{notifications.length}</span>}
        </button>
      </div>

      {menuOpen && activePanel && (
        <div className="account-panel" role="dialog" aria-label={t(activePanel === 'profile' ? 'Account' : activePanel === 'cart' ? 'Cart' : activePanel === 'inbox' ? 'Inbox' : 'Notifications')}>
          {activePanel === 'profile' && (
            <>
              <strong>{user.name}</strong>
              <p>{user.email}</p>
              <p>{user.city} | {user.languagesSpoken}</p>
              <div className="account-badges">
                <span>{user.rating} {t('rating')}</span>
                <span>{user.verified ? t('Verified seller') : t('New member')}</span>
              </div>
              <button type="button" className="reset-button" onClick={logout}>
                {t('Log out')}
              </button>
            </>
          )}

          {activePanel === 'cart' && (
            <>
              <strong>{t('Cart')} ({cart.length})</strong>
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
            </>
          )}

          {activePanel === 'inbox' && (
            <>
              <strong>{t('Inbox')} ({messages.length})</strong>
              {messages.length === 0 ? (
                <p>{t('No messages yet')}</p>
              ) : (
                messages.map((message) => (
                  <p key={message.id}><strong>{message.from}:</strong> {message.text}</p>
                ))
              )}
            </>
          )}

          {activePanel === 'notifications' && (
            <>
              <strong>{t('Notifications')} ({notifications.length})</strong>
              {notifications.length === 0 ? (
                <p>{t('No notifications yet')}</p>
              ) : (
                notifications.map((notification) => (
                  <p key={notification}>{notification}</p>
                ))
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function AppShell() {
  const { user, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const [language, setLanguage] = useState('en')
  const [cart, setCart] = useState([])
  const [messages, setMessages] = useState([])
  const [notifications, setNotifications] = useState([])
  const t = useMemo(() => makeTranslator(language), [language])
  const isLanding = location.pathname === '/'

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
        <div className="brand-cluster">
          <span className="brand">Bazzaar</span>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `home-toggle${isActive ? ' is-on' : ''}`}
            aria-pressed={isLanding}
          >
            {t('Home')}
          </NavLink>
        </div>
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

        {!isAuthenticated && (
          <div className="auth-nav">
            <Link to="/login" className="nav-auth-link">{t('Log in')}</Link>
            <Link to="/signup" className="button nav-signup">{t('Sign up')}</Link>
          </div>
        )}
      </nav>

      {isAuthenticated && (
        <AccountFab
          user={user}
          cart={cart}
          messages={messages}
          notifications={notifications}
          logout={logout}
          t={t}
        />
      )}

      <main className={isLanding ? 'page page-landing' : 'page'}>
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
