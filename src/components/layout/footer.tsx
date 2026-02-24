import Link from "next/link";
import { getTranslations, type Locale } from "@/lib/i18n";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-delay-2"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse-delay-4"></div>
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="group">
                <Link href="/" className="inline-block">
                  <div className="flex items-center space-x-3 group-hover:scale-105 transition-transform duration-300">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                        </svg>
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-white tracking-tight">
                        PULSE <span className="text-red-400">NEWS</span>
                      </h3>
                      <p className="text-blue-300 text-sm font-medium">Breaking News, Real Time</p>
                    </div>
                  </div>
                </Link>
              </div>
              
              <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                {t.footer.brand} - Your trusted source for breaking news and in-depth analysis. 
                Stay informed with real-time updates from around the globe.
              </p>

              {/* Newsletter Signup */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Stay Updated
                </h4>
                <div className="flex space-x-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-red-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-blue-400 to-red-400 rounded-full mr-3"></div>
                Quick Links
              </h4>
              <nav className="space-y-3">
                {[
                  { href: "/", label: t.nav.home, icon: "🏠" },
                  { href: "/about", label: t.nav.about || "About", icon: "ℹ️" },
                  { href: "/contact", label: t.nav.contact || "Contact", icon: "📧" },
                  { href: "/privacy", label: "Privacy Policy", icon: "🔒" },
                  { href: "/terms", label: "Terms of Service", icon: "📋" }
                ].map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="group flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-300 hover:translate-x-2"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                    <span className="group-hover:text-blue-400 transition-colors duration-300">{link.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Social & Connect */}
            <div className="space-y-6">
              <h4 className="text-white font-bold text-lg flex items-center">
                <div className="w-2 h-6 bg-gradient-to-b from-red-400 to-blue-400 rounded-full mr-3"></div>
                Connect With Us
              </h4>
              
              {/* Social Media */}
              <div className="flex flex-wrap gap-4">
                {[
                  { 
                    href: "https://facebook.com", 
                    label: "Facebook", 
                    icon: "M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0",
                    color: "hover:bg-blue-600"
                  },
                  { 
                    href: "https://twitter.com", 
                    label: "Twitter", 
                    icon: "M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195a4.916 4.916 0 0 0-8.38 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.117 2.823 5.254a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.21-.005-.423-.015-.633A9.936 9.936 0 0 0 24 4.557z",
                    color: "hover:bg-sky-500"
                  },
                  { 
                    href: "https://instagram.com", 
                    label: "Instagram", 
                    icon: "M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.809 2.256 6.089 2.243 6.498 2.243 12c0 5.502.013 5.911.072 7.191.059 1.277.353 2.45 1.32 3.417.967.967 2.14 1.261 3.417 1.32 1.28.059 1.689.072 7.191.072s5.911-.013 7.191-.072c1.277-.059 2.45-.353 3.417-1.32.967-.967 1.261-2.14 1.32-3.417.059-1.28.072-1.689.072-7.191s-.013-5.911-.072-7.191c-.059-1.277-.353-2.45-1.32-3.417C21.05.425 19.877.131 18.6.072 17.32.013 16.911 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z",
                    color: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500"
                  },
                  { 
                    href: "https://linkedin.com", 
                    label: "LinkedIn", 
                    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                    color: "hover:bg-blue-700"
                  }
                ].map((social) => (
                  <a 
                    key={social.label}
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={social.label}
                    className={`group relative w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${social.color} hover:shadow-lg hover:shadow-blue-500/25`}
                  >
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-white group-hover:scale-110 transition-transform duration-300">
                      <path d={social.icon}/>
                    </svg>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                ))}
              </div>

              {/* Contact Info */}
              <div className="space-y-3 text-slate-300">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <span className="text-sm">Global News Network</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <span className="text-sm">news@pulsenews.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-slate-300 text-sm">
                <span>© {year} {t.footer.brand}.</span>
                <span className="hidden md:inline">•</span>
                <span className="text-blue-400">{t.footer.builtWith}</span>
              </div>
              
              <div className="flex items-center space-x-6 text-slate-400 text-sm">
                <Link href="/privacy" className="hover:text-white transition-colors duration-300">Privacy</Link>
                <Link href="/terms" className="hover:text-white transition-colors duration-300">Terms</Link>
                <Link href="/cookies" className="hover:text-white transition-colors duration-300">Cookies</Link>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group z-50"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}
