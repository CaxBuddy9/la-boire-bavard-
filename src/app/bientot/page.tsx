'use client'

import { useEffect, useState } from 'react'

export default function BientotPage() {
  const [mounted, setMounted] = useState(false)
  const [hit, setHit] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Déclenche l'effet "impact" en sync avec l'animation du marteau
    const interval = setInterval(() => {
      setHit(true)
      setTimeout(() => setHit(false), 120)
    }, 1400)
    return () => clearInterval(interval)
  }, [])

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
        .scene::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(196,160,80,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,160,80,.025) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Lucioles */
        .firefly {
          position: fixed;
          border-radius: 50%;
          background: radial-gradient(circle, #d4b862 0%, transparent 65%);
          pointer-events: none;
          animation: fly var(--dur,12s) ease-in-out infinite var(--delay,0s);
          opacity: 0;
          z-index: 0;
        }
        @keyframes fly {
          0%   { transform: translate(0,0) scale(.6); opacity: 0; }
          15%  { opacity: .7; }
          50%  { transform: translate(var(--tx,30px),var(--ty,-60px)) scale(1); opacity: .5; }
          85%  { opacity: .6; }
          100% { transform: translate(var(--tx2,10px),var(--ty2,-120px)) scale(.4); opacity: 0; }
        }

        /* Lueur centrale */
        .glow-ring {
          position: fixed; top: 50%; left: 50%;
          transform: translate(-50%,-50%);
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(196,160,80,.05) 0%, transparent 65%);
          animation: glow-pulse 5s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }
        @keyframes glow-pulse {
          0%,100% { opacity: .5; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 1;  transform: translate(-50%,-50%) scale(1.1); }
        }

        /* Cadre */
        .frame {
          position: relative; z-index: 1;
          width: min(700px, 94vw);
          animation: appear 1.1s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes appear {
          from { opacity: 0; transform: translateY(28px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }

        /* Parchemin */
        .scroll {
          background: linear-gradient(180deg, #1a2c1c 0%, #162214 40%, #111b12 100%);
          border: 1px solid rgba(196,160,80,.35);
          box-shadow:
            0 0 0 4px rgba(196,160,80,.07),
            0 0 0 8px rgba(196,160,80,.03),
            inset 0 1px 0 rgba(196,160,80,.1),
            0 32px 80px rgba(0,0,0,.7);
          padding: 0 2.2rem 2.6rem;
          position: relative;
        }

        /* Coins */
        .corner { position: absolute; width: 52px; height: 52px; pointer-events: none; }
        .corner svg { width: 100%; height: 100%; }
        .corner-tl { top: -1px; left: -1px; }
        .corner-tr { top: -1px; right: -1px; transform: scaleX(-1); }
        .corner-bl { bottom: -1px; left: -1px; transform: scaleY(-1); }
        .corner-br { bottom: -1px; right: -1px; transform: scale(-1); }

        /* Flambeaux */
        .torches { display: flex; justify-content: space-between; padding: 0 .4rem; position: relative; top: -22px; margin-bottom: -8px; }
        .torch { display: flex; flex-direction: column; align-items: center; }
        .torch-flame { width: 20px; height: 32px; position: relative; }
        .flame-inner {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 12px; height: 24px;
          background: linear-gradient(180deg,#ffd700 0%,#ff8c00 50%,#c4501a 100%);
          border-radius: 50% 50% 30% 30%;
          animation: flicker 1.4s ease-in-out infinite;
          transform-origin: bottom center; filter: blur(1px);
        }
        .flame-outer {
          position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
          width: 20px; height: 30px;
          background: linear-gradient(180deg,rgba(255,165,0,.3) 0%,rgba(255,69,0,.15) 60%,transparent 100%);
          border-radius: 50% 50% 30% 30%;
          animation: flicker 1.8s ease-in-out infinite .3s;
          transform-origin: bottom center; filter: blur(3px);
        }
        .flame-glow {
          position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
          width: 40px; height: 40px;
          background: radial-gradient(circle,rgba(255,140,0,.2) 0%,transparent 70%);
          animation: glow-pulse 1.4s ease-in-out infinite;
        }
        @keyframes flicker {
          0%,100% { transform: translateX(-50%) scaleX(1) scaleY(1) rotate(-1deg); }
          25%      { transform: translateX(-50%) scaleX(.85) scaleY(1.08) rotate(2deg); }
          50%      { transform: translateX(-50%) scaleX(1.08) scaleY(.95) rotate(-2deg); }
          75%      { transform: translateX(-50%) scaleX(.9) scaleY(1.05) rotate(1deg); }
        }
        .torch-body { width: 8px; height: 28px; background: linear-gradient(180deg,#8b6914 0%,#5c3d0a 100%); border-radius: 2px 2px 0 0; }
        .torch-base { width: 14px; height: 5px; background: rgba(196,160,80,.5); border-radius: 0 0 3px 3px; }

        /* Bannière */
        .banner {
          background: linear-gradient(90deg,transparent,rgba(196,160,80,.07),transparent);
          border-top: 1px solid rgba(196,160,80,.2);
          border-bottom: 1px solid rgba(196,160,80,.2);
          padding: 1rem 1.5rem; text-align: center; margin-bottom: 1.6rem; position: relative;
        }
        .banner::before,.banner::after { content:'✦'; position:absolute; top:50%; transform:translateY(-50%); color:rgba(196,160,80,.4); font-size:.65rem; }
        .banner::before { left:1rem; } .banner::after { right:1rem; }
        .inn-label { font-family:'Raleway',sans-serif; font-weight:300; font-size:.68rem; letter-spacing:.32em; text-transform:uppercase; color:rgba(196,160,80,.7); margin-bottom:.5rem; }
        h1 { font-family:'Playfair Display',serif; font-size:clamp(1.7rem,5vw,2.8rem); font-weight:400; text-align:center; line-height:1.2; color:#f0e8d4; text-shadow:0 2px 20px rgba(196,160,80,.12); }
        h1 em { font-style:italic; color:#c4a050; display:block; font-size:.8em; }

        /* ══════════════════════════════════
           PERSONNAGE ANIMÉ
        ══════════════════════════════════ */
        .builder-stage {
          margin: .8rem auto 1.4rem;
          display: flex;
          justify-content: center;
        }
        .builder-svg {
          width: min(340px, 90%);
          height: auto;
          overflow: visible;
        }

        /* Sol */
        .ground { }

        /* Pierre */
        .rock { filter: drop-shadow(0 4px 8px rgba(0,0,0,.5)); }
        .rock-shake {
          animation: rock-hit .14s ease-out;
          transform-origin: 148px 78px;
        }
        @keyframes rock-hit {
          0%  { transform: translate(0,0) rotate(0deg); }
          30% { transform: translate(2px,-1px) rotate(.8deg); }
          60% { transform: translate(-1px,0) rotate(-.4deg); }
          100%{ transform: translate(0,0) rotate(0deg); }
        }

        /* Bras + pioche */
        .arm-group {
          transform-origin: 78px 62px;
          animation: swing 1.4s cubic-bezier(.4,0,.2,1) infinite;
        }
        @keyframes swing {
          0%   { transform: rotate(-38deg); }
          35%  { transform: rotate(22deg); }
          50%  { transform: rotate(24deg); }
          65%  { transform: rotate(22deg); }
          100% { transform: rotate(-38deg); }
        }

        /* Jambes */
        .leg-l { transform-origin: 68px 88px; animation: leg-l 1.4s ease-in-out infinite; }
        .leg-r { transform-origin: 74px 88px; animation: leg-r 1.4s ease-in-out infinite; }
        @keyframes leg-l {
          0%,100% { transform: rotate(-4deg); }
          50%     { transform: rotate(4deg); }
        }
        @keyframes leg-r {
          0%,100% { transform: rotate(4deg); }
          50%     { transform: rotate(-4deg); }
        }

        /* Corps (léger bounce) */
        .body-group {
          animation: body-bounce 1.4s ease-in-out infinite;
          transform-origin: 68px 70px;
        }
        @keyframes body-bounce {
          0%,100% { transform: translateY(0); }
          35%     { transform: translateY(1.5px); }
          50%     { transform: translateY(2px); }
        }

        /* Étincelles */
        .spark {
          transform-origin: 148px 72px;
          animation: spark-fly 1.4s ease-out infinite;
          opacity: 0;
        }
        .spark:nth-child(1) { animation-delay: .05s; }
        .spark:nth-child(2) { animation-delay: .09s; }
        .spark:nth-child(3) { animation-delay: .12s; }
        @keyframes spark-fly {
          0%   { opacity: 0; transform: translate(0,0) scale(1); }
          38%  { opacity: 0; }
          42%  { opacity: 1; }
          70%  { opacity: .8; }
          100% { opacity: 0; transform: translate(var(--sx,12px),var(--sy,-18px)) scale(0); }
        }

        /* Poussière */
        .dust {
          animation: dust-rise 1.4s ease-out infinite;
          opacity: 0;
          transform-origin: 148px 82px;
        }
        @keyframes dust-rise {
          0%,38% { opacity:0; transform:scale(.3) translate(0,0); }
          45%    { opacity:.5; }
          100%   { opacity:0; transform:scale(1.4) translate(-8px,-12px); }
        }
        .dust2 { animation-delay: .06s; transform-origin: 155px 82px; }

        /* Bulle de dialogue */
        .speech-bubble {
          animation: bubble-float 3s ease-in-out infinite;
          transform-origin: 88px 22px;
        }
        @keyframes bubble-float {
          0%,100% { transform: translateY(0) rotate(-.5deg); }
          50%     { transform: translateY(-2px) rotate(.5deg); }
        }

        /* Sueurs (stress du perso) */
        .sweat {
          animation: sweat-drop 2.8s ease-in infinite;
          opacity: 0;
        }
        @keyframes sweat-drop {
          0%,60%  { opacity:0; transform:translateY(0); }
          65%     { opacity:.8; }
          100%    { opacity:0; transform:translateY(10px); }
        }

        /* Diviseur */
        .divider { display:flex; align-items:center; gap:.8rem; margin:1.4rem 0; color:rgba(196,160,80,.35); font-size:.65rem; }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(196,160,80,.3),transparent); }

        /* Description */
        .desc { font-family:'Playfair Display',serif; font-style:italic; font-size:.98rem; color:rgba(240,232,212,.62); text-align:center; line-height:1.8; margin-bottom:1.6rem; }

        /* Stats */
        .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:.8rem; margin-bottom:1.6rem; }
        .stat { background:rgba(196,160,80,.055); border:1px solid rgba(196,160,80,.14); padding:.8rem .5rem; text-align:center; }
        .stat-val { font-family:'Playfair Display',serif; font-size:1.05rem; color:#c4a050; display:block; }
        .stat-lbl { font-size:.62rem; letter-spacing:.12em; text-transform:uppercase; color:rgba(240,232,212,.38); }

        /* Sceau */
        .seal { display:flex; justify-content:center; margin:1.4rem 0; }
        .seal-ring { width:56px; height:56px; border:1px solid rgba(196,160,80,.3); border-radius:50%; display:flex; align-items:center; justify-content:center; position:relative; animation: seal-r 22s linear infinite; }
        .seal-ring::before { content:''; position:absolute; inset:4px; border:1px dashed rgba(196,160,80,.18); border-radius:50%; animation: seal-r 9s linear infinite reverse; }
        @keyframes seal-r { to { transform:rotate(360deg); } }
        .seal-inner { font-size:1.3rem; animation: seal-r 22s linear infinite reverse; }

        /* Contact */
        .contact-row { border-top:1px solid rgba(196,160,80,.14); padding-top:1.6rem; display:flex; flex-direction:column; align-items:center; gap:.65rem; }
        .contact-hint { font-size:.66rem; letter-spacing:.2em; text-transform:uppercase; color:rgba(240,232,212,.33); }
        .contact-links { display:flex; flex-wrap:wrap; justify-content:center; gap:.5rem 1.4rem; }
        .contact-links a { color:rgba(240,232,212,.62); text-decoration:none; font-size:.84rem; display:flex; align-items:center; gap:.4rem; transition:color .2s; }
        .contact-links a:hover { color:#c4a050; }
        .wa-btn { display:inline-flex; align-items:center; gap:.55rem; margin-top:.4rem; padding:.62rem 1.8rem; border:1px solid rgba(196,160,80,.38); color:#c4a050; font-size:.74rem; letter-spacing:.14em; text-transform:uppercase; text-decoration:none; transition:background .25s,border-color .25s,box-shadow .25s; }
        .wa-btn:hover { background:rgba(196,160,80,.09); border-color:#c4a050; box-shadow:0 0 18px rgba(196,160,80,.1); color:#d4b460; }
      `}</style>

      <div className="scene">
        {/* Lucioles */}
        {mounted && [
          { s:10, x:'12%', y:'72%', tx:'22px',  ty:'-75px',  tx2:'-8px',   ty2:'-140px', dur:'11s', delay:'0s'   },
          { s:14, x:'28%', y:'78%', tx:'-32px', ty:'-62px',  tx2:'18px',   ty2:'-125px', dur:'16s', delay:'2.2s' },
          { s: 8, x:'52%', y:'66%', tx:'14px',  ty:'-88px',  tx2:'-5px',   ty2:'-155px', dur:'13s', delay:'4.8s' },
          { s:12, x:'70%', y:'74%', tx:'-18px', ty:'-68px',  tx2:'28px',   ty2:'-135px', dur:'18s', delay:'1.1s' },
          { s:16, x:'84%', y:'58%', tx:'9px',   ty:'-95px',  tx2:'-14px',  ty2:'-175px', dur:'14s', delay:'6.3s' },
          { s: 9, x:'93%', y:'83%', tx:'-28px', ty:'-52px',  tx2:'5px',    ty2:'-108px', dur:'12s', delay:'3.4s' },
        ].map((f,i) => (
          <div key={i} className="firefly" style={{
            width:f.s, height:f.s, left:f.x, top:f.y,
            '--tx':f.tx,'--ty':f.ty,'--tx2':f.tx2,'--ty2':f.ty2,
            '--dur':f.dur,'--delay':f.delay,
          } as React.CSSProperties} />
        ))}

        <div className="glow-ring" aria-hidden />

        <div className="frame">
          {/* Flambeaux */}
          <div className="torches">
            {[0,1].map(i => (
              <div key={i} className="torch">
                <div className="torch-flame">
                  <div className="flame-glow"/>
                  <div className="flame-outer"/>
                  <div className="flame-inner" style={{animationDelay: i===1?'.55s':'0s'}}/>
                </div>
                <div className="torch-body"/>
                <div className="torch-base"/>
              </div>
            ))}
          </div>

          <div className="scroll">
            {/* Coins ornementaux */}
            {['corner-tl','corner-tr','corner-bl','corner-br'].map(cls => (
              <div key={cls} className={`corner ${cls}`}>
                <svg viewBox="0 0 52 52" fill="none">
                  <path d="M2 2 L20 2 L2 20 Z" fill="rgba(196,160,80,.1)" stroke="rgba(196,160,80,.48)" strokeWidth=".8"/>
                  <path d="M2 2 L8 2 L2 8 Z" fill="rgba(196,160,80,.28)"/>
                  <circle cx="20" cy="2" r="1.4" fill="rgba(196,160,80,.55)"/>
                  <circle cx="2" cy="20" r="1.4" fill="rgba(196,160,80,.55)"/>
                  <path d="M12 2 Q2 2 2 12" stroke="rgba(196,160,80,.3)" strokeWidth=".8" fill="none"/>
                </svg>
              </div>
            ))}

            {/* Bannière titre */}
            <div className="banner">
              <p className="inn-label">Chambre d'hôtes · Anjou · France</p>
              <h1>
                La Boire Bavard
                <em>Bientôt disponible</em>
              </h1>
            </div>

            {/* ═══ PERSONNAGE ANIMÉ ═══ */}
            <div className="builder-stage">
              <svg
                className="builder-svg"
                viewBox="0 0 220 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Sol */}
                <line x1="20" y1="97" x2="200" y2="97" stroke="rgba(196,160,80,.2)" strokeWidth="1"/>

                {/* ── Pierre à tailler ── */}
                <g className={hit ? 'rock rock-shake' : 'rock'}>
                  {/* ombre */}
                  <ellipse cx="150" cy="95" rx="28" ry="4" fill="rgba(0,0,0,.35)"/>
                  {/* corps de la pierre */}
                  <polygon points="122,92 128,68 142,60 162,62 175,72 172,92" fill="#1e2e20"/>
                  <polygon points="122,92 128,68 142,60 162,62 175,72 172,92" fill="none" stroke="rgba(196,160,80,.35)" strokeWidth=".8"/>
                  {/* reflets */}
                  <polygon points="128,68 142,60 148,65 136,74" fill="rgba(196,160,80,.08)"/>
                  <line x1="138" y1="70" x2="145" y2="82" stroke="rgba(196,160,80,.18)" strokeWidth=".7"/>
                  <line x1="150" y1="64" x2="155" y2="78" stroke="rgba(196,160,80,.12)" strokeWidth=".6"/>
                  {/* fissures */}
                  <path d="M140,75 L148,68 L152,74" stroke="rgba(196,160,80,.25)" strokeWidth=".8" fill="none"/>
                </g>

                {/* Étincelles (impact) */}
                <g>
                  <circle className="spark" cx="148" cy="72" r="1.5" fill="#ffd700"
                    style={{'--sx':'10px','--sy':'-14px'} as React.CSSProperties}/>
                  <circle className="spark" cx="148" cy="72" r="1" fill="#ff9900"
                    style={{'--sx':'-7px','--sy':'-18px'} as React.CSSProperties}/>
                  <circle className="spark" cx="148" cy="72" r="1.2" fill="#ffcc44"
                    style={{'--sx':'14px','--sy':'-8px'} as React.CSSProperties}/>
                </g>

                {/* Poussière */}
                <ellipse className="dust" cx="148" cy="82" rx="6" ry="3" fill="rgba(180,150,80,.2)"/>
                <ellipse className="dust dust2" cx="155" cy="80" rx="4" ry="2" fill="rgba(180,150,80,.15)"/>

                {/* ── Personnage Dofus-style ── */}
                {/* Ombre */}
                <ellipse cx="68" cy="96" rx="18" ry="3.5" fill="rgba(0,0,0,.3)"/>

                {/* Jambes */}
                <g className="leg-l">
                  <rect x="60" y="86" width="7" height="14" rx="3" fill="#1a4020"/>
                  <rect x="58" y="97" width="10" height="5" rx="2" fill="#2a1a08"/>
                </g>
                <g className="leg-r">
                  <rect x="70" y="86" width="7" height="14" rx="3" fill="#1a4020"/>
                  <rect x="70" y="97" width="10" height="5" rx="2" fill="#2a1a08"/>
                </g>

                {/* Corps + tête + bras */}
                <g className="body-group">
                  {/* Corps */}
                  <rect x="54" y="60" width="28" height="30" rx="8" fill="#1a4020"/>
                  {/* Ceinture */}
                  <rect x="54" y="75" width="28" height="4" rx="1" fill="rgba(196,160,80,.4)"/>
                  <circle cx="68" cy="77" r="2" fill="#c4a050"/>

                  {/* Bras gauche (statique, tenu en avant) */}
                  <rect x="42" y="64" width="14" height="6" rx="3" fill="#1a4020"/>
                  {/* Main gauche */}
                  <circle cx="40" cy="67" r="4" fill="#c4855a"/>

                  {/* ─ Bras droit + pioche (animé) ─ */}
                  <g className="arm-group">
                    {/* bras */}
                    <rect x="78" y="58" width="6" height="18" rx="3"
                      fill="#1a4020"
                      transform="rotate(-15, 81, 62)"/>
                    {/* avant-bras */}
                    <rect x="85" y="48" width="5" height="16" rx="2.5"
                      fill="#1a4020"
                      transform="rotate(-30, 87, 52)"/>
                    {/* manche pioche */}
                    <rect x="90" y="34" width="4" height="32" rx="2"
                      fill="#7a4a18"
                      transform="rotate(-40, 92, 48)"/>
                    {/* tête de pioche */}
                    <path
                      d="M108,22 L120,16 L124,26 L116,32 Z"
                      fill="#7a8a7a"
                      transform="rotate(-40, 116, 24)"/>
                    <path
                      d="M116,32 L124,26 L130,34 L118,38 Z"
                      fill="#a0aaa0"
                      transform="rotate(-40, 123, 32)"/>
                  </g>

                  {/* Tête (grosse, style Dofus) */}
                  <circle cx="68" cy="44" r="18" fill="#c4855a"/>
                  {/* Joues */}
                  <circle cx="60" cy="47" r="4" fill="rgba(220,120,80,.35)"/>
                  <circle cx="76" cy="47" r="4" fill="rgba(220,120,80,.35)"/>
                  {/* Yeux */}
                  <ellipse cx="62" cy="42" rx="3.5" ry="4" fill="#1a1a0a"/>
                  <ellipse cx="74" cy="42" rx="3.5" ry="4" fill="#1a1a0a"/>
                  <circle cx="63" cy="41" r="1.2" fill="white"/>
                  <circle cx="75" cy="41" r="1.2" fill="white"/>
                  {/* Bouche (sourire concentré) */}
                  <path d="M63,50 Q68,53 73,50" stroke="#7a3a18" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

                  {/* Sourcils froncés */}
                  <path d="M58,37 L67,39" stroke="#7a4a18" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M69,39 L78,37" stroke="#7a4a18" strokeWidth="2" strokeLinecap="round"/>

                  {/* Chapeau médiéval */}
                  <path d="M50,36 L68,12 L86,36 Z" fill="#2a5a2a"/>
                  <rect x="48" y="34" width="40" height="6" rx="2" fill="#1e4520"/>
                  {/* Plume */}
                  <path d="M84,34 Q90,22 86,16 Q82,24 84,30" fill="rgba(196,160,80,.7)"/>

                  {/* Bulle "Work in progress" qui part de la plume */}
                  <g className="speech-bubble">
                    {/* Queue de bulle pointant vers la plume */}
                    <polygon points="88,18 94,22 90,26" fill="#1e3a22" stroke="rgba(196,160,80,.55)" strokeWidth=".8"/>
                    {/* Corps de la bulle */}
                    <rect x="91" y="4" width="68" height="20" rx="5" fill="#1e3a22" stroke="rgba(196,160,80,.55)" strokeWidth=".8"/>
                    {/* Texte */}
                    <text x="125" y="17" textAnchor="middle"
                      fontFamily="'Raleway', sans-serif"
                      fontSize="6.5"
                      fontWeight="500"
                      fill="#c4a050"
                      letterSpacing=".8">
                      Work in progress...
                    </text>
                  </g>
                  {/* Bande dorée chapeau */}
                  <rect x="50" y="36" width="36" height="3" rx="1" fill="rgba(196,160,80,.5)"/>
                  <circle cx="68" cy="37" r="1.5" fill="#c4a050"/>

                  {/* Gouttes de sueur */}
                  <ellipse className="sweat" cx="84" cy="38" rx="1.5" ry="2.5" fill="rgba(100,180,255,.6)"/>
                  <ellipse className="sweat" cx="87" cy="43" rx="1" ry="1.8" fill="rgba(100,180,255,.5)"
                    style={{animationDelay:'.8s'}}/>
                </g>

                {/* Texte sous le perso */}
                <text x="68" y="108" textAnchor="middle"
                  fontFamily="'Raleway', sans-serif"
                  fontSize="5.5"
                  fill="rgba(196,160,80,.5)"
                  letterSpacing="1">
                  EN CONSTRUCTION
                </text>
              </svg>
            </div>

            <div className="divider"><span>✦ &nbsp; ✦ &nbsp; ✦</span></div>

            <p className="desc">
              Une maison d'hôtes de charme entre Angers et Saumur.<br/>
              Piscine chauffée · Spa · Petit-déjeuner gourmand · 4 chambres.
            </p>

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

            <div className="divider"><span>✦ &nbsp; ✦ &nbsp; ✦</span></div>

            <div className="seal">
              <div className="seal-ring">
                <span className="seal-inner">⚜</span>
              </div>
            </div>

            <div className="divider"><span>✦ &nbsp; ✦ &nbsp; ✦</span></div>

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
