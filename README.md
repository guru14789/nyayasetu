# ⚖️ NyayaSetu: Zero-Internet Legal Awareness Platform

**NyayaSetu** (meaning "Bridge to Justice") is a specialized, **100% offline-first** web application designed to bridge the gap between complex legal jargon and common citizens. The platform provides simplified legal guidance across multiple Indian languages, ensuring that justice and awareness are accessible even in areas with zero internet connectivity.

---

## 🚀 Fully Offline Architecture

Unlike traditional legal platforms that rely on cloud-based AI or remote databases, NyayaSetu is engineered to reside entirely on the user's device:

- **Local Brain**: The entire legal database (`legal_data_v2.json`) is bundled within the application.
- **Embedded Search Engine**: Uses a custom, client-side scoring algorithm to find laws based on keywords and situational context without any API calls.
- **Zero-Latency**: Instantaneous responses with no loading states for data retrieval.
- **Privacy First**: No search queries ever leave your device. Everything remains private and local.

---

## ✨ Key Features

### 🏛️ Simplified Legal Situations
Complex laws (IPC, BNS, etc.) are translated into "Real-Life Situations" (e.g., "What to do if a landlord locks you out?"). This makes the law relatable to everyone.

### 🌐 Multilingual Accessibility
Built for India's diversity, supporting multiple languages:
- **English, Hindi, Tamil** (Primary support)
- Placeholder support for 20+ other regional languages.

### 🎙️ Emergency & Urgency Indicators
Each legal situation is tagged with an urgency level (High, Medium, Low) and whether it constitutes an emergency, helping users prioritize actions.

### 📋 Actionable Step-by-Step Guides
Provides a clear roadmap:
1. **Explanation**: What does the law say in simple terms?
2. **Steps to Take**: Immediate actions to protect your rights.
3. **Documents Required**: List of what you need to carry to a police station or court.
4. **Authority**: Which government body handles this specific issue.

### 📝 Notice Templates
Commonly required legal notice drafts are provided for users to copy and adapt.

---

## 🛠️ Technical Specifications

| Spec | Implementation |
| :--- | :--- |
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite |
| **Data Storage** | Local JSON Bundling (Zero DB connection required) |
| **Styling** | Vanilla CSS + Tailwind CSS 4 (Custom Chocolate/Black Theme) |
| **Animations** | Framer Motion / Motion for React |
| **Search Logic** | Weighted Keyword Matching + Synonym Mapping |
| **Language Support** | Dynamic ISO-code based mapping |

---

## 📂 Project Structure

- `src/App.tsx`: The heart of the application, managing views and state.
- `src/legal_data_v2.json`: The **Offline Database** containing hundreds of law-simplified situations.
- `src/services/searchService.ts`: The **Local Search Machine** that powers the finding of laws without internet.
- `src/config/ui_translations.ts`: Localized interface text for multi-language support.

---

## � Getting Started

### Prerequisites
- Node.js (v18+)
- A modern web browser (for PWA and local storage support)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/guru14789/nyayasetu.git
   cd nyayasetu
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the local server:**
   ```bash
   npm run dev
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```
   *The generated `dist` folder can be hosted on any static hosting service or even run locally via a simple file server.*

---

## 📄 Disclaimer
NyayaSetu is an awareness tool. It aims to provide simplified information about Indian laws but does not constitute professional legal advice. Users should always consult with a qualified legal professional for specific cases.

&copy; 2026 NyayaSetu • Empowering Citizens Through Knowledge.
