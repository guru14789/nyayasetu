import { Situation } from "../models/types";

const templates = {
    en: {
        to: "To,",
        subject: "Subject: Complaint regarding",
        body: (name: string, address: string, title: string) => `I, ${name}, residing at ${address}, would like to inform that I am facing the issue of "${title}".`,
        legal: (basis: string) => `As per ${basis}, I request immediate action on this matter.`,
        closing: "Sincerely,"
    },
    hi: {
        to: "सेवा में,",
        subject: "विषय: शिकायत के बारे में",
        body: (name: string, address: string, title: string) => `मैं, ${name}, पुत्र/पुत्री ${address} का निवासी, आपको सूचित करना चाहता हूं कि मैं "${title}" की समस्या का सामना कर रहा हूं।`,
        legal: (basis: string) => `${basis} के अनुसार, मैं इस मामले में तत्काल कार्रवाई का अनुरोध करता हूं।`,
        closing: "भवदीय,"
    },
    ta: {
        to: "பெறுநர்,",
        subject: "பொருள்: புகார் தொடர்பான",
        body: (name: string, address: string, title: string) => `நான், ${name}, ${address} இல் வசிப்பவர், "${title}" தொடர்பான சிக்கலை எதிர்கொள்கிறேன் என்பதைத் தெரிவித்துக் கொள்கிறேன்.`,
        legal: (basis: string) => `${basis} இன் படி, இந்த விஷயத்தில் உடனடி நடவடிக்கை எடுக்குமாறு கேட்டுக்கொள்கிறேன்.`,
        closing: "இப்படிக்கு,"
    }
};

export function generateNotice(
    situation: Situation,
    name: string,
    address: string,
    language: 'en' | 'hi' | 'ta' = 'en'
): string {
    const t = templates[language] || templates.en;
    const title = situation[`title_${language}`] || situation.title_en;
    const summary = situation[`summary_${language}`] || situation.summary_en;
    const authority = situation[`authority_${language}`] || situation.authority_en;
    const basis = situation[`legal_basis_${language}`] || situation.legal_basis_en;

    return `
${t.to}
${authority}

${t.subject} ${title}

${t.body(name, address, title)}

${summary}

${t.legal(basis)}

${t.closing}
${name}
`;
}
