"use client";

import { useState, useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadHeroImage } from "@/app/actions/hero";
import { Loader2, UploadCloud, X } from "lucide-react";

export default function ImageUploader({
  initialImageUrl,
  onUploadSuccess,
}: {
  initialImageUrl: string | null;
  onUploadSuccess: (url: string) => void;
}) {
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      const formData = new FormData();
      formData.append("file", file);

      startTransition(async () => {
        try {
          const result = await uploadHeroImage(formData);
          if (result.success && result.url) {
            setImageUrl(result.url);
            onUploadSuccess(result.url);
          } else {
            // @ts-expect-error - result may have an error property
            setError(result.error || "An unknown error occurred.");
          }
        } catch (e) {
          if (e instanceof Error) {
            setError(e.message || "Failed to upload image.");
          } else {
            setError("An unknown error occurred during upload.");
          }
        }
      });
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onUploadSuccess(""); // Notify parent that image is removed
  };

  return (
    <div>
      {imageUrl ? (
        <div className="relative group w-full h-40">
          <Image
            src={imageUrl}
            alt="Uploaded hero image"
            fill
            className="object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              variant="destructive"
              size="icon"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="w-full h-40 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {isPending ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <UploadCloud className="h-8 w-8" />
              <span className="mt-2 text-sm">Click to upload</span>
            </>
          )}
        </div>
      )}
      <Input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        disabled={isPending}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
} 