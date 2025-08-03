export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const HEBREW_ALPHABET = "אבגדהוזחטיכךלמםנןסעפףצץקרשת";
export const GREEK_ALPHABET_LOWER = "αβγδεζηθικλμνξοπρστυφχψω";
export const GREEK_ALPHABET_UPPER = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
export const DEVANAGARI_REGEX_CHAR_CHECK = /[\u0900-\u097F]/;

export const HIEROGLYPH_UNILITERALS: { [key: string]: { glyph: string; desc: string; sound: string } } = {
    'A': { glyph: '𓄿', desc: 'Egyptian Vulture', sound: 'ah' },
    'I': { glyph: '𓇋', desc: 'Flowering Reed', sound: 'i/y' },
    'Y': { glyph: '𓇋', desc: 'Flowering Reed', sound: 'i/y' },
    'E': { glyph: '𓇋', desc: 'Flowering Reed', sound: 'i/y' }, // Mapped to I
    'U': { glyph: '𓅱', desc: 'Quail Chick', sound: 'w/u' },
    'W': { glyph: '𓅱', desc: 'Quail Chick', sound: 'w/u' },
    'O': { glyph: '𓅱', desc: 'Quail Chick', sound: 'w/u' }, // Mapped to U
    'B': { glyph: '𓃀', desc: 'Foot', sound: 'b' },
    'P': { glyph: '𓊪', desc: 'Stool', sound: 'p' },
    'F': { glyph: '𓆑', desc: 'Horned Viper', sound: 'f' },
    'M': { glyph: '𓅓', desc: 'Owl', sound: 'm' },
    'N': { glyph: '𓈖', desc: 'Water Ripple', sound: 'n' },
    'R': { glyph: '𓂋', desc: 'Mouth', sound: 'r' },
    'L': { glyph: '𓂋', desc: 'Mouth', sound: 'r' }, // Mapped to R
    'H': { glyph: '𓉔', desc: 'Reed Shelter', sound: 'h' },
    'S': { glyph: '𓋴', desc: 'Folded Cloth', sound: 's' },
    'Z': { glyph: '𓋴', desc: 'Folded Cloth', sound: 's' }, // Mapped to S
    'SH':{ glyph: '𓈙', desc: 'Pool of Water', sound: 'sh' },
    'Q': { glyph: '𓈎', desc: 'Hill Slope', sound: 'q' },
    'K': { glyph: '𓎡', desc: 'Basket with Handle', sound: 'k' },
    'G': { glyph: '𓎼', desc: 'Jar Stand', sound: 'g' },
    'T': { glyph: '𓏏', desc: 'Bread Loaf', sound: 't' },
    'TH':{ glyph: '𓍿', desc: 'Tethering Rope', sound: 'tch' },
    'D': { glyph: '𓂧', desc: 'Hand', sound: 'd' },
    'DJ':{ glyph: '𓆓', desc: 'Cobra', sound: 'dj' },
};

const SANSKRIT_KATAPAYADI_VALUES = {
    // Consonants
    'क': 1, 'ख': 2, 'ग': 3, 'घ': 4, 'ङ': 5, 'च': 6, 'छ': 7, 'ज': 8, 'झ': 9, 'ञ': 0,
    'ट': 1, 'ठ': 2, 'ड': 3, 'ढ': 4, 'ण': 5, 'त': 6, 'थ': 7, 'द': 8, 'ध': 9, 'न': 0,
    'प': 1, 'फ': 2, 'ब': 3, 'भ': 4, 'म': 5,
    'य': 1, 'र': 2, 'ल': 3, 'व': 4, 'श': 5, 'ष': 6, 'स': 7, 'ह': 8,
    // Independent Vowels are 0
    'अ': 0, 'आ': 0, 'इ': 0, 'ई': 0, 'उ': 0, 'ऊ': 0, 'ऋ': 0, 'ॠ': 0, 'ऌ': 0, 'ॡ': 0, 'ए': 0, 'ऐ': 0, 'ओ': 0, 'औ': 0
};


export const GEMATRIA_VALUES: { [key: string]: { [char: string]: number } } = {
    'pythagorean': { // Formerly simple_english
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9, 
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    },
    'chaldean': {
        'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
        'B': 2, 'K': 2, 'R': 2,
        'C': 3, 'G': 3, 'L': 3, 'S': 3,
        'D': 4, 'M': 4, 'T': 4,
        'E': 5, 'H': 5, 'N': 5, 'X': 5,
        'U': 6, 'V': 6, 'W': 6,
        'O': 7, 'Z': 7,
        'F': 8, 'P': 8
    },
    'latin_roman': {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    },
    'hebrew': {
      'א': 1, 'ב': 2, 'ג': 3, 'ד': 4, 'ה': 5, 'ו': 6, 'ז': 7, 'ח': 8, 'ט': 9, 
      'י': 10, 'כ': 20, 'ך': 20, 'ל': 30, 'מ': 40, 'ם': 40, 'נ': 50, 'ן': 50, 
      'ס': 60, 'ע': 70, 'פ': 80, 'ף': 80, 'צ': 90, 'ץ': 90, 'ק': 100, 'ר': 200, 
      'ש': 300, 'ת': 400
    },
    'greek': {
        'α': 1, 'β': 2, 'γ': 3, 'δ': 4, 'ε': 5, 'ζ': 7, 'η': 8, 'θ': 9,
        'ι': 10, 'κ': 20, 'λ': 30, 'μ': 40, 'ν': 50, 'ξ': 60, 'ο': 70, 'π': 80,
        'ρ': 100, 'σ': 200, 'τ': 300, 'υ': 400, 'φ': 500, 'χ': 600, 'ψ': 700, 'ω': 800,
        'Α': 1, 'Β': 2, 'Γ': 3, 'Δ': 4, 'Ε': 5, 'Ζ': 7, 'Η': 8, 'Θ': 9,
        'Ι': 10, 'Κ': 20, 'Λ': 30, 'Μ': 40, 'Ν': 50, 'Ξ': 60, 'Ο': 70, 'Π': 80,
        'Ρ': 100, 'Σ': 200, 'Τ': 300, 'Υ': 400, 'Φ': 500, 'Χ': 600, 'Ψ': 700, 'Ω': 800,
        // Historical letters
        'ϛ': 6, 'Ϛ': 6, // Stigma
        'ϟ': 90, 'Ϟ': 90, // Koppa
        'ϡ': 900, 'Ϡ': 900 // Sampi
    },
    'sanskrit_katapayadi': SANSKRIT_KATAPAYADI_VALUES
};