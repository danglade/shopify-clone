import { getSetting } from "@/app/actions/settings";
import SettingsForm from "./_components/SettingsForm";

export default async function SettingsPage() {
  const announcementHtml = await getSetting("announcement_bar_html");
  const isDismissible =
    (await getSetting("announcement_dismissible")) === "true";
  const isHeaderSticky = (await getSetting("sticky_header")) === "true";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Site Settings</h1>
      <SettingsForm
        initialAnnouncementHtml={announcementHtml}
        initialIsDismissible={isDismissible}
        initialIsHeaderSticky={isHeaderSticky}
      />
    </div>
  );
} 