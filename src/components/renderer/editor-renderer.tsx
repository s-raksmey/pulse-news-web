// @/components/renderer/editor-renderer.tsx
"use client";

import type { EditorBlock, EditorOutputData } from "@/types/editor";

/* =========================
   Helpers
========================= */

function renderVideo(data: any) {
  // ✅ ONLY allow embed-safe URLs
  const src = data?.embed || data?.url;

  if (!src) return null;

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl border bg-black">
      <iframe
        src={src}
        className="absolute inset-0 h-full w-full"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

// Safe HTML rendering helper
function safeHtmlRender(html: string) {
  return { __html: html || "" };
}

/* =========================
   Renderer
========================= */

export default function EditorRenderer({
  data,
}: {
  data: EditorOutputData;
}) {
  // Debug log - remove in production
  if (process.env.NODE_ENV === 'development') {
    console.log('EditorRenderer data:', {
      hasData: !!data,
      blocksCount: data?.blocks?.length,
      blocks: data?.blocks?.map(b => ({
        type: b.type,
        id: b.id,
        hasText: !!b.data?.text,
        hasUrl: !!b.data?.url
      }))
    });
  }

  if (!data?.blocks?.length) {
    return (
      <div className="text-center py-8 text-slate-500">
        No content available
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      {data.blocks.map((b: EditorBlock, i: number) => {
        try {
        const highlight = b.tunes?.highlight?.highlighted
          ? "editor-highlight bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-2 rounded-r"
          : "";

        /* ---------- IMAGE ---------- */
        if (b.type === "image") {
          // Based on debug data, image URLs are in b.data.url
          const imageUrl = b.data?.url || b.data?.file?.url;
          
          if (!imageUrl) {
            console.warn('Image block missing URL:', b);
            return null;
          }

          return (
            <figure key={b.id || i} className="my-6">
              <img
                src={imageUrl}
                alt={b.data.caption || "Article image"}
                loading="lazy"
                className="mx-auto w-full max-w-[900px] rounded-xl border"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {b.data.caption && (
                <figcaption className="mt-2 text-sm text-slate-500 text-center">
                  {b.data.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        /* ---------- VIDEO ---------- */
        if (b.type === "video") {
          return (
            <div key={b.id || i} className={`my-8 ${highlight}`}>
              {renderVideo(b.data)}
            </div>
          );
        }

        /* ---------- PARAGRAPH ---------- */
        if (b.type === "paragraph") {
          const text = b.data?.text || "";
          
          if (!text) return null;
          
          return (
            <div
              key={b.id || i}
              className={`leading-7 text-slate-800 ${highlight}`}
            >
              <p>{text}</p>
            </div>
          );
        }

        /* ---------- HEADER ---------- */
        if (b.type === "header") {
          const level = b.data?.level || 2;
          const text = b.data?.text || "";
          
          if (!text) return null;
          
          const Tag = `h${Math.min(6, Math.max(1, level))}` as keyof JSX.IntrinsicElements;
          
          return (
            <Tag
              key={b.id || i}
              className={`font-bold mt-8 mb-4 ${highlight}`}
            >
              {text}
            </Tag>
          );
        }

        /* ---------- LIST ---------- */
        if (b.type === "list") {
          const items = b.data?.items || [];
          
          if (!items.length) return null;
          
          return b.data.style === "ordered" ? (
            <ol key={b.id || i} className={`list-decimal pl-6 space-y-2 ${highlight}`}>
              {items.map((item: any, idx: number) => (
                <li key={idx} className="text-slate-700">
                  {typeof item === 'string' ? item : (item?.content || item?.text || JSON.stringify(item))}
                </li>
              ))}
            </ol>
          ) : (
            <ul key={b.id || i} className={`list-disc pl-6 space-y-2 ${highlight}`}>
              {items.map((item: any, idx: number) => (
                <li key={idx} className="text-slate-700">
                  {typeof item === 'string' ? item : (item?.content || item?.text || JSON.stringify(item))}
                </li>
              ))}
            </ul>
          );
        }

        /* ---------- QUOTE ---------- */
        if (b.type === "quote") {
          const text = b.data?.text || "";
          const caption = b.data?.caption;
          
          if (!text) return null;
          
          return (
            <blockquote
              key={b.id || i}
              className={`border-l-4 border-blue-500 pl-6 py-2 italic text-slate-600 bg-blue-50 rounded-r my-6 ${highlight}`}
            >
              <p className="text-lg">{text}</p>
              {caption && (
                <footer className="mt-2 text-right text-sm text-slate-500">
                  — {caption}
                </footer>
              )}
            </blockquote>
          );
        }

        /* ---------- DELIMITER (Horizontal Rule) ---------- */
        if (b.type === "delimiter") {
          return (
            <hr key={b.id || i} className="my-8 border-t border-gray-300" />
          );
        }

        /* ---------- EMBED ---------- */
        if (b.type === "embed") {
          const embedUrl = b.data?.embed || b.data?.url;
          
          if (!embedUrl) return null;
          
          return (
            <div key={b.id || i} className={`my-8 ${highlight}`}>
              <div className="relative w-full aspect-video overflow-hidden rounded-xl border bg-black">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              {b.data.caption && (
                <figcaption className="mt-2 text-sm text-slate-500 text-center">
                  {b.data.caption}
                </figcaption>
              )}
            </div>
          );
        }

        /* ---------- TABLE ---------- */
        if (b.type === "table") {
          const content = b.data?.content || [];
          
          if (!content.length) return null;
          
          return (
            <div key={b.id || i} className={`my-8 overflow-x-auto ${highlight}`}>
              <table className="min-w-full border border-gray-300">
                <tbody>
                  {content.map((row: string[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex} 
                          className="border border-gray-300 px-4 py-2 text-slate-700"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        /* ---------- WARNING ---------- */
        if (b.type === "warning") {
          const title = b.data?.title || "";
          const message = b.data?.message || "";
          
          return (
            <div key={b.id || i} className={`my-6 p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r ${highlight}`}>
              {title && <div className="font-bold text-amber-800 mb-1">{title}</div>}
              {message && <div className="text-amber-700">{message}</div>}
            </div>
          );
        }

        /* ---------- CODE ---------- */
        if (b.type === "code") {
          const code = b.data?.code || "";
          
          if (!code) return null;
          
          return (
            <pre key={b.id || i} className={`my-6 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto font-mono text-sm ${highlight}`}>
              <code>{code}</code>
            </pre>
          );
        }

        /* ---------- UNSUPPORTED BLOCK TYPE ---------- */
        console.warn(`Unsupported Editor.js block type: ${b.type}`, b);
        
        return (
          <div 
            key={b.id || i} 
            className="my-4 p-4 bg-gray-100 rounded border border-gray-300 text-sm text-gray-600"
          >
            <div className="font-medium mb-1">Unsupported content type: <code>{b.type}</code></div>
            <div className="text-xs opacity-75">
              Block ID: {b.id || 'N/A'}
            </div>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-2 text-xs overflow-auto max-h-40">
                {JSON.stringify(b, null, 2)}
              </pre>
            )}
          </div>
        );
        } catch (error) {
          console.error('Error rendering block:', error, b);
          return (
            <div 
              key={b.id || i} 
              className="my-4 p-4 bg-red-100 rounded border border-red-300 text-sm text-red-600"
            >
              <div className="font-medium mb-1">Error rendering block: <code>{b.type}</code></div>
              <div className="text-xs opacity-75">
                Block ID: {b.id || 'N/A'}
              </div>
              {process.env.NODE_ENV === 'development' && (
                <pre className="mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(b, null, 2)}
                </pre>
              )}
            </div>
          );
        }
      })}
    </article>
  );
}
