'use client'

import { useEffect, useState } from 'react'

export default function BientotPage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Raleway:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body {
          min-height: 100vh;
          background: #0a130c;
          color: #f0e8d4;
          font-family: 'Raleway', sans-serif;
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          gap: 0;
        }

        /* Lueur de fond */
        .page::before {
          content: '';
          position: fixed;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(196,160,80,.05) 0%, transparent 65%);
          pointer-events: none;
          animation: breathe 6s ease-in-out infinite;
        }
        @keyframes breathe {
          0%,100% { opacity: .6; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 1; transform: translate(-50%,-50%) scale(1.12); }
        }

        /* Lucioles discrètes */
        .ff {
          position: fixed;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(196,160,80,.9) 0%, transparent 70%);
          pointer-events: none;
          opacity: 0;
          animation: ff var(--d) ease-in-out infinite var(--del);
        }
        @keyframes ff {
          0%   { opacity: 0; transform: translate(0,0); }
          20%  { opacity: .55; }
          80%  { opacity: .4; }
          100% { opacity: 0; transform: translate(var(--x), var(--y)); }
        }

        /* Contenu */
        .inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0;
          animation: up 1s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: none; }
        }

        /* Label */
        .label {
          font-size: .68rem;
          letter-spacing: .3em;
          text-transform: uppercase;
          color: rgba(196,160,80,.6);
          margin-bottom: 1.2rem;
          animation: up 1s cubic-bezier(.16,1,.3,1) both .1s;
        }

        /* Titre */
        h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 6vw, 3.4rem);
          font-weight: 400;
          line-height: 1.15;
          margin-bottom: .5rem;
          animation: up 1s cubic-bezier(.16,1,.3,1) both .18s;
        }
        h1 em {
          font-style: italic;
          color: #c4a050;
          display: block;
          font-size: .75em;
        }

        /* Ligne */
        .line {
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c4a050, transparent);
          margin: 1.8rem auto;
          animation: expand 1s ease forwards .5s;
        }
        @keyframes expand { to { width: 160px; } }

        /* ── Personnage SVG ── */
        .character {
          margin: .4rem 0 1.6rem;
          animation: up 1s cubic-bezier(.16,1,.3,1) both .3s;
        }

        /* Bras + pioche */
        .arm {
          transform-origin: 50px 46px;
          animation: swing 1.2s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes swing {
          0%   { transform: rotate(-35deg); }
          40%  { transform: rotate(20deg); }
          55%  { transform: rotate(22deg); }
          100% { transform: rotate(-35deg); }
        }

        /* Pierre tremble à l'impact */
        .rock {
          transform-origin: 118px 68px;
          animation: shake 1.2s ease-in-out infinite;
        }
        @keyframes shake {
          0%,38%,55%,100% { transform: translate(0,0); }
          44% { transform: translate(1.5px,-1px); }
          48% { transform: translate(-1px,.5px); }
        }

        /* Étincelles */
        .spark { animation: spark 1.2s ease-out infinite; opacity: 0; transform-origin: 118px 58px; }
        .s2 { animation-delay: .04s; }
        .s3 { animation-delay: .08s; }
        @keyframes spark {
          0%,38% { opacity: 0; transform: translate(0,0) scale(1); }
          43%    { opacity: 1; }
          100%   { opacity: 0; transform: translate(var(--sx,8px), var(--sy,-12px)) scale(0); }
        }

        /* Corps bounce */
        .body { animation: bounce 1.2s ease-in-out infinite; transform-origin: 50px 65px; }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          44%     { transform: translateY(2px); }
        }

        /* Bulle */
        .bubble {
          animation: float-bubble 3s ease-in-out infinite;
          transform-origin: 78px 18px;
        }
        @keyframes float-bubble {
          0%,100% { transform: translateY(0) rotate(-.4deg); }
          50%     { transform: translateY(-2.5px) rotate(.4deg); }
        }

        /* Description */
        .desc {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 1rem;
          color: rgba(240,232,212,.55);
          line-height: 1.8;
          max-width: 420px;
          margin-bottom: 2.4rem;
          animation: up 1s cubic-bezier(.16,1,.3,1) both .4s;
        }

        /* Contacts */
        .contacts {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .9rem;
          animation: up 1s cubic-bezier(.16,1,.3,1) both .5s;
        }
        .links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: .4rem 1.6rem;
        }
        .links a {
          color: rgba(240,232,212,.5);
          text-decoration: none;
          font-size: .82rem;
          display: flex;
          align-items: center;
          gap: .4rem;
          transition: color .2s;
        }
        .links a:hover { color: #c4a050; }

        .wa {
          display: inline-flex;
          align-items: center;
          gap: .55rem;
          padding: .6rem 1.6rem;
          border: 1px solid rgba(196,160,80,.35);
          color: #c4a050;
          font-size: .72rem;
          letter-spacing: .14em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background .2s, border-color .2s;
        }
        .wa:hover { background: rgba(196,160,80,.08); border-color: #c4a050; }
      `}</style>

      <div className="page">
        {/* Lucioles */}
        {mounted && [
          { s:6,  x:'18%', y:'65%', tx:'20px',  ty:'-90px',  d:'14s', del:'0s'   },
          { s:8,  x:'75%', y:'72%', tx:'-25px', ty:'-70px',  d:'17s', del:'3s'   },
          { s:5,  x:'88%', y:'45%', tx:'-15px', ty:'-110px', d:'12s', del:'6s'   },
          { s:7,  x:'10%', y:'55%', tx:'30px',  ty:'-80px',  d:'16s', del:'1.5s' },
        ].map((f,i) => (
          <div key={i} className="ff" style={{
            width: f.s, height: f.s, left: f.x, top: f.y,
            '--x': f.tx, '--y': f.ty, '--d': f.d, '--del': f.del,
          } as React.CSSProperties} />
        ))}

        <div className="inner">
          <p className="label">Chambre d'hôtes · Anjou · France</p>

          <h1>
            La Boire Bavard
            <em>Bientôt disponible</em>
          </h1>

          <div className="line" />

          {/* Personnage */}
          <div className="character">
            <svg width="200" height="120" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">

              {/* Pierre */}
              <g className="rock">
                <ellipse cx="120" cy="90" rx="22" ry="4" fill="rgba(0,0,0,.3)"/>
                <polygon points="98,88 104,64 116,56 134,58 144,70 140,88" fill="#182818" stroke="rgba(196,160,80,.3)" strokeWidth=".8"/>
                <polygon points="104,64 116,56 120,62 110,70" fill="rgba(196,160,80,.06)"/>
                <path d="M112,70 L118,62 L122,68" stroke="rgba(196,160,80,.2)" strokeWidth=".7" fill="none"/>
              </g>

              {/* Étincelles */}
              <circle className="spark s1" cx="116" cy="58" r="1.2" fill="#ffd700" style={{'--sx':'8px','--sy':'-12px'} as React.CSSProperties}/>
              <circle className="spark s2" cx="116" cy="58" r="1" fill="#ffaa00" style={{'--sx':'-6px','--sy':'-10px'} as React.CSSProperties}/>
              <circle className="spark s3" cx="116" cy="58" r=".8" fill="#fff" style={{'--sx':'12px','--sy':'-6px'} as React.CSSProperties}/>

              {/* Corps */}
              <g className="body">
                {/* Ombre */}
                <ellipse cx="50" cy="94" rx="14" ry="2.5" fill="rgba(0,0,0,.28)"/>
                {/* Jambes */}
                <rect x="44" y="80" width="6" height="14" rx="3" fill="#1a3820"/>
                <rect x="52" y="80" width="6" height="14" rx="3" fill="#1a3820"/>
                {/* Pieds */}
                <rect x="42" y="91" width="9" height="4" rx="2" fill="#231408"/>
                <rect x="51" y="91" width="9" height="4" rx="2" fill="#231408"/>

                {/* Tronc */}
                <rect x="40" y="55" width="22" height="28" rx="7" fill="#1a3820"/>

                {/* Bras gauche */}
                <rect x="28" y="59" width="13" height="5" rx="2.5" fill="#1a3820"/>
                <circle cx="26" cy="61" r="3.5" fill="#b87040"/>

                {/* Bras droit + pioche */}
                <g className="arm">
                  <rect x="60" y="53" width="5" height="15" rx="2.5" fill="#1a3820" transform="rotate(-10,62,58)"/>
                  {/* manche */}
                  <rect x="64" y="36" width="3.5" height="26" rx="1.5" fill="#6b3a10" transform="rotate(-38,66,48)"/>
                  {/* tête pioche */}
                  <path d="M80,20 L90,14 L93,22 L86,28 Z" fill="#6a7a6a" transform="rotate(-38,86,21)"/>
                  <path d="M86,28 L93,22 L98,28 L88,32 Z" fill="#8a9a8a" transform="rotate(-38,92,27)"/>
                </g>

                {/* Tête */}
                <circle cx="51" cy="40" r="16" fill="#b87040"/>
                <circle cx="46" cy="43" r="3.5" fill="rgba(200,100,60,.3)"/>
                <circle cx="56" cy="43" r="3.5" fill="rgba(200,100,60,.3)"/>
                {/* Yeux */}
                <ellipse cx="46" cy="38" rx="3" ry="3.5" fill="#111"/>
                <ellipse cx="56" cy="38" rx="3" ry="3.5" fill="#111"/>
                <circle cx="47" cy="37" r="1" fill="white"/>
                <circle cx="57" cy="37" r="1" fill="white"/>
                {/* Bouche */}
                <path d="M46,46 Q51,49 56,46" stroke="#7a3510" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                {/* Sourcils */}
                <path d="M42,34 L50,36" stroke="#6a3010" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M52,36 L60,34" stroke="#6a3010" strokeWidth="1.8" strokeLinecap="round"/>

                {/* Chapeau */}
                <path d="M35,36 L51,14 L67,36 Z" fill="#224422"/>
                <rect x="33" y="34" width="36" height="5" rx="2" fill="#1a3318"/>
                <rect x="35" y="36" width="32" height="2.5" rx="1" fill="rgba(196,160,80,.45)"/>

                {/* Plume */}
                <path d="M65,32 Q71,20 67,13 Q63,21 65,28" fill="rgba(196,160,80,.65)"/>

                {/* Bulle "Work in progress" */}
                <g className="bubble">
                  <polygon points="68,14 74,18 72,22" fill="#162614" stroke="rgba(196,160,80,.45)" strokeWidth=".7"/>
                  <rect x="72" y="3" width="72" height="17" rx="4.5" fill="#162614" stroke="rgba(196,160,80,.45)" strokeWidth=".7"/>
                  <text x="108" y="14.5" textAnchor="middle"
                    fontFamily="'Raleway', sans-serif"
                    fontSize="6.2" fontWeight="400"
                    fill="#c4a050" letterSpacing=".6">
                    Work in progress...
                  </text>
                </g>
              </g>
            </svg>
          </div>

          <p className="desc">
            Une maison d'hôtes de charme entre Angers et Saumur.<br/>
            Piscine · Spa · Petit-déjeuner gourmand · 4 chambres.
          </p>

          <div className="contacts">
            <div className="links">
              <a href="tel:+33675786335">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/>
                </svg>
                06 75 78 63 35
              </a>
              <a href="mailto:laboirebavard@gmail.com">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                laboirebavard@gmail.com
              </a>
            </div>
            <a className="wa" href="https://wa.me/33675786335" target="_blank" rel="noopener noreferrer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.096.538 4.07 1.482 5.797L0 24l6.39-1.467A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.213-3.793.87.937-3.665-.234-.376A9.82 9.82 0 012.182 12C2.182 6.573 6.573 2.182 12 2.182S21.818 6.573 21.818 12 17.427 21.818 12 21.818z"/>
              </svg>
              Écrire sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
