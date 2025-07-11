import { getHeroSlides } from "@/app/actions/hero";
import { getSetting } from "@/app/actions/settings";
import { unstable_noStore as noStore } from "next/cache";
import HeroCarousel from "./HeroCarousel";
import { Skeleton } from "./ui/skeleton";

const HERO_SLIDE_DURATION_KEY = "hero_slide_duration_seconds";
const DEFAULT_SLIDE_DURATION = 5;

export default async function HeroBanner() {
  noStore();
  
  const slides = await getHeroSlides();
  const durationSetting = await getSetting(HERO_SLIDE_DURATION_KEY);
  const slideDuration = durationSetting
    ? parseInt(durationSetting, 10)
    : DEFAULT_SLIDE_DURATION;

  return <HeroCarousel slides={slides} slideDuration={slideDuration} />;
}

HeroBanner.Skeleton = function HeroBannerSkeleton() {
  return <Skeleton className="w-full h-[60vh]" />;
}; 