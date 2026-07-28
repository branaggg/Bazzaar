import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

function formatTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function NotificationsPage({
  t,
  notifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,
}) {
  const { isAuthenticated, ready } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!ready) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/notifications' }, replace: true })
    }
  }, [isAuthenticated, navigate, ready])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications],
  )

  if (!ready || !isAuthenticated) return null

  return (
    <section className="notifications-page">
      <div className="page-header rose-line cart-header">
        <div>
          <p className="eyebrow">{t('Notifications')}</p>
          <h1>{t('Your updates')}</h1>
          <p className="cart-count">
            {notifications.length} {notifications.length === 1 ? t('notification') : t('notifications')}
            {unreadCount > 0 ? ` · ${unreadCount} ${t('unread')}` : ''}
          </p>
        </div>
        <div className="header-actions">
          <Link to="/trade" className="button secondary-button">{t('Browse marketplace')}</Link>
          {notifications.length > 0 && (
            <>
              <button type="button" className="reset-button" onClick={markAllNotificationsRead}>
                {t('Mark all read')}
              </button>
              <button type="button" className="reset-button" onClick={clearNotifications}>
                {t('Clear all')}
              </button>
            </>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state cart-empty">
          <h2>{t('No notifications yet')}</h2>
          <p>{t('Cart adds, trade offers, and community activity will show up here.')}</p>
          <div className="cart-empty-actions">
            <Link to="/trade" className="button">{t('Explore Marketplace')}</Link>
            <Link to="/chat" className="button secondary-button">{t('Join the Conversation')}</Link>
          </div>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className={`notification-card ${notification.read ? '' : 'is-unread'}`}
            >
              <button
                type="button"
                className="notification-main"
                onClick={() => markNotificationRead(notification.id)}
              >
                <span className="notification-dot" aria-hidden="true"></span>
                <div className="notification-copy">
                  <p>{notification.text}</p>
                  <span>{formatTime(notification.createdAt)}</span>
                </div>
              </button>
              <button
                type="button"
                className="reset-button notification-delete"
                onClick={() => deleteNotification(notification.id)}
              >
                {t('Delete')}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
