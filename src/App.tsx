import React, { useState, useMemo, useEffect } from 'react';
import { Search, Scale, Languages, Info, AlertCircle, ChevronRight, BookOpen, Home, Settings, HelpCircle, Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from './hooks/useSpeechToText';
import { searchSituations } from './services/searchService';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category, LegalData, Situation } from './models/types';
import legalDataRaw from './legal_data_v2.json';
import { INDIAN_LANGUAGES } from './config/languages';
import { ui_translations } from './config/ui_translations';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Language = string; // Support any ISO code
type View = 'home' | 'search' | 'about';

export default function App() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [results, setResults] = useState<Situation[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeView, setActiveView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { isListening, startListening, stopListening, error: speechError } = useSpeechToText(language as 'en' | 'hi' | 'ta');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleVoiceInput = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isOnline) {
      alert("Voice input requires a connection in most browsers. Please use the keyboard for full zero-internet search.");
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setQuery(text);
        // Direct call to match requirements
        handleSearch(undefined, text);
      });
    }
  };

  const t = ui_translations[language] || ui_translations.en;

  const categories = (legalDataRaw as any).categories as Category[];

  const handleSearch = (e?: React.FormEvent, forcedQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = forcedQuery !== undefined ? forcedQuery : query;
    if (!activeQuery.trim()) return;

    const allSituations: Situation[] = categories.flatMap(cat => cat.situations);
    const matchedSituations = searchSituations(activeQuery, allSituations, language);

    setResults(matchedSituations);
    setHasSearched(true);
    setActiveView('search');
    setSelectedCategory(null);
  };

  const handleCategoryClick = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    if (cat) {
      setResults(cat.situations);
      setHasSearched(true);
      setActiveView('search');
      setSelectedCategory(catId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-chocolate-500/30 overflow-x-hidden">
      <div className="atmosphere" />

      {/* Header */}
      <header className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 chocolate-gradient rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-chocolate-900/50">
              <Scale size={18} className="md:hidden" />
              <Scale size={24} className="hidden md:block" />
            </div>
            <div className="text-left">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">{t.title}</h1>
              <p className="hidden md:block text-[10px] uppercase tracking-widest font-semibold text-chocolate-400 opacity-80">
                {t.subtitle}
              </p>
            </div>
          </button>


          <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-2.5 py-1 md:px-3 md:py-1.5 border border-white/10">
            <Languages size={14} className="text-white/40" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-xs md:text-sm font-medium focus:outline-none cursor-pointer text-white/80"
            >
              {INDIAN_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-stone-900">
                  {lang.code.toUpperCase()} - {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setActiveView(activeView === 'about' ? 'home' : 'about')}
            className={cn(
              "p-2 rounded-full transition-all border",
              activeView === 'about'
                ? "bg-chocolate-500 text-white border-chocolate-500 shadow-lg shadow-chocolate-900/50"
                : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
            )}
            title={t.navAbout}
          >
            <Info size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 md:py-12">
        <AnimatePresence mode="wait">
          {activeView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="text-center space-y-6 py-12 md:py-20">
                <h2 className="text-4xl md:text-7xl font-display font-medium tracking-tight text-balance leading-[1.1] text-white">
                  {t.heroTitlePart1} <span className="italic font-light text-chocolate-300">{t.heroTitleItalic}</span> {t.heroTitlePart2}
                </h2>
                <p className="text-white/60 text-base md:text-xl max-w-xl mx-auto font-light leading-relaxed">
                  {t.heroSubtitle}
                </p>
              </div>

              <div className="glass-dark p-6 md:p-10 rounded-[2.5rem] chocolate-glow">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/30 group-focus-within:text-chocolate-400 transition-colors">
                    <Search size={22} />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-14 pr-44 md:pr-56 text-lg shadow-inner focus:outline-none focus:ring-4 focus:ring-chocolate-500/10 focus:border-chocolate-500/30 focus:bg-white/10 transition-all placeholder:text-white/20 text-white"
                  />
                  <div className="absolute right-2 inset-y-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => toggleVoiceInput(e)}
                      className={cn(
                        "p-3 rounded-2xl transition-all",
                        isListening
                          ? "bg-red-500 text-white shadow-lg shadow-red-900/50 animate-pulse"
                          : "bg-white/5 text-white/40 hover:bg-white/10"
                      )}
                      title={t.voiceSearch}
                    >
                      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button
                      type="submit"
                      className="px-6 md:px-8 h-full bg-chocolate-500 text-white rounded-2xl font-semibold text-sm md:text-base hover:bg-chocolate-600 transition-all shadow-lg shadow-chocolate-900/50 active:scale-[0.98] hover:shadow-chocolate-500/20"
                    >
                      {t.searchBtn}
                    </button>
                  </div>
                </form>
              </div>

              {/* Categories Grid */}
              <div className="space-y-8 pt-12 border-t border-white/5">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl md:text-3xl font-serif font-medium text-white">{t.categories}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-chocolate-400">
                    Exploring 128 Legal Situations
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="glass-dark p-6 rounded-3xl border border-white/5 hover:border-chocolate-500/30 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-chocolate-500/10 transition-colors">
                        <BookOpen size={20} className="text-white/40 group-hover:text-chocolate-400" />
                      </div>
                      <h4 className="font-medium text-sm md:text-base text-white/80 group-hover:text-white line-clamp-2 min-h-[2.5rem]">
                        {(cat[`title_${language}`] || cat.title_en) as string}
                      </h4>
                      <p className="text-[10px] text-white/20 mt-1 uppercase tracking-wider font-bold">
                        {cat.situations.length} {t.situations}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Mobile Search Bar */}
              <div className="sticky top-16 z-20 bg-black/60 backdrop-blur-md py-4 -mx-4 px-4 border-b border-white/5 md:hidden">
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-32 text-sm focus:outline-none focus:ring-4 focus:ring-chocolate-500/10 focus:border-chocolate-500/30 shadow-sm transition-all text-white placeholder:text-white/20"
                  />
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <div className="absolute right-1.5 inset-y-1.5 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => toggleVoiceInput(e)}
                      className={cn(
                        "p-1.5 rounded-lg transition-all",
                        isListening
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-white/5 text-white/40"
                      )}
                      title={t.voiceSearch}
                    >
                      {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    </button>
                    <button
                      type="submit"
                      className="px-4 h-full bg-chocolate-500 text-white rounded-xl font-bold text-xs hover:bg-chocolate-600 transition-colors"
                    >
                      {t.searchBtn}
                    </button>
                  </div>
                </form>
              </div>

              {/* Desktop Search Bar (Visible only on Search view) */}
              <div className="hidden md:block glass-dark p-8 rounded-[2.5rem] chocolate-glow mb-12">
                <form onSubmit={handleSearch} className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/30 group-focus-within:text-chocolate-400 transition-colors">
                    <Search size={22} />
                  </div>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-56 text-lg focus:outline-none focus:ring-4 focus:ring-chocolate-500/10 focus:border-chocolate-500/30 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                  />
                  <div className="absolute right-2.5 inset-y-2.5 flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={(e) => toggleVoiceInput(e)}
                      className={cn(
                        "p-3 rounded-xl transition-all",
                        isListening
                          ? "bg-red-500 text-white shadow-lg shadow-red-900/50 animate-pulse"
                          : "bg-white/5 text-white/40 hover:bg-white/10"
                      )}
                      title={t.voiceSearch}
                    >
                      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button
                      type="submit"
                      className="px-8 h-full bg-chocolate-500 text-white rounded-xl font-semibold text-base hover:bg-chocolate-600 transition-all shadow-lg shadow-chocolate-900/50 active:scale-[0.98]"
                    >
                      {t.searchBtn}
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-between px-2 mb-8">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveView('home')}
                    className="p-2 -ml-2 hover:bg-white/5 rounded-full md:hidden transition-colors"
                  >
                    <ChevronRight size={22} className="rotate-180 text-white/30" />
                  </button>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
                    {hasSearched ? (results.length > 0 ? `${results.length} ${t.resultsFound}` : t.noResults) : "Enter keywords to search"}
                    {selectedCategory && (
                      <> in {categories.find(c => c.id === selectedCategory)?.[`title_${language}`] || "Category"}</>
                    )}
                  </h3>
                </div>
                {hasSearched && results.length > 0 && (
                  <button onClick={() => { setQuery(''); setHasSearched(false); setActiveView('home'); }} className="text-xs font-bold text-chocolate-400 hover:text-chocolate-300 transition-colors">Clear</button>
                )}
              </div>

              {!hasSearched ? (
                <div className="text-center py-32 opacity-20">
                  <Search size={64} className="mx-auto mb-6 text-white" />
                  <p className="text-lg font-serif italic text-white">Search for laws and rights</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-8">
                  {results.map((situation, idx) => (
                    <motion.div
                      key={situation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="glass-dark rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl shadow-black/50 hover:border-white/10 transition-all group"
                    >
                      <div className="flex flex-col gap-8">
                        <div>
                          <div className="flex items-center gap-3 mb-6">
                            <span className={cn(
                              "text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border",
                              situation.urgency_level === 'High' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                situation.urgency_level === 'Medium' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                  "bg-chocolate-500/10 text-chocolate-300 border-chocolate-500/20"
                            )}>
                              {situation.is_emergency ? t.emergency : `${t.urgency}: ${t[situation.urgency_level.toLowerCase() as keyof typeof t] || situation.urgency_level}`}
                            </span>
                          </div>
                          <h4 className="text-2xl md:text-4xl font-serif font-medium mb-10 text-white leading-tight">
                            {situation[`title_${language}`] || situation.title_en}
                          </h4>

                          <div className="grid grid-cols-1 gap-6">
                            {/* Summary */}
                            <div className="flex items-start gap-5 bg-chocolate-500/10 p-6 rounded-3xl border border-chocolate-500/20">
                              <Info size={20} className="text-chocolate-400 mt-1 shrink-0" />
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-chocolate-400/50 mb-2">{t.explanation}</p>
                                <p className="text-base md:text-lg text-white/90 leading-relaxed">
                                  {situation[`summary_${language}`] || situation.summary_en}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Legal Basis */}
                              <div className="flex items-start gap-5 bg-white/5 p-6 rounded-3xl border border-white/5">
                                <Scale size={20} className="text-white/20 mt-1 shrink-0" />
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-2">{t.lawCode}</p>
                                  <p className="text-sm text-white/70 leading-relaxed font-serif italic">
                                    {situation[`legal_basis_${language}`] || situation.legal_basis_en}
                                  </p>
                                </div>
                              </div>

                              {/* Authority */}
                              <div className="flex items-start gap-5 bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20">
                                <HelpCircle size={20} className="text-blue-400 mt-1 shrink-0" />
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-400/50 mb-2">{t.authority}</p>
                                  <p className="text-sm text-white/80 leading-relaxed">
                                    {situation[`authority_${language}`] || situation.authority_en}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Steps to Take */}
                            <div className="flex items-start gap-5 bg-amber-500/10 p-6 rounded-3xl border border-amber-500/20">
                              <AlertCircle size={20} className="text-amber-400 mt-1 shrink-0" />
                              <div className="w-full">
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400/50 mb-4">{t.action}</p>
                                <ul className="space-y-3">
                                  {((situation[`steps_${language}`] || situation.steps_en) as string[]).map((step: string, i: number) => (
                                    <li key={i} className="flex gap-3 text-sm text-white/80">
                                      <span className="text-amber-400 font-bold">{i + 1}.</span>
                                      <span>{step}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Documents Required */}
                            <div className="flex items-start gap-5 bg-white/5 p-6 rounded-3xl border border-white/5">
                              <BookOpen size={20} className="text-white/20 mt-1 shrink-0" />
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-3">{t.documents}</p>
                                <div className="flex flex-wrap gap-2">
                                  {((situation[`documents_required_${language}`] || situation.documents_required_en) as string[]).map((doc: string, i: number) => (
                                    <span key={i} className="text-[11px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/60">
                                      {doc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Notice Template */}
                            {(situation[`notice_template_${language}`] || situation.notice_template_en) &&
                              (situation[`notice_template_${language}`] || situation.notice_template_en) !== "N/A" && (
                                <div className="bg-black/20 p-6 rounded-3xl border border-white/5">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 mb-3">Notice Template</p>
                                  <pre className="text-xs text-white/40 font-mono whitespace-pre-wrap leading-relaxed">
                                    {situation[`notice_template_${language}`] || situation.notice_template_en}
                                  </pre>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 glass-dark rounded-[2rem] border-2 border-dashed border-white/5">
                  <AlertCircle size={48} className="mx-auto text-white/10 mb-4" />
                  <p className="text-white/40 font-medium px-6">{t.noResults}</p>
                  <button onClick={() => { setQuery(''); setHasSearched(false); setActiveView('home'); }} className="mt-4 text-sm font-bold text-chocolate-400 underline">{t.goBack}</button>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="glass-dark p-10 md:p-16 rounded-[3rem] chocolate-glow">
                <h3 className="text-4xl md:text-6xl font-serif font-medium mb-12 text-white">{t.aboutTitle} <span className="italic text-chocolate-300">NyayaSetu</span></h3>
                <div className="space-y-10 text-white/60 text-lg md:text-xl leading-relaxed font-light">
                  <p>{t.aboutPara1}</p>
                  <p>{t.aboutPara2}</p>

                  <div className="p-10 bg-white/5 rounded-[2.5rem] border border-white/10">
                    <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 mb-8">{t.keyFeatures}</h4>
                    <ul className="space-y-6">
                      {[
                        t.feature1,
                        t.feature2,
                        t.feature3,
                        t.feature4,
                        t.feature5
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-5">
                          <div className="w-2 h-2 bg-chocolate-400 rounded-full shadow-lg shadow-chocolate-900" />
                          <span className="text-white/80 font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-500/10 p-8 rounded-3xl border border-amber-500/20">
                    <p className="text-sm text-amber-200/70 italic leading-relaxed text-center">
                      {t.disclaimer}
                    </p>
                  </div>

                  <div className="pt-6 text-center">
                    <button
                      onClick={() => setActiveView('home')}
                      className="inline-flex items-center gap-2 text-chocolate-400 font-bold hover:text-chocolate-300 transition-colors"
                    >
                      <ChevronRight size={20} className="rotate-180" />
                      {t.backToHome}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/10">
        &copy; 2026 NyayaSetu • Simplified Legal Awareness for Citizens
      </footer>
    </div >
  );
}
