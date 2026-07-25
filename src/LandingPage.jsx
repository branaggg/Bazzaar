import { Link } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function LandingPage({ t }) {
  const { isAuthenticated } = useAuth()

  return (
    <section className="landing">
      <div className="hero-copy">
        <p className="eyebrow">{t('Community marketplace')}</p>
        <h1>{t('Your Culture, Your Community, Your Marketplace')}</h1>
        <p>
          {t('The premier space for Indian women to buy, sell, trade, and connect. From exquisite sarees to authentic homemade spices, find your niche here.')}
        </p>
        {!isAuthenticated && (
          <div className="hero-actions">
            <Link to="/signup" className="button">{t('Sign up')}</Link>
            <Link to="/login" className="button secondary-button">{t('Log in')}</Link>
          </div>
        )}
      </div>

      <div className="feature-grid">
        <article className="feature-card rose">
          <h2>{t('Trade & Shop')}</h2>
          <p>{t('Discover pre-loved lehengas, authentic jewelry, and handcrafted decor.')}</p>
          <Link to="/trade" className="button">{t('Explore Marketplace')}</Link>
        </article>

        <article className="feature-card orange">
          <h2>{t('Food & Spices')}</h2>
          <p>{t('Buy fresh homemade snacks, rare spices, or share your family recipes.')}</p>
          <Link to="/food" className="button">{t('Taste the Culture')}</Link>
        </article>

        <article className="feature-card violet">
          <h2>{t('Community Chat')}</h2>
          <p>{t('Connect, share advice, and build friendships with women just like you.')}</p>
          <Link to="/chat" className="button">{t('Join the Conversation')}</Link>
        </article>
      </div>
    </section>
  )
}
