'use client'

const CHARS = 'Coming soon'.split('')

export default function BientotPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:ital,wght@1,300&family=Raleway:wght@300;400&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{
          min-height:100vh;
          background:#07100a;
          color:#f0e8d4;
          font-family:'Raleway',sans-serif;
          overflow:hidden;
        }

        .page{
          min-height:100vh;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding:2rem 2rem 3rem;
          position:relative;
        }

        /* Vignette */
        .vignette{
          position:fixed;inset:0;
          background:radial-gradient(ellipse 75% 65% at 50% 50%, transparent 25%, rgba(3,7,4,.75) 100%);
          pointer-events:none;z-index:0;
        }

        /* Lueur ambiante */
        .glow{
          position:fixed;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:900px;height:700px;
          border-radius:50%;
          background:radial-gradient(ellipse, rgba(196,160,80,.045) 0%, transparent 62%);
          pointer-events:none;z-index:0;
          animation:breathe 9s ease-in-out infinite;
        }
        @keyframes breathe{
          0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5;}
          50%    {transform:translate(-50%,-50%) scale(1.14);opacity:1;}
        }

        .inner{
          position:relative;z-index:1;
          display:flex;flex-direction:column;
          align-items:center;text-align:center;
        }

        /* Label */
        .label{
          font-size:.6rem;letter-spacing:.36em;text-transform:uppercase;
          color:rgba(196,160,80,.45);margin-bottom:.9rem;
          animation:rise .9s ease both;
        }
        /* Titre */
        .title{
          font-family:'Cormorant Garamond',serif;
          font-style:italic;font-weight:300;
          font-size:clamp(1.4rem,4vw,2.2rem);
          letter-spacing:.06em;color:rgba(240,232,212,.8);
          animation:rise .9s ease both .1s;
        }
        @keyframes rise{
          from{opacity:0;transform:translateY(14px);}
          to{opacity:1;transform:none;}
        }

        /* Ligne */
        .sep{
          width:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(196,160,80,.4),transparent);
          margin:1.4rem auto 0;
          animation:grow-line 1s ease forwards .55s;
        }
        @keyframes grow-line{to{width:120px;}}

        /* ═══════════════════════════
           PLUME CENTRALE
        ═══════════════════════════ */
        .feather-stage{
          position:relative;
          margin: .6rem 0 0;
          height:180px;
          display:flex;
          align-items:flex-end;
          justify-content:center;
          animation:rise .9s ease both .2s;
        }

        /* La plume flotte doucement */
        .feather-float{
          animation:float 5s ease-in-out infinite;
          filter:drop-shadow(0 8px 24px rgba(196,160,80,.18));
        }
        @keyframes float{
          0%,100%{transform:translateY(0) rotate(-2deg);}
          50%    {transform:translateY(-10px) rotate(2deg);}
        }

        /* Goutte d'encre qui tombe de la pointe */
        .ink-drop{
          position:absolute;
          bottom:0;left:50%;
          transform:translateX(-50%);
          width:4px;height:4px;
          border-radius:50% 50% 40% 40%;
          background:#c4a050;
          box-shadow:0 0 8px 3px rgba(196,160,80,.45);
          animation:drip 3.5s ease-in infinite 1.2s;
          opacity:0;
        }
        @keyframes drip{
          0%  {opacity:0;transform:translateX(-50%) translateY(0) scaleY(.6);}
          8%  {opacity:1;transform:translateX(-50%) translateY(0) scaleY(1);}
          55% {opacity:.7;transform:translateX(-50%) translateY(22px) scaleY(1.3) scaleX(.7);}
          80% {opacity:0;transform:translateX(-50%) translateY(30px) scaleY(.3) scaleX(1.8);}
          100%{opacity:0;transform:translateX(-50%) translateY(30px);}
        }

        /* ═══════════════════════════
           TEXTE COMING SOON
        ═══════════════════════════ */
        .cs-wrap{
          position:relative;
          margin-top:0;
          animation:rise .9s ease both .3s;
        }
        .cs{
          font-family:'Great Vibes',cursive;
          font-size:clamp(3.2rem,10vw,6rem);
          color:#e8dcc8;
          white-space:nowrap;
          display:flex;align-items:baseline;
          line-height:1;
          text-shadow:0 4px 40px rgba(196,160,80,.08);
        }
        /* Chaque lettre sort du flou comme de l'encre qui se dépose */
        .ch{
          display:inline-block;
          opacity:0;
          filter:blur(10px);
          transform:scale(.92) translateY(4px);
          animation:ink-appear .55s cubic-bezier(.22,1,.36,1) forwards;
        }
        .sp{display:inline-block;width:.22em;}
        @keyframes ink-appear{
          to{opacity:1;filter:blur(0);transform:none;}
        }

        /* Sous-ligne en or qui se dessine */
        .underline{
          height:1px;width:0;margin:0 auto;
          background:linear-gradient(90deg,transparent,rgba(196,160,80,.35),transparent);
          animation:draw-line 1.4s ease forwards;
        }
        @keyframes draw-line{to{width:85%;}}

        /* ═══════════════════════════
           RESTE
        ═══════════════════════════ */
        .desc{
          font-family:'Cormorant Garamond',serif;
          font-style:italic;font-weight:300;
          font-size:.96rem;letter-spacing:.025em;
          color:rgba(240,232,212,.4);
          line-height:2;max-width:340px;
          margin-top:1.6rem;margin-bottom:1.8rem;
          animation:rise .9s ease both .55s;
        }

        .contacts{
          display:flex;flex-direction:column;
          align-items:center;gap:.75rem;
          animation:rise .9s ease both .65s;
        }
        .links{display:flex;flex-wrap:wrap;justify-content:center;gap:.3rem 1.3rem;}
        .links a{
          color:rgba(240,232,212,.35);text-decoration:none;
          font-size:.76rem;display:flex;align-items:center;gap:.38rem;
          transition:color .2s;letter-spacing:.02em;
        }
        .links a:hover{color:#c4a050;}
        .wa{
          display:inline-flex;align-items:center;gap:.5rem;
          padding:.52rem 1.4rem;
          border:1px solid rgba(196,160,80,.22);
          color:rgba(196,160,80,.75);
          font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;
          text-decoration:none;
          transition:all .2s;
        }
        .wa:hover{background:rgba(196,160,80,.06);border-color:rgba(196,160,80,.55);color:#c4a050;}
      `}</style>

      <div className="page">
        <div className="vignette" aria-hidden />
        <div className="glow"    aria-hidden />

        <div className="inner">
          <p className="label">Chambre d'hôtes · Anjou · France</p>
          <h1 className="title">La Boire Bavard</h1>
          <div className="sep" />

          {/* ── Plume flottante ── */}
          <div className="feather-stage">
            <div className="feather-float">
              <svg viewBox="0 0 60 172" width="60" height="172" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Vane arrière */}
                <path
                  d="M30,5 Q6,20 8,44 Q10,64 15,80 Q19,94 23,108 Q26,120 30,140
                     Q29,122 28,106 Q27,90 28,72 Q29,54 30,36 Q31,18 30,5 Z"
                  fill="rgba(172,132,42,.3)"
                />
                {/* Vane avant */}
                <path
                  d="M30,5 Q54,20 52,44 Q50,64 45,80 Q41,94 37,108 Q34,120 30,140
                     Q31,122 32,106 Q33,90 32,72 Q31,54 30,36 Q29,18 30,5 Z"
                  fill="rgba(210,168,65,.52)"
                />
                {/* Reflet */}
                <path d="M30,7 Q46,22 44,40 Q42,56 38,70 Q35,82 32,94"
                  stroke="rgba(255,240,185,.09)" strokeWidth="5" strokeLinecap="round"/>
                {/* Barbules gauche */}
                {[10,18,28,38,50,62,76,90,104,116].map((y,i)=>(
                  <path key={`bl${i}`}
                    d={`M30,${y} Q${30-8+i*.2},${y+6} ${30-11+i*.3},${y+11}`}
                    stroke="rgba(196,160,80,.2)" strokeWidth=".65" strokeLinecap="round" fill="none"/>
                ))}
                {/* Barbules droite */}
                {[10,18,28,38,50,62,76,90,104,116].map((y,i)=>(
                  <path key={`br${i}`}
                    d={`M30,${y} Q${30+8-i*.2},${y+6} ${30+11-i*.3},${y+11}`}
                    stroke="rgba(196,160,80,.26)" strokeWidth=".65" strokeLinecap="round" fill="none"/>
                ))}
                {/* Rachis */}
                <path d="M30,4 Q30.5,88 30,145"
                  stroke="#c4a050" strokeWidth="1.1" strokeLinecap="round"/>
                {/* Calamus */}
                <path d="M28.5,128 Q27,140 30,158 Q33,140 31.5,128 Z"
                  fill="rgba(196,160,80,.6)"/>
                {/* Bec */}
                <path d="M29.2,153 Q28,161 30,170 Q32,161 30.8,153 Z"
                  fill="#c4a050"/>
                {/* Tip */}
                <path d="M30,3 Q35,0 37,4 Q32,8 30,6 Q28,8 23,4 Q25,0 30,3 Z"
                  fill="rgba(196,160,80,.45)"/>
              </svg>
            </div>
            <div className="ink-drop" aria-hidden />
          </div>

          {/* ── Coming soon ── */}
          <div className="cs-wrap">
            <div className="cs" aria-label="Coming soon">
              {CHARS.map((ch, i) =>
                ch === ' '
                  ? <span key={i} className="sp" />
                  : <span key={i} className="ch" style={{animationDelay:`${0.35 + i * 0.09}s`}}>{ch}</span>
              )}
            </div>
            <div className="underline" style={{animationDelay:'1.5s'}} />
          </div>

          <p className="desc">
            Maison d'hôtes de charme entre Angers et Saumur.<br />
            Piscine · Petit-déjeuner gourmand · 3 chambres.
          </p>

          <div className="contacts">
            <div className="links">
              <a href="tel:+33675786335">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/>
                </svg>
                06 75 78 63 35
              </a>
              <a href="mailto:laboirebavard@gmail.com">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                laboirebavard@gmail.com
              </a>
            </div>
            <a className="wa" href="https://wa.me/33675786335" target="_blank" rel="noopener noreferrer">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
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
