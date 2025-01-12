'use client'

import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function EmblaCarousel() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" }, [Autoplay()])

  const images = [
    { src: "/slideshow/chickenteriyaki.jpeg", alt: "Chicken Teriyaki" },
    { src: "/slideshow/friedrice.jpeg", alt: "Fried Rice" },
    { src: "/slideshow/ramensoup.jpeg", alt: "Ramen Soup" },
    { src: "/slideshow/rockyshrimp.jpeg", alt: "Rocky Shrimp" },
    { src: "/slideshow/stirfriednoodle.jpeg", alt: "Stir Fried Noodle" },
  ]

  return (
    <div className="embla mx-auto w-[90vw] md:w-[45vw]" ref={emblaRef} style={{ height: 'calc(100vh - 300px)' }}>
      <div className="embla__container h-full">
        {images.map((image, index) => (
          <div key={index} className="embla__slide flex items-center justify-center">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  )
}