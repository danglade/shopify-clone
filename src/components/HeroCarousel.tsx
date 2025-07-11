"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRef } from "react";

type HeroSlide = {
  id: number;
  imageUrl: string;
  title?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  buttonPosition?: "top" | "middle" | "bottom" | null;
  buttonHorizontalPosition?: "left" | "center" | "right" | null;
  order: number;
};

interface HeroCarouselProps {
  slides: HeroSlide[];
  slideDuration: number;
}

export default function HeroCarousel({
  slides,
  slideDuration,
}: HeroCarouselProps) {
  const plugin = useRef(
    Autoplay({ delay: slideDuration * 1000, stopOnInteraction: true })
  );

  console.log("Initializing HeroCarousel with slide duration (seconds):", slideDuration);

  if (slides.length === 0) {
    return null; // Don't render anything if there are no slides
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      opts={{ loop: true }}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {slides.map((slide) => {
          const verticalPositionClass = {
            top: "items-start",
            middle: "items-center",
            bottom: "items-end",
          }[slide.buttonPosition || "middle"];

          const horizontalPositionClass = {
            left: "justify-start text-left",
            center: "justify-center text-center",
            right: "justify-end text-right",
          }[slide.buttonHorizontalPosition || "left"];

          return (
            <CarouselItem key={slide.id}>
              <div
                className={`w-full h-[60vh] bg-cover bg-center flex p-12 md:p-24 ${verticalPositionClass} ${horizontalPositionClass}`}
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              >
                <div className="max-w-md">
                  {slide.title && (
                    <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="mt-4 text-lg md:text-xl text-white drop-shadow-lg">
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