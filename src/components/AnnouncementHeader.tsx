"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AnnouncementHeaderProps {
  htmlContent: string;
  isDismissible: boolean;
}

export default function AnnouncementHeader({
  htmlContent,
  isDismissible,
}: AnnouncementHeaderProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible || !htmlContent) {
    return null;
  }

  return (
    <div className="relative bg-gray-900 text-white px-4 py-2 text-center">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      {isDismissible && (
        <button
          onClick={handleDismiss}
          className="absolute top-1/2 right-4 -translate-y-1/2"
          aria-label="Dismiss announcement"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
} 