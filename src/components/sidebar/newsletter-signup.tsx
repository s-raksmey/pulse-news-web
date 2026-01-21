"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, AlertCircle } from "lucide-react";
import { getTranslations, type Locale } from "@/lib/i18n";

interface NewsletterSignupProps {
  locale: Locale;
  title?: string;
  description?: string;
  className?: string;
}

export default function NewsletterSignup({
  locale,
  title,
  description,
  className = "",
}: NewsletterSignupProps) {
  const t = getTranslations(locale);
  const resolvedTitle = title ?? t.newsletter.title;
  const resolvedDescription = description ?? t.newsletter.description;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage(t.newsletter.invalidEmail);
      return;
    }

    setStatus("loading");
    
    try {
      // Simulate API call - replace with actual newsletter signup logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus("success");
      setMessage(t.newsletter.success);
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(t.newsletter.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-lg ${className}`}
    >
      {/* Header */}
      <div className="mb-4 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{resolvedTitle}</h3>
        <p className="mt-1 text-sm text-slate-600">{resolvedDescription}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.newsletter.emailPlaceholder}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            disabled={status === "loading" || status === "success"}
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "loading" ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{t.newsletter.subscribing}</span>
            </div>
          ) : status === "success" ? (
            <div className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4" />
              <span>{t.newsletter.subscribed}</span>
            </div>
          ) : (
            t.newsletter.subscribeButton
          )}
        </button>
      </form>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 flex items-center gap-2 text-sm ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status === "success" ? (
            <Check className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <span>{message}</span>
        </motion.div>
      )}

      {/* Privacy Note */}
      <p className="mt-4 text-xs text-slate-500">
        {t.newsletter.privacy}
      </p>
    </motion.div>
  );
}
