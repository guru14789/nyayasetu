export interface Situation {
    id: string;
    // Base fields (always in English) - kept for structural reference
    title_en: string;
    summary_en: string;
    legal_basis_en: string;
    steps_en: string[];
    authority_en: string;
    documents_required_en: string[];
    notice_template_en?: string;

    // Core fields
    urgency_level: 'Low' | 'Medium' | 'High';
    is_emergency: boolean;
    confidence_note_en: string;
    keywords: string[];

    // Dynamic access for any language fields like title_hi, summary_kn, etc.
    [key: string]: string | string[] | boolean | undefined;
}

export interface Category {
    id: string;
    title_en: string;
    situations: Situation[];
    [key: string]: string | Situation[] | undefined;
}

export interface LegalData {
    categories: Category[];
}
