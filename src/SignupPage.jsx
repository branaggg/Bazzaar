import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function SignupPage({ t }) {
  const { signup, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    languagesSpoken: '',
  })
  const [error, setError] = useState('')
  const redirectTo = location.state?.from || '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const result = signup(form)
    if (!result.ok) {
      setError(t(result.error))
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">{t('Join Bazzaar')}</p>
        <h1>{t('Create account')}</h1>
        <p className="auth-subtitle">
          {t('Set up your profile to start shopping, listing, and connecting.')}
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

          <button type="submit">{t('Create account')}</button>
        </form>

        <p className="auth-switch">
          {t('Already have an account?')}{' '}
          <Link to="/login" state={{ from: redirectTo }}>{t('Log in')}</Link>
        </p>
      </div>
    </section>
  )
}
