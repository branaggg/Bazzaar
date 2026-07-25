import { useMemo, useState } from 'react'

const groups = [
  {
    id: 'general',
    name: 'Everyday Circle',
    topic: 'General',
    description: 'Casual check-ins, introductions, and daily questions.',
    members: 128,
    joined: true,
  },
  {
    id: 'fashion',
    name: 'Fashion Advice',
    topic: 'Clothing',
    description: 'Outfit help, styling ideas, sizing, and seller reviews.',
    members: 94,
    joined: false,
  },
  {
    id: 'wedding',
    name: 'Wedding Prep',
    topic: 'Events',
    description: 'Planning outfits, gifts, vendors, and timelines.',
    members: 76,
    joined: false,
  },
  {
    id: 'recipes',
    name: 'Recipe Swap',
    topic: 'Food',
    description: 'Family recipes, snacks, spice tips, and meal ideas.',
    members: 143,
    joined: true,
  },
  {
    id: 'career',
    name: 'Career & School',
    topic: 'Advice',
    description: 'Internships, classes, resumes, interviews, and support.',
    members: 61,
    joined: false,
  },
  {
    id: 'local',
    name: 'Local Finds',
    topic: 'Marketplace',
    description: 'Nearby shops, tailors, events, pickups, and recommendations.',
    members: 88,
    joined: false,
  },
]

const initialPosts = [
  {
    id: 1,
    group: 'general',
    author: 'Sneha P.',
    time: '10:42 AM',
    title: 'Has anyone ordered from the new jewelry seller?',
    body: 'The kundan pieces look beautiful, but I wanted to ask if anyone has seen the quality in person.',
    replies: 8,
  },
  {
    id: 2,
    group: 'general',
    author: 'Kavya M.',
    time: 'Yesterday',
    title: 'Welcome thread for new members',
    body: 'Drop your city and what you are hoping to find here. I am looking for festival outfits and homemade snacks.',
    replies: 15,
  },
  {
    id: 3,
    group: 'fashion',
    author: 'Rhea B.',
    time: '9:15 AM',
    title: 'Lehenga color help for a summer sangeet',
    body: 'Would you choose sage green or coral for an outdoor evening event?',
    replies: 12,
  },
  {
    id: 4,
    group: 'wedding',
    author: 'Meera V.',
    time: 'Mon',
    title: 'How early should bridesmaids order outfits?',
    body: 'Trying to coordinate sizes across three states without everyone panic-buying last minute.',
    replies: 6,
  },
  {
    id: 5,
    group: 'recipes',
    author: 'Lakshmi P.',
    time: 'Sun',
    title: 'Best shortcut for soft idli batter?',
    body: 'My batter ferments slowly in winter. What has worked for you?',
    replies: 19,
  },
  {
    id: 6,
    group: 'career',
    author: 'Ananya S.',
    time: 'Fri',
    title: 'Resume wording for first internship?',
    body: 'I helped run my auntie’s small business inventory. How should I describe that professionally?',
    replies: 9,
  },
  {
    id: 7,
    group: 'local',
    author: 'Nisha R.',
    time: 'Thu',
    title: 'Good blouse alteration place near Fremont?',
    body: 'Looking for someone reliable for a last-minute sleeve adjustment.',
    replies: 4,
  },
]

const onlineFriends = [
  { name: 'Kavya M.', status: 'In Recipe Swap' },
  { name: 'Rhea B.', status: 'Viewing Fashion Advice' },
  { name: 'Meera V.', status: 'Online' },
  { name: 'Simran G.', status: 'Online' },
]

export default function ChatPage({ t, addNotification }) {
  const [communityGroups, setCommunityGroups] = useState(groups)
  const [communityPosts, setCommunityPosts] = useState(initialPosts)
  const [selectedGroupId, setSelectedGroupId] = useState('general')
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [discoverOpen, setDiscoverOpen] = useState(false)
  const [postDraft, setPostDraft] = useState('')

  const selectedGroup = communityGroups.find((group) => group.id === selectedGroupId)
  const joinedGroups = communityGroups.filter((group) => group.joined)
  const filteredGroups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) return communityGroups

    return communityGroups.filter((group) => {
      const searchableText = `${group.name} ${group.topic} ${group.description}`.toLowerCase()
      return searchableText.includes(query)
    })
  }, [communityGroups, searchTerm])

  const selectedPosts = useMemo(
    () => communityPosts.filter((post) => post.group === selectedGroupId),
    [communityPosts, selectedGroupId],
  )

  function toggleJoin(groupId) {
    setCommunityGroups((currentGroups) =>
      currentGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              joined: !group.joined,
              members: group.joined ? group.members - 1 : group.members + 1,
            }
          : group,
      ),
    )
  }

  function submitPost(event) {
    event.preventDefault()
    if (!postDraft.trim()) return

    setCommunityPosts((current) => [
      {
        id: Date.now(),
        group: selectedGroupId,
        author: 'Anika Sharma',
        time: 'Just now',
        title: postDraft.trim(),
        body: 'New community post.',
        replies: 0,
      },
      ...current,
    ])
    setPostDraft('')
    addNotification?.(`Posted in ${selectedGroup.name}`)
  }

  return (
    <section className={`community-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className="community-sidebar">
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((isOpen) => !isOpen)}
          aria-label={sidebarOpen ? 'Minimize sidebar' : 'Show sidebar'}
        >
          {sidebarOpen ? '<' : '>'}
        </button>

        {sidebarOpen && (
          <div className="sidebar-content">
            <section>
              <h2>{t('Your Communities')}</h2>
              <div className="sidebar-list">
                {joinedGroups.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    className={selectedGroupId === group.id ? 'sidebar-item selected' : 'sidebar-item'}
                    onClick={() => setSelectedGroupId(group.id)}
                  >
                    <span>{t(group.name)}</span>
                    <small>{group.members} {t('members')}</small>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2>{t('Online Friends')}</h2>
              <div className="friend-list">
                {onlineFriends.map((friend) => (
                  <div key={friend.name} className="friend-item">
                    <span className="online-dot"></span>
                    <div>
                      <strong>{friend.name}</strong>
                      <small>{t(friend.status)}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </aside>

      <div className="community-page">
        <div className="page-header community-header">
          <div>
            <p className="eyebrow">{t('Community')}</p>
            <h1>{t('Find Your Groups')}</h1>
          </div>
          <button
            type="button"
            className="discover-toggle"
            onClick={() => setDiscoverOpen((isOpen) => !isOpen)}
          >
            {discoverOpen ? t('Hide Communities') : t('Find Communities')}
          </button>
        </div>

        {discoverOpen && (
          <div className="discover-panel">
            <div className="community-search">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('Search communities, topics, or interests...')}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')}>
                  {t('Clear')}
                </button>
              )}
            </div>

            <div className="group-grid">
              {filteredGroups.map((group) => (
                <article
                  key={group.id}
                  className={`group-card ${selectedGroupId === group.id ? 'selected' : ''}`}
                >
                  <button
                    type="button"
                    className="group-select"
                    onClick={() => setSelectedGroupId(group.id)}
                  >
                    <span>{t(group.name)}</span>
                    <small>{t(group.topic)} | {group.members} {t('members')}</small>
                  </button>
                  <p>{t(group.description)}</p>
                  <button
                    type="button"
                    className={group.joined ? 'joined-button' : 'join-button'}
                    onClick={() => toggleJoin(group.id)}
                  >
                    {group.joined ? t('Joined') : t('Join')}
                  </button>
                </article>
              ))}
            </div>

            {filteredGroups.length === 0 && (
              <div className="empty-state">
                <h2>{t('No communities found')}</h2>
                <p>{t('Try searching for fashion, recipes, wedding, career, or local.')}</p>
              </div>
            )}
          </div>
        )}

        <div className="community-feed">
          <div className="feed-main">
            <div className="feed-title">
              <div>
                <p className="eyebrow">{t('Now Viewing')}</p>
                <h2>{t(selectedGroup.name)}</h2>
              </div>
              <span>{selectedPosts.length} {t('posts')}</span>
            </div>

            <form className="post-composer" onSubmit={submitPost}>
              <input
                type="text"
                value={postDraft}
                onChange={(event) => setPostDraft(event.target.value)}
                placeholder={`${t('Start a post in')} ${t(selectedGroup.name)}...`}
              />
              <button type="submit">{t('Post')}</button>
            </form>

            <div className="post-list">
              {selectedPosts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="post-meta">
                    <strong>{post.author}</strong>
                    <span>{post.time}</span>
                  </div>
                  <h3>{t(post.title)}</h3>
                  <p>{t(post.body)}</p>
                  <button type="button" className="reply-button">
                    {post.replies} {t('replies')}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
