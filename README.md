
# The B4DM4N Cipher Workbench

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white)

An advanced, all-in-one interactive workbench for analyzing historical ciphers and esoteric texts. This tool combines classical cryptanalysis techniques with powerful AI insights from the Google Gemini API, creating a comprehensive environment for enthusiasts, researchers, and puzzle solvers.

![The B4DM4N Cipher Workbench Screenshot](https://storage.googleapis.com/genai-assets/workbench.png)

---

## ✨ Core Features

-   **🏛️ Expansive & Organized Library**: Analyze a curated list of famous ciphers (Kryptos, Vicksburg) and esoteric texts (Torah, Emerald Tablet), or paste your own custom text.
-   **🛠️ Interactive Solver Suite**: Instantly decrypt classical ciphers:
    -   **Vigenère Solver**: Decrypts using a keyword.
    -   **Caesar Solver**: An interactive slider to test all 26 rotational shifts.
    -   **Atbash Solver**: One-click decryption for the Hebrew mirror alphabet cipher.
-   **🤖 AI-Powered Analysis (Gemini API)**:
    -   **Context-Aware Insights**: Get tailored analysis from Gemini based on the text type (Vigenère, Esoteric, Puzzle).
    -   **AI Keyword Suggestions**: Let the AI suggest high-probability keywords for Vigenère ciphers.
    -   **One-Click Auto-Analysis**: Clicking a suggested keyword automatically triggers a full AI analysis of the decryption attempt.
-   **📈 Professional Cryptanalysis Dashboard**: A multi-tabbed interface with professional-grade tools:
    -   **Key Length Analysis**: Combines Kasiski Examination with an interactive Index of Coincidence (IoC) chart to find the key length.
    -   **Frequency Analysis**: Side-by-side charts comparing ciphertext and plaintext letter frequencies against English norms.
    -   **N-gram Analysis**: View the most frequent character digrams and trigrams to spot patterns.
-   **📜 Textual & Esoteric Study Tools**:
    -   **Hieroglyphics Lab**: Transliterate names into a royal cartouche and reference common glyphs.
    -   **Multi-Schema Gematria Calculator**: Supports Pythagorean, Chaldean, Hebrew, Greek (Isopsephy), and Sanskrit (Katapayadi) systems.
    -   **Character Set Display**: Instantly view every unique character in the source text.
-   **📝 Persistent Workspace**: A dedicated notepad for each cipher where your notes, theories, and discoveries are automatically saved to your browser's local storage.

## 🚀 Technology Stack

-   **Frontend**: React 18 (with Hooks)
-   **Language**: TypeScript
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API
-   **Charting**: Recharts

## 📂 Project Structure

The application is built on a clean, component-based architecture for excellent maintainability and scalability.

```
src/
├── components/
│   ├── layout/       # Page structure (Header)
│   ├── ui/           # Reusable UI elements (Buttons, Spinners)
│   ├── AnalysisDashboard.tsx
│   ├── CipherDetails.tsx
│   ├── CipherSelector.tsx
│   ├── KeyLengthAnalysis.tsx
│   └── ... (other feature components)
├── data/             # Static data (cipher library)
├── services/         # External API interactions (geminiService.ts)
├── utils/            # Core logic (crypto.ts)
├── types.ts          # Centralized TypeScript types
├── App.tsx           # Main application component
└── index.tsx         # Application entry point
```

## 💻 Getting Started: Running Locally

Follow these instructions to set up and run the project on your local machine for testing and development.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/WilliamMajanja/b4dm4n-cipher-workbench.git
cd b4dm4n-cipher-workbench
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

This application requires a Google Gemini API key to power its AI features.

1.  Create a file named `.env` in the root of the project directory.
2.  Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3.  Add your key to the `.env` file:

    ```
    VITE_API_KEY="your_gemini_api_key_goes_here"
    ```

**Important**: The `VITE_` prefix is required by Vite to expose the variable to the browser. Your `.env` file should be listed in `.gitignore` and never committed to source control.

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📄 License

This project is licensed under the Creative Commons License.
