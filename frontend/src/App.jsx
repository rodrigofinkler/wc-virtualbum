import { useEffect, useMemo, useState } from 'react'

const sectionOrder = ['Panini', 'FWC', ...'ABCDEFGHIJKL'.split('').map(l => `Group ${l}`), 'Coca-Cola']

const fifaToIso = {
  ALG: 'DZ', ARG: 'AR', AUS: 'AU', AUT: 'AT', BEL: 'BE', BIH: 'BA', BRA: 'BR',
  CAN: 'CA', CIV: 'CI', COD: 'CD', COL: 'CO', CPV: 'CV', CRO: 'HR', CUW: 'CW',
  CZE: 'CZ', ECU: 'EC', EGY: 'EG', ENG: 'GB-ENG', ESP: 'ES', FRA: 'FR', GER: 'DE',
  GHA: 'GH', HAI: 'HT', IRN: 'IR', IRQ: 'IQ', JOR: 'JO', JPN: 'JP', KOR: 'KR',
  KSA: 'SA', MAR: 'MA', MEX: 'MX', NED: 'NL', NOR: 'NO', NZL: 'NZ', PAN: 'PA',
  PAR: 'PY', POR: 'PT', QAT: 'QA', RSA: 'ZA', SCO: 'GB-SCT', SEN: 'SN', SUI: 'CH',
  SWE: 'SE', TUN: 'TN', TUR: 'TR', URU: 'UY', USA: 'US', UZB: 'UZ',
}

function flagEmoji(code) {
  const iso = fifaToIso[code]
  if (!iso) return ''
  if (iso.includes('-')) {
    const tag = iso.replace('-', '').toLowerCase()
    return String.fromCodePoint(0x1F3F4) +
      [...tag].map(c => String.fromCodePoint(0xE0060 + c.charCodeAt(0))).join('') +
      String.fromCodePoint(0xE007F)
  }
  return [...iso].map(c => String.fromCodePoint(0x1F1E6 + c.codePointAt(0) - 65)).join('')
}

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
              {sticker.country && <span className="name">{flagEmoji(sticker.country.code)} {sticker.country.name}</span>}
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
