import { useEffect, useMemo, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

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
  ALG: ['#FFFFFF', '#006633', '#D21034'],
  ARG: ['#75AADB', '#FFFFFF', '#000000'],
  AUS: ['#FFCD00', '#007A3D', '#000000'],
  AUT: ['#ED2939', '#FFFFFF', '#000000'],
  BEL: ['#EF3340', '#000000', '#FDDA24'],
  BIH: ['#003399', '#FFCC00', '#FFFFFF'],
  BRA: ['#FFDF00', '#009C3B', '#002776'],
  CAN: ['#DC143C', '#FFFFFF', '#000000'],
  CIV: ['#FF8000', '#FFFFFF', '#009944'],
  COD: ['#007FFF', '#F7D618', '#CE1021'],
  COL: ['#FCD116', '#003893', '#CE1126'],
  CPV: ['#0073CF', '#FFFFFF', '#CF142B'],
  CRO: ['#FFFFFF', '#DC0000', '#172D7E'],
  CUW: ['#005B96', '#FFCD00', '#FFFFFF'],
  CZE: ['#D7141A', '#FFFFFF', '#11457E'],
  ECU: ['#FFDD00', '#0038A8', '#ED1C24'],
  EGY: ['#CE1126', '#FFFFFF', '#000000'],
  ENG: ['#FFFFFF', '#00205B', '#C8102E'],
  ESP: ['#AA151B', '#FFC400', '#0038A8'],
  FRA: ['#002395', '#FFFFFF', '#ED2939'],
  GER: ['#FFFFFF', '#000000', '#DD0000'],
  GHA: ['#FFFFFF', '#000000', '#008000'],
  HAI: ['#00205B', '#CE1126', '#FFFFFF'],
  IRN: ['#FFFFFF', '#CD002F', '#239655'],
  IRQ: ['#007A3D', '#FFFFFF', '#CE1126'],
  JOR: ['#FFFFFF', '#CE1126', '#007A3D'],
  JPN: ['#003087', '#FFFFFF', '#BC002D'],
  KOR: ['#CD002F', '#000000', '#FFFFFF'],
  KSA: ['#006633', '#FFFFFF', '#000000'],
  MAR: ['#C1272D', '#006233', '#FFFFFF'],
  MEX: ['#006847', '#FFFFFF', '#CE1126'],
  NED: ['#FF5F00', '#000000', '#FFFFFF'],
  NOR: ['#BA0C2F', '#00205B', '#FFFFFF'],
  NZL: ['#000000', '#FFFFFF', '#C0C0C0'],
  PAN: ['#FFFFFF', '#CE1126', '#0038A8'],
  PAR: ['#FFFFFF', '#D50032', '#003087'],
  POR: ['#CE1126', '#006633', '#FFCC00'],
  QAT: ['#800020', '#FFFFFF', '#000000'],
  RSA: ['#FFB800', '#007A3D', '#000000'],
  SCO: ['#002654', '#FFFFFF', '#CE1126'],
  SEN: ['#008542', '#FFFFFF', '#FFCD00'],
  SUI: ['#DA291C', '#FFFFFF', '#000000'],
  SWE: ['#FFCC00', '#006AA7', '#FFFFFF'],
  TUN: ['#E70013', '#FFFFFF', '#000000'],
  TUR: ['#E30A17', '#FFFFFF', '#000000'],
  URU: ['#5FAFDC', '#FFFFFF', '#000000'],
  USA: ['#FFFFFF', '#002855', '#BF0D3E'],
  UZB: ['#0099B5', '#FFFFFF', '#1EB53A'],
  COKE: ['#F40000', '#000000', '#F40000'],
  GOLD: ['#BF953F', '#FCF6B5', '#B38728'],
}

const slugToGroup = {
  panini: 'Panini',
  fwc: 'FWC',
  a: 'Group A',
  b: 'Group B',
  c: 'Group C',
  d: 'Group D',
  e: 'Group E',
  f: 'Group F',
  g: 'Group G',
  h: 'Group H',
  i: 'Group I',
  j: 'Group J',
  k: 'Group K',
  l: 'Group L',
  cc: 'Coca-Cola',
}

const groupToSlug = {}
for (const [slug, group] of Object.entries(slugToGroup)) {
  groupToSlug[group] = slug
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

function resolveRoute(slug, code) {
  if (code) {
    const upper = code.toUpperCase()
    if (flags[upper]) return { type: 'country', code: upper }
    return null
  }
  if (!slug) return { type: 'all' }
  if (slugToGroup[slug]) return { type: 'group', group: slugToGroup[slug] }
  return null
}

function CountryList() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/countries/')
      .then((r) => r.json())
      .then((data) => {
        setCountries(data)
        setLoading(false)
      })
  }, [])

  if (loading)
    return (
      <div className="loading">
        <div className="spinner" />
        Loading countries...
      </div>
    )

  return (
    <div className="container">
      <header>
        <div className="title">
          <h1>
            <Link to="/" className="home-link">
              FIFA World Cup 26
            </Link>
          </h1>
        </div>
        <div className="stats">
          <span>{countries.length} countries</span>
        </div>
      </header>

      <div className="country-grid">
        {countries.map((c) => (
          <Link key={c.id} to={`/country/${c.code.toLowerCase()}`} className="country-card">
            <span className="country-flag">{flagEmoji(c.code)}</span>
            <span className="country-code">{c.code}</span>
            <span className="country-name">{c.name}</span>
            <span className="country-group">Group {c.group}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/country" element={<CountryList />} />
        <Route path="/country/:code" element={<Page />} />
        <Route path="/:slug" element={<Page />} />
      </Routes>
    </BrowserRouter>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      className={`back-to-top${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <span className="tooltip">Back to top</span>↑
    </button>
  )
}

function Page() {
  const params = useParams()
  const { pathname } = useLocation()
  const slug = params.slug
  const code = params.code
  const navigate = useNavigate()

  const [stickers, setStickers] = useState([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(new Set())
  const [userStickerIds, setUserStickerIds] = useState({})
  const [search, setSearch] = useState('')
  const [ownership, setOwnership] = useState('all')

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

  const route = useMemo(() => resolveRoute(slug, code), [slug, code])

  useEffect(() => {
    if (!route) {
      navigate('/', { replace: true })
    }
  }, [route, navigate])

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

  const countryOrder = useMemo(() => {
    const seen = new Set()
    const order = []
    stickers.forEach((s) => {
      const code = s.country?.code
      if (code && !seen.has(code)) {
        seen.add(code)
        order.push(code)
      }
    })
    return order
  }, [stickers])

  const navOrder = useMemo(() => {
    const items = [{ slug: '', label: 'All' }]
    sectionOrder.forEach((s) => {
      const g = groups[s]
      if (g) {
        items.push({ slug: groupToSlug[s], label: s, count: g.length })
      }
    })
    countryOrder.forEach((c) => {
      items.push({ slug: `country/${c.toLowerCase()}`, label: c, emoji: flags[c] })
    })
    return items
  }, [groups])

  const currentSlug = route?.type === 'country' ? `country/${route.code.toLowerCase()}` : slug || ''
  const currentIdx = navOrder.findIndex((item) => item.slug === currentSlug)
  const prev = currentIdx > 0 ? navOrder[currentIdx - 1] : null
  const next = currentIdx < navOrder.length - 1 ? navOrder[currentIdx + 1] : null

  const baseDisplayed = search
    ? stickers.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : route.type === 'country'
      ? stickers.filter((s) => s.country?.code === route.code)
      : route.type === 'group'
        ? groups[route.group] || []
        : sectionOrder.flatMap((s) => groups[s] || [])

  const displayed =
    ownership === 'all'
      ? baseDisplayed
      : baseDisplayed.filter((s) => (ownership === 'owned' ? s.owned : !s.owned))

  function goTo(slug) {
    setSearch('')
    navigate(`/${slug}`)
  }

  if (loading)
    return (
      <div className="loading">
        <div className="spinner" />
        Loading stickers...
      </div>
    )

  if (!route) return null

  return (
    <div className="container">
      <header>
        <div className="title">
          <h1>
            <Link to="/" className="home-link">
              FIFA World Cup 26
            </Link>
          </h1>
        </div>
        <div className="stats">
          <span>{displayed.length} stickers</span>
          <span className="highlight">{displayed.filter((s) => s.owned).length} owned</span>
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
        <button onClick={() => goTo('')} className={!slug ? 'active' : ''}>
          All
        </button>
        <div className="ownership-tabs">
          <button
            className={ownership === 'owned' ? 'active' : ''}
            onClick={() => setOwnership(ownership === 'owned' ? 'all' : 'owned')}
          >
            ✓ Owned
          </button>
          <button
            className={ownership === 'missing' ? 'active' : ''}
            onClick={() => setOwnership(ownership === 'missing' ? 'all' : 'missing')}
          >
            ○ Missing
          </button>
        </div>
        <Link
          to="/country"
          className={`countries-btn${pathname.startsWith('/country') ? ' active' : ''}`}
        >
          Countries
        </Link>
        {sectionOrder
          .filter((s) => groups[s])
          .map((s) => (
            <button
              key={s}
              onClick={() => goTo(groupToSlug[s])}
              className={route.type === 'group' && route.group === s ? 'active' : ''}
            >
              {s} <small>({groups[s].length})</small>
            </button>
          ))}
      </div>

      {(slug || code) && !search && route && (
        <div className="nav-row">
          <button
            className="nav-arrow"
            onClick={() => goTo(prev.slug)}
            disabled={!prev}
            style={{ visibility: prev ? 'visible' : 'hidden' }}
          >
            ← {prev?.emoji || ''} {prev?.label || ''}
          </button>
          <div className="nav-title">
            {route.type === 'country' && <span className="nav-emoji">{flags[route.code]}</span>}
            {route.type === 'country'
              ? route.code
              : route.type === 'group'
                ? route.group
                : 'All Stickers'}
          </div>
          <button
            className="nav-arrow"
            onClick={() => goTo(next.slug)}
            disabled={!next}
            style={{ visibility: next ? 'visible' : 'hidden' }}
          >
            {next?.emoji || ''} {next?.label || ''} →
          </button>
        </div>
      )}

      <div className="grid">
        {displayed.map((sticker) => {
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

      <BackToTop />
    </div>
  )
}

export default App
