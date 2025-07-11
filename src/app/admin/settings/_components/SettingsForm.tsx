"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateSetting } from "@/app/actions/settings";

interface SettingsFormProps {
  initialAnnouncementHtml: string | null;
  initialIsDismissible: boolean;
  initialIsHeaderSticky: boolean;
}

export default function SettingsForm({
  initialAnnouncementHtml,
  initialIsDismissible,
  initialIsHeaderSticky,
}: SettingsFormProps) {
  const [announcementHtml, setAnnouncementHtml] = useState(
    initialAnnouncementHtml ?? ""
  );
  const [isDismissible, setIsDismissible] = useState(initialIsDismissible);
  const [isHeaderSticky, setIsHeaderSticky] = useState(initialIsHeaderSticky);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      await updateSetting("announcement_bar_html", announcementHtml);
      await updateSetting("announcement_dismissible", String(isDismissible));
      await updateSetting("sticky_header", String(isHeaderSticky));
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Label htmlFor="announcement_bar_html" className="text-base">
          Announcement Bar
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Enter the HTML content for the announcement bar. It will be displayed
          at the top of the site. Leave blank to hide the bar.
        </p>
        <Textarea
          id="announcement_bar_html"
          name="announcement_bar_html"
          rows={6}
          value={announcementHtml}
          onChange={(e) => setAnnouncementHtml(e.target.value)}
          placeholder='e.g. <p class="text-white text-sm">Get <b>10% OFF</b> your first order!</p>'
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <Label htmlFor="announcement_dismissible">Is Dismissible?</Label>
          <p className="text-[0.8rem] text-muted-foreground">
            If enabled, users can close the announcement bar.
          </p>
        </div>
        <Switch
          id="announcement_dismissible"
          name="announcement_dismissible"
          checked={isDismissible}
          onCheckedChange={setIsDismissible}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <div className="space-y-0.5">
          <Label htmlFor="sticky_header">Sticky Header</Label>
          <p className="text-[0.8rem] text-muted-foreground">
            If enabled, the entire header will stick to the top on scroll. The
            navbar will remain sticky regardless.
          </p>
        </div>
        <Switch
          id="sticky_header"
          name="sticky_header"
          checked={isHeaderSticky}
          onCheckedChange={setIsHeaderSticky}
        />
      </div>

      <Button onClick={handleSave} disabled={isPending}>
        {isPending ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
} 