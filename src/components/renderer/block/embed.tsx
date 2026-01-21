"use client";

type Props = { url: string };

function toIframeSrc(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    // reuse the same helpers as video-tool if you want
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split(/[?&]/)[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (url.includes("/watch")) {
      const id = new URL(url).searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
    if (url.includes("/shorts/")) {
      const id = url.split("/shorts/")[1]?.split(/[?&]/)[0];
      return id ? `https://www.youtube.com/embed/${id}` : "";
    }
  }

  if (url.includes("facebook.com")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}&show_text=0&width=560`;
  }

  if (url.includes("instagram.com")) {
    const cleaned = url.replace(/\?.*$/, "").replace(/\/$/, "");
    const m = cleaned.match(/instagram\.com\/(p|reel)\/([^/]+)/i);
    if (!m) return "";
    return `https://www.instagram.com/${m[1]}/${m[2]}/embed`;
  }

  return "";
}

export default function EmbedBlock({ url }: Props) {
  const src = toIframeSrc(url);
  if (!src) return null;

  return (
    <div className="my-6 aspect-video w-full overflow-hidden rounded-xl border border-slate-200">
      <iframe
        src={src}
        className="h-full w-full"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
