"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageUploader from "./ImageUploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortableSlideProps {
  slide: {
    id: number | string;
    imageUrl: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    buttonPosition?: string;
    buttonHorizontalPosition?: string;
  };
  onRemove: (id: number | string) => void;
  onChange: (id: number | string, field: string, value: string) => void;
}

export function SortableSlide({ slide, onRemove, onChange }: SortableSlideProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="w-full">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div
              {...listeners}
              className="cursor-grab touch-none p-2"
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="space-y-2">
                <Label>Image</Label>
                <ImageUploader
                  initialImageUrl={slide.imageUrl}
                  onUploadSuccess={(url: string) => onChange(slide.id, "imageUrl", url)}
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${slide.id}`}>Title</Label>
                  <Input
                    id={`title-${slide.id}`}
                    placeholder="e.g. New Collection"
                    value={slide.title || ""}
                    onChange={(e) =>
                      onChange(slide.id, "title", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`subtitle-${slide.id}`}>Subtitle</Label>
                  <Input
                    id={`subtitle-${slide.id}`}
                    placeholder="e.g. Summer Styles"
                    value={slide.subtitle || ""}
                    onChange={(e) =>
                      onChange(slide.id, "subtitle", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`button-text-${slide.id}`}>Button Text</Label>
                  <Input
                    id={`button-text-${slide.id}`}
                    placeholder="e.g. Shop Now"
                    value={slide.buttonText || ""}
                    onChange={(e) =>
                      onChange(slide.id, "buttonText", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`button-link-${slide.id}`}>Button Link</Label>
                  <Input
                    id={`button-link-${slide.id}`}
                    placeholder="e.g. /collections/all"
                    value={slide.buttonLink || ""}
                    onChange={(e) =>
                      onChange(slide.id, "buttonLink", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Position</Label>
                  <Select
                    value={slide.buttonPosition || "middle"}
                    onValueChange={(value) =>
                      onChange(slide.id, "buttonPosition", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                 <div className="space-y-2">
                  <Label>Button Horizontal Position</Label>
                  <Select
                    value={slide.buttonHorizontalPosition || "left"}
                    onValueChange={(value) =>
                      onChange(slide.id, "buttonHorizontalPosition", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => onRemove(slide.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 