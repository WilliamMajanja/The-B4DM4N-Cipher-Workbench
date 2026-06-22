import re

ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
HEBREW_ALPHABET = "אבגדהוזחטיכךלמםנןסעפףצץקרשת"
GREEK_ALPHABET_LOWER = "αβγδεζηθικλμνξοπρστυφχψω"
GREEK_ALPHABET_UPPER = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ"
DEVANAGARI_REGEX = re.compile(r'[\u0900-\u097F]')

HIEROGLYPH_UNILITERALS: dict[str, dict[str, str]] = {
    'A': {'glyph': '\U0001313F', 'desc': 'Egyptian Vulture', 'sound': 'ah'},
    'I': {'glyph': '\U000131CB', 'desc': 'Flowering Reed', 'sound': 'i/y'},
    'Y': {'glyph': '\U000131CB', 'desc': 'Flowering Reed', 'sound': 'i/y'},
    'E': {'glyph': '\U000131CB', 'desc': 'Flowering Reed', 'sound': 'i/y'},
    'U': {'glyph': '\U00013171', 'desc': 'Quail Chick', 'sound': 'w/u'},
    'W': {'glyph': '\U00013171', 'desc': 'Quail Chick', 'sound': 'w/u'},
    'O': {'glyph': '\U00013171', 'desc': 'Quail Chick', 'sound': 'w/u'},
    'B': {'glyph': '\U000130C0', 'desc': 'Foot', 'sound': 'b'},
    'P': {'glyph': '\U000132AA', 'desc': 'Stool', 'sound': 'p'},
    'F': {'glyph': '\U00013191', 'desc': 'Horned Viper', 'sound': 'f'},
    'M': {'glyph': '\U00013153', 'desc': 'Owl', 'sound': 'm'},
    'N': {'glyph': '\U000131D6', 'desc': 'Water Ripple', 'sound': 'n'},
    'R': {'glyph': '\U0001308B', 'desc': 'Mouth', 'sound': 'r'},
    'L': {'glyph': '\U0001308B', 'desc': 'Mouth', 'sound': 'r'},
    'H': {'glyph': '\U00013254', 'desc': 'Reed Shelter', 'sound': 'h'},
    'S': {'glyph': '\U000132F4', 'desc': 'Folded Cloth', 'sound': 's'},
    'Z': {'glyph': '\U000132F4', 'desc': 'Folded Cloth', 'sound': 's'},
    'SH': {'glyph': '\U00013219', 'desc': 'Pool of Water', 'sound': 'sh'},
    'Q': {'glyph': '\U0001320E', 'desc': 'Hill Slope', 'sound': 'q'},
    'K': {'glyph': '\U000133A1', 'desc': 'Basket with Handle', 'sound': 'k'},
    'G': {'glyph': '\U0001333C', 'desc': 'Jar Stand', 'sound': 'g'},
    'T': {'glyph': '\U000133CF', 'desc': 'Bread Loaf', 'sound': 't'},
    'TH': {'glyph': '\U0001337F', 'desc': 'Tethering Rope', 'sound': 'tch'},
    'D': {'glyph': '\U000130A7', 'desc': 'Hand', 'sound': 'd'},
    'DJ': {'glyph': '\U00013193', 'desc': 'Cobra', 'sound': 'dj'},
}

_SANSKRIT_KATAPAYADI_VALUES: dict[str, int] = {
    '\u0915': 1, '\u0916': 2, '\u0917': 3, '\u0918': 4, '\u0919': 5,
    '\u091a': 6, '\u091b': 7, '\u091c': 8, '\u091d': 9, '\u091e': 0,
    '\u091f': 1, '\u0920': 2, '\u0921': 3, '\u0922': 4, '\u0923': 5,
    '\u0924': 6, '\u0925': 7, '\u0926': 8, '\u0927': 9, '\u0928': 0,
    '\u092a': 1, '\u092b': 2, '\u092c': 3, '\u092d': 4, '\u092e': 5,
    '\u092f': 1, '\u0930': 2, '\u0932': 3, '\u0935': 4,
    '\u0936': 5, '\u0937': 6, '\u0938': 7, '\u0939': 8,
    '\u0905': 0, '\u0906': 0, '\u0907': 0, '\u0908': 0,
    '\u0909': 0, '\u090a': 0, '\u090b': 0, '\u0960': 0,
    '\u090c': 0, '\u0961': 0, '\u090f': 0, '\u0910': 0,
    '\u0913': 0, '\u0914': 0,
}

GEMATRIA_VALUES: dict[str, dict[str, int]] = {
    'pythagorean': {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
    },
    'chaldean': {
        'A': 1, 'I': 1, 'J': 1, 'Q': 1, 'Y': 1,
        'B': 2, 'K': 2, 'R': 2,
        'C': 3, 'G': 3, 'L': 3, 'S': 3,
        'D': 4, 'M': 4, 'T': 4,
        'E': 5, 'H': 5, 'N': 5, 'X': 5,
        'U': 6, 'V': 6, 'W': 6,
        'O': 7, 'Z': 7,
        'F': 8, 'P': 8,
    },
    'latin_roman': {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000,
    },
    'hebrew': {
        '\u05d0': 1, '\u05d1': 2, '\u05d2': 3, '\u05d3': 4, '\u05d4': 5,
        '\u05d5': 6, '\u05d6': 7, '\u05d7': 8, '\u05d8': 9,
        '\u05d9': 10, '\u05db': 20, '\u05da': 20, '\u05dc': 30,
        '\u05de': 40, '\u05dd': 40, '\u05e0': 50, '\u05df': 50,
        '\u05e1': 60, '\u05e2': 70, '\u05e4': 80, '\u05e3': 80,
        '\u05e6': 90, '\u05e5': 90, '\u05e7': 100, '\u05e8': 200,
        '\u05e9': 300, '\u05ea': 400,
    },
    'greek': {
        '\u03b1': 1, '\u03b2': 2, '\u03b3': 3, '\u03b4': 4, '\u03b5': 5,
        '\u03b6': 7, '\u03b7': 8, '\u03b8': 9,
        '\u03b9': 10, '\u03ba': 20, '\u03bb': 30, '\u03bc': 40, '\u03bd': 50,
        '\u03be': 60, '\u03bf': 70, '\u03c0': 80,
        '\u03c1': 100, '\u03c3': 200, '\u03c4': 300, '\u03c5': 400,
        '\u03c6': 500, '\u03c7': 600, '\u03c8': 700, '\u03c9': 800,
        '\u0391': 1, '\u0392': 2, '\u0393': 3, '\u0394': 4, '\u0395': 5,
        '\u0396': 7, '\u0397': 8, '\u0398': 9,
        '\u0399': 10, '\u039a': 20, '\u039b': 30, '\u039c': 40, '\u039d': 50,
        '\u039e': 60, '\u039f': 70, '\u03a0': 80,
        '\u03a1': 100, '\u03a3': 200, '\u03a4': 300, '\u03a5': 400,
        '\u03a6': 500, '\u03a7': 600, '\u03a8': 700, '\u03a9': 800,
        '\u03db': 6, '\u03da': 6,
        '\u03df': 90, '\u03de': 90,
        '\u03e1': 900, '\u03e0': 900,
    },
    'sanskrit_katapayadi': _SANSKRIT_KATAPAYADI_VALUES,
}
