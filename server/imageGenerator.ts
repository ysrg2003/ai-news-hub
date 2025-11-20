/**
 * Smart Cover Image Generator for AI News Hub
 * Creates unique, professional SVG cover images for each article
 */

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

interface CategoryVisualIdentity {
  colors: ColorPalette;
  pattern: string;
}

// Visual identity dictionary - maps each category to colors and patterns
const CATEGORY_VISUAL_IDENTITY: Record<string, CategoryVisualIdentity> = {
  "machine-learning": {
    colors: {
      primary: "#6366f1",
      secondary: "#818cf8",
      accent: "#c7d2fe",
      background: "#f0f4ff",
    },
    pattern: "grid",
  },
  "natural-language-processing": {
    colors: {
      primary: "#ec4899",
      secondary: "#f472b6",
      accent: "#fbcfe8",
      background: "#fdf2f8",
    },
    pattern: "waves",
  },
  "computer-vision": {
    colors: {
      primary: "#f59e0b",
      secondary: "#fbbf24",
      accent: "#fcd34d",
      background: "#fffbeb",
    },
    pattern: "circles",
  },
  robotics: {
    colors: {
      primary: "#10b981",
      secondary: "#34d399",
      accent: "#a7f3d0",
      background: "#f0fdf4",
    },
    pattern: "hexagons",
  },
  "generative-ai": {
    colors: {
      primary: "#8b5cf6",
      secondary: "#a78bfa",
      accent: "#ddd6fe",
      background: "#faf5ff",
    },
    pattern: "spirals",
  },
  "ai-applications": {
    colors: {
      primary: "#06b6d4",
      secondary: "#22d3ee",
      accent: "#a5f3fc",
      background: "#f0f9fa",
    },
    pattern: "dots",
  },
  "ai-research": {
    colors: {
      primary: "#ef4444",
      secondary: "#f87171",
      accent: "#fca5a5",
      background: "#fef2f2",
    },
    pattern: "lines",
  },
  "ai-ethics": {
    colors: {
      primary: "#14b8a6",
      secondary: "#2dd4bf",
      accent: "#99f6e4",
      background: "#f0fdfa",
    },
    pattern: "triangles",
  },
};

// Conceptual icon library - maps keywords to SVG functions
const ICON_LIBRARY: Record<string, (x: number, y: number, size: number, color: string) => string> = {
  network: (x, y, size, color) =>
    `<circle cx="${x}" cy="${y - size / 2}" r="${size / 6}" fill="${color}"/>
     <circle cx="${x + size / 3}" cy="${y + size / 3}" r="${size / 6}" fill="${color}"/>
     <circle cx="${x - size / 3}" cy="${y + size / 3}" r="${size / 6}" fill="${color}"/>
     <line x1="${x}" y1="${y - size / 2}" x2="${x + size / 3}" y2="${y + size / 3}" stroke="${color}" stroke-width="2"/>
     <line x1="${x}" y1="${y - size / 2}" x2="${x - size / 3}" y2="${y + size / 3}" stroke="${color}" stroke-width="2"/>
     <line x1="${x + size / 3}" y1="${y + size / 3}" x2="${x - size / 3}" y2="${y + size / 3}" stroke="${color}" stroke-width="2"/>`,

  balance: (x, y, size, color) =>
    `<line x1="${x - size / 2}" y1="${y}" x2="${x + size / 2}" y2="${y}" stroke="${color}" stroke-width="3"/>
     <rect x="${x - size / 3}" y="${y - size / 3}" width="${size / 3}" height="${size / 3}" fill="${color}" opacity="0.7"/>
     <rect x="${x}" y="${y - size / 3}" width="${size / 3}" height="${size / 3}" fill="${color}" opacity="0.7"/>
     <line x1="${x - size / 2}" y1="${y}" x2="${x - size / 6}" y2="${y - size / 2}" stroke="${color}" stroke-width="2"/>
     <line x1="${x + size / 2}" y1="${y}" x2="${x + size / 6}" y2="${y - size / 2}" stroke="${color}" stroke-width="2"/>`,

  security: (x, y, size, color) =>
    `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" rx="${size / 8}" fill="none" stroke="${color}" stroke-width="2"/>
     <path d="M ${x - size / 2} ${y - size / 2} L ${x} ${y - size / 4} L ${x + size / 2} ${y - size / 2}" fill="none" stroke="${color}" stroke-width="2"/>
     <circle cx="${x}" cy="${y + size / 4}" r="${size / 6}" fill="none" stroke="${color}" stroke-width="2"/>`,

  innovation: (x, y, size, color) =>
    `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="none" stroke="${color}" stroke-width="2"/>
     <path d="M ${x} ${y - size / 2} L ${x + size / 3} ${y + size / 3} L ${x - size / 3} ${y + size / 3} Z" fill="${color}" opacity="0.7"/>
     <circle cx="${x}" cy="${y}" r="${size / 6}" fill="${color}"/>`,

  growth: (x, y, size, color) =>
    `<polyline points="${x - size / 2},${y + size / 2} ${x - size / 6},${y + size / 6} ${x + size / 6},${y - size / 6} ${x + size / 2},${y - size / 2}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
     <circle cx="${x - size / 2}" cy="${y + size / 2}" r="${size / 8}" fill="${color}"/>
     <circle cx="${x + size / 2}" cy="${y - size / 2}" r="${size / 8}" fill="${color}"/>`,

  data: (x, y, size, color) =>
    `<rect x="${x - size / 2}" y="${y - size / 3}" width="${size / 3}" height="${size / 2}" fill="${color}" opacity="0.7"/>
     <rect x="${x - size / 6}" y="${y - size / 4}" width="${size / 3}" height="${size / 3}" fill="${color}" opacity="0.7"/>
     <rect x="${x + size / 6}" y="${y - size / 6}" width="${size / 3}" height="${size / 4}" fill="${color}" opacity="0.7"/>`,

  learning: (x, y, size, color) =>
    `<path d="M ${x - size / 2} ${y - size / 2} L ${x} ${y - size / 2 - size / 6} L ${x + size / 2} ${y - size / 2}" fill="none" stroke="${color}" stroke-width="2"/>
     <rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" rx="${size / 8}" fill="none" stroke="${color}" stroke-width="2"/>
     <line x1="${x}" y1="${y - size / 6}" x2="${x}" y2="${y + size / 3}" stroke="${color}" stroke-width="2"/>`,

  brain: (x, y, size, color) =>
    `<circle cx="${x - size / 4}" cy="${y - size / 4}" r="${size / 4}" fill="${color}" opacity="0.7"/>
     <circle cx="${x + size / 4}" cy="${y - size / 4}" r="${size / 4}" fill="${color}" opacity="0.7"/>
     <circle cx="${x - size / 4}" cy="${y + size / 4}" r="${size / 4}" fill="${color}" opacity="0.7"/>
     <circle cx="${x + size / 4}" cy="${y + size / 4}" r="${size / 4}" fill="${color}" opacity="0.7"/>
     <circle cx="${x}" cy="${y}" r="${size / 6}" fill="${color}"/>`,

  rocket: (x, y, size, color) =>
    `<path d="M ${x} ${y - size / 2} L ${x - size / 4} ${y + size / 3} L ${x + size / 4} ${y + size / 3} Z" fill="${color}" opacity="0.7"/>
     <circle cx="${x}" cy="${y - size / 3}" r="${size / 6}" fill="${color}"/>
     <path d="M ${x - size / 6} ${y + size / 3} L ${x - size / 4} ${y + size / 2}" stroke="${color}" stroke-width="2"/>
     <path d="M ${x + size / 6} ${y + size / 3} L ${x + size / 4} ${y + size / 2}" stroke="${color}" stroke-width="2"/>`,
};

// Pattern generators
function generatePattern(type: string, width: number, height: number, colors: ColorPalette): string {
  const patternId = `pattern-${type}`;

  switch (type) {
    case "grid":
      return `<defs>
        <pattern id="${patternId}" x="20" y="20" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="20" height="20" fill="${colors.background}"/>
          <line x1="0" y1="0" x2="20" y2="20" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>
          <line x1="20" y1="0" x2="0" y2="20" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>
        </pattern>
      </defs>`;

    case "waves":
      return `<defs>
        <pattern id="${patternId}" x="0" y="0" width="100" height="50" patternUnits="userSpaceOnUse">
          <path d="M0,25 Q25,5 50,25 T100,25" stroke="${colors.accent}" stroke-width="2" fill="none" opacity="0.6"/>
        </pattern>
      </defs>`;

    case "circles":
      return `<defs>
        <pattern id="${patternId}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="10" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>
        </pattern>
      </defs>`;

    case "hexagons":
      return `<defs>
        <pattern id="${patternId}" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
          <polygon points="25,5 45,15 45,35 25,45 5,35 5,15" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>
        </pattern>
      </defs>`;

    case "spirals":
      return `<defs>
        <pattern id="${patternId}" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30,10 Q40,20 30,30 Q20,40 30,50" stroke="${colors.accent}" stroke-width="1" fill="none" opacity="0.5"/>
        </pattern>
      </defs>`;

    case "dots":
      return `<defs>
        <pattern id="${patternId}" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="3" fill="${colors.accent}" opacity="0.5"/>
        </pattern>
      </defs>`;

    case "lines":
      return `<defs>
        <pattern id="${patternId}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="20" y2="20" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>
        </pattern>
      </defs>`;

    case "triangles":
      return `<defs>
        <pattern id="${patternId}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <polygon points="20,5 35,30 5,30" fill="none" stroke="${colors.accent}" stroke-width="1" opacity="0.5"/>
        </pattern>
      </defs>`;

    default:
      return "";
  }
}

/**
 * Generate article cover image as SVG
 */
export function generateArticleCoverImage(
  title: string,
  categorySlug: string,
  conceptualIcon: string
): string {
  const width = 1200;
  const height = 630;

  // Get visual identity for category
  const identity = CATEGORY_VISUAL_IDENTITY[categorySlug] || CATEGORY_VISUAL_IDENTITY["machine-learning"];
  const colors = identity.colors;

  // Get icon function
  const iconKey = conceptualIcon.toLowerCase();
  const iconFunc = ICON_LIBRARY[iconKey] || ICON_LIBRARY.brain;

  // Generate pattern
  const patternDef = generatePattern(identity.pattern, width, height, colors);
  const patternId = `pattern-${identity.pattern}`;

  // Create gradient
  const gradientId = `gradient-${Date.now()}`;

  // Truncate title if too long
  const displayTitle = title.length > 60 ? title.substring(0, 57) + "..." : title;

  // Split title into lines for better display
  const words = displayTitle.split(" ");
  let line1 = "";
  let line2 = "";
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + word).length <= 30) {
      currentLine += (currentLine ? " " : "") + word;
    } else {
      if (!line1) {
        line1 = currentLine;
      } else {
        line2 = currentLine;
        break;
      }
      currentLine = word;
    }
  }

  if (!line2) {
    line2 = currentLine;
  }

  // Generate SVG
  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:0.1" />
        <stop offset="100%" style="stop-color:${colors.secondary};stop-opacity:0.2" />
      </linearGradient>
      ${patternDef}
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="${colors.background}"/>

    <!-- Pattern -->
    <rect width="${width}" height="${height}" fill="url(#${patternId})"/>

    <!-- Gradient overlay -->
    <rect width="${width}" height="${height}" fill="url(#${gradientId})"/>

    <!-- Decorative shapes -->
    <circle cx="${width * 0.15}" cy="${height * 0.2}" r="120" fill="${colors.accent}" opacity="0.3"/>
    <circle cx="${width * 0.85}" cy="${height * 0.8}" r="150" fill="${colors.secondary}" opacity="0.2"/>

    <!-- Icon -->
    <g transform="translate(${width * 0.85}, ${height * 0.3})">
      ${iconFunc(0, 0, 120, colors.primary)}
    </g>

    <!-- Title -->
    <text x="${width * 0.5}" y="${height * 0.45}" font-size="56" font-weight="bold" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif">
      ${escapeXml(line1)}
    </text>
    <text x="${width * 0.5}" y="${height * 0.58}" font-size="56" font-weight="bold" text-anchor="middle" fill="${colors.primary}" font-family="Arial, sans-serif">
      ${escapeXml(line2)}
    </text>

    <!-- Accent line -->
    <rect x="${width * 0.15}" y="${height * 0.65}" width="150" height="4" fill="${colors.secondary}"/>

    <!-- Branding -->
    <text x="${width * 0.15}" y="${height * 0.9}" font-size="18" fill="${colors.secondary}" font-family="Arial, sans-serif" opacity="0.8">
      AI News Hub
    </text>
  </svg>`;

  return svg;
}

/**
 * Convert SVG to Base64
 */
export function svgToBase64(svg: string): string {
  return Buffer.from(svg).toString("base64");
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generate image data URL for display
 */
export function generateImageDataUrl(svg: string): string {
  const base64 = svgToBase64(svg);
  return `data:image/svg+xml;base64,${base64}`;
}
