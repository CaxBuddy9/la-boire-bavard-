'use client'
import { useState, useRef } from 'react'
import Nav from '@/components/sections/Nav'

const ROOMS = ['Côté Jardin', 'Côté Cèdre', 'Côté Vallée', 'Côté Potager']
const PRICE_NUIT = 88
const PRICE_TABLE = 25
const TAXE_SEJOUR = 0.83 // €/personne/nuit (Blaison-Saint-Sulpice)

function nights(a: string, d: string) {
  if (!a || !d) return 0
  return Math.max(0, Math.round((new Date(d).getTime() - new Date(a).getTime()) / 86400000))
}

function fmtDate(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function pad(n: number) { return String(n).padStart(4, '0') }

export default function FacturationPage() {
  const printRef = useRef<HTMLDivElement>(null)

  const today = new Date().toISOString().split('T')[0]
  const [num,       setNum]       = useState(`LBB-${new Date().getFullYear()}-${pad(1)}`)
  const [dateFacture, setDateFacture] = useState(today)
  const [nom,       setNom]       = useState('')
  const [prenom,    setPrenom]    = useState('')
  const [adresse,   setAdresse]   = useState('')
  const [email,     setEmail]     = useState('')
  const [chambre,   setChambre]   = useState(ROOMS[0])
  const [arrive,    setArrive]    = useState('')
  const [depart,    setDepart]    = useState('')
  const [pers,      setPers]      = useState(2)
  const [tableHotes, setTableHotes] = useState(0)
  const [note,      setNote]      = useState('')

  const n      = nights(arrive, depart)
  const lignes = [
    { label: `Chambre ${chambre} — ${n} nuit${n > 1 ? 's' : ''} × ${PRICE_NUIT} €`, qty: n, pu: PRICE_NUIT, total: n * PRICE_NUIT },
    ...(tableHotes > 0 ? [{ label: `Table d'hôtes — ${tableHotes} convive${tableHotes > 1 ? 's' : ''}`, qty: tableHotes, pu: PRICE_TABLE, total: tableHotes * PRICE_TABLE }] : []),
    ...(n > 0 ? [{ label: `Taxe de séjour — ${pers} pers. × ${n} nuit${n > 1 ? 's' : ''} × ${TAXE_SEJOUR} €`, qty: pers * n, pu: TAXE_SEJOUR, total: Math.round(pers * n * TAXE_SEJOUR * 100) / 100 }] : []),
  ]
  const total = lignes.reduce((s, l) => s + l.total, 0)

  const handlePrint = () => {
    const content = printRef.current?.innerHTML
    if (!content) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <title>Facture ${num} — La Boire Bavard</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;600&family=Playfair+Display:ital,wght@0,400;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:Raleway,sans-serif;color:#1a1a1a;background:#fff;padding:40px;max-width:800px;margin:auto}
        .facture-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #c4a050}
        .logo-text{font-family:'Playfair Display',Georgia,serif;font-size:1.6rem;color:#1a3220}
        .logo-sub{font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:#c4a050;margin-top:4px}
        .etablissement{font-size:0.78rem;color:#555;line-height:1.7;margin-top:8px}
        .facture-meta{text-align:right}
        .facture-num{font-family:'Playfair Display',serif;font-size:1.1rem;color:#1a3220}
        .facture-date{font-size:0.78rem;color:#777;margin-top:6px}
        .section-title{font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:#c4a050;margin-bottom:10px}
        .client-box{background:#f8f6f0;padding:16px 20px;border-left:3px solid #c4a050;margin-bottom:32px}
        .client-name{font-family:'Playfair Display',serif;font-size:1.1rem;margin-bottom:4px}
        .client-detail{font-size:0.82rem;color:#555;line-height:1.6}
        .sejour-bar{display:flex;gap:32px;margin-bottom:32px;padding:14px 20px;background:#1a3220;color:#fff;border-radius:2px}
        .sejour-item label{font-size:0.55rem;letter-spacing:0.18em;text-transform:uppercase;color:rgba(196,160,80,.8);display:block;margin-bottom:3px}
        .sejour-item span{font-size:0.9rem}
        table{width:100%;border-collapse:collapse;margin-bottom:24px}
        thead tr{border-bottom:1px solid #c4a050}
        th{font-size:0.6rem;letter-spacing:0.15em;text-transform:uppercase;color:#888;padding:8px 0;text-align:left;font-weight:400}
        th:last-child,td:last-child{text-align:right}
        td{padding:12px 0;font-size:0.85rem;border-bottom:1px solid #eee;vertical-align:top}
        .total-row td{border-bottom:none;padding-top:16px;font-weight:600;font-size:1rem;color:#1a3220}
        .gold-line{height:2px;background:linear-gradient(90deg,#c4a050,transparent);margin-bottom:16px}
        .exo-tva{font-size:0.72rem;color:#888;font-style:italic;margin-bottom:20px}
        .note-box{background:#f8f6f0;padding:14px 18px;font-size:0.8rem;color:#555;line-height:1.6;margin-bottom:32px;border-left:2px solid #ddd}
        .footer-facture{margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:0.7rem;color:#aaa;text-align:center;line-height:1.8}
        @media print{body{padding:20px}button{display:none}}
      </style>
    </head><body>${content}</body></html>`)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }

  const s = { color: '#fff', fontFamily: 'Raleway, sans-serif' }

  return (
    <>
      <Nav />
      <main style={{ background: '#0a100a', minHeight: '100vh', paddingTop: 100, paddingBottom: 60 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '340px 1fr', gap: 32, alignItems: 'start' }}>

          {/* ── FORMULAIRE ── */}
          <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(196,160,80,.15)', padding: 28, borderRadius: 2, position: 'sticky', top: 100 }}>
            <p style={{ ...s, fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c4a050', marginBottom: 20 }}>Nouvelle facture</p>

            {/* N° et date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <label style={labelStyle}>
                <span style={labelSpan}>N° facture</span>
                <input style={inputStyle} value={num} onChange={e => setNum(e.target.value)} />
              </label>
              <label style={labelStyle}>
                <span style={labelSpan}>Date</span>
                <input style={inputStyle} type="date" value={dateFacture} onChange={e => setDateFacture(e.target.value)} />
              </label>
            </div>

            <div style={{ height: 1, background: 'rgba(196,160,80,.12)', marginBottom: 16 }} />
            <p style={{ ...s, fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.5)', marginBottom: 12 }}>Client</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <label style={labelStyle}>
                <span style={labelSpan}>Prénom</span>
                <input style={inputStyle} value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Marie" />
              </label>
              <label style={labelStyle}>
                <span style={labelSpan}>Nom</span>
                <input style={inputStyle} value={nom} onChange={e => setNom(e.target.value)} placeholder="Dupont" />
              </label>
            </div>
            <label style={{ ...labelStyle, marginBottom: 12 }}>
              <span style={labelSpan}>Adresse</span>
              <input style={inputStyle} value={adresse} onChange={e => setAdresse(e.target.value)} placeholder="12 rue des Roses, 75001 Paris" />
            </label>
            <label style={{ ...labelStyle, marginBottom: 16 }}>
              <span style={labelSpan}>Email</span>
              <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="marie@exemple.fr" />
            </label>

            <div style={{ height: 1, background: 'rgba(196,160,80,.12)', marginBottom: 16 }} />
            <p style={{ ...s, fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(196,160,80,.5)', marginBottom: 12 }}>Séjour</p>

            <label style={{ ...labelStyle, marginBottom: 12 }}>
              <span style={labelSpan}>Chambre</span>
              <select style={inputStyle} value={chambre} onChange={e => setChambre(e.target.value)}>
                {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <label style={labelStyle}>
                <span style={labelSpan}>Arrivée</span>
                <input style={inputStyle} type="date" value={arrive} onChange={e => setArrive(e.target.value)} />
              </label>
              <label style={labelStyle}>
                <span style={labelSpan}>Départ</span>
                <input style={inputStyle} type="date" value={depart} onChange={e => setDepart(e.target.value)} />
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <label style={labelStyle}>
                <span style={labelSpan}>Personnes</span>
                <input style={inputStyle} type="number" min={1} max={4} value={pers} onChange={e => setPers(+e.target.value)} />
              </label>
              <label style={labelStyle}>
                <span style={labelSpan}>Table d'hôtes (couverts)</span>
                <input style={inputStyle} type="number" min={0} max={20} value={tableHotes} onChange={e => setTableHotes(+e.target.value)} />
              </label>
            </div>

            <label style={{ ...labelStyle, marginBottom: 20 }}>
              <span style={labelSpan}>Note (optionnel)</span>
              <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 60 }} value={note} onChange={e => setNote(e.target.value)} placeholder="Remise, message personnalisé…" />
            </label>

            <button
              onClick={handlePrint}
              style={{
                width: '100%', padding: '12px 0',
                background: 'transparent', border: '1px solid #c4a050',
                color: '#c4a050', fontFamily: 'Raleway, sans-serif',
                fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all .2s',
              }}
              onMouseOver={e => { (e.target as HTMLButtonElement).style.background = '#c4a050'; (e.target as HTMLButtonElement).style.color = '#0a100a' }}
              onMouseOut={e => { (e.target as HTMLButtonElement).style.background = 'transparent'; (e.target as HTMLButtonElement).style.color = '#c4a050' }}
            >
              Imprimer / Enregistrer PDF
            </button>
          </div>

          {/* ── PRÉVISUALISATION ── */}
          <div style={{ background: '#fff', borderRadius: 2, padding: '48px 52px', boxShadow: '0 8px 60px rgba(0,0,0,0.4)' }} ref={printRef}>

            {/* Header */}
            <div className="facture-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, paddingBottom: 24, borderBottom: '2px solid #c4a050' }}>
              <div>
                <div className="logo-text" style={{ fontFamily: 'Georgia, serif', fontSize: '1.6rem', color: '#1a3220' }}>La Boire Bavard</div>
                <div className="logo-sub" style={{ fontSize: '0.65rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c4a050', marginTop: 4 }}>Chambres d'Hôtes · Anjou</div>
                <div className="etablissement" style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.7, marginTop: 8 }}>
                  4 chemin de la Boire Bavard, Lieu-dit La Hutte<br />
                  49320 Blaison-Saint-Sulpice<br />
                  06 75 78 63 35 · laboirebavard@gmail.com
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="facture-num" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: '#1a3220' }}>Facture {num}</div>
                <div className="facture-date" style={{ fontSize: '0.78rem', color: '#777', marginTop: 6 }}>
                  Émise le {fmtDate(dateFacture)}
                </div>
              </div>
            </div>

            {/* Client */}
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c4a050', marginBottom: 10 }}>Facturé à</p>
            <div className="client-box" style={{ background: '#f8f6f0', padding: '16px 20px', borderLeft: '3px solid #c4a050', marginBottom: 32 }}>
              <div className="client-name" style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', marginBottom: 4 }}>
                {prenom || nom ? `${prenom} ${nom}`.trim() : 'Nom du client'}
              </div>
              <div className="client-detail" style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.6 }}>
                {adresse && <>{adresse}<br /></>}
                {email && <>{email}</>}
              </div>
            </div>

            {/* Séjour */}
            {n > 0 && (
              <div className="sejour-bar" style={{ display: 'flex', gap: 32, marginBottom: 32, padding: '14px 20px', background: '#1a3220', color: '#fff' }}>
                {[
                  { label: 'Chambre', val: chambre },
                  { label: 'Arrivée', val: fmtDate(arrive) },
                  { label: 'Départ', val: fmtDate(depart) },
                  { label: 'Durée', val: `${n} nuit${n > 1 ? 's' : ''}` },
                  { label: 'Personnes', val: String(pers) },
                ].map(({ label, val }) => (
                  <div key={label} className="sejour-item">
                    <label style={{ fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(196,160,80,.8)', display: 'block', marginBottom: 3 }}>{label}</label>
                    <span style={{ fontSize: '0.9rem' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tableau */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #c4a050' }}>
                  {['Prestation', 'Qté', 'P.U.', 'Total'].map(h => (
                    <th key={h} style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', padding: '8px 0', textAlign: h === 'Total' || h === 'P.U.' || h === 'Qté' ? 'right' : 'left', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lignes.map((l, i) => (
                  <tr key={i}>
                    <td style={{ padding: '12px 0', fontSize: '0.85rem', borderBottom: '1px solid #eee', verticalAlign: 'top' }}>{l.label}</td>
                    <td style={{ padding: '12px 0', fontSize: '0.85rem', borderBottom: '1px solid #eee', textAlign: 'right', color: '#777' }}>{l.qty}</td>
                    <td style={{ padding: '12px 0', fontSize: '0.85rem', borderBottom: '1px solid #eee', textAlign: 'right', color: '#777' }}>{l.pu.toFixed(2)} €</td>
                    <td style={{ padding: '12px 0', fontSize: '0.85rem', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 500 }}>{l.total.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, #c4a050, transparent)', marginBottom: 16 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <table style={{ borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px 32px 6px 0', fontSize: '0.78rem', color: '#777' }}>Sous-total</td>
                    <td style={{ padding: '6px 0', fontSize: '0.78rem', textAlign: 'right', color: '#777' }}>{total.toFixed(2)} €</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 32px 14px 0', fontSize: '0.78rem', color: '#777' }}>TVA</td>
                    <td style={{ padding: '6px 0 14px', fontSize: '0.78rem', textAlign: 'right', color: '#777' }}>Non applicable</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #1a3220' }}>
                    <td style={{ padding: '14px 32px 0 0', fontSize: '1.1rem', fontFamily: 'Georgia, serif', color: '#1a3220', fontWeight: 400 }}>Total TTC</td>
                    <td style={{ padding: '14px 0 0', fontSize: '1.3rem', fontFamily: 'Georgia, serif', color: '#1a3220', textAlign: 'right' }}>{total.toFixed(2)} €</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Note */}
            {note && (
              <div className="note-box" style={{ background: '#f8f6f0', padding: '14px 18px', fontSize: '0.8rem', color: '#555', lineHeight: 1.6, marginTop: 28, borderLeft: '2px solid #ddd' }}>
                <strong style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>Note</strong><br />
                {note}
              </div>
            )}

            {/* Pied de page */}
            <div style={{ marginTop: 48, paddingTop: 20, borderTop: '1px solid #eee', fontSize: '0.7rem', color: '#aaa', textAlign: 'center', lineHeight: 1.8 }}>
              La Boire Bavard · 4 chemin de la Boire Bavard · 49320 Blaison-Saint-Sulpice<br />
              Sandrine · 06 75 78 63 35 · laboirebavard@gmail.com<br />
              Micro-entreprise · TVA non applicable — art. 293B du CGI
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', gap: 5,
}
const labelSpan: React.CSSProperties = {
  fontSize: '0.52rem', letterSpacing: '0.18em', textTransform: 'uppercase',
  color: 'rgba(196,160,80,.6)', fontFamily: 'Raleway, sans-serif',
}
const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,.06)',
  border: '1px solid rgba(196,160,80,.2)',
  color: '#fff',
  fontFamily: 'Raleway, sans-serif',
  fontSize: '0.82rem',
  padding: '8px 10px',
  borderRadius: 1,
  outline: 'none',
  width: '100%',
}
