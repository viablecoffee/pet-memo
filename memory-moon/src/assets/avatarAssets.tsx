// avatarAssets.ts
// Storing SVG paths and configs for the 2D Avatar Builder

export type AvatarCategory = 'body' | 'ears' | 'eyes' | 'mouth' | 'accessory';

export interface AvatarAsset {
  id: string;
  category: AvatarCategory;
  name: string;
  renderSVG: (color: string) => React.ReactNode;
}

// Basic Colors for mapping
export const AVATAR_COLORS = [
  '#f3c78b', // Light Gold (Golden Retriever)
  '#d48c46', // Golden Dark
  '#f5caaa', // Light Orange
  '#e59b59', // Orange
  '#8c6046', // Brown
  '#3d312a', // Dark Brown
  '#d6d6d6', // Light Gray
  '#7a7a7a', // Dark Gray
  '#1c1c1c', // Black
  '#ffffff', // White
  '#f9e1e1', // Pink
];

export const avatarAssets: AvatarAsset[] = [
  // --- BODY SHAPES ---
  {
    id: 'body-husky',
    category: 'body',
    name: 'Husky',
    renderSVG: (color) => (
      <g>
        <path d="M 25 15 Q 50 5 75 15 Q 90 30 95 50 Q 100 70 85 80 Q 75 95 50 95 Q 25 95 15 80 Q 0 70 5 50 Q 10 30 25 15 Z" fill={color} />
        <path d="M 12 55 Q 5 65 15 75 Q 25 90 50 90 Q 75 90 85 75 Q 95 65 88 55 Q 70 65 65 45 Q 65 30 50 40 Q 35 30 35 45 Q 30 65 12 55 Z" fill="#ffffff" />
        <circle cx="33" cy="45" r="14" fill="#ffffff" />
        <circle cx="67" cy="45" r="14" fill="#ffffff" />
        <path d="M 28 25 Q 33 15 38 25 Q 33 22 28 25 Z" fill="#ffffff" />
        <path d="M 72 25 Q 67 15 62 25 Q 67 22 72 25 Z" fill="#ffffff" />
        <rect x="46" y="25" width="8" height="30" rx="4" fill="#ffffff" />
      </g>
    )
  },
  {
    id: 'body-retriever',
    category: 'body',
    name: 'Retriever',
    renderSVG: (color) => (
      <g>
        <path d="M 25 15 Q 50 5 75 15 Q 90 30 85 55 Q 80 85 50 90 Q 20 85 15 55 Q 10 30 25 15 Z" fill={color} />
        <path d="M 15 45 Q 0 55 10 70 Q 20 60 20 45 Z" fill={color} />
        <path d="M 85 45 Q 100 55 90 70 Q 80 60 80 45 Z" fill={color} />
        <ellipse cx="50" cy="65" rx="22" ry="18" fill="#ffffff" opacity="0.3" />
      </g>
    )
  },
  {
    id: 'body-round',
    category: 'body',
    name: 'Round',
    renderSVG: (color) => (
      <path d="M 12 50 C 12 10, 88 10, 88 50 C 88 90, 12 90, 12 50 Z" fill={color} />
    )
  },
  {
    id: 'body-fluffy',
    category: 'body',
    name: 'Fluffy',
    renderSVG: (color) => (
      <path d="M 20 40 Q 10 30 25 20 Q 50 5 75 20 Q 90 30 80 40 Q 95 60 80 80 Q 50 95 20 80 Q 5 60 20 40 Z" fill={color} />
    )
  },
  {
    id: 'body-tall',
    category: 'body',
    name: 'Tall',
    renderSVG: (color) => (
      <rect x="25" y="15" width="50" height="70" rx="25" fill={color} />
    )
  },

  // --- EARS ---
  {
    id: 'ears-husky',
    category: 'ears',
    name: 'Husky',
    renderSVG: (color) => (
      <g>
        <path d="M 25 35 L 12 5 L 45 25 Z" fill={color} />
        <path d="M 23 30 L 16 12 L 38 23 Z" fill="#ffffff" opacity="0.9" />
        <path d="M 75 35 L 88 5 L 55 25 Z" fill={color} />
        <path d="M 77 30 L 84 12 L 62 23 Z" fill="#ffffff" opacity="0.9" />
      </g>
    )
  },
  {
    id: 'ears-retriever',
    category: 'ears',
    name: 'Retriever',
    renderSVG: (color) => (
      <g>
        <path d="M 30 20 C 0 20, -15 60, 5 80 C 15 90, 25 80, 25 50 C 25 30, 30 20, 30 20 Z" fill={color} />
        <path d="M 25 25 C 10 30, 5 55, 10 70 C 15 75, 20 65, 22 50 Z" fill="#000000" opacity="0.1" />
        <path d="M 70 20 C 100 20, 115 60, 95 80 C 85 90, 75 80, 75 50 C 75 30, 70 20, 70 20 Z" fill={color} />
        <path d="M 75 25 C 90 30, 95 55, 90 70 C 85 75, 80 65, 78 50 Z" fill="#000000" opacity="0.1" />
      </g>
    )
  },
  {
    id: 'ears-pointy',
    category: 'ears',
    name: 'Pointy (Cat)',
    renderSVG: (color) => (
      <g>
        <path d="M 15 35 L 20 5 L 40 20 Z" fill={color} />
        <path d="M 85 35 L 80 5 L 60 20 Z" fill={color} />
      </g>
    )
  },
  {
    id: 'ears-floppy',
    category: 'ears',
    name: 'Floppy (Dog)',
    renderSVG: (color) => (
      <g>
        <path d="M 25 25 Q 5 20 10 50 Q 15 65 30 50 Z" fill={color} />
        <path d="M 75 25 Q 95 20 90 50 Q 85 65 70 50 Z" fill={color} />
      </g>
    )
  },
  {
    id: 'ears-round',
    category: 'ears',
    name: 'Round (Bear)',
    renderSVG: (color) => (
      <g>
        <circle cx="25" cy="20" r="12" fill={color} />
        <circle cx="75" cy="20" r="12" fill={color} />
      </g>
    )
  },

  // --- EYES ---
  {
    id: 'eyes-husky',
    category: 'eyes',
    name: 'Husky Blue',
    renderSVG: () => (
      <g>
        <path d="M 22 45 Q 32 37 40 46 Q 32 50 22 45 Z" fill="#ffffff" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="32" cy="44" r="4" fill="#3498db" />
        <circle cx="32" cy="44" r="2" fill="#1a1a1a" />
        <circle cx="33.5" cy="42.5" r="1.5" fill="#ffffff" />
        <path d="M 78 45 Q 68 37 60 46 Q 68 50 78 45 Z" fill="#ffffff" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="68" cy="44" r="4" fill="#3498db" />
        <circle cx="68" cy="44" r="2" fill="#1a1a1a" />
        <circle cx="66.5" cy="42.5" r="1.5" fill="#ffffff" />
      </g>
    )
  },
  {
    id: 'eyes-puppy',
    category: 'eyes',
    name: 'Puppy',
    renderSVG: () => (
      <g>
        <circle cx="32" cy="45" r="7" fill="#1a1a1a" />
        <circle cx="34" cy="42" r="2.5" fill="white" />
        <circle cx="30" cy="47" r="1" fill="white" />
        <circle cx="68" cy="45" r="7" fill="#1a1a1a" />
        <circle cx="66" cy="42" r="2.5" fill="white" />
        <circle cx="70" cy="47" r="1" fill="white" />
      </g>
    )
  },
  {
    id: 'eyes-dot',
    category: 'eyes',
    name: 'Dots',
    renderSVG: () => (
      <g fill="#1a1a1a">
        <circle cx="35" cy="45" r="4" />
        <circle cx="65" cy="45" r="4" />
      </g>
    )
  },
  {
    id: 'eyes-happy',
    category: 'eyes',
    name: 'Happy',
    renderSVG: () => (
      <g stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M 30 45 Q 35 38 40 45" />
        <path d="M 60 45 Q 65 38 70 45" />
      </g>
    )
  },
  {
    id: 'eyes-big',
    category: 'eyes',
    name: 'Big Anime',
    renderSVG: () => (
      <g>
        <circle cx="35" cy="45" r="7" fill="#1a1a1a" />
        <circle cx="37" cy="43" r="2" fill="white" />
        <circle cx="65" cy="45" r="7" fill="#1a1a1a" />
        <circle cx="67" cy="43" r="2" fill="white" />
      </g>
    )
  },

  // --- MOUTH ---
  {
    id: 'mouth-dog',
    category: 'mouth',
    name: 'Dog Smile',
    renderSVG: () => (
      <g>
        <ellipse cx="50" cy="56" rx="8" ry="5.5" fill="#1a1a1a" />
        <ellipse cx="48" cy="54" rx="2" ry="1" fill="#ffffff" opacity="0.5" />
        <path d="M 50 61 L 50 68" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 35 65 Q 45 78 50 68 Q 55 78 65 65" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    )
  },
  {
    id: 'mouth-dog-tongue',
    category: 'mouth',
    name: 'Dog Tongue',
    renderSVG: () => (
      <g>
        <path d="M 42 68 L 58 68 Q 58 88 50 88 Q 42 88 42 68 Z" fill="#FF7B7B" stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round" />
        <line x1="50" y1="68" x2="50" y2="80" stroke="#D05A5A" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="50" cy="56" rx="8" ry="5.5" fill="#1a1a1a" />
        <ellipse cx="48" cy="54" rx="2" ry="1" fill="#ffffff" opacity="0.5" />
        <path d="M 50 61 L 50 68" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 35 65 Q 45 78 50 68 Q 55 78 65 65" stroke="#1a1a1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    )
  },
  {
    id: 'mouth-smile',
    category: 'mouth',
    name: 'Smile',
    renderSVG: () => (
      <path d="M 40 60 Q 50 70 60 60" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
    )
  },
  {
    id: 'mouth-cat',
    category: 'mouth',
    name: 'Cat 3',
    renderSVG: () => (
      <g stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 50 58 L 50 62" />
        <path d="M 43 60 Q 46 65 50 62" />
        <path d="M 57 60 Q 54 65 50 62" />
        <path d="M 48 58 L 52 58 L 50 60 Z" fill="#FFA5A5" stroke="none"/>
      </g>
    )
  },
  {
    id: 'mouth-tongue',
    category: 'mouth',
    name: 'Tongue',
    renderSVG: () => (
      <g>
        <path d="M 40 60 Q 50 65 60 60" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 47 62 L 53 62 Q 53 72 47 72 Z" fill="#FF7B7B" />
      </g>
    )
  },

  // --- ACCESSORIES ---
  {
    id: 'acc-none',
    category: 'accessory',
    name: 'None',
    renderSVG: () => <g></g>
  },
  {
    id: 'acc-collar-red',
    category: 'accessory',
    name: 'Red Collar',
    renderSVG: () => (
      <g>
        <path d="M 25 75 Q 50 85 75 75 L 72 80 Q 50 90 28 80 Z" fill="#E74C3C" />
        <circle cx="50" cy="85" r="4" fill="#F1C40F" />
      </g>
    )
  },
  {
    id: 'acc-bowtie',
    category: 'accessory',
    name: 'Bowtie',
    renderSVG: () => (
      <g fill="#3498DB">
        <path d="M 50 80 L 35 70 L 35 90 Z" />
        <path d="M 50 80 L 65 70 L 65 90 Z" />
        <circle cx="50" cy="80" r="3" fill="#2980B9" />
      </g>
    )
  },
  {
    id: 'acc-flower',
    category: 'accessory',
    name: 'Flower',
    renderSVG: () => (
      <g transform="translate(70, 20) scale(0.6)">
        <circle cx="0" cy="-10" r="8" fill="#FFB6C1" />
        <circle cx="10" cy="0" r="8" fill="#FFB6C1" />
        <circle cx="0" cy="10" r="8" fill="#FFB6C1" />
      </g>
    )
  },
  // --- WESTIE ---
  {
    id: 'body-westie',
    category: 'body',
    name: 'Westie',
    renderSVG: () => (
      <image href="/assets/avatar/face_base.png" x="15" y="30" width="70" height="70" />
    )
  },
  {
    id: 'ears-westie-stand',
    category: 'ears',
    name: 'Westie Stand',
    renderSVG: () => (
      <image href="/assets/avatar/standing_ear.png" x="20" y="5" width="60" height="54" />
    )
  },
  {
    id: 'ears-westie-lie',
    category: 'ears',
    name: 'Westie Lie',
    renderSVG: () => (
      <image href="/assets/avatar/lie_ear.png" x="15" y="20" width="70" height="42" />
    )
  },
  {
    id: 'ears-westie-half',
    category: 'ears',
    name: 'Westie Half',
    renderSVG: () => (
      <image href="/assets/avatar/half_lie_ear.png" x="12" y="10" width="76" height="38" />
    )
  },
  {
    id: 'eyes-westie-open',
    category: 'eyes',
    name: 'Westie Open',
    renderSVG: () => (
      <image href="/assets/avatar/open_eye.png" x="25" y="45" width="50" height="23" />
    )
  },
  {
    id: 'eyes-westie-closed',
    category: 'eyes',
    name: 'Westie Closed',
    renderSVG: () => (
      <image href="/assets/avatar/closed_eye.png" x="25" y="48" width="50" height="17" />
    )
  },
  {
    id: 'mouth-westie-closed',
    category: 'mouth',
    name: 'Westie Closed',
    renderSVG: () => (
      <image href="/assets/avatar/closed_mouth.png" x="40" y="65" width="20" height="15.5" />
    )
  },
  {
    id: 'mouth-westie-smell',
    category: 'mouth',
    name: 'Westie Smell',
    renderSVG: () => (
      <image href="/assets/avatar/smell_mouth.png" x="40" y="65" width="20" height="18" />
    )
  },
  {
    id: 'acc-collar-2',
    category: 'accessory',
    name: 'Striped Collar',
    renderSVG: () => (
      <image href="/assets/avatar/Collar.png" x="20" y="80" width="60" height="26" />
    )
  },
  {
    id: 'acc-bell',
    category: 'accessory',
    name: 'Bell',
    renderSVG: () => (
      <image href="/assets/avatar/bell.png" x="40" y="85" width="20" height="19" />
    )
  },
  {
    id: 'acc-blue-bow',
    category: 'accessory',
    name: 'Blue Bow',
    renderSVG: () => (
      <image href="/assets/avatar/blue_bow.png" x="35" y="82" width="30" height="17" />
    )
  },
  {
    id: 'acc-red-bow-2',
    category: 'accessory',
    name: 'Red Bow 2',
    renderSVG: () => (
      <image href="/assets/avatar/red_bow.png" x="35" y="82" width="30" height="19" />
    )
  },
  {
    id: 'acc-flower-2',
    category: 'accessory',
    name: 'Flower 2',
    renderSVG: () => (
      <image href="/assets/avatar/flower.png" x="65" y="20" width="20" height="13" />
    )
  },
  {
    id: 'acc-glass',
    category: 'accessory',
    name: 'Glasses',
    renderSVG: () => (
      <image href="/assets/avatar/glass.png" x="20" y="40" width="60" height="34" />
    )
  }
];

export const getAssetsByCategory = (category: AvatarCategory) => {
  return avatarAssets.filter(asset => asset.category === category);
};
