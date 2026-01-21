import { getTranslations, type Locale } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-slate-500">
        © {year} {t.footer.brand}. {t.footer.builtWith}
      </div>
    </footer>
  );
}
