'use client';

import Image, { StaticImageData } from 'next/image';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import party1Image from '@/public/party1.jpg';
import party2Image from '@/public/party2.jpg';
import party3Image from '@/public/party3.jpg';
import party4Image from '@/public/party4.jpg';

interface Slide {
  id: number;
  src: StaticImageData | string;
  caption: string;
  description: string;
}

const slides: Slide[] = [
  {
    id: 1,
    src: party1Image,
    caption: 'Party Time!',
    description: `Join us for an unforgettable night filled with fun and excitement.`,
  },
  {
    id: 2,
    src: party2Image,
    caption: 'Dancing Under the Stars',
    description: `Get ready to dance the night away with great music and friends.`,
  },
  {
    id: 3,
    src: party3Image,
    caption: 'Good Vibes Only',
    description: `Experience the magic of a night full of laughter and joy.`,
  },
  {
    id: 4,
    src: party4Image,
    caption: 'Celebrate with Us',
    description: `Let’s make memories together that will last a lifetime.`,
  },
];

export default function Component() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const slideRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<boolean[]>(Array(slides.length).fill(false));

  const handleSwipe = useCallback(
    (delta: number) => {
      let newIndex = currentSlide + delta;
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= slides.length) newIndex = slides.length - 1;
      setCurrentSlide(newIndex);
    },
    [currentSlide]
  );

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(1),
    onSwipedRight: () => handleSwipe(-1),
    trackMouse: true,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.scrollTo({
        left: currentSlide * slideRef.current.clientWidth,
        behavior: 'smooth',
      });
    }
    setInView((prev) => {
      const newView = [...prev];
      newView[currentSlide] = true;
      return newView;
    });
  }, [currentSlide]);

  return (
    <div className="relative h-[80vh] w-full overflow-hidden" {...swipeHandlers}>
      <div className="mx-auto w-full h-full" ref={slideRef}>
        <div
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map(({ id, src, caption, description }, index) => (
            <div key={id} className={`relative h-full w-full flex-shrink-0 flex flex-col md:flex-row ${inView[index] ? 'slide-in' : 'opacity-0'}`}>
              <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-4 md:p-8 text-black">
                <h2 className="mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-center tracking-wider">
                  {caption}
                </h2>
                <p className="mb-4 max-w-md text-sm md:text-base lg:text-lg text-left leading-relaxed">
                  {description}
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  {slides.map((_, barIndex) => (
                    <div
                      key={barIndex}
                      onClick={() => setCurrentSlide(barIndex)}
                      className={`cursor-pointer h-1 transition-all duration-500 
                        ${barIndex === currentSlide ? 'bg-purple-400 w-8' : 'bg-gray-400 w-4'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="w-full md:w-1/2 relative h-[40vh] md:h-full">
                <Image
                  src={src}
                  alt={caption}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .slide-in {
          animation: slide-in 1s forwards;
        }
      `}</style>
    </div>
  );
}
