import { useEffect, useMemo, useState } from 'react'
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

export default function InboxPage({
  t,
  messages,
  addMessage,
  markThreadRead,
  markAllMessagesRead,
  deleteMessage,
  clearInbox,
}) {
  const { user, isAuthenticated, ready } = useAuth()
  const navigate = useNavigate()
  const [selectedFrom, setSelectedFrom] = useState(null)
  const [reply, setReply] = useState('')

  useEffect(() => {
    if (!ready) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/inbox' }, replace: true })
    }
  }, [isAuthenticated, navigate, ready])

  const threads = useMemo(() => {
    const groups = new Map()

    messages.forEach((message) => {
      const key = message.from || t('Unknown')
      const existing = groups.get(key) || {
        from: key,
        messages: [],
        unread: 0,
      }

      existing.messages.push(message)
      if (!message.read) existing.unread += 1
      groups.set(key, existing)
    })

    return [...groups.values()]
      .map((thread) => {
        const sorted = [...thread.messages].sort(
          (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
        )

        return {
          ...thread,
          messages: sorted,
          latest: sorted[sorted.length - 1],
        }
      })
      .sort((a, b) => new Date(b.latest?.createdAt || 0) - new Date(a.latest?.createdAt || 0))
  }, [messages, t])

  useEffect(() => {
    if (!selectedFrom && threads[0]) {
      setSelectedFrom(threads[0].from)
      markThreadRead?.(threads[0].from)
    }

    if (selectedFrom && !threads.some((thread) => thread.from === selectedFrom)) {
      const next = threads[0]?.from || null
      setSelectedFrom(next)
      if (next) markThreadRead?.(next)
    }
  }, [markThreadRead, selectedFrom, threads])

  const activeThread = threads.find((thread) => thread.from === selectedFrom) || null
  const unreadCount = messages.filter((message) => !message.read).length

  if (!ready || !isAuthenticated) return null

  function handleSelectThread(from) {
    setSelectedFrom(from)
    setReply('')
    markThreadRead?.(from)
  }

  function handleReply(event) {
    event.preventDefault()
    if (!activeThread || !reply.trim()) return

    addMessage?.({
      from: activeThread.from,
      text: `${user.name}: ${reply.trim()}`,
      outbound: true,
    })
    setReply('')
  }

  return (
    <section className="inbox-page">
      <div className="page-header rose-line cart-header">
        <div>
          <p className="eyebrow">{t('Inbox')}</p>
          <h1>{t('Messages')}</h1>
          <p className="cart-count">
            {messages.length} {messages.length === 1 ? t('message') : t('messages')}
            {unreadCount > 0 ? ` · ${unreadCount} ${t('unread')}` : ''}
          </p>
        </div>
        <div className="header-actions">
          <Link to="/trade" className="button secondary-button">{t('Browse sellers')}</Link>
          {messages.length > 0 && (
            <>
              <button type="button" className="reset-button" onClick={markAllMessagesRead}>
                {t('Mark all read')}
              </button>
              <button type="button" className="reset-button" onClick={clearInbox}>
                {t('Clear inbox')}
              </button>
            </>
          )}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="empty-state cart-empty">
          <h2>{t('No messages yet')}</h2>
          <p>{t('Trade offers and seller notes will show up here.')}</p>
          <div className="cart-empty-actions">
            <Link to="/trade" className="button">{t('Explore Marketplace')}</Link>
            <Link to="/chat" className="button secondary-button">{t('Join the Conversation')}</Link>
          </div>
        </div>
      ) : (
        <div className="inbox-layout">
          <aside className="inbox-thread-list" aria-label={t('Conversations')}>
            {threads.map((thread) => (
              <button
                key={thread.from}
                type="button"
                className={`inbox-thread-item ${selectedFrom === thread.from ? 'is-active' : ''}`}
                onClick={() => handleSelectThread(thread.from)}
              >
                <div className="inbox-thread-avatar" aria-hidden="true">
                  {thread.from.slice(0, 1)}
                </div>
                <div className="inbox-thread-copy">
                  <div className="inbox-thread-heading">
                    <strong>{thread.from}</strong>
                    <span>{formatTime(thread.latest?.createdAt)}</span>
                  </div>
                  <p>{thread.latest?.text}</p>
                </div>
                {thread.unread > 0 && <span className="inbox-unread">{thread.unread}</span>}
              </button>
            ))}
          </aside>

          <div className="inbox-conversation">
            {activeThread ? (
              <>
                <div className="inbox-conversation-header">
                  <div>
                    <h2>{activeThread.from}</h2>
                    <p>{activeThread.messages.length} {t('in this thread')}</p>
                  </div>
                </div>

                <div className="inbox-message-list">
                  {activeThread.messages.map((message) => (
                    <article
                      key={message.id}
                      className={`inbox-bubble ${message.outbound ? 'is-outbound' : ''}`}
                    >
                      <p>{message.text}</p>
                      <div className="inbox-bubble-meta">
                        <span>{formatTime(message.createdAt)}</span>
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => deleteMessage(message.id)}
                        >
                          {t('Delete')}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <form className="inbox-reply" onSubmit={handleReply}>
                  <input
                    type="text"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder={t('Write a reply...')}
                  />
                  <button type="submit">{t('Send')}</button>
                </form>
              </>
            ) : (
              <div className="empty-state">
                <h2>{t('Select a conversation')}</h2>
                <p>{t('Choose a thread on the left to read and reply.')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
