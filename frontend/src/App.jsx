import { useEffect, useMemo, useState } from 'react'

const sectionOrder = [
  'Panini',
  'FWC',
  ...'ABCDEFGHIJKL'.split('').map((l) => `Group ${l}`),
  'Coca-Cola',
]

const flags = {
  ALG: '🇩🇿',
  ARG: '🇦🇷',
  AUS: '🇦🇺',
  AUT: '🇦🇹',
  BEL: '🇧🇪',
  BIH: '🇧🇦',
  BRA: '🇧🇷',
  CAN: '🇨🇦',
  CIV: '🇨🇮',
  COD: '🇨🇩',
  COL: '🇨🇴',
  CPV: '🇨🇻',
  CRO: '🇭🇷',
  CUW: '🇨🇼',
  CZE: '🇨🇿',
  ECU: '🇪🇨',
  EGY: '🇪🇬',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  ESP: '🇪🇸',
  FRA: '🇫🇷',
  GER: '🇩🇪',
  GHA: '🇬🇭',
  HAI: '🇭🇹',
  IRN: '🇮🇷',
  IRQ: '🇮🇶',
  JOR: '🇯🇴',
  JPN: '🇯🇵',
  KOR: '🇰🇷',
  KSA: '🇸🇦',
  MAR: '🇲🇦',
  MEX: '🇲🇽',
  NED: '🇳🇱',
  NOR: '🇳🇴',
  NZL: '🇳🇿',
  PAN: '🇵🇦',
  PAR: '🇵🇾',
  POR: '🇵🇹',
  QAT: '🇶🇦',
  RSA: '🇿🇦',
  SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  SEN: '🇸🇳',
  SUI: '🇨🇭',
  SWE: '🇸🇪',
  TUN: '🇹🇳',
  TUR: '🇹🇷',
  URU: '🇺🇾',
  USA: '🇺🇸',
  UZB: '🇺🇿',
}

const flagColors = {
  ALG: ['#006233', '#FFFFFF', '#D21034'],
  ARG: ['#75AADB', '#FFFFFF', '#75AADB'],
  AUS: ['#00008B', '#FFFFFF', '#FF0000'],
  AUT: ['#ED2939', '#FFFFFF', '#ED2939'],
  BEL: ['#000000', '#FDEE00', '#EF3340'],
  BIH: ['#002395', '#FEDB00', '#002395'],
  BRA: ['#009739', '#FEDF00', '#002776'],
  CAN: ['#FF0000', '#FFFFFF', '#FF0000'],
  CIV: ['#FF8200', '#FFFFFF', '#009E60'],
  COD: ['#007FFF', '#F7D618', '#CE1021'],
  COL: ['#FCD116', '#003893', '#CE1126'],
  CPV: ['#003893', '#FFFFFF', '#CF202A'],
  CRO: ['#ED1C24', '#FFFFFF', '#005DA4'],
  CUW: ['#002B7F', '#FEDD00', '#002B7F'],
  CZE: ['#11457A', '#FFFFFF', '#D7141A'],
  ECU: ['#FEDF00', '#003893', '#ED1C24'],
  EGY: ['#CE1126', '#FFFFFF', '#000000'],
  ENG: ['#CF142B', '#FFFFFF', '#CF142B'],
  ESP: ['#C60B1E', '#FFC400', '#C60B1E'],
  FRA: ['#002395', '#FFFFFF', '#ED2939'],
  GER: ['#000000', '#DD0000', '#FFCC00'],
  GHA: ['#CE1126', '#FCD116', '#006B3F'],
  HAI: ['#00209F', '#D21034', '#00209F'],
  IRN: ['#239F40', '#FFFFFF', '#DA0000'],
  IRQ: ['#CE1126', '#FFFFFF', '#000000'],
  JOR: ['#000000', '#FFFFFF', '#006A4E'],
  JPN: ['#BC002D', '#FFFFFF', '#BC002D'],
  KOR: ['#CD2E3A', '#003478', '#FFFFFF'],
  KSA: ['#006C35', '#FFFFFF', '#006C35'],
  MAR: ['#C1272D', '#006233', '#006233'],
  MEX: ['#006847', '#FFFFFF', '#CE1126'],
  NED: ['#AE1C28', '#FFFFFF', '#003882'],
  NOR: ['#BA0C2F', '#FFFFFF', '#00205B'],
  NZL: ['#00247D', '#FFFFFF', '#CC142B'],
  PAN: ['#00529F', '#CE1126', '#00529F'],
  PAR: ['#D52B1E', '#FFFFFF', '#0038A8'],
  POR: ['#006600', '#FFD700', '#FF0000'],
  QAT: ['#8A1538', '#FFFFFF', '#8A1538'],
  RSA: ['#DE3831', '#007A4D', '#002395'],
  SCO: ['#005EB8', '#FFFFFF', '#005EB8'],
  SEN: ['#00853F', '#FDEF42', '#E31B23'],
  SUI: ['#DA291C', '#FFFFFF', '#DA291C'],
  SWE: ['#005BAA', '#FECC00', '#005BAA'],
  TUN: ['#E70013', '#FFFFFF', '#E70013'],
  TUR: ['#E30A17', '#FFFFFF', '#E30A17'],
  URU: ['#0038A8', '#FFFFFF', '#FCBF49'],
  USA: ['#B22234', '#FFFFFF', '#3C3B6E'],
  UZB: ['#0099B5', '#FFFFFF', '#1EB53A'],
  COKE: ['#F40000', '#000000', '#F40000'],
  GOLD: ['#BF953F', '#FCF6B5', '#B38728'],
}

function flagEmoji(code) {
  return flags[code] || ''
}

function flagStyle(code) {
  const c = flagColors[code]
  if (!c) return {}
  return {
    '--fc1': c[0],
    '--fc2': c[1],
    '--fc3': c[2],
  }
}

function groupStickers(stickers) {
  const gs = {}
  stickers.forEach((st) => {
    const g = st.country
      ? `Group ${st.country.group}`
      : st.name.startsWith('CC')
        ? 'Coca-Cola'
        : st.name === '00'
          ? 'Panini'
          : 'FWC'
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
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/stickers/').then((r) => r.json()),
      fetch('/api/user-stickers/').then((r) => r.json()),
    ]).then(([s, us]) => {
      setStickers(s)
      const map = {}
      us.forEach((us) => {
        map[us.sticker.id] = us.id
      })
      setUserStickerIds(map)
      setLoading(false)
    })
  }, [])

  const groups = useMemo(() => groupStickers(stickers), [stickers])

  function toggleSticker(sticker) {
    if (claiming.has(sticker.id)) return

    const wasOwned = sticker.owned
    const prevUserStickerId = userStickerIds[sticker.id]

    setClaiming((prev) => new Set(prev).add(sticker.id))
    setStickers((prev) => prev.map((s) => (s.id === sticker.id ? { ...s, owned: !wasOwned } : s)))
    if (wasOwned) {
      setUserStickerIds((prev) => {
        const n = { ...prev }
        delete n[sticker.id]
        return n
      })
    }

    const request = wasOwned
      ? fetch(`/api/user-stickers/${prevUserStickerId}/`, { method: 'DELETE' })
      : fetch('/api/user-stickers/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sticker_id: sticker.id }),
        })
          .then((r) => r.json())
          .then((us) => {
            setUserStickerIds((prev) => ({ ...prev, [sticker.id]: us.id }))
          })

    request
      .catch(() => {
        setStickers((prev) =>
          prev.map((s) => (s.id === sticker.id ? { ...s, owned: wasOwned } : s)),
        )
        if (wasOwned) {
          setUserStickerIds((prev) => ({
            ...prev,
            [sticker.id]: prevUserStickerId,
          }))
        }
      })
      .finally(() => {
        setClaiming((prev) => {
          const n = new Set(prev)
          n.delete(sticker.id)
          return n
        })
      })
  }

  const filtered = search
    ? stickers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : activeGroup === 'all'
      ? sectionOrder.flatMap((s) => groups[s] || [])
      : groups[activeGroup] || []

  if (loading)
    return (
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
          <span className="highlight">{stickers.filter((s) => s.owned).length} owned</span>
        </div>
      </header>

      <div className="filters">
        <input
          type="text"
          className="search"
          placeholder="Search stickers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => {
            setActiveGroup('all')
            setSearch('')
          }}
          className={activeGroup === 'all' && !search ? 'active' : ''}
        >
          All
        </button>
        {sectionOrder
          .filter((s) => groups[s])
          .map((s) => (
            <button
              key={s}
              onClick={() => setActiveGroup(s)}
              className={activeGroup === s ? 'active' : ''}
            >
              {s} <small>({groups[s].length})</small>
            </button>
          ))}
      </div>

      <div className="grid">
        {filtered.map((sticker) => {
          const flagKey =
            sticker.owned &&
            (sticker.country?.code ||
              (sticker.name.startsWith('CC')
                ? 'COKE'
                : sticker.name === '00' || sticker.name.startsWith('FWC')
                  ? 'GOLD'
                  : null))
          return (
            <div
              key={sticker.id}
              className={`card${sticker.owned ? ' owned' : ''}${flagKey ? ' flagged' : ''}${claiming.has(sticker.id) ? ' claiming' : ''}`}
              style={flagKey ? flagStyle(flagKey) : {}}
              onClick={() => toggleSticker(sticker)}
            >
              <div className="sticker-image">
                <div className="placeholder">{sticker.name}</div>
              </div>
              <div className="info">
                <span className="number">{sticker.name}</span>
                {sticker.country && (
                  <span className="name">
                    {flagEmoji(sticker.country.code)} {sticker.country.name}
                  </span>
                )}
                {sticker.country && (
                  <span className="collection">Group {sticker.country.group}</span>
                )}
                <span className={`badge ${sticker.owned ? 'owned' : 'missing'}`}>
                  {sticker.owned ? '✓ Owned' : '○ Missing'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
