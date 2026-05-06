'use client'

import { useEffect, useState } from 'react'

export default function BientotPage() {
  const [mounted, setMounted] = useState(false)
  const [glyphIdx, setGlyphIdx] = useState(0)

  useEffect(() => {
    setMounted(true)
    const t = setInterval(() => setGlyphIdx(i => (i + 1) % 6), 2800)
    return () => clearInterval(t)
  }, [])

  const glyphs = ['᛭', 'ᚨ', 'ᚦ', 'ᚢ', 'ᚾ', 'ᛗ']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Raleway:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          min-height: 100vh;
          background: #07100a;
          color: #f0e8d4;
          font-family: 'Raleway', sans-serif;
          overflow-x: hidden;
        }

        /* ── Fond texturé ── */
        .scene {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background:
            radial-gradient(ellipse 70% 55% at 50% 60%, #0f2415 0%, transparent 70%),
            radial-gradient(ellipse 100% 80% at 50% 100%, #0c1a0e 0%, transparent 60%),
            #07100a;
        }

        /* ── Grille médiévale floutée en fond ── */
        .scene::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(196,160,80,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,160,80,.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* ── Lucioles ── */
        .firefly {
          position: fixed;
          border-radius: 50%;
          background: radial-gradient(circle, #d4b862 0%, transparent 65%);
          pointer-events: none;
          animation: fly var(--dur, 12s) ease-in-out infinite var(--delay, 0s);
          opacity: 0;
          z-index: 0;
        }
        @keyframes fly {
          0%   { transform: translate(0,0) scale(.6); opacity: 0; }
          15%  { opacity: .7; }
          50%  { transform: translate(var(--tx,30px), var(--ty,-60px)) scale(1); opacity: .5; }
          85%  { opacity: .6; }
          100% { transform: translate(var(--tx2,10px), var(--ty2,-120px)) scale(.4); opacity: 0; }
        }

        /* ── Cadre principal ── */
        .frame {
          position: relative;
          z-index: 1;
          width: min(680px, 94vw);
          animation: appear 1.2s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes appear {
          from { opacity: 0; transform: translateY(32px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }

        /* ── Parchemin ── */
        .scroll {
          background:
            linear-gradient(180deg, #1a2c1c 0%, #162214 40%, #111b12 100%);
          border: 1px solid rgba(196,160,80,.35);
          box-shadow:
            0 0 0 4px rgba(196,160,80,.08),
            0 0 0 8px rgba(196,160,80,.04),
            inset 0 1px 0 rgba(196,160,80,.12),
            0 32px 80px rgba(0,0,0,.7),
            0 0 60px rgba(196,160,80,.04);
          padding: 0 2.4rem 2.8rem;
          position: relative;
        }

        /* ── Coins ornementaux ── */
        .corner {
          position: absolute;
          width: 52px;
          height: 52px;
          pointer-events: none;
        }
        .corner svg { width: 100%; height: 100%; }
        .corner-tl { top: -1px; left: -1px; }
        .corner-tr { top: -1px; right: -1px; transform: scaleX(-1); }
        .corner-bl { bottom: -1px; left: -1px; transform: scaleY(-1); }
        .corner-br { bottom: -1px; right: -1px; transform: scale(-1); }

        /* ── Flambeaux ── */
        .torches {
          display: flex;
          justify-content: space-between;
          padding: 0 .5rem;
          position: relative;
          top: -24px;
          margin-bottom: -10px;
        }
        .torch {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
        }
        .torch-flame {
          width: 20px;
          height: 32px;
          position: relative;
        }
        .flame-inner {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 24px;
          background: linear-gradient(180deg, #ffd700 0%, #ff8c00 50%, #c4501a 100%);
          border-radius: 50% 50% 30% 30%;
          animation: flicker 1.4s ease-in-out infinite;
          transform-origin: bottom center;
          filter: blur(1px);
        }
        .flame-outer {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 30px;
          background: linear-gradient(180deg, rgba(255,165,0,.3) 0%, rgba(255,69,0,.15) 60%, transparent 100%);
          border-radius: 50% 50% 30% 30%;
          animation: flicker 1.8s ease-in-out infinite .3s;
          transform-origin: bottom center;
          filter: blur(3px);
        }
        .flame-glow {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(255,140,0,.2) 0%, transparent 70%);
          animation: glow-pulse 1.4s ease-in-out infinite;
        }
        @keyframes flicker {
          0%, 100% { transform: translateX(-50%) scaleX(1) scaleY(1) rotate(-1deg); }
          25%       { transform: translateX(-50%) scaleX(.85) scaleY(1.08) rotate(2deg); }
          50%       { transform: translateX(-50%) scaleX(1.08) scaleY(.95) rotate(-2deg); }
          75%       { transform: translateX(-50%) scaleX(.9) scaleY(1.05) rotate(1deg); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: .6; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1; transform: translateX(-50%) scale(1.3); }
        }
        .torch-body {
          width: 8px;
          height: 28px;
          background: linear-gradient(180deg, #8b6914 0%, #5c3d0a 100%);
          border-radius: 2px 2px 0 0;
          box-shadow: inset -2px 0 4px rgba(0,0,0,.4);
        }
        .torch-base {
          width: 14px;
          height: 5px;
          background: rgba(196,160,80,.5);
          border-radius: 0 0 3px 3px;
        }

        /* ── Bannière de titre ── */
        .banner {
          background: linear-gradient(90deg, transparent, rgba(196,160,80,.07), transparent);
          border-top: 1px solid rgba(196,160,80,.2);
          border-bottom: 1px solid rgba(196,160,80,.2);
          padding: 1rem 1.5rem;
          text-align: center;
          margin-bottom: 2rem;
          position: relative;
        }
        .banner::before, .banner::after {
          content: '✦';
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(196,160,80,.45);
          font-size: .7rem;
        }
        .banner::before { left: 1rem; }
        .banner::after  { right: 1rem; }

        /* ── Glyphe runique ── */
        .rune-container {
          text-align: center;
          margin-bottom: 1.2rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rune {
          font-size: 2rem;
          color: rgba(196,160,80,.6);
          animation: rune-in .6s ease both;
          text-shadow: 0 0 20px rgba(196,160,80,.4);
        }
        @keyframes rune-in {
          from { opacity: 0; transform: scale(.7) rotate(-10deg); filter: blur(4px); }
          to   { opacity: 1; transform: none; filter: none; }
        }

        /* ── Typographie ── */
        .inn-label {
          font-family: 'Raleway', sans-serif;
          font-weight: 300;
          font-size: .7rem;
          letter-spacing: .35em;
          text-transform: uppercase;
          color: rgba(196,160,80,.7);
          text-align: center;
          margin-bottom: .6rem;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.8rem, 5vw, 3rem);
          font-weight: 400;
          text-align: center;
          line-height: 1.2;
          color: #f0e8d4;
          text-shadow: 0 2px 20px rgba(196,160,80,.15);
        }
        h1 em {
          font-style: italic;
          color: #c4a050;
          display: block;
          font-size: .82em;
        }

        /* ── Diviseur ── */
        .divider {
          display: flex;
          align-items: center;
          gap: .8rem;
          margin: 1.6rem 0;
          color: rgba(196,160,80,.35);
          font-size: .65rem;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196,160,80,.3), transparent);
        }

        /* ── Description ── */
        .desc {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1rem;
          color: rgba(240,232,212,.65);
          text-align: center;
          line-height: 1.8;
          margin-bottom: 1.8rem;
        }

        /* ── Badges stats ── */
        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: .8rem;
          margin-bottom: 1.8rem;
        }
        .stat {
          background: rgba(196,160,80,.06);
          border: 1px solid rgba(196,160,80,.15);
          padding: .8rem .5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .stat::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(196,160,80,.04) 0%, transparent 60%);
        }
        .stat-val {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          color: #c4a050;
          display: block;
        }
        .stat-lbl {
          font-size: .65rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(240,232,212,.4);
        }

        /* ── Sceau animé ── */
        .seal {
          display: flex;
          justify-content: center;
          margin: 1.6rem 0;
        }
        .seal-ring {
          width: 64px;
          height: 64px;
          border: 1px solid rgba(196,160,80,.35);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          animation: seal-rotate 20s linear infinite;
        }
        .seal-ring::before {
          content: '';
          position: absolute;
          inset: 4px;
          border: 1px dashed rgba(196,160,80,.2);
          border-radius: 50%;
          animation: seal-rotate 8s linear infinite reverse;
        }
        @keyframes seal-rotate {
          to { transform: rotate(360deg); }
        }
        .seal-inner {
          font-size: 1.4rem;
          animation: seal-rotate 20s linear infinite reverse;
        }

        /* ── Contacts ── */
        .contact-row {
          border-top: 1px solid rgba(196,160,80,.15);
          padding-top: 1.6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .7rem;
        }
        .contact-hint {
          font-size: .68rem;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: rgba(240,232,212,.35);
        }
        .contact-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: .5rem 1.4rem;
        }
        .contact-links a {
          color: rgba(240,232,212,.65);
          text-decoration: none;
          font-size: .85rem;
          display: flex;
          align-items: center;
          gap: .4rem;
          transition: color .2s;
        }
        .contact-links a:hover { color: #c4a050; }

        .wa-btn {
          display: inline-flex;
          align-items: center;
          gap: .6rem;
          margin-top: .4rem;
          padding: .65rem 1.8rem;
          border: 1px solid rgba(196,160,80,.4);
          color: #c4a050;
          font-size: .75rem;
          letter-spacing: .15em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background .25s, border-color .25s, box-shadow .25s;
          position: relative;
          overflow: hidden;
        }
        .wa-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(196,160,80,.08) 0%, transparent 60%);
        }
        .wa-btn:hover {
          background: rgba(196,160,80,.1);
          border-color: #c4a050;
          box-shadow: 0 0 20px rgba(196,160,80,.12);
          color: #d4b460;
        }

        @media (max-width: 480px) {
          .stats { grid-template-columns: repeat(3,1fr); }
          .stat-val { font-size: .95rem; }
          .scroll { padding: 0 1.4rem 2rem; }
        }
      `}</style>

      <div className="scene">
        {/* Lucioles */}
        {mounted && [
          { s: 10, x: '15%', y: '70%', tx: '25px', ty: '-80px', tx2: '-10px', ty2: '-150px', dur: '11s', delay: '0s' },
          { s: 14, x: '30%', y: '80%', tx: '-35px', ty: '-65px', tx2: '20px', ty2: '-130px', dur: '15s', delay: '2s' },
          { s:  8, x: '50%', y: '65%', tx: '15px',  ty: '-90px', tx2: '-5px',  ty2: '-160px', dur: '13s', delay: '4.5s' },
          { s: 12, x: '68%', y: '75%', tx: '-20px', ty: '-70px', tx2: '30px', ty2: '-140px', dur: '17s', delay: '1s' },
          { s: 16, x: '82%', y: '60%', tx: '10px',  ty: '-100px',tx2: '-15px', ty2: '-180px', dur: '14s', delay: '6s' },
          { s:  9, x: '92%', y: '85%', tx: '-30px', ty: '-55px', tx2: '5px',  ty2: '-110px', dur: '12s', delay: '3s' },
          { s: 11, x: '5%',  y: '50%', tx: '40px',  ty: '-75px', tx2: '-20px', ty2: '-145px', dur: '16s', delay: '8s' },
        ].map((f, i) => (
          <div
            key={i}
            className="firefly"
            style={{
              width: f.s, height: f.s,
              left: f.x, top: f.y,
              '--tx': f.tx, '--ty': f.ty,
              '--tx2': f.tx2, '--ty2': f.ty2,
              '--dur': f.dur, '--delay': f.delay,
            } as React.CSSProperties}
          />
        ))}

        <div className="frame">
          {/* Flambeaux */}
          <div className="torches">
            {[0, 1].map(i => (
              <div key={i} className="torch">
                <div className="torch-flame">
                  <div className="flame-glow" />
                  <div className="flame-outer" />
                  <div className="flame-inner" style={{ animationDelay: i === 1 ? '.5s' : '0s' }} />
                </div>
                <div className="torch-body" />
                <div className="torch-base" />
              </div>
            ))}
          </div>

          {/* Parchemin */}
          <div className="scroll">
            {/* Coins */}
            {['corner-tl','corner-tr','corner-bl','corner-br'].map(cls => (
              <div key={cls} className={`corner ${cls}`}>
                <svg viewBox="0 0 52 52" fill="none">
                  <path d="M2 2 L20 2 L2 20 Z" fill="rgba(196,160,80,.12)" stroke="rgba(196,160,80,.5)" strokeWidth=".8"/>
                  <path d="M2 2 L8 2 L2 8 Z" fill="rgba(196,160,80,.3)"/>
                  <circle cx="20" cy="2" r="1.5" fill="rgba(196,160,80,.6)"/>
                  <circle cx="2" cy="20" r="1.5" fill="rgba(196,160,80,.6)"/>
                  <path d="M12 2 Q2 2 2 12" stroke="rgba(196,160,80,.35)" strokeWidth=".8" fill="none"/>
                </svg>
              </div>
            ))}

            {/* Bannière */}
            <div className="banner">
              <p className="inn-label">Auberge de charme · Anjou · France</p>
              <h1>
                La Boire Bavard
                <em>Bientôt disponible</em>
              </h1>
            </div>

            {/* Glyphe runique animé */}
            <div className="rune-container">
              <span key={glyphIdx} className="rune">{glyphs[glyphIdx]}</span>
            </div>

            <p className="desc">
              Une maison d'hôtes de charme entre Angers et Saumur.<br />
              Piscine chauffée · Spa · Petit-déjeuner gourmand · 4 chambres.
            </p>

            {/* Stats */}
            <div className="stats">
              <div className="stat">
                <span className="stat-val">88 €</span>
                <span className="stat-lbl">/ nuit pdj inclus</span>
              </div>
              <div className="stat">
                <span className="stat-val">9.9⁄10</span>
                <span className="stat-lbl">note Booking</span>
              </div>
              <div className="stat">
                <span className="stat-val">4</span>
                <span className="stat-lbl">chambres uniques</span>
              </div>
            </div>

            <div className="divider">
              <span>✦ &nbsp; ✦ &nbsp; ✦</span>
            </div>

            {/* Sceau */}
            <div className="seal">
              <div className="seal-ring">
                <span className="seal-inner">⚜</span>
              </div>
            </div>

            <div className="divider">
              <span>✦ &nbsp; ✦ &nbsp; ✦</span>
            </div>

            {/* Contact */}
            <div className="contact-row">
              <span className="contact-hint">Prendre contact dès maintenant</span>
              <div className="contact-links">
                <a href="tel:+33675786335">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/>
                  </svg>
                  06 75 78 63 35
                </a>
                <a href="mailto:laboirebavard@gmail.com">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  laboirebavard@gmail.com
                </a>
              </div>
              <a className="wa-btn" href="https://wa.me/33675786335" target="_blank" rel="noopener noreferrer">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.538 4.07 1.482 5.797L0 24l6.39-1.467A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.213-3.793.87.937-3.665-.234-.376A9.82 9.82 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
                </svg>
                Écrire sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
