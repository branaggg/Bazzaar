import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function SettingsPage({ t }) {
  const { user, isAuthenticated, ready, updateProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    city: '',
    languagesSpoken: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!ready) return

    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/settings' }, replace: true })
      return
    }

    setForm({
      name: user.name || '',
      city: user.city || '',
      languagesSpoken: user.languagesSpoken || '',
    })
  }, [isAuthenticated, navigate, ready, user])

  if (!ready || !isAuthenticated) return null

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const result = updateProfile({
      name: form.name.trim(),
      city: form.city.trim() || 'San Jose',
      languagesSpoken: form.languagesSpoken.trim() || 'English',
    })

    if (!result.ok) {
      setError(t(result.error))
      return
    }

    setMessage(t('Settings saved'))
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <section className="settings-page">
      <div className="page-header rose-line">
        <div>
          <p className="eyebrow">{t('Account')}</p>
          <h1>{t('Settings')}</h1>
        </div>
        <Link to="/" className="button secondary-button">{t('Back to Home')}</Link>
      </div>

      <div className="settings-layout">
        <aside className="settings-summary">
          <div className="settings-avatar" aria-hidden="true">
            {user.name
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join('')}
          </div>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
          <div className="account-badges">
            <span>{user.rating} {t('rating')}</span>
            <span>{user.verified ? t('Verified seller') : t('New member')}</span>
          </div>
        </aside>

        <form className="settings-form" onSubmit={handleSubmit}>
          <label>
            {t('Full name')}
            <input
              type="text"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
            />
          </label>

          <label>
            {t('Email')}
            <input type="email" value={user.email} disabled />
          </label>

          <label>
            {t('City')}
            <input
              type="text"
              value={form.city}
              onChange={(event) => updateField('city', event.target.value)}
            />
          </label>

          <label>
            {t('Languages')}
            <input
              type="text"
              value={form.languagesSpoken}
              onChange={(event) => updateField('languagesSpoken', event.target.value)}
              placeholder={t('Hindi, Tamil, English')}
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="settings-success" role="status">{message}</p>}

          <div className="settings-actions">
            <button type="submit">{t('Save changes')}</button>
            <button type="button" className="reset-button" onClick={handleLogout}>
              {t('Log out')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
