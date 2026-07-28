import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function AddUserPage({ t }) {
  const { createUser, isAuthenticated, ready } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    languagesSpoken: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!ready) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/add-user' }, replace: true })
    }
  }, [isAuthenticated, navigate, ready])

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
    setError('')
    setSuccess('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!createUser) return

    const result = createUser(form)
    if (!result.ok) {
      setError(t(result.error))
      return
    }

    setSuccess(t('User account created successfully.'))
    setForm({ name: '', email: '', password: '', city: '', languagesSpoken: '' })
  }

  if (!ready || !isAuthenticated) return null

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">{t('Add user')}</p>
        <h1>{t('Create a new account')}</h1>
        <p className="auth-subtitle">
          {t('Add a new user to the Bazaar system without signing out.')}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t('Full name')}
            <input
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              required
            />
          </label>

          <label>
            {t('Email')}
            <input
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              required
            />
          </label>

          <label>
            {t('Password')}
            <input
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              minLength={6}
              required
            />
          </label>

          <label>
            {t('City')}
            <input
              type="text"
              autoComplete="address-level2"
              value={form.city}
              onChange={(event) => updateField('city', event.target.value)}
              placeholder={t('San Jose')}
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
          {success && <p className="auth-success" role="status">{success}</p>}

          <button type="submit">{t('Create user')}</button>
        </form>

        <p className="auth-switch">
          <Link to="/settings">{t('Back to settings')}</Link>
        </p>
      </div>
    </section>
  )
}
