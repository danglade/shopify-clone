"use client";

import useEmblaCarousel from "embla-carousel-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getHeroSlides } from "@/app/actions/hero";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

type HeroSlide = {
  id: number;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  buttonPosition?: "top" | "middle" | "bottom" | null;
  order: number;
};

export default function HeroBanner() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      setIsLoading(true);
      const fetchedSlides = await getHeroSlides();
      setSlides(fetchedSlides);
      setIsLoading(false);
    };
    fetchSlides();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] bg-gray-200 animate-pulse flex items-center justify-center">
        <p className="text-muted-foreground">Loading Hero...</p>
      </div>
    );
  }
  
  if (slides.length === 0) {
    return null; // Don't render anything if there are no slides
  }

  return (
    <Carousel className="w-full" opts={{ loop: true }}>
      <CarouselContent>
        {slides.map((slide) => {
          const positionClass = {
            top: "items-start",
            middle: "items-center",
            bottom: "items-end",
          }[slide.buttonPosition || "middle"];

          return (
            <CarouselItem key={slide.id}>
              <div
                className={`w-full h-[60vh] bg-cover bg-center flex p-12 md:p-24 ${positionClass} justify-start`}
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              >
                <div className="text-left text-white max-w-md">
                  {slide.title && (
                    <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="mt-4 text-lg md:text-xl drop-shadow-lg">
                      {slide.subtitle}
                    </p>
                  )}
                  {slide.buttonText && slide.buttonLink && (
                    <Button asChild size="lg" className="mt-6">
                      <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                    </Button>
                  )}
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselPrevious className="absolute left-4" />
      <CarouselNext className="absolute right-4" />
    </Carousel>
  );
} 