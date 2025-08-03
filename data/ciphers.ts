import { Cipher, CipherType } from "../types.ts";

export const customCipherTemplate: Cipher = {
    id: 'custom',
    name: 'Custom Cipher',
    type: 'CUSTOM',
    description: 'Analyze your own ciphertext. Paste your text below, select the appropriate solver (Vigenère, Caesar, etc.), and use the analysis tools to crack the code.',
    ciphertext: 'PASTE YOUR CIPHERTEXT HERE...',
};


export const ciphers: Cipher[] = [
    // Famous Unsolved Ciphers
    {
        id: 'k4',
        name: 'Kryptos K4',
        type: 'VIGENERE',
        description: 'The fourth and final unsolved passage of the Kryptos sculpture. It is widely believed to be a Vigenère cipher.',
        ciphertext: 'OBKRUOXOGHULBSOLIFBBWFLRVQQPRNGKSSOTWTQSJQSSEKZZWATJKLUDIAWINFBNYPVTTMZFPKWGDKZXTJCDIGKUHUAUEKCAR',
        suggestedKeyword: 'BERLINCLOCK',
        notes: 'This remains one of the world\'s most famous unsolved codes. The keyword BERLINCLOCK is a popular but unconfirmed theory.'
    },
    // Classical Ciphers
    {
        id: 'k1',
        name: 'Kryptos K1',
        type: 'VIGENERE',
        description: 'The first passage of the Kryptos sculpture, solved by Jim Gillogly in 1999. It uses a Vigenère cipher.',
        ciphertext: 'EMUFPHZLRFAXYUSDJKZLDKRNSHGNFIVJMYVGUVFHLPACVLEQVERVHRKAWKYLHNSBECVHVTHMMOCHMSKKYHLDNPNYMPAYWETHELVNKIWHZYVNKOHOFPGHINHJHILKPGHNIVJWAYVRXBGWLKSLKISJJVGETAGDNUFHVLWAYVENEYROLDPDBKLHLLAHLAYYDHNIYMPMYWHUYADRGKAGYHTAVHNPHVWLKMMBLHVHCSXHIFYVNKEXHDAWKVLQNAPSHDRJHOMHILKPGHNEIMPHWIVHMLAXOSLHKROTVERVHEUABKCAAMIHMMMHSHGIYMPYACCYHEVIDKYGZ',
        suggestedKeyword: 'PALIMPSEST',
        plaintext: 'BETWEEN SUBTLE SHADING AND THE ABSENCE OF LIGHT LIES THE NUANCE OF IQLUSION',
        notes: 'The keyword for K1 is PALIMPSEST, and the keyword for K2 is ABSCISSA. IQLUSION is an intentional misspelling by the artist.'
    },
    {
        id: 'k2',
        name: 'Kryptos K2',
        type: 'VIGENERE',
        description: 'The second passage of the Kryptos sculpture. It is also a Vigenère cipher and contains coordinates for a location at the CIA.',
        ciphertext: 'VFPJUDEEHZWETZYVGWHKKQETGFQJNCEGGWHKK?DQMCPFQZDQMMIAGPFXHQRLGTIMVMZJANQLVKQEDAGDVFRPJUNGEUNAQZGZLECGYUXUEENJTBJLBQCRTBJDFHRRYIZETKZEMVDUFKSJHKFWHKUWQLSZFTIHHDDDUVHDWKBFUFPWNTDFIYCUQZEREEVLDKFEZMOTPZPKOFMDMIYLVGUVELVAGCIJCKJEFINSSLQVFYWAYXIRADQTTERTSVNFHUHJFLOTSMTFPKWGDKZXTJCDIGKUHUAUEKCAR',
        suggestedKeyword: 'ABSCISSA',
        plaintext: 'IT WAS TOTALLY INVISIBLE HOWS THAT POSSIBLE? THEY USED THE EARTHS MAGNETIC FIELD X THE INFORMATION WAS GATHERED AND TRANSMITTED UNDERGRUUND TO AN UNKNOWN LOCATION X DOES LANGLEY KNOW ABOUT THIS? THEY SHOULD ITS BURIED OUT THERE SOMEWHERE X WHO KNOWS THE EXACT LOCATION? ONLY WW THIS WAS HIS LAST MESSAGE X THIRTY EIGHT DEGREES FIFTY SEVEN MINUTES SIX POINT FIVE SECONDS NORTH SEVENTY SEVEN DEGREES EIGHT MINUTES FORTY FOUR SECONDS WEST X LAYER TWO',
    },
    {
        id: 'vicksburg',
        name: 'CSA Vicksburg Cipher',
        type: 'VIGENERE',
        description: 'A Confederate States of America (CSA) message sent from Vicksburg during the American Civil War. It was encrypted using a Vigenère cipher and famously deciphered by Union cryptanalysts.',
        ciphertext: 'YPQAPLUSJDISBAKBVTQCVPQKQYTWGJVBUFWCYRGKKEUVSHCQYTWGJVBUFWCYRGKKEUVS',
        suggestedKeyword: 'MANCHESTERBLUFF',
        plaintext: 'I HAVE NO NEWS FROM PEMBERTON I HEAR THAT HE IS BEING HARD PRESSED I SHALL TRY TO ASSIST HIM',
    },
    {
        id: 'bible_jeremiah',
        name: 'Bible (Jeremiah 25:26)',
        type: 'ATBASH',
        description: 'A verse from the Book of Jeremiah containing the word "Sheshach," which is a famous example of an Atbash cipher for "Babel" (Babylon).',
        ciphertext: 'וְאֵת כָּל־הַמְּלָכִים אֲשֶׁר בַּצָּפוֹן הַקְּרֹבִים וְהָרְחֹקִים אִישׁ אֶל־אָחִיו וְאֵת כָּל־מַמְלְכוֹת הָאָרֶץ אֲשֶׁר עַל־פְּנֵי הָאֲדָמָה וּמֶלֶךְ־שֵׁשַׁךְ יִשְׁתֶּה אַחֲרֵיהֶם׃',
        plaintext: 'ואת כל־המלכים אשר בצפון הקרבים והרחוקים איש אל־אחיו ואת כל־ממלכות הארץ אשר על־פני האדמה ומלך־בבל ישתה אחריהם׃',
        notes: 'The word שֵׁשַׁךְ (Sheshach) becomes בבל (Babel) using the Atbash cipher. The solver is pre-selected for you.'
    },
    // Esoteric & Philosophical Texts
    {
        id: 'torah_genesis',
        name: 'Torah (Genesis 1:1-5)',
        type: 'ESOTERIC',
        description: 'The opening verses of the Book of Genesis from the Hebrew Torah. Not a cipher, but a foundational text for esoteric analysis, particularly using Hebrew Gematria.',
        ciphertext: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃ וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל־פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל־פְּנֵי הַמָּיִם׃ וַיֹּאמֶר אֱלֹהִים יְהִי־אוֹר וַיְהִי־אוֹר׃ וַיַּרְא אֱלֹהִים אֶת־הָאוֹר כִּי־טוֹב וַיַּבְדֵּל אֱלֹהִים בֵּין הָאוֹר וּבֵין הַחֹשֶׁךְ׃ וַיִּקְרָא אֱלֹהִים לָאוֹר יוֹם וְלַחֹשֶׁךְ קָרָא לָיְלָה וַיְהִי־עֶרֶב וַיְהִי־בֹקֶר יוֹם אֶחָד׃',
        notes: 'This text is for symbolic and numerological analysis. Use the Textual Analysis tab and select the Hebrew Gematria schema.'
    },
    {
        id: 'quran_al-fatiha',
        name: 'Quran (Al-Fatiha)',
        type: 'ESOTERIC',
        description: 'The first chapter (Sura) of the Quran. A central text in Islam, used for prayer and esoteric analysis.',
        ciphertext: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ الرَّحْمَٰنِ الرَّحِيمِ مَالِكِ يَوْمِ الدِّينِ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        notes: 'This text is for symbolic and numerological analysis. The Gematria calculator may not directly apply in standard form, but the text invites deep symbolic interpretation.'
    },
    {
        id: 'bhagavad_gita',
        name: 'Bhagavad Gita (2.47)',
        type: 'ESOTERIC',
        description: 'A famous verse from the Hindu scripture, the Bhagavad Gita, discussing action and detachment from results. A core text for philosophical and numerological study using Sanskrit systems.',
        ciphertext: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
        notes: 'Use the Textual Analysis tab and select the Sanskrit (Katapayadi) Gematria schema to analyze this text numerologically.'
    },
    {
        id: 'dhammapada',
        name: 'Dhammapada (Verse 5)',
        type: 'ESOTERIC',
        description: 'A verse from the Dhammapada, a foundational text of Buddhist wisdom, written in the Pali language.',
        ciphertext: 'न हि वेरेन वेरानि सम्मन्तीध कुदाचनं। अवेरेन च सम्मन्ति एस धम्मो सनन्तनो॥',
        notes: 'This text invites symbolic analysis. The Character Set tool can be used to examine the Pali script.'
    },
    {
        id: 'tao_te_ching',
        name: 'Tao Te Ching (Chapter 1)',
        type: 'ESOTERIC',
        description: 'The opening chapter of the foundational text of Taoism, attributed to Lao Tzu.',
        ciphertext: '道可道，非常道。名可名，非常名。無名天地之始；有名萬物之母。故常無欲，以觀其妙；常有欲，以觀其徼。此兩者，同出而異名，同謂之玄。玄之又玄，眾妙之門。',
        notes: 'A core text of philosophical and symbolic inquiry. Explore the meaning of key characters like 道 (Dào) and 無 (Wú).'
    },
    {
        id: 'emerald_tablet',
        name: 'The Emerald Tablet',
        type: 'ESOTERIC',
        description: 'A short, cryptic text attributed to Hermes Trismegistus, forming a cornerstone of Western alchemy and Hermeticism. This is the Latin version from the 16th century.',
        ciphertext: 'Verum, sine mendacio, certum et verissimum. Quod est inferius, est sicut quod est superius, et quod est superius, est sicut quod est inferius, ad perpetranda miracula rei unius. Et sicut omnes res fuerunt ab uno, meditatione unius, sic omnes res natae fuerunt ab hac una re, adaptatione. Pater eius est Sol, mater eius Luna. Portavit illud ventus in ventre suo. Nutrix eius terra est. Pater omnis telesmi totius mundi est hic. Vis eius integra est, si versa fuerit in terram. Separabis terram ab igne, subtile a spisso, suaviter, cum magno ingenio. Ascendit a terra in coelum, iterumque descendit in terram, et recipit vim superiorum et inferiorum. Sic habebis gloriam totius mundi. Ideo fugiat a te omnis obscuritas. Hic est totius fortitudinis fortitudo fortis, quia vincet omnem rem subtilem, omnemque solidam penetrabit. Sic mundus creatus est. Hinc erunt adaptationes mirabiles, quarum modus est hic. Itaque vocatus sum Hermes Trismegistus, habens tres partes philosophiae totius mundi. Completum est quod dixi de operatione Solis.',
        notes: 'Use the Latin Gematria schema and other textual analysis tools to explore its famous axiom "As above, so below".'
    },
    {
        id: 'meditations',
        name: 'The Meditations (IV.23)',
        type: 'ESOTERIC',
        description: 'A passage from the private writings of Roman Emperor Marcus Aurelius, a foundational text of Stoic philosophy.',
        ciphertext: 'Everything harmonizes with me, which is harmonious to thee, O Universe. Nothing for me is too early nor too late, which is in due time for thee. Everything is fruit to me which thy seasons bring, O Nature: from thee are all things, in thee are all things, to thee all things return.',
        notes: 'Not a cipher, but a text for deep philosophical and symbolic contemplation.'
    },
    // Puzzles & Challenges
    {
        id: 'cicada_3301',
        name: 'Cicada 3301 "Liber Primus"',
        type: 'PUZZLE',
        description: 'A puzzle from the mysterious Cicada 3301 group. These puzzles often involve multiple layers of cryptography, steganography, and obscure cultural references.',
        ciphertext: 'A WARNING. BELIEVE NOTHING FROM THIS BOOK, EXCEPT WHAT YOU KNOW TO BE TRUE. TEST THE KNOWLEDGE. FIND THE TRUTH. EXPERIENCE THE DEEP PEACE THAT TRUTH BRINGS. THE LAW IS FOR ALL.',
        notes: 'This is not a simple cipher. It is a clue. Traditional cryptanalysis is only the first step. Think about Gematria, prime numbers, and the source of the text.'
    },
     {
        id: 'rosetta_stone',
        name: 'Rosetta Stone (Ptolemy V)',
        type: 'ESOTERIC',
        description: 'The key that unlocked Egyptian hieroglyphs. This snippet shows the name of King Ptolemy V in a cartouche, a critical clue used by Jean-François Champollion.',
        ciphertext: 'p t w l m y s',
        notes: 'This is not a cipher to be decrypted, but a subject for study. Use the Hieroglyphics Lab in the Textual Analysis tab to see how this name is written in glyphs and to create your own cartouches.'
    },
    {
        id: 'k3',
        name: 'Kryptos K3',
        type: 'TRANSPOSITION',
        description: 'The third passage of Kryptos. Unlike K1 & K2, this is a complex transposition cipher. The plaintext is from Howard Carter\'s diary on opening Tutankhamun\'s tomb.',
        ciphertext: 'ENDYAHROHNLSRHEOCPTEOIBIDYSHNAIACHTNREYULDSLLSLLNOHSNOSMRWXMNETPRNGATIHNRARPESLNNELEBLPIAHAEIWYRUITRYFETSYBIHAYMROHNSPTSKBIDYSHNAIACHTNREYULDSLLSLLNOHSNOSMRWXMNETPRNGATIHNRARPESLNNELEBLPIAHAEIWYRUITRYFETSYBIHAYMROHNSPSENDYAHROHNLSRHEOCPTEOIBIDYSHNAIACHTNREYULDSLLSLLNOHSNOSMRWXMNETPRNGATIHNRARPESLNNELEBLPIAHAEIWYRUITRYFETSYBIHAYMROHNSPTSKBIDYSHNAIACHTNREYULDSLLSLLNOHSNOSMRWXMNETPRNGATIHNRARPESLNNELEBLPIAHAEIWYRUITRYFETSYBIHAYMROHNSPS',
        plaintext: 'SLOWLY DESPARATLY SLOWly THE REMAINS OF PASSAGE DEBRIS THAT ENCUMBERED THE LOWER PART OF THE DOORWAY WAS REMOVED WITH TREMBLING HANDS I MADE A TINY BREACH IN THE UPPER LEFT HAND CORNER AND THEN WIDENING THE HOLE A LITTLE I INSERTED THE CANDLE AND PEERED IN THE HOT AIR ESCAPING FROM THE CHAMBER CAUSED THE FLAME TO FLUTTER BUT PRESENTLY DETAILS OF THE ROOM WITHIN EMERGED FROM THE MIST X CAN YOU SEE ANYTHING Q?',
        notes: 'As a transposition cipher, solver controls do not apply. Use the AI analysis and other tools to examine the text.'
    },
];