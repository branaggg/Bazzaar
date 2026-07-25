import { Link } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'
import './LandingPage.css'

export default function LandingPage({ t }) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="landing-page">
      <section className="lp-hero">
        <div className="lp-hero-media" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2000&q=80"
            alt=""
          />
        </div>

        <div className="lp-hero-content">
          <p className="lp-brand">Bazzaar</p>
          <h1>{t('Where culture finds its next home')}</h1>
          <p className="lp-hero-line">
            {t('Buy, sell, and share fashion, food, and friendship with Indian women nearby.')}
          </p>
          <div className="lp-hero-actions">
            {isAuthenticated ? (
              <Link to="/trade" className="lp-button">{t('Enter the marketplace')}</Link>
            ) : (
              <>
                <Link to="/signup" className="lp-button">{t('Join Bazzaar')}</Link>
                <Link to="/trade" className="lp-button lp-button-ghost">{t('Browse first')}</Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="lp-section lp-paths">
        <div className="lp-section-copy">
          <h2>{t('Three doors into community')}</h2>
          <p>{t('Start where you feel most at home today.')}</p>
        </div>

        <div className="lp-path-list">
          <Link to="/trade" className="lp-path">
            <span className="lp-path-index">01</span>
            <span className="lp-path-body">
              <strong>{t('Marketplace')}</strong>
              <span>{t('Sarees, lehengas, jewelry, and pieces with a story.')}</span>
            </span>
            <span className="lp-path-go">{t('Shop')}</span>
          </Link>

          <Link to="/food" className="lp-path">
            <span className="lp-path-index">02</span>
            <span className="lp-path-body">
              <strong>{t('Food Bazaar')}</strong>
              <span>{t('Homemade snacks, spices, and recipes from local kitchens.')}</span>
            </span>
            <span className="lp-path-go">{t('Taste')}</span>
          </Link>

          <Link to="/chat" className="lp-path">
            <span className="lp-path-index">03</span>
            <span className="lp-path-body">
              <strong>{t('Community')}</strong>
              <span>{t('Ask questions, share advice, and find your people.')}</span>
            </span>
            <span className="lp-path-go">{t('Talk')}</span>
          </Link>
        </div>
      </section>

      <section className="lp-section lp-steps">
        <div className="lp-section-copy">
          <h2>{t('How Bazzaar works')}</h2>
          <p>{t('A simple loop for buying, selling, and belonging.')}</p>
        </div>

        <ol className="lp-step-list">
          <li>
            <strong>{t('Create your place')}</strong>
            <p>{t('Set your city, languages, and what you love to trade.')}</p>
          </li>
          <li>
            <strong>{t('List or discover')}</strong>
            <p>{t('Post an outfit or snack, or browse what neighbors are offering.')}</p>
          </li>
          <li>
            <strong>{t('Meet in community')}</strong>
            <p>{t('Message sellers, reserve food, and join group conversations.')}</p>
          </li>
        </ol>
      </section>

      <section className="lp-closing">
        <p className="lp-brand lp-brand-small">Bazzaar</p>
        <h2>{t('Your culture deserves a marketplace that feels like home')}</h2>
        <p>{t('Come for the saree. Stay for the sisterhood.')}</p>
        <div className="lp-hero-actions">
          {isAuthenticated ? (
            <Link to="/food" className="lp-button">{t('Explore Food Bazaar')}</Link>
          ) : (
            <Link to="/signup" className="lp-button">{t('Create your account')}</Link>
          )}
        </div>
      </section>
    </div>
  )
}
