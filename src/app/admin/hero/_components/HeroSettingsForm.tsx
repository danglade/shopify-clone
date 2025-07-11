"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";

import { Button } from "@/components/ui/button";
import { updateHeroSlides } from "@/app/actions/hero";
import { SortableSlide } from "./SortableSlide";
import { updateSetting } from "@/app/actions/settings";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const HERO_SLIDE_DURATION_KEY = "hero_slide_duration_seconds";

interface Slide {
  id: number | string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  buttonPosition?: string;
  buttonHorizontalPosition?: string;
}

export default function HeroSettingsForm({
  initialSlides,
  initialSlideDuration,
}: {
  initialSlides: Slide[];
  initialSlideDuration: number;
}) {
  const [slides, setSlides] = useState(initialSlides);
  const [slideDuration, setSlideDuration] = useState(initialSlideDuration);
  const [isPending, startTransition] = useTransition();
  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        id: `new-${Date.now()}`, // Temporary ID
        imageUrl: "",
        title: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        buttonPosition: "middle",
        buttonHorizontalPosition: "left",
      },
    ]);
  };

  const handleRemoveSlide = (id: number | string) => {
    setSlides(slides.filter((slide) => slide.id !== id));
  };

  const handleSlideChange = (id: number | string, field: string, value: string) => {
    setSlides(
      slides.map((slide) =>
        slide.id === id ? { ...slide, [field]: value } : slide
      )
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSlides((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  
  const handleSave = () => {
    startTransition(async () => {
        // We strip the temporary ID for new slides so the database can generate a real one
        const slidesToSave = slides.map(({ id, ...rest }) => 
            typeof id === 'string' && id.startsWith('new-') ? rest : { id, ...rest }
        );
      await updateHeroSlides(slidesToSave);
      await updateSetting(HERO_SLIDE_DURATION_KEY, String(slideDuration));
    });
  };

  return (
    <div className="max-w-4xl">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext items={slides} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {slides.map((slide) => (
              <SortableSlide
                key={slide.id}
                slide={slide}
                onRemove={handleRemoveSlide}
                onChange={handleSlideChange}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Slider Settings</h2>
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="slide-duration">Slide Duration (seconds)</Label>
          <Input
            id="slide-duration"
            type="number"
            value={slideDuration}
            onChange={(e) => setSlideDuration(Number(e.target.value))}
            min="1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <Button onClick={handleAddSlide} variant="outline">
          Add Slide
        </Button>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
} 