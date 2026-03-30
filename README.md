
# The B4DM4N Cipher Workbench

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Gemini](https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white) ![Pi Network](https://img.shields.io/badge/Pi_Network-6D3FAC?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHRleHQgeD0iNCIgeT0iMTgiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE4Ij7PgDwvdGV4dD48L3N2Zz4=&logoColor=white)

A **Pi Network DApp** — an advanced, all-in-one interactive workbench for analyzing historical ciphers and esoteric texts. This tool combines classical cryptanalysis techniques with powerful AI insights from the Google Gemini API and integrates with the **Pi Network** blockchain for decentralized identity and micro-tipping.

![The B4DM4N Cipher Workbench Screenshot](https://storage.googleapis.com/genai-assets/workbench.png)

---

## 🟣 Pi Network Integration

This application is a **decentralized application (DApp)** built for the Pi Network ecosystem:

-   **π Wallet Authentication**: Connect your Pi wallet via the Pi Browser to identify yourself on the workbench.
-   **π Micro-Tipping**: Tip a small amount of Pi (0.01 π) to unlock premium AI analysis features within your session.
-   **Pi Browser Native**: Designed to run inside the [Pi Browser](https://minepi.com/) — the Pi SDK is loaded automatically.
-   **Works Everywhere**: The workbench functions fully outside the Pi Browser; Pi-specific features (auth & payments) are simply hidden when the SDK is unavailable.

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
-   **Blockchain**: Pi Network SDK

## 📂 Project Structure

The application is built on a clean, component-based architecture for excellent maintainability and scalability.

```
├── components/
│   ├── layout/          # Page structure (Header with Pi auth)
│   ├── ui/              # Reusable UI elements (Buttons, Spinners)
│   ├── AnalysisDashboard.tsx
│   ├── CipherDetails.tsx
│   ├── CipherSelector.tsx
│   ├── KeyLengthAnalysis.tsx
│   ├── PiAuthButton.tsx     # Pi Network wallet connection button
│   ├── PiPaymentButton.tsx  # Pi micro-tip payment button
│   └── ... (other feature components)
├── data/                # Static data (cipher library)
├── services/
│   ├── geminiService.ts     # Google Gemini API integration
│   └── piNetworkService.ts  # Pi Network SDK service (auth & payments)
├── utils/               # Core logic (crypto.ts)
├── types.ts             # Centralized TypeScript types (incl. Pi types)
├── App.tsx              # Main application component
├── index.tsx            # Application entry point
└── metadata.json        # Pi Network DApp metadata
```

## 💻 Getting Started: Running Locally

Follow these instructions to set up and run the project on your local machine for testing and development.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [Pi Browser](https://minepi.com/) (for testing Pi wallet features)

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

### 5. Testing Pi Network Features

To test Pi wallet authentication and payments:

1.  Deploy the app to a publicly accessible URL (or use a tunnel like ngrok).
2.  Register your app on the [Pi Developer Portal](https://develop.pi).
3.  Open the app URL in the **Pi Browser** — the SDK will be injected automatically.
4.  Click **"π Connect Pi Wallet"** in the header to authenticate.
5.  Use the **"π Tip 0.01 Pi for AI"** button to test the payment flow.

## 📄 License

This project is licensed under the Creative Commons License.
