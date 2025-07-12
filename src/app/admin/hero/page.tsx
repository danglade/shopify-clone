import { getHeroSlides } from "@/app/actions/hero";
import HeroSettingsForm from "./_components/HeroSettingsForm";
import { unstable_noStore as noStore } from "next/cache";
import { getSetting } from "@/app/actions/settings";

const HERO_SLIDE_DURATION_KEY = "hero_slide_duration_seconds";
const DEFAULT_SLIDE_DURATION = 5; // 5 seconds

export default async function HeroSettingsPage() {
  noStore(); // Ensure we always get the latest data
  const rawSlides = await getHeroSlides();
  const durationSetting = await getSetting(HERO_SLIDE_DURATION_KEY);
  const slideDuration = durationSetting
    ? parseInt(durationSetting, 10)
    : DEFAULT_SLIDE_DURATION;

  const slides = rawSlides.map((slide) => ({
    ...slide,
    title: slide.title ?? undefined,
    subtitle: slide.subtitle ?? undefined,
    buttonText: slide.buttonText ?? undefined,
    buttonLink: slide.buttonLink ?? undefined,
    buttonPosition: slide.buttonPosition ?? undefined,
    buttonHorizontalPosition: slide.buttonHorizontalPosition ?? undefined,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Hero Slider Settings</h1>
      <p className="text-muted-foreground mb-6">
        Manage the slides for your homepage hero carousel. Drag and drop to
        reorder.
      </p>
      <HeroSettingsForm
        initialSlides={slides}
        initialSlideDuration={slideDuration}
      />
    </div>
  );
} 