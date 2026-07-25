import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const USERS_KEY = 'bazzaar_users'
const SESSION_KEY = 'bazzaar_session'

const AuthContext = createContext(null)

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

function publicUser(user) {
  if (!user) return null
  const { password, ...safeUser } = user
  return safeUser
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = readSession()
    if (session?.email) {
      const saved = readUsers().find((entry) => entry.email === session.email)
      if (saved) setUser(publicUser(saved))
    }
    setReady(true)
  }, [])

  function signup({ name, email, password, city, languagesSpoken }) {
    const normalizedEmail = email.trim().toLowerCase()
    const users = readUsers()

    if (!name.trim() || !normalizedEmail || !password) {
      return { ok: false, error: 'Please fill in all required fields.' }
    }

    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' }
    }

    if (users.some((entry) => entry.email === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists.' }
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      password,
      city: city.trim() || 'San Jose',
      languagesSpoken: languagesSpoken.trim() || 'English',
      rating: 5,
      verified: false,
      createdAt: new Date().toISOString(),
    }

    writeUsers([newUser, ...users])
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalizedEmail }))
    setUser(publicUser(newUser))
    return { ok: true }
  }

  function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const saved = readUsers().find((entry) => entry.email === normalizedEmail)

    if (!saved || saved.password !== password) {
      return { ok: false, error: 'Invalid email or password.' }
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: normalizedEmail }))
    setUser(publicUser(saved))
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  function updateProfile(updates) {
    if (!user) return { ok: false, error: 'Not signed in.' }

    const users = readUsers()
    const index = users.findIndex((entry) => entry.email === user.email)
    if (index < 0) return { ok: false, error: 'Account not found.' }

    const nextUser = {
      ...users[index],
      ...updates,
      email: users[index].email,
      password: users[index].password,
      id: users[index].id,
    }

    users[index] = nextUser
    writeUsers(users)
    setUser(publicUser(nextUser))
    return { ok: true }
  }

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      signup,
      login,
      logout,
      updateProfile,
    }),
    [user, ready],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
