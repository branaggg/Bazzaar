import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext.jsx'

export default function FriendsPage({ t }) {
  const navigate = useNavigate()
  const { user, ready, isAuthenticated, getUsers, addFriend, removeFriend } = useAuth()
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!ready) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/friends' }, replace: true })
    }
  }, [isAuthenticated, navigate, ready])

  const allUsers = useMemo(
    () => getUsers().filter((other) => other.email !== user?.email),
    [getUsers, user],
  )

  const friends = useMemo(
    () => allUsers.filter((other) => user?.friends?.includes(other.email)),
    [allUsers, user],
  )

  const defaultRecommendations = [
    { name: 'Ariana Hart', email: 'demo+ariana@bazzaar.com' },
    { name: 'Mina Patel', email: 'demo+mina@bazzaar.com' },
    { name: 'Samir Ali', email: 'demo+samir@bazzaar.com' },
    { name: 'Noor Khan', email: 'demo+noor@bazzaar.com' },
  ]

  const nonFriendUsers = useMemo(
    () => allUsers.filter((other) => !user?.friends?.includes(other.email)),
    [allUsers, user],
  )

  const searchQuery = query.trim().toLowerCase()
  const searchResults = useMemo(() => {
    if (!searchQuery) return []
    return nonFriendUsers.filter(
      (other) =>
        other.name.toLowerCase().includes(searchQuery) ||
        other.email.toLowerCase().includes(searchQuery),
    )
  }, [nonFriendUsers, searchQuery])

  const recommended = useMemo(
    () => {
      if (nonFriendUsers.length > 0) {
        return nonFriendUsers.slice(0, 4)
      }
      return defaultRecommendations
    },
    [nonFriendUsers],
  )

  if (!ready) {
    return <div className="friends-page"><p>{t('Loading user network...')}</p></div>
  }

  if (!isAuthenticated) {
    return (
      <section className="friends-page">
        <div className="page-header rose-line">
          <div>
            <p className="eyebrow">{t('Friends')}</p>
            <h1>{t('Please sign in')}</h1>
          </div>
        </div>
        <div className="friends-empty-state">
          <p>{t('You need to sign in to see your friends and discover new users.')}</p>
          <Link className="button" to="/login">
            {t('Log in')}
          </Link>
          <Link className="button secondary" to="/signup">
            {t('Sign up')}
          </Link>
        </div>
      </section>
    )
  }

  function handleAddFriend(email) {
    setMessage('')
    setError('')
    const result = addFriend(email)
    if (!result.ok) {
      setError(t(result.error))
      return
    }
    setMessage(t('Friend added'))
  }

  function handleRemoveFriend(email) {
    setMessage('')
    setError('')
    const result = removeFriend(email)
    if (!result.ok) {
      setError(t(result.error))
      return
    }
    setMessage(t('Friend removed'))
  }

  return (
    <section className="friends-page">
      <div className="page-header rose-line">
        <div>
          <p className="eyebrow">{t('Friends')}</p>
          <h1>{t('Your connections')}</h1>
        </div>
      </div>

      <div className="friends-layout">
        <div className="friends-sidebar">
          <label>
            {t('Search users')}
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('Search by name or email')}
            />
          </label>

          <div className="friends-suggestions">
            <h2>{t('Recommended to add')}</h2>
            {recommended.length === 0 ? (
              <p>{t('No users available to recommend.')}</p>
            ) : (
              recommended.map((other) => (
                <div key={other.email} className="friend-suggestion">
                  <div>
                    <strong>{other.name}</strong>
                    <p>{other.email}</p>
                  </div>
                  <button type="button" onClick={() => handleAddFriend(other.email)}>
                    {t('Add friend')}
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="friends-search-results">
            <h2>{t('Search results')}</h2>
            {searchQuery === '' ? (
              <p>{t('Enter a name or email to search.')}</p>
            ) : searchResults.length === 0 ? (
              <p>{t('No users matched your search.')}</p>
            ) : (
              searchResults.map((other) => (
                <div key={other.email} className="friend-suggestion">
                  <div>
                    <strong>{other.name}</strong>
                    <p>{other.email}</p>
                  </div>
                  <button type="button" onClick={() => handleAddFriend(other.email)}>
                    {t('Add friend')}
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="friends-browse-all">
            <h2>{t('Browse users')}</h2>
            {nonFriendUsers.length === 0 ? (
              <p>{t('There are no other users to add. Create or sign in with another account to build your network.')}</p>
            ) : (
              nonFriendUsers.map((other) => (
                <div key={other.email} className="friend-suggestion">
                  <div>
                    <strong>{other.name}</strong>
                    <p>{other.email}</p>
                  </div>
                  <button type="button" onClick={() => handleAddFriend(other.email)}>
                    {t('Add friend')}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="friends-main">
          {message && <p className="settings-success" role="status">{message}</p>}
          {error && <p className="auth-error" role="alert">{error}</p>}

          <div className="friends-card">
            <h2>{t('Your friends')}</h2>
            {friends.length === 0 ? (
              <p>{t('You have no friends yet.')}</p>
            ) : (
              friends.map((friend) => (
                <div key={friend.email} className="friend-item">
                  <div>
                    <strong>{friend.name}</strong>
                    <p>{friend.email}</p>
                  </div>
                  <button type="button" className="reset-button" onClick={() => handleRemoveFriend(friend.email)}>
                    {t('Remove')}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
