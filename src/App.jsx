import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import './App.css'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'
import LandingPage from './LandingPage.jsx'
import TradePage from './TradePage.jsx'
import FoodPage from './FoodPage.jsx'
import ServicesPage from './ServicesPage.jsx'
import { FoodDetailPage, TradeDetailPage } from './ProductDetailPage.jsx'
import RecipesPage from './RecipesPage.jsx'
import ChatPage from './ChatPage.jsx'
import LoginPage from './LoginPage.jsx'
import SignupPage from './SignupPage.jsx'
import SettingsPage from './SettingsPage.jsx'
import CartPage from './CartPage.jsx'
import InboxPage from './InboxPage.jsx'
import { BellIcon, CartIcon, MailIcon, SettingsIcon } from './OrbitIcons.jsx'
import { languages, makeTranslator } from './translations.js'

function AccountFab({ user, cart, messages, notifications, logout, t }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activePanel, setActivePanel] = useState(null)
  const [spinning, setSpinning] = useState(false)
  const fabRef = useRef(null)
  const navigate = useNavigate()

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const unreadMessages = messages.filter((message) => !message.read).length

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

  function openSettings() {
    setMenuOpen(false)
    setActivePanel(null)
    navigate('/settings')
  }

  function openCart() {
    setMenuOpen(false)
    setActivePanel(null)
    navigate('/cart')
  }

  function openInbox() {
    setMenuOpen(false)
    setActivePanel(null)
    navigate('/inbox')
  }

  const panelLabel = {
    profile: 'Account',
    cart: 'Cart',
    inbox: 'Inbox',
    notifications: 'Notifications',
  }[activePanel] || 'Account'

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
          aria-label={`${t('Cart')} (${cartCount})`}
          title={t('Cart')}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => openPanel('cart')}
        >
          <CartIcon />
          {cartCount > 0 && <span className="orbit-badge">{cartCount}</span>}
        </button>

        <button
          type="button"
          className={`orbit-circle ${activePanel === 'inbox' ? 'is-active' : ''}`}
          style={{ '--orbit-index': 1 }}
          aria-label={`${t('Inbox')} (${messages.length})`}
          title={t('Inbox')}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => openPanel('inbox')}
        >
          <MailIcon />
          {unreadMessages > 0 && <span className="orbit-badge">{unreadMessages}</span>}
        </button>

        <button
          type="button"
          className={`orbit-circle ${activePanel === 'notifications' ? 'is-active' : ''}`}
          style={{ '--orbit-index': 2 }}
          aria-label={`${t('Notifications')} (${notifications.length})`}
          title={t('Notifications')}
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => openPanel('notifications')}
        >
          <BellIcon />
          {notifications.length > 0 && <span className="orbit-badge">{notifications.length}</span>}
        </button>

        <button
          type="button"
          className="orbit-circle"
          style={{ '--orbit-index': 3 }}
          aria-label={t('Settings')}
          title={t('Settings')}
          tabIndex={menuOpen ? 0 : -1}
          onClick={openSettings}
        >
          <SettingsIcon />
        </button>
      </div>

      {menuOpen && activePanel && (
        <div className="account-panel" role="dialog" aria-label={t(panelLabel)}>
          {activePanel === 'profile' && (
            <>
              <strong>{user.name}</strong>
              <p>{user.email}</p>
              <p>{user.city} | {user.languagesSpoken}</p>
              <div className="account-badges">
                <span>{user.rating} {t('rating')}</span>
                <span>{user.verified ? t('Verified seller') : t('New member')}</span>
              </div>
              <button type="button" onClick={openSettings}>
                {t('Settings')}
              </button>
              <button type="button" className="reset-button" onClick={logout}>
                {t('Log out')}
              </button>
            </>
          )}

          {activePanel === 'cart' && (
            <>
              <strong>{t('Cart')} ({cartCount})</strong>
              {cart.length === 0 ? (
                <p>{t('Your cart is empty')}</p>
              ) : (
                <>
                  {cart.slice(0, 3).map((item) => (
                    <p key={item.id}>
                      {item.name} × {item.quantity || 1} — ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  ))}
                  {cart.length > 3 && <p>+{cart.length - 3} {t('more')}</p>}
                  <button type="button" onClick={openCart}>{t('View cart')}</button>
                  <button type="button" className="reset-button" onClick={openCart}>
                    {t('Checkout')}
                  </button>
                </>
              )}
              {cart.length === 0 && (
                <button type="button" className="reset-button" onClick={openCart}>
                  {t('View cart')}
                </button>
              )}
            </>
          )}

          {activePanel === 'inbox' && (
            <>
              <strong>{t('Inbox')} ({messages.length})</strong>
              {messages.length === 0 ? (
                <p>{t('No messages yet')}</p>
              ) : (
                <>
                  {messages.slice(0, 3).map((message) => (
                    <p key={message.id}><strong>{message.from}:</strong> {message.text}</p>
                  ))}
                  {messages.length > 3 && <p>+{messages.length - 3} {t('more')}</p>}
                </>
              )}
              <button type="button" onClick={openInbox}>{t('Open inbox')}</button>
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
    setMessages((current) => [
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        from: message.from,
        text: message.text,
        createdAt: new Date().toISOString(),
        read: Boolean(message.outbound),
        outbound: Boolean(message.outbound),
      },
      ...current,
    ])
  }

  function markThreadRead(from) {
    setMessages((current) => {
      if (!current.some((message) => message.from === from && !message.read)) {
        return current
      }

      return current.map((message) =>
        message.from === from ? { ...message, read: true } : message,
      )
    })
  }

  function markAllMessagesRead() {
    setMessages((current) => current.map((message) => ({ ...message, read: true })))
  }

  function deleteMessage(messageId) {
    setMessages((current) => current.filter((message) => message.id !== messageId))
  }

  function clearInbox() {
    setMessages([])
  }

  function addToCart(item) {
    const name = item.name || item.title
    const price = Number(item.price) || 0

    setCart((current) => {
      const existing = current.find(
        (entry) => entry.name === name && entry.price === price && entry.seller === item.seller,
      )

      if (existing) {
        return current.map((entry) =>
          entry.id === existing.id
            ? { ...entry, quantity: (entry.quantity || 1) + 1 }
            : entry,
        )
      }

      return [
        ...current,
        {
          id: Date.now(),
          name,
          price,
          quantity: 1,
          seller: item.seller || item.vendor || '',
          category: item.category || '',
        },
      ]
    })
    addNotification(`${name} added to cart`)
  }

  function updateCartQuantity(itemId, quantity) {
    const nextQuantity = Math.max(1, Math.min(10, quantity))
    setCart((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, quantity: nextQuantity } : item,
      ),
    )
  }

  function removeFromCart(itemId) {
    setCart((current) => current.filter((item) => item.id !== itemId))
  }

  function clearCart() {
    setCart([])
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
          <NavLink to="/services">{t('Services')}</NavLink>
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
          <Route path="/settings" element={<SettingsPage t={t} />} />
          <Route
            path="/cart"
            element={(
              <CartPage
                t={t}
                cart={cart}
                updateCartQuantity={updateCartQuantity}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            )}
          />
          <Route
            path="/inbox"
            element={(
              <InboxPage
                t={t}
                messages={messages}
                addMessage={addMessage}
                markThreadRead={markThreadRead}
                markAllMessagesRead={markAllMessagesRead}
                deleteMessage={deleteMessage}
                clearInbox={clearInbox}
              />
            )}
          />
          <Route path="/trade" element={<TradePage t={t} addToCart={addToCart} addMessage={addMessage} addNotification={addNotification} />} />
          <Route path="/trade/:id" element={<TradeDetailPage t={t} addToCart={addToCart} addMessage={addMessage} addNotification={addNotification} />} />
          <Route path="/food" element={<FoodPage t={t} addToCart={addToCart} addNotification={addNotification} />} />
          <Route path="/food/:id" element={<FoodDetailPage t={t} addToCart={addToCart} addNotification={addNotification} />} />
          <Route path="/food/recipes" element={<RecipesPage t={t} />} />
          <Route path="/services" element={<ServicesPage t={t} addMessage={addMessage} addNotification={addNotification} />} />
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
