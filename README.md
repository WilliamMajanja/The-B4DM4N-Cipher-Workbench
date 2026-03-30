
# The B4DM4N Cipher Workbench

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white) ![Minima](https://img.shields.io/badge/Minima-00C6A7?style=for-the-badge&logoColor=white)

A **Minima MiniDApp** — an advanced, all-in-one interactive workbench for analyzing historical ciphers and esoteric texts. This tool combines classical cryptanalysis techniques with powerful AI insights from the Google Gemini API and integrates with the **Minima** blockchain for decentralized identity and micro-tipping.

![The B4DM4N Cipher Workbench Screenshot](https://storage.googleapis.com/genai-assets/workbench.png)

---

## ⬡ Minima PiNet OS Integration

This application is a **MiniDApp** built for the Minima ecosystem:

-   **⬡ Node Identity**: Connect to your Minima node to identify yourself on the workbench via your public key.
-   **⬡ Micro-Tipping**: Send a small amount of Minima (0.01) to unlock premium AI analysis features within your session.
-   **Minima Node Native**: Designed to run inside a [Minima](https://minima.global/) node — the MDS API (`/mds.js`) is served automatically.
-   **Works Everywhere**: The workbench functions fully outside a Minima node; Minima-specific features (identity & payments) are simply hidden when MDS is unavailable.

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
-   **Blockchain**: Minima MDS

## 📂 Project Structure

The application is built on a clean, component-based architecture for excellent maintainability and scalability.

```
├── components/
│   ├── layout/          # Page structure (Header with Minima status)
│   ├── ui/              # Reusable UI elements (Buttons, Spinners)
│   ├── AnalysisDashboard.tsx
│   ├── CipherDetails.tsx
│   ├── CipherSelector.tsx
│   ├── KeyLengthAnalysis.tsx
│   ├── MinimaStatusButton.tsx     # Minima node connection button
│   ├── MinimaPaymentButton.tsx  # Minima micro-tip payment button
│   └── ... (other feature components)
├── data/                # Static data (cipher library)
├── services/
│   ├── geminiService.ts     # Google Gemini API integration
│   └── minimaService.ts  # Minima MDS service (identity & payments)
├── utils/               # Core logic (crypto.ts)
├── types.ts             # Centralized TypeScript types (incl. Minima types)
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
└── metadata.json        # Minima MiniDApp metadata
```

## 💻 Getting Started: Running Locally

Follow these instructions to set up and run the project on your local machine for testing and development.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [Minima Node](https://minima.global/) (for testing Minima MiniDApp features)

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

### 5. Testing Minima MiniDApp Features

To test Minima node connection and payments:

1.  Install and run a [Minima node](https://docs.minima.global/docs/runanode/get-started).
2.  Package the app as a MiniDApp (zip the build output) and install it on your node.
3.  Open the MiniDApp from the Minima hub — the MDS API (`/mds.js`) is served automatically.
4.  Click **"⬡ Connect Minima"** in the header to view your node identity.
5.  Use the **"⬡ Tip 0.01 Minima for AI"** button to test the payment flow.

## 📄 License

This project is licensed under the Creative Commons License.
