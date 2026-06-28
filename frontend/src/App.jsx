import { useEffect, useMemo, useState } from 'react'

const sectionOrder = ['Panini', 'FWC', ...'ABCDEFGHIJKL'.split('').map(l => `Group ${l}`), 'Coca-Cola']

function groupStickers(stickers) {
  const gs = {}
  stickers.forEach(st => {
    const g = st.country ? `Group ${st.country.group}` : st.name.startsWith('CC') ? 'Coca-Cola' : st.name === '00' ? 'Panini' : 'FWC'
    if (!gs[g]) gs[g] = []
    gs[g].push(st)
  })
  return gs
}

function App() {
  const [stickers, setStickers] = useState([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(new Set())
  const [userStickerIds, setUserStickerIds] = useState({})
  const [activeGroup, setActiveGroup] = useState('all')

  useEffect(() => {
    Promise.all([
      fetch('/api/stickers/').then(r => r.json()),
      fetch('/api/user-stickers/').then(r => r.json()),
    ]).then(([s, us]) => {
      setStickers(s)
      const map = {}
      us.forEach(us => { map[us.sticker.id] = us.id })
      setUserStickerIds(map)
      setLoading(false)
    })
  }, [])

  const groups = useMemo(() => groupStickers(stickers), [stickers])

  function toggleSticker(sticker) {
    if (claiming.has(sticker.id)) return

    const wasOwned = sticker.owned
    const prevUserStickerId = userStickerIds[sticker.id]

    setClaiming(prev => new Set(prev).add(sticker.id))
    setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, owned: !wasOwned } : s))
    if (wasOwned) {
      setUserStickerIds(prev => { const n = { ...prev }; delete n[sticker.id]; return n })
    }

    const request = wasOwned
      ? fetch(`/api/user-stickers/${prevUserStickerId}/`, { method: 'DELETE' })
      : fetch('/api/user-stickers/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sticker_id: sticker.id }),
        }).then(r => r.json()).then(us => {
          setUserStickerIds(prev => ({ ...prev, [sticker.id]: us.id }))
        })

    request.catch(() => {
      setStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, owned: wasOwned } : s))
      if (wasOwned) {
        setUserStickerIds(prev => ({ ...prev, [sticker.id]: prevUserStickerId }))
      }
    }).finally(() => {
      setClaiming(prev => { const n = new Set(prev); n.delete(sticker.id); return n })
    })
  }

  const displayed = activeGroup === 'all'
    ? sectionOrder.flatMap(s => groups[s] || [])
    : (groups[activeGroup] || [])

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      Loading stickers...
    </div>
  )

  return (
    <div className="container">
      <header>
        <div className="title">
          <h1>FIFA World Cup 26</h1>
        </div>
        <div className="stats">
          <span>{stickers.length} stickers</span>
          <span className="highlight">{stickers.filter(s => s.owned).length} owned</span>
        </div>
      </header>

      <div className="filters">
        <button onClick={() => setActiveGroup('all')}
          className={activeGroup === 'all' ? 'active' : ''}>All</button>
        {sectionOrder.filter(s => groups[s]).map(s => (
          <button key={s} onClick={() => setActiveGroup(s)}
            className={activeGroup === s ? 'active' : ''}>
            {s} <small>({groups[s].length})</small>
          </button>
        ))}
      </div>

      <div className="grid">
        {displayed.map(sticker => (
          <div key={sticker.id} className={`card${sticker.owned ? ' owned' : ''}${claiming.has(sticker.id) ? ' claiming' : ''}`}
               onClick={() => toggleSticker(sticker)}>
            <div className="sticker-image">
              <div className="placeholder">
                {sticker.name}
              </div>
            </div>
            <div className="info">
              <span className="number">{sticker.name}</span>
              {sticker.country && <span className="name">{sticker.country.name}</span>}
              {sticker.country && <span className="collection">Group {sticker.country.group}</span>}
              <span className={`badge ${sticker.owned ? 'owned' : 'missing'}`}>
                {sticker.owned ? '✓ Owned' : '○ Missing'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
