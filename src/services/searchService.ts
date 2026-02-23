import { Situation } from "../models/types";

const stopWords = new Set(["the", "a", "an", "in", "on", "at", "for", "to", "of", "and", "or", "is", "with", "from", "my", "our", "your", "their", "not", "no", "how", "i", "am", "facing", "issue", "problem", "regarding", "about", "want", "tell", "me", "what", "can", "do", "if", "when"]);

const synonyms: Record<string, string[]> = {
    "landlord": ["owner", "proprietor", "house owner", "मकान मालिक", "வீட்டு உரிமையாளர்", "owner"],
    "tenant": ["renter", "occupant", "lessee", "किरायेदार", "வாடகையாளர்"],
    "police": ["cop", "officer", "station", "thana", "पुलिस", "थाना", "காவல்துறை", "காவல் நிலையம்"],
    "money": ["cash", "amount", "payment", "deposit", "fund", "पैसे", "रुपये", "பணம்", "வைப்பு"],
    "lock": ["locked", "closure", "entry", "ताला", "பூட்டு"],
    "evict": ["remove", "throw out", "leave", "kick out", "बेदखल", "வெளியேற்று"],
    "arrest": ["jail", "prison", "custody", "locked up", "गिरफ्तार", "கைது"],
    "fir": ["complaint", "report", "case", "प्राथमिकी", "शिकायत", "புகார்"]
};

function normalize(text: string): string[] {
    // Unicode ranges for major Indian scripts:
    // Devanagari (\u0900-\u097F), Bengali (\u0980-\u09FF), Gurmukhi (\u0A00-\u0A7F), 
    // Gujarati (\u0A80-\u0AFF), Oriya (\u0B00-\u0B7F), Tamil (\u0B80-\u0BFF), 
    // Telugu (\u0C00-\u0C7F), Kannada (\u0C80-\u0CFF), Malayalam (\u0D00-\u0D7F)
    const rawWords = text.toLowerCase()
        .replace(/[^\w\s\u0900-\u0D7F]/g, "")
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word));

    const expandedWords = [...rawWords];

    // Add synonyms to the search terms to increase hit rate
    rawWords.forEach(word => {
        for (const [key, list] of Object.entries(synonyms)) {
            if (key === word || list.includes(word)) {
                expandedWords.push(key);
                list.forEach(s => expandedWords.push(s));
            }
        }
    });

    return [...new Set(expandedWords)];
}

export function searchSituations(
    query: string,
    situations: Situation[],
    language: string = 'en'
): Situation[] {
    const queryTerms = normalize(query);
    if (queryTerms.length === 0) return [];

    const scored = situations.map((s) => {
        let score = 0;

        // Language specific Title matching
        const titleKey = `title_${language}` as keyof Situation;
        const summaryKey = `summary_${language}` as keyof Situation;
        const legalBasisKey = `legal_basis_${language}` as keyof Situation;

        const title = (s[titleKey] || s.title_en || "").toString().toLowerCase();
        const summary = (s[summaryKey] || s.summary_en || "").toString().toLowerCase();
        const legalBasis = (s[legalBasisKey] || s.legal_basis_en || "").toString().toLowerCase();
        const keywords = (s.keywords || []).map(k => k.toLowerCase());

        queryTerms.forEach(term => {
            // High priority: Direct title match
            if (title.includes(term)) {
                score += 15;
                if (title.startsWith(term)) score += 5; // Bonus for start of title
            }

            // High priority: Direct keyword match
            keywords.forEach(kw => {
                if (kw === term) score += 20; // Exact keyword match is highest
                else if (kw.includes(term)) score += 8;
            });

            // Medium priority: Summary match
            if (summary.includes(term)) {
                score += 8; // Increased from 5 to 8 for better discovery
            }

            // Low priority: Legal basis match
            if (legalBasis.includes(term)) {
                score += 3;
            }
        });

        // Exact match bonus for the whole phrase in title
        const normalizedQuery = query.toLowerCase();
        if (title.includes(normalizedQuery)) score += 30;

        return { situation: s, score };
    })
        .filter((item) => item.score > 2) // Minimum threshold to reduce noise
        .sort((a, b) => b.score - a.score);

    // If top result is significantly better, maybe just show that, 
    // but here we return top 5 for variety.
    return scored.map((item) => item.situation).slice(0, 5);
}

