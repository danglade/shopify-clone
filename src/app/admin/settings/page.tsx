import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSetting, updateSetting } from "@/app/actions/settings";

export default async function SettingsPage() {
  const announcementHtml = await getSetting("announcement_bar_html");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Site Settings</h1>
      <form action={updateSetting} className="space-y-4 max-w-2xl">
        <input type="hidden" name="key" value="announcement_bar_html" />
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="announcement_bar_html">
            Announcement Bar HTML
          </Label>
          <p className="text-sm text-muted-foreground">
            Enter the HTML content for the announcement bar. It will be
            displayed at the top of the site. Leave blank to hide the bar.
          </p>
          <Textarea
            id="announcement_bar_html"
            name="value"
            rows={8}
            defaultValue={announcementHtml ?? ""}
            placeholder='e.g. <p class="text-white text-sm">Get <b>10% OFF</b> your first order!</p>'
          />
        </div>
        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
} 