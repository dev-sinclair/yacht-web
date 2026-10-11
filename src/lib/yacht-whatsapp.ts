const WEBSITE_ORIGIN = "https://yacht-web-indol.vercel.app";

export function yachtWhatsAppUrl(yachtName: string, pathname: string): string {
  const yachtUrl = new URL(pathname, WEBSITE_ORIGIN);
  yachtUrl.search = "";
  yachtUrl.hash = "";
  const message = [
    `I'm enquiring about this yacht: ${yachtName}`,
    yachtUrl.href,
    "",
    "Preferred dates: ",
    "Destination / cruising area: ",
    "Number of guests: ",
    "My name: ",
    "Email / preferred contact: ",
    "Additional information: ",
  ].join("\n");
  return `https://wa.me/34744409765?text=${encodeURIComponent(message)}`;
}
