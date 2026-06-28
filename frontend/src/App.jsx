import { useEffect, useState } from 'react'

function App() {
  const [stickers, setStickers] = useState([])
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState([])
  const [activeGroup, setActiveGroup] = useState('all')

  useEffect(() => {
    Promise.all([
      fetch('/api/stickers/').then(r => r.json()),
      fetch('/api/countries/').then(r => r.json()),
    ]).then(([s]) => {
      setStickers(s)
      const gs = {}
      s.forEach(st => {
        const g = st.country ? `Group ${st.country.group}` : st.name.startsWith('CC') ? 'Coca-Cola' : st.name === '00' ? 'Panini' : 'FWC'
        if (!gs[g]) gs[g] = []
        gs[g].push(st)
      })
      setGroups(gs)
      setLoading(false)
    })
  }, [])

  const sectionOrder = ['Panini', 'FWC', ...'ABCDEFGHIJKL'.split('').map(l => `Group ${l}`), 'Coca-Cola']

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
          <div key={sticker.id} className="card">
            <div className="sticker-image">
              <div className="placeholder">
                {sticker.country ? sticker.country.code : sticker.name.startsWith('CC') ? 'CC' : sticker.name}
              </div>
            </div>
            <div className="info">
              <span className="number">{sticker.name}</span>
              {sticker.country && <span className="name">{sticker.country.name}</span>}
              {sticker.country && <span className="collection">Group {sticker.country.group}</span>}
              <span className="badge missing">○ Missing</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
