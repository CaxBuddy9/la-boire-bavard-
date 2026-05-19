'use client'

// Bouton d'export PDF — ouvre la boîte d'impression du navigateur.
// L'utilisateur choisit « Enregistrer au format PDF » comme destination.
export default function PrintButton({ label = 'Enregistrer en PDF' }: { label?: string }) {
  return (
    <button
      onClick={() => window.print()}
      style={{
        background: '#2a2018', color: '#fdfaf2', border: 'none',
        borderRadius: 9, padding: '12px 30px', fontSize: '0.95rem',
        fontFamily: 'Georgia, serif', cursor: 'pointer',
        boxShadow: '0 3px 12px rgba(0,0,0,.18)',
      }}
    >
      {label}
    </button>
  )
}
