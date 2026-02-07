
import { AcademicLevel, Course, Faculty, LibraryItem, NewsItem } from './types';

export const COURSES: Course[] = [
  {
    id: 'LIT-101',
    title: 'The Architecture of Wealth: From Zero to Sovereignty',
    level: AcademicLevel.FOUNDATION,
    credits: 3,
    instructor: 'Dr. Julian Thorne',
    department: 'Foundational Literacy',
    description: 'A deconstruction of the global monetary system. Starting from first principles of value, we explore how central banks, inflation, and interest rates shape your economic reality.',
    syllabus: ['First Principles of Value', 'The Central Bank Ledger', 'Inflation & Purchasing Power', 'Wealth Preservation Cycles'],
    readingList: ['The Richest Man in Babylon - George S. Clason', 'The Psychology of Money - Morgan Housel'],
    image: 'https://images.unsplash.com/photo-1611974717482-480f28a7e58a?auto=format&fit=crop&q=80&w=1200',
    visualPrompt: 'A conceptual institutional artwork representing global wealth: a golden architectural blueprint of a central bank vault, overlapping with digital nodes and rising market charts, cinematic lighting, polished brass and deep navy tones, hyper-realistic, 8k.'
  },
  {
    id: 'FX-202',
    title: 'Forex Mechanics & Institutional Liquidity',
    level: AcademicLevel.UNDERGRADUATE,
    credits: 4,
    instructor: 'Sarah Chen',
    department: 'Market Operations',
    description: 'Learn the mechanics of the $7 trillion-a-day FX market. We focus on interbank flow, session psychology, and the strategic positioning of large institutions.',
    syllabus: ['The FX Microstructure', 'Market Session Flow', 'Economic Indicators (NFP/CPI)', 'Liquidity Pools & Stop Runs'],
    readingList: ['Trading for a Living - Alexander Elder', 'Global Macro Trading - Greg Guszcza'],
    image: 'https://images.unsplash.com/photo-1642390250611-306f0a671801?auto=format&fit=crop&q=80&w=1200',
    visualPrompt: 'A sophisticated visualization of foreign exchange markets: a high-speed digital stream of currency symbols (USD, EUR, GBP) flowing through a glass and steel institutional trading floor at night, bokeh lights, corporate aesthetic, navy and gold highlights.'
  },
  {
    id: 'CRY-305',
    title: 'Cryptographic Assets & Digital Settlement',
    level: AcademicLevel.GRADUATE,
    credits: 6,
    instructor: 'Marcus Vane',
    department: 'Digital Finance',
    description: 'Moving beyond speculation into the infrastructure of Bitcoin and Ethereum. Analyzing on-chain data, DeFi protocols, and institutional custody solutions.',
    syllabus: ['DLT & Consensus Mechanisms', 'On-Chain Liquidity Analysis', 'DeFi yield Architectures', 'Digital Asset Risk Modeling'],
    readingList: ['The Bitcoin Standard - Saifedean Ammous', 'Mastering Ethereum - Andreas Antonopoulos'],
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1200',
    visualPrompt: 'Advanced blockchain visualization: glowing geometric crystalline structures representing cryptographic blocks, interconnected by golden light filaments in a dark obsidian space, institutional finance aesthetic, high-tech, clean.'
  },
  {
    id: 'ALG-900',
    title: 'Algorithmic Alpha & Quantitative Systems',
    level: AcademicLevel.MASTERS,
    credits: 12,
    instructor: 'Dr. Julian Thorne',
    department: 'Advanced Studies',
    description: 'The pinnacle of market execution. Designing high-frequency models, VWAP/TWAP execution strategies, and managing multi-asset institutional portfolios.',
    syllabus: ['Statistical Arbitrage', 'Machine Learning in Markets', 'HFT Execution Engines', 'Systemic Risk management'],
    readingList: ['Flash Boys - Michael Lewis', 'Algorithmic Trading - Ernie Chan'],
    image: 'https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&q=80&w=1200',
    visualPrompt: 'Quantitative trading visualization: complex mathematical equations floating over a dark futuristic command center, multiple screens displaying glowing algorithmic flowcharts, golden light, deep navy backgrounds, sharp focus, technical brilliance.'
  }
];

export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'LIB-001',
    title: 'Interbank Flow Analysis 2024',
    author: 'Julian Thorne',
    type: 'Research Paper',
    topic: 'Microstructure',
    year: 2024,
    description: 'Analyzing the shift in interbank liquidity during central bank rate pivots.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    visualPrompt: 'A formal research paper cover with institutional seals, featuring a minimal graph of market liquidity waves, elegant serif typography, cream parchment texture.'
  },
  {
    id: 'LIB-002',
    title: 'The Digital Sovereignty Manifesto',
    author: 'DLT Working Group',
    type: 'White Paper',
    topic: 'Blockchain',
    year: 2023,
    description: 'The roadmap for nation-state adoption of decentralized settlement layers.',
    coverImage: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?auto=format&fit=crop&q=80&w=600',
    visualPrompt: 'A modern white paper cover with a digital globe silhouette, golden network lines, clean corporate design, institutional blue accents.'
  },
  {
    id: 'LIB-003',
    title: 'Macro Wealth Cycles',
    author: 'Global Strategy Board',
    type: 'Institutional Journal',
    topic: 'Macro Economics',
    year: 2024,
    description: 'Historical correlation between debt cycles and hard asset appreciation.',
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=600',
    visualPrompt: 'An elegant financial journal cover, featuring a stylized hourglass filled with gold coins and digital bits, deep navy and brass color scheme, prestigious feel.'
  },
  {
    id: 'LIB-004',
    title: 'The Quant Bible V2',
    author: 'Sarah Chen',
    type: 'Textbook',
    topic: 'Quantitative Strategy',
    year: 2024,
    description: 'Bridging technical analysis with heavy statistical validation.',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
    visualPrompt: 'A thick academic textbook cover with gold embossed title "THE QUANT BIBLE", dark leather texture, scholarly and authoritative.'
  }
];

export const FACULTY: Faculty[] = [
  {
    name: 'Julian Thorne',
    title: 'Chief Academic Strategist',
    expertise: 'Institutional Liquidity & Macro Policy',
    bio: 'Former head of global macro at a top-tier European fund with 25 years of institutional experience.',
    professionalHistory: [
      'Executive Director (Macro), Goldman Sachs London',
      'Lead Economist, ECB Liquidity Working Group',
      'Founder, AlphaStream Quantitative Research',
      'Ph.D. Economics, London School of Economics'
    ],
    keyPublications: [
      'The Liquidity Paradox: Market Depth in Times of Volatility (2022)',
      'Macro-cycle Entropy and the Decay of Fiat Settlement (2019)',
      'Interbank Flow & Central Bank Rate Pivots (2024)'
    ],
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
    officeHours: 'Tuesdays & Thursdays, 09:00 - 11:30 EST',
    visualPrompt: 'A professional portrait of a senior economics professor, mid-50s, refined features, wearing a dark bespoke suit, standing in a sunlit university library with floor-to-ceiling bookshelves, institutional and authoritative atmosphere.'
  },
  {
    name: 'Sarah Chen',
    title: 'Dean of Research',
    expertise: 'Quant Strategy & Emerging Assets',
    bio: 'Lead architect of multi-billion dollar algorithmic systems specializing in the FX/Crypto cross-over.',
    professionalHistory: [
      'Fellow, MIT Media Lab (Digital Currency Initiative)',
      'Senior Algorithmic Architect, Citadel Securities',
      'Technical Advisor to IMF on Digital Settlement Layers',
      'M.Sc. Computer Science (Quant Finance), Stanford University'
    ],
    keyPublications: [
      'Synthesizing Cross-Chain Liquidity: An Institutional Framework (2023)',
      'Non-Linear Execution in Fragmented FX Markets (2021)',
      'Algorithmic Alpha & Quantitative Systems V2 (2024)'
    ],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
    officeHours: 'Mondays & Wednesdays, 14:00 - 16:30 EST',
    visualPrompt: 'A professional portrait of a female quantitative researcher, early 40s, intelligent and sharp gaze, wearing professional attire, in a modern glass-walled office with digital trading monitors in the background, high-fidelity, polished.'
  }
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'NEWS-001',
    title: 'Institutional Pivot: The 2024 Interest Rate Outlook',
    date: 'March 15, 2024',
    category: 'Market Alert',
    summary: 'Our faculty analyzes the upcoming central bank policy shifts and their impact on global liquidity pools.',
    image: 'https://images.unsplash.com/photo-1611974717482-480f28a7e58a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'NEWS-002',
    title: 'GTI Research Lab Achieves On-Chain Analysis Breakthrough',
    date: 'March 10, 2024',
    category: 'Research',
    summary: 'A new proprietary model for identifying institutional accumulation phases in digital asset markets has been verified.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'NEWS-003',
    title: 'Global Trading Institute Opens London Academic Hub',
    date: 'March 05, 2024',
    category: 'Institutional',
    summary: 'Expanding our physical presence to the heart of the world\'s largest FX trading hub to facilitate direct institutional networking.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'
  }
];
