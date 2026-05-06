'use client'

export default function BientotPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400&family=Raleway:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { min-height: 100vh; background: #09110b; color: #f0e8d4; font-family: 'Raleway', sans-serif; overflow: hidden; }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding: 3rem 2rem;
        }

        /* Lueur ambiante */
        .page::before {
          content: '';
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(196,160,80,.04) 0%, transparent 68%);
          pointer-events: none;
          animation: breathe 7s ease-in-out infinite;
        }
        @keyframes breathe {
          0%,100% { transform: translate(-50%,-50%) scale(1); opacity:.6; }
          50%      { transform: translate(-50%,-50%) scale(1.15); opacity:1; }
        }

        .inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          animation: fade-up 1s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes fade-up {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:none; }
        }

        .label {
          font-size: .65rem;
          letter-spacing: .32em;
          text-transform: uppercase;
          color: rgba(196,160,80,.55);
          margin-bottom: 1.1rem;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(1.6rem, 4.5vw, 2.6rem);
          font-weight: 400;
          color: #f0e8d4;
          letter-spacing: .02em;
          margin-bottom: 0;
        }

        .gold-line {
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #c4a050, transparent);
          margin: 1.6rem auto 2.2rem;
          animation: line-grow 1s ease forwards .6s;
        }
        @keyframes line-grow { to { width: 140px; } }

        /* ══════════════════════════════════
           SCÈNE PLUME + TEXTE
        ══════════════════════════════════ */
        .writing-scene {
          position: relative;
          margin-bottom: 2.4rem;
          height: 110px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        /* Wrap texte + plume ensemble */
        .writing-wrap {
          position: relative;
          display: inline-block;
        }

        /* Texte "Coming soon" révélé gauche → droite */
        .cs-text {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: clamp(2.4rem, 7vw, 4rem);
          font-weight: 400;
          color: #e8dccc;
          white-space: nowrap;
          display: block;
          /* clip-path reveal */
          clip-path: inset(0 100% 0 0);
          animation: text-reveal 3.2s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes text-reveal {
          0%          { clip-path: inset(0 100% 0 0); opacity:1; }
          55%         { clip-path: inset(0 0% 0 0);   opacity:1; }
          80%         { clip-path: inset(0 0% 0 0);   opacity:1; }
          92%         { clip-path: inset(0 0% 0 0);   opacity:0; }
          100%        { clip-path: inset(0 100% 0 0); opacity:0; }
        }

        /* Conteneur de la plume — se déplace de gauche à droite */
        .feather-wrap {
          position: absolute;
          bottom: calc(100% - 8px);
          left: 0;
          transform: translateX(-42%) rotate(-38deg);
          transform-origin: bottom center;
          pointer-events: none;
          animation: feather-move 3.2s cubic-bezier(.4,0,.2,1) infinite,
                     feather-jiggle 0.18s ease-in-out infinite;
        }
        @keyframes feather-move {
          0%          { left: 0%;   opacity:1; }
          55%         { left: 100%; opacity:1; }
          80%         { left: 100%; opacity:1; }
          92%         { left: 100%; opacity:0; }
          100%        { left: 0%;   opacity:0; }
        }
        /* Micro-tremblement pendant l'écriture */
        @keyframes feather-jiggle {
          0%,100% { rotate: 0deg; }
          50%     { rotate: 1.5deg; }
        }

        /* Encre au bout de la plume */
        .ink-dot {
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #c4a050;
          box-shadow: 0 0 6px 2px rgba(196,160,80,.5);
          animation: ink-pulse .4s ease-in-out infinite;
        }
        @keyframes ink-pulse {
          0%,100% { transform: translateX(-50%) scale(1); opacity:.9; }
          50%     { transform: translateX(-50%) scale(1.6); opacity:.5; }
        }

        /* ── SVG Plume ── */
        .feather-svg { display: block; filter: drop-shadow(0 0 8px rgba(196,160,80,.25)); }

        .desc {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: .95rem;
          color: rgba(240,232,212,.48);
          line-height: 1.9;
          max-width: 380px;
          margin-bottom: 2.2rem;
          animation: fade-up 1s cubic-bezier(.16,1,.3,1) both .35s;
        }

        .contacts {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: .85rem;
          animation: fade-up 1s cubic-bezier(.16,1,.3,1) both .48s;
        }
        .links { display:flex; flex-wrap:wrap; justify-content:center; gap:.4rem 1.4rem; }
        .links a { color:rgba(240,232,212,.45); text-decoration:none; font-size:.8rem; display:flex; align-items:center; gap:.4rem; transition:color .2s; }
        .links a:hover { color:#c4a050; }
        .wa { display:inline-flex; align-items:center; gap:.5rem; padding:.58rem 1.5rem; border:1px solid rgba(196,160,80,.3); color:#c4a050; font-size:.7rem; letter-spacing:.15em; text-transform:uppercase; text-decoration:none; transition:background .2s,border-color .2s; }
        .wa:hover { background:rgba(196,160,80,.07); border-color:#c4a050; }
      `}</style>

      <div className="page">
        <div className="inner">
          <p className="label">Chambre d'hôtes · Anjou · France</p>
          <h1>La Boire Bavard</h1>
          <div className="gold-line" />

          {/* Animation plume */}
          <div className="writing-scene">
            <div className="writing-wrap">

              {/* Plume animée */}
              <div className="feather-wrap">
                <svg
                  className="feather-svg"
                  viewBox="0 0 38 108"
                  width="38" height="108"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Vane gauche */}
                  <path
                    d="M19,4 Q3,16 5,34 Q7,50 11,62 Q13,72 15,80 Q16,86 19,94
                       Q18,86 17,78 Q16,68 17,58 Q18,46 19,34 Q20,20 19,4 Z"
                    fill="rgba(196,160,80,.38)"
                  />
                  {/* Vane droite */}
                  <path
                    d="M19,4 Q35,16 33,34 Q31,50 27,62 Q25,72 23,80 Q22,86 19,94
                       Q20,86 21,78 Q22,68 21,58 Q20,46 19,34 Q18,20 19,4 Z"
                    fill="rgba(196,160,80,.55)"
                  />
                  {/* Détails barbules gauche */}
                  {[14,22,30,38,46,54,62].map((y,i) => (
                    <line key={i}
                      x1={19} y1={y}
                      x2={19 - 8 + i * .4} y2={y + 6}
                      stroke="rgba(196,160,80,.2)" strokeWidth=".7"
                    />
                  ))}
                  {/* Détails barbules droite */}
                  {[14,22,30,38,46,54,62].map((y,i) => (
                    <line key={i}
                      x1={19} y1={y}
                      x2={19 + 8 - i * .4} y2={y + 6}
                      stroke="rgba(196,160,80,.25)" strokeWidth=".7"
                    />
                  ))}
                  {/* Rachis (tige centrale) */}
                  <path
                    d="M19,4 Q19.5,48 19,94"
                    stroke="#c4a050"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                  {/* Calamus (tuyau de la plume) */}
                  <path
                    d="M18,82 Q17,90 19,100 Q21,90 20,82 Z"
                    fill="rgba(196,160,80,.7)"
                  />
                  {/* Pointe (bec) */}
                  <path
                    d="M19,96 Q18.2,102 19,108 Q19.8,102 19,96 Z"
                    fill="#c4a050"
                  />
                  {/* Reflet sur la vane */}
                  <path
                    d="M19,8 Q26,18 25,32 Q23,44 21,54"
                    stroke="rgba(255,240,180,.12)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="ink-dot" />
              </div>

              {/* Texte Coming soon */}
              <span className="cs-text">Coming soon</span>
            </div>
          </div>

          <p className="desc">
            Une maison d'hôtes de charme entre Angers et Saumur.<br />
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
