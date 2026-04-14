'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type Photo = { src: string; alt: string }

function Lightbox({ photos, index, onClose, onPrev, onNext }: {
  photos: Photo[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.94)' }}
      onClick={onClose}
    >
      {/* Fermer */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white/60 hover:text-white transition-colors z-10"
        style={{ fontSize: '2rem', lineHeight: 1 }}
        aria-label="Fermer"
      >
        ×
      </button>

      {/* Compteur */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 font-sans text-[0.65rem] tracking-[0.25em] uppercase text-white/40">
        {index + 1} / {photos.length}
      </div>

      {/* Flèche gauche */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 md:left-8 text-white/50 hover:text-gold transition-colors z-10 select-none"
          style={{ fontSize: '2.5rem' }}
          aria-label="Photo précédente"
        >
          ‹
        </button>
      )}

      {/* Image */}
      <div
        className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16 md:mx-24"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photos[index].src}
          alt={photos[index].alt}
          fill
          className="object-contain"
          sizes="(max-width:768px) 90vw, 80vw"
          priority
        />
      </div>

      {/* Flèche droite */}
      {photos.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 md:right-8 text-white/50 hover:text-gold transition-colors z-10 select-none"
          style={{ fontSize: '2.5rem' }}
          aria-label="Photo suivante"
        >
          ›
        </button>
      )}

      {/* Légende */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-[0.65rem] tracking-[0.2em] uppercase text-white/35 text-center px-4">
        {photos[index].alt}
      </div>
    </div>
  )
}

export default function PhotoGallery({
  photos,
  columns = 3,
  aspectRatio = '4/3',
  className = '',
}: {
  photos: Photo[]
  columns?: 2 | 3 | 4
  aspectRatio?: string
  className?: string
}) {
  const [open, setOpen] = useState<number | null>(null)

  const close = useCallback(() => setOpen(null), [])
  const prev = useCallback(() => setOpen((i) => (i !== null ? (i - 1 + photos.length) % photos.length : null)), [photos.length])
  const next = useCallback(() => setOpen((i) => (i !== null ? (i + 1) % photos.length : null)), [photos.length])

  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns]

  return (
    <>
      <div className={`grid ${colClass} gap-2 ${className}`}>
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            className="relative overflow-hidden block group focus:outline-none"
            style={{ aspectRatio }}
            aria-label={`Voir ${photo.alt} en grand`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              sizes={
                columns === 2
                  ? '(max-width:768px) 50vw, 50vw'
                  : columns === 4
                  ? '(max-width:768px) 50vw, 25vw'
                  : '(max-width:768px) 50vw, 33vw'
              }
            />
            {/* Overlay hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white/0 group-hover:text-white/80 transition-all duration-300 text-2xl">
                ⊕
              </span>
            </div>
          </button>
        ))}
      </div>

      {open !== null && (
        <Lightbox
          photos={photos}
          index={open}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}
