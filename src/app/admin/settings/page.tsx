import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getSetting, updateSettings } from "@/app/actions/settings";
import { Switch } from "@/components/ui/switch";

export default async function SettingsPage() {
  const announcementHtml = await getSetting("announcement_bar_html");
  const isDismissible = (await getSetting("announcement_dismissible")) === "true";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Site Settings</h1>
      <form action={updateSettings} className="space-y-6 max-w-2xl">
        <div>
          <Label htmlFor="announcement_bar_html" className="text-base">
            Announcement Bar
          </Label>
          <p className="text-sm text-muted-foreground mb-2">
            Enter the HTML content for the announcement bar. It will be
            displayed at the top of the site. Leave blank to hide the bar.
          </p>
          <Textarea
            id="announcement_bar_html"
            name="announcement_bar_html"
            rows={6}
            defaultValue={announcementHtml ?? ""}
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
            defaultChecked={isDismissible}
          />
        </div>

        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
} 