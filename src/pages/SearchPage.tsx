import { useState } from "react";
import data from "../legal_data_v2.json";
import { Category, LegalData, Situation } from "../models/types";
import { searchSituations } from "../services/searchService";
import { useSpeechToText } from "../hooks/useSpeechToText";
import { Mic, MicOff, Search as SearchIcon } from "lucide-react";

const legalData = data as any;

interface Props {
    language?: 'en' | 'hi' | 'ta';
}

function SearchPage({ language = 'en' }: Props) {
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<Situation[]>([]);
    const { isListening, startListening, stopListening } = useSpeechToText(language);

    const allSituations = legalData.categories.flatMap(
        (category) => category.situations
    );

    const handleSearch = (forcedQuery?: string) => {
        const activeQuery = forcedQuery !== undefined ? forcedQuery : query;
        const matched = searchSituations(activeQuery, allSituations, language);
        setResults(matched);
    };

    const toggleVoiceInput = (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (isListening) {
            stopListening();
        } else {
            startListening((text) => {
                setQuery(text);
                handleSearch(text);
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30 group-focus-within:text-chocolate-400 transition-colors">
                    <SearchIcon size={20} />
                </div>
                <input
                    type="text"
                    placeholder="Describe your issue..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-40 text-lg focus:outline-none focus:ring-4 focus:ring-chocolate-500/10 focus:border-chocolate-500/30 transition-all text-white placeholder:text-white/20"
                />
                <div className="absolute right-2 inset-y-2 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={(e) => toggleVoiceInput(e)}
                        className={`p-2.5 rounded-xl transition-all ${isListening
                            ? "bg-red-500 text-white animate-pulse"
                            : "bg-white/5 text-white/40 hover:bg-white/10"
                            }`}
                    >
                        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                    <button
                        onClick={() => handleSearch()}
                        className="px-6 h-full bg-chocolate-500 text-white rounded-xl font-semibold hover:bg-chocolate-600 transition-all shadow-lg shadow-chocolate-900/50"
                    >
                        Search
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {results.map((item) => (
                    <div key={item.id} className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                        <h3 className="text-xl font-medium text-white mb-2">{item[`title_${language}`] || item.title_en}</h3>
                        <p className="text-white/60 leading-relaxed">{item[`summary_${language}`] || item.summary_en}</p>
                        <div className="mt-4 flex gap-2">
                            {item.keywords.slice(0, 3).map(kw => (
                                <span key={kw} className="text-[10px] uppercase tracking-wider font-bold bg-white/5 px-2 py-1 rounded text-white/30">
                                    #{kw}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchPage;

