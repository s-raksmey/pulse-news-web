"use client";

import { useEffect, useRef, useState } from "react";

type LanguageToggleProps = {
  initialLocale: "en" | "km";
};

const LOCALE_LABELS: Record<LanguageToggleProps["initialLocale"], "EN" | "KH"> = {
  en: "EN",
  km: "KH",
};

const LABEL_TO_LOCALE: Record<"EN" | "KH", LanguageToggleProps["initialLocale"]> = {
  EN: "en",
  KH: "km",
};

export default function LanguageToggle({ initialLocale }: LanguageToggleProps) {
  const [lang, setLang] = useState<"EN" | "KH">(LOCALE_LABELS[initialLocale]);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const locale = LABEL_TO_LOCALE[lang];
    document.documentElement.lang = locale;
    document.documentElement.dataset.locale = locale;
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
    if (hasMountedRef.current) {
      window.location.reload();
    } else {
      hasMountedRef.current = true;
    }
  }, [lang]);

  return (
    <div className="inline-flex items-center rounded-md border bg-white p-1 text-xs">
      <button
        type="button"
        onClick={() => setLang("EN")}
        className={`rounded px-2 py-1 ${lang === "EN" ? "bg-slate-900 text-white" : "text-slate-700"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("KH")}
        className={`rounded px-2 py-1 ${lang === "KH" ? "bg-slate-900 text-white" : "text-slate-700"}`}
      >
        KH
      </button>
    </div>
  );
}
