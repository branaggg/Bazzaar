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

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

function publicUser(user) {
  if (!user) return null
  const { password, ...safeUser } = user
  return {
    ...safeUser,
    friends: safeUser.friends || [],
  }
}

function seedSampleUsers(existingUsers) {
  const sampleUsers = [
    {
      id: Date.now() + 1,
      name: 'Ariana Hart',
      email: 'demo+ariana@bazzaar.com',
      password: 'demo1234',
      city: 'New York',
      languagesSpoken: 'English',
      rating: 5,
      verified: true,
      friends: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: Date.now() + 2,
      name: 'Mina Patel',
      email: 'demo+mina@bazzaar.com',
      password: 'demo1234',
      city: 'San Francisco',
      languagesSpoken: 'English, Hindi',
      rating: 4.8,
      verified: true,
      friends: [],
      createdAt: new Date().toISOString(),
    },
    {
      id: Date.now() + 3,
      name: 'Samir Ali',
      email: 'demo+samir@bazzaar.com',
      password: 'demo1234',
      city: 'Austin',
      languagesSpoken: 'English, Urdu',
      rating: 4.7,
      verified: false,
      friends: [],
      createdAt: new Date().toISOString(),
    },
  ]

  const nextUsers = [...existingUsers]
  for (const sample of sampleUsers) {
    if (!nextUsers.some((user) => user.email === sample.email)) {
      nextUsers.push(sample)
    }
  }
  return nextUsers
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const users = readUsers()
    const seeded = seedSampleUsers(users)
    if (seeded.length !== users.length) {
      writeUsers(seeded)
    }

    const session = readSession()
    if (session?.email) {
      const saved = seeded.find((entry) => entry.email === session.email)
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

  function createUser({ name, email, password, city, languagesSpoken }) {
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
      friends: [],
      createdAt: new Date().toISOString(),
    }

    writeUsers([newUser, ...users])
    return { ok: true }
  }

  function getUsers() {
    return readUsers().map(publicUser)
  }

  function findUserByName(name) {
    if (!name) return null
    const normalized = normalizeName(name)
    return readUsers().find((entry) => normalizeName(entry.name) === normalized) || null
  }

  function addFriend(friendEmail) {
    if (!user) return { ok: false, error: 'Not signed in.' }

    const normalizedFriend = String(friendEmail || '').trim().toLowerCase()
    if (!normalizedFriend) return { ok: false, error: 'Valid friend email required.' }
    if (normalizedFriend === user.email) {
      return { ok: false, error: 'You cannot add yourself as a friend.' }
    }

    const users = readUsers()
    const currentIndex = users.findIndex((entry) => entry.email === user.email)
    const friendIndex = users.findIndex((entry) => entry.email === normalizedFriend)

    if (friendIndex < 0) {
      return { ok: false, error: 'User not found.' }
    }

    const current = users[currentIndex]
    const friend = users[friendIndex]
    const currentFriends = new Set(current.friends || [])
    const friendFriends = new Set(friend.friends || [])

    if (currentFriends.has(normalizedFriend)) {
      return { ok: false, error: 'Already friends.' }
    }

    currentFriends.add(normalizedFriend)
    friendFriends.add(current.email)

    users[currentIndex] = { ...current, friends: [...currentFriends] }
    users[friendIndex] = { ...friend, friends: [...friendFriends] }
    writeUsers(users)

    setUser(publicUser(users[currentIndex]))
    return { ok: true }
  }

  function removeFriend(friendEmail) {
    if (!user) return { ok: false, error: 'Not signed in.' }

    const normalizedFriend = String(friendEmail || '').trim().toLowerCase()
    if (!normalizedFriend) return { ok: false, error: 'Valid friend email required.' }

    const users = readUsers()
    const currentIndex = users.findIndex((entry) => entry.email === user.email)
    const friendIndex = users.findIndex((entry) => entry.email === normalizedFriend)
    if (friendIndex < 0) {
      return { ok: false, error: 'User not found.' }
    }

    const current = users[currentIndex]
    const friend = users[friendIndex]
    const currentFriends = new Set(current.friends || [])
    const friendFriends = new Set(friend.friends || [])

    if (!currentFriends.has(normalizedFriend)) {
      return { ok: false, error: 'Not friends.' }
    }

    currentFriends.delete(normalizedFriend)
    friendFriends.delete(current.email)

    users[currentIndex] = { ...current, friends: [...currentFriends] }
    users[friendIndex] = { ...friend, friends: [...friendFriends] }
    writeUsers(users)

    setUser(publicUser(users[currentIndex]))
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
      createUser,
      getUsers,
      findUserByName,
      addFriend,
      removeFriend,
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
