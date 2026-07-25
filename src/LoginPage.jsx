import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function LoginPage({ t }) {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
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
    const result = login(form)
    if (!result.ok) {
      setError(t(result.error))
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <p className="eyebrow">{t('Welcome back')}</p>
        <h1>{t('Log in')}</h1>
        <p className="auth-subtitle">
          {t('Sign in to buy, sell, trade, and join community conversations.')}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              required
            />
          </label>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit">{t('Log in')}</button>
        </form>

        <p className="auth-switch">
          {t("Don't have an account?")}{' '}
          <Link to="/signup" state={{ from: redirectTo }}>{t('Create one')}</Link>
        </p>
      </div>
    </section>
  )
}
