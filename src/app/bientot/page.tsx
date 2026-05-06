'use client'

const CHARS = 'Coming soon'.split('')
const LOOP  = 5.8   // durée totale d'un cycle (s)
const WRITE = 2.6   // durée de l'écriture (s)

export default function BientotPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@1,300&family=Raleway:wght@300;400&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{
          min-height:100vh;
          background:#080f09;
          color:#f0e8d4;
          font-family:'Raleway',sans-serif;
          overflow:hidden;
        }

        /* ─── Fond ─── */
        .page{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding:2.5rem 2rem;
          position:relative;
        }

        /* Vignette */
        .page::after{
          content:'';
          position:fixed;
          inset:0;
          background:radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(4,8,5,.7) 100%);
          pointer-events:none;
          z-index:0;
        }

        /* Lueur chaude centrale */
        .glow{
          position:fixed;
          top:52%;left:50%;
          transform:translate(-50%,-50%);
          width:800px;height:600px;
          border-radius:50%;
          background:radial-gradient(ellipse, rgba(196,160,80,.055) 0%, transparent 65%);
          pointer-events:none;
          animation:breathe 8s ease-in-out infinite;
          z-index:0;
        }
        @keyframes breathe{
          0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1);}
          50%    {opacity:1; transform:translate(-50%,-50%) scale(1.12);}
        }

        /* ─── Inner ─── */
        .inner{
          position:relative;
          z-index:1;
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
          gap:0;
        }

        .label{
          font-size:.62rem;
          letter-spacing:.34em;
          text-transform:uppercase;
          color:rgba(196,160,80,.5);
          margin-bottom:1rem;
          animation:fade-up .9s ease both;
        }
        h1{
          font-family:'Cormorant Garamond',serif;
          font-style:italic;
          font-weight:300;
          font-size:clamp(1.5rem,4vw,2.3rem);
          letter-spacing:.06em;
          color:rgba(240,232,212,.85);
          animation:fade-up .9s ease both .1s;
        }
        @keyframes fade-up{
          from{opacity:0;transform:translateY(16px);}
          to{opacity:1;transform:none;}
        }

        /* Ligne */
        .sep{
          display:flex;
          align-items:center;
          gap:.7rem;
          margin:1.5rem 0 2rem;
          animation:fade-up .9s ease both .2s;
          color:rgba(196,160,80,.35);
          font-size:.55rem;
        }
        .sep::before,.sep::after{
          content:'';
          width:60px;height:1px;
          background:linear-gradient(90deg,transparent,rgba(196,160,80,.35),transparent);
        }

        /* ─── Scène écriture ─── */
        .scene{
          position:relative;
          margin-bottom:2.4rem;
          animation:fade-up .9s ease both .28s;
          display:flex;
          align-items:flex-end;
          justify-content:center;
        }

        /* Wrap relatif : la plume est positionnée par rapport à lui */
        .wrap{
          position:relative;
          display:inline-flex;
          align-items:baseline;
        }

        /* ── Texte lettre par lettre ── */
        .cs{
          font-family:'Great Vibes',cursive;
          font-size:clamp(3rem,9vw,5.5rem);
          color:#e8dcc8;
          white-space:nowrap;
          display:flex;
          align-items:baseline;
          line-height:1;
          text-shadow:0 2px 40px rgba(196,160,80,.12);
        }
        .ch{
          display:inline-block;
          opacity:0;
          transform:translateY(6px) rotate(-4deg) scale(.88);
          animation:char-in .22s cubic-bezier(.34,1.56,.64,1) forwards;
          /* animation-delay est mis inline */
        }
        /* Espace */
        .sp{display:inline-block;width:.28em;opacity:0;animation:char-in .1s ease forwards;}

        @keyframes char-in{
          to{opacity:1;transform:none;}
        }

        /* Fade out de tout le texte à la fin du cycle */
        .cs{
          animation:text-loop ${LOOP}s ease infinite;
        }
        @keyframes text-loop{
          0%      {opacity:1;}
          ${Math.round((WRITE+1.4)/LOOP*100)}%  {opacity:1;}
          ${Math.round((WRITE+2.0)/LOOP*100)}%  {opacity:0;}
          99%     {opacity:0;}
          100%    {opacity:1;}
        }

        /* ── Plume ── */
        .feather{
          position:absolute;
          bottom:88%;
          left:0;
          transform:rotate(-42deg) translateX(-44%);
          transform-origin:bottom center;
          pointer-events:none;
          animation:feather-glide ${LOOP}s cubic-bezier(.4,0,.2,1) infinite,
                     feather-loop-opacity ${LOOP}s ease infinite;
          will-change:left;
        }
        @keyframes feather-glide{
          0%                                      {left:0%;}
          ${Math.round(WRITE/LOOP*100)}%          {left:100%;}
          ${Math.round((WRITE+1.9)/LOOP*100)}%    {left:100%;}
          ${Math.round((WRITE+2.0)/LOOP*100)}%    {left:100%;}
          99%                                     {left:0%;}
          100%                                    {left:0%;}
        }
        @keyframes feather-loop-opacity{
          0%                                      {opacity:1;}
          ${Math.round((WRITE+1.5)/LOOP*100)}%    {opacity:1;}
          ${Math.round((WRITE+1.9)/LOOP*100)}%    {opacity:0;}
          99%                                     {opacity:0;}
          100%                                    {opacity:1;}
        }

        /* Micro-vibration de la plume pendant l'écriture */
        .feather-inner{
          animation:quill-jitter .12s ease-in-out infinite;
        }
        @keyframes quill-jitter{
          0%,100%{transform:rotate(0deg) translateY(0);}
          50%    {transform:rotate(.8deg) translateY(-.4px);}
        }

        /* Point d'encre à la pointe */
        .nib-glow{
          position:absolute;
          bottom:-4px;left:50%;
          transform:translateX(-50%);
          width:5px;height:5px;
          border-radius:50%;
          background:#c4a050;
          box-shadow:0 0 10px 4px rgba(196,160,80,.5),
                     0 0 20px 6px rgba(196,160,80,.2);
          animation:nib-pulse .35s ease-in-out infinite;
        }
        @keyframes nib-pulse{
          0%,100%{transform:translateX(-50%) scale(1);opacity:.95;}
          50%    {transform:translateX(-50%) scale(1.7);opacity:.55;}
        }

        /* Traînée d'encre sous le texte */
        .ink-trail{
          position:absolute;
          bottom:-3px;
          left:0;
          height:1px;
          width:0;
          background:linear-gradient(90deg,rgba(196,160,80,.3),rgba(196,160,80,.08));
          animation:trail ${LOOP}s ease infinite;
        }
        @keyframes trail{
          0%                                   {width:0;opacity:1;}
          ${Math.round(WRITE/LOOP*100)}%       {width:100%;opacity:.6;}
          ${Math.round((WRITE+1.4)/LOOP*100)}% {width:100%;opacity:.4;}
          ${Math.round((WRITE+2)/LOOP*100)}%   {width:100%;opacity:0;}
          99%                                  {width:0;opacity:0;}
          100%                                 {width:0;opacity:1;}
        }

        /* ─── Desc ─── */
        .desc{
          font-family:'Cormorant Garamond',serif;
          font-style:italic;
          font-weight:300;
          font-size:.98rem;
          color:rgba(240,232,212,.42);
          line-height:2;
          max-width:360px;
          margin-bottom:2rem;
          animation:fade-up .9s ease both .45s;
          letter-spacing:.02em;
        }

        /* ─── Contacts ─── */
        .contacts{
          display:flex;
          flex-direction:column;
          align-items:center;
          gap:.8rem;
          animation:fade-up .9s ease both .55s;
        }
        .links{display:flex;flex-wrap:wrap;justify-content:center;gap:.35rem 1.4rem;}
        .links a{color:rgba(240,232,212,.38);text-decoration:none;font-size:.78rem;display:flex;align-items:center;gap:.4rem;transition:color .2s;letter-spacing:.02em;}
        .links a:hover{color:#c4a050;}
        .wa{
          display:inline-flex;align-items:center;gap:.5rem;
          padding:.55rem 1.5rem;
          border:1px solid rgba(196,160,80,.25);
          color:rgba(196,160,80,.8);
          font-size:.68rem;letter-spacing:.16em;text-transform:uppercase;
          text-decoration:none;
          transition:background .2s,border-color .2s,color .2s;
        }
        .wa:hover{background:rgba(196,160,80,.07);border-color:rgba(196,160,80,.6);color:#c4a050;}
      `}</style>

      <div className="page">
        <div className="glow" aria-hidden />

        <div className="inner">
          <p className="label">Chambre d'hôtes · Anjou · France</p>
          <h1>La Boire Bavard</h1>

          <div className="sep"><span>✦</span></div>

          {/* ── Scène plume ── */}
          <div className="scene">
            <div className="wrap">

              {/* Plume */}
              <div className="feather" aria-hidden>
                <div className="feather-inner">
                  <svg
                    viewBox="0 0 44 130"
                    width="44" height="130"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{filter:'drop-shadow(0 0 12px rgba(196,160,80,.22))'}}
                  >
                    {/* ── Vane arrière (plus sombre) ── */}
                    <path
                      d="M22,6 Q2,18 4,38 Q6,56 10,70 Q13,82 16,92 Q18,100 22,112
                         Q21,100 20,90 Q19,78 20,66 Q21,52 22,38 Q23,22 22,6 Z"
                      fill="rgba(180,140,50,.28)"
                    />
                    {/* ── Vane avant (plus lumineuse) ── */}
                    <path
                      d="M22,6 Q42,18 40,38 Q38,56 34,70 Q31,82 28,92 Q26,100 22,112
                         Q23,100 24,90 Q25,78 24,66 Q23,52 22,38 Q21,22 22,6 Z"
                      fill="rgba(210,170,70,.48)"
                    />
                    {/* ── Reflet lumineux sur vane droite ── */}
                    <path
                      d="M22,8 Q36,20 35,36 Q33,50 29,62 Q26,72 23,82"
                      stroke="rgba(255,240,180,.1)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {/* ── Barbules gauche ── */}
                    {[10,18,26,34,42,52,62,72,82].map((y,i) => (
                      <path key={`l${i}`}
                        d={`M22,${y} Q${22-10+i*.3},${y+5} ${22-13+i*.5},${y+9}`}
                        stroke="rgba(196,160,80,.22)"
                        strokeWidth=".7"
                        strokeLinecap="round"
                        fill="none"
                      />
                    ))}
                    {/* ── Barbules droite ── */}
                    {[10,18,26,34,42,52,62,72,82].map((y,i) => (
                      <path key={`r${i}`}
                        d={`M22,${y} Q${22+10-i*.3},${y+5} ${22+13-i*.5},${y+9}`}
                        stroke="rgba(196,160,80,.28)"
                        strokeWidth=".7"
                        strokeLinecap="round"
                        fill="none"
                      />
                    ))}
                    {/* ── Rachis (tige) ── */}
                    <path
                      d="M22,5 Q22.4,60 22,115"
                      stroke="#c4a050"
                      strokeWidth="1.1"
                      strokeLinecap="round"
                    />
                    {/* ── Calamus (tuyau creux) ── */}
                    <path
                      d="M20,96 Q19,106 22,120 Q25,106 24,96 Z"
                      fill="rgba(196,160,80,.55)"
                    />
                    <path
                      d="M21,108 Q20.5,114 22,122 Q23.5,114 23,108 Z"
                      fill="rgba(196,160,80,.8)"
                    />
                    {/* ── Pointe bec ── */}
                    <path
                      d="M21.2,118 Q20.5,124 22,130 Q23.5,124 22.8,118 Z"
                      fill="#c4a050"
                    />
                    {/* ── Bout de plume (tip) ── */}
                    <path
                      d="M22,4 Q26,1 28,5 Q24,8 22,6 Q20,8 16,5 Q18,1 22,4 Z"
                      fill="rgba(196,160,80,.5)"
                    />
                  </svg>
                  <div className="nib-glow" />
                </div>
              </div>

              {/* Texte Coming soon */}
              <div className="cs" aria-label="Coming soon">
                {CHARS.map((ch, i) =>
                  ch === ' '
                    ? <span key={i} className="sp" style={{animationDelay:`${i*(WRITE/CHARS.length)}s`,animationIterationCount:'infinite',animationDuration:`${LOOP}s`}}>&nbsp;</span>
                    : <span key={i} className="ch" style={{
                        animationDelay:`${i*(WRITE/CHARS.length)}s`,
                        animationIterationCount:'infinite',
                        animationDuration:`${LOOP}s`,
                      }}>{ch}</span>
                )}
              </div>

              {/* Traînée d'encre */}
              <div className="ink-trail" aria-hidden />
            </div>
          </div>

          <p className="desc">
            Maison d'hôtes de charme entre Angers et Saumur.<br />
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
