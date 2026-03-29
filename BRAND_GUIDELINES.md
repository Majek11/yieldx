# YieldX Brand Guidelines

## Logo System

### Primary Logo
- **File:** `logo.svg` (main branding asset)
- **Colors:** Purple (#7C3AED) + Emerald Green (#10B981)
- **Usage:** All official branding, hero sections, headers
- **Locations:** `/public/logo.svg`, `/src/assets/yieldx-logo.svg`

### Logo Variants

#### 1. **Monochrome (Purple)**
- **File:** `logo-monochrome.svg`
- **Usage:** Print, B&W contexts, embroidery, situations where color isn't available
- **Color:** Purple (#7C3AED)

#### 2. **Inverted (White)**
- **File:** `logo-inverted.svg`
- **Usage:** Dark backgrounds, dark mode contexts, inverse layouts
- **Colors:** White (#FFFFFF) + Emerald Green (#10B981)

#### 3. **Emerald Accent**
- **File:** `logo-emerald.svg`
- **Usage:** Alternative accent treatments, secondary branding
- **Colors:** Emerald (#10B981) + Purple (#7C3AED)

#### 4. **Stacked**
- **File:** `logo-stacked.svg`
- **Usage:** Vertical layouts, email headers, app icons with text
- **Format:** Logo above text (vertical stacking)

## Color Palette

### Primary Colors
- **Purple (Primary):** `#7C3AED` - Main brand color, CTAs, primary actions
- **Emerald (Accent):** `#10B981` - Success states, data points, growth indicators

### Secondary Colors
- **Dark Background:** `#080b18` - Dark mode default
- **Light Background:** `#f8f9fa` - Light mode default
- **Foreground (Dark):** `#1e1b4b` - Text on light backgrounds
- **Foreground (Light):** `#FFFFFF` - Text on dark backgrounds

### Neutral Grays
- **Muted:** `hsl(228 20% 18%)`
- **Border:** `hsl(228 20% 15%)`
- **Input:** `hsl(228 20% 15%)`

## Typography

### Font Families
- **Headings:** Syne (wght: 400-800)
- **Body:** Plus Jakarta Sans (wght: 300-700)
- **Sans:** Plus Jakarta Sans (default)

### Font Stack in CSS
```css
font-family: 'Syne', sans-serif;  /* Headings */
font-family: 'Plus Jakarta Sans', sans-serif;  /* Body */
```

## Logo Sizing Guidelines

### Recommended Minimum Sizes
- **Desktop:** 32×32px (navbar)
- **Favicon:** 192×192px, 512×512px
- **Print:** 1 inch × 1 inch minimum
- **Web Banner:** 300×300px minimum

### Spacing
- **Clear Space (minimum):** 10% of logo width on all sides
- **No text wrapping:** Keep logo and wordmark minimum 8px apart

## Usage Rules

### ✅ DO
- Use the full-color primary logo on white or light backgrounds
- Use inverted logo on dark/purple backgrounds
- Maintain aspect ratio when scaling
- Leave adequate whitespace around logo
- Use monochrome for print/B&W contexts

### ❌ DON'T
- Stretch or distort the logo
- Change colors without approval
- Use reversed colors without design intent
- Place on competing background patterns
- Rotate the logo at angles

## Logo Files Provided

### Public Assets (`/public`)
- `logo.svg` - Primary logo (color)
- `logo-monochrome.svg` - Purple-only version
- `logo-inverted.svg` - White version for dark backgrounds
- `logo-emerald.svg` - Emerald-dominant variant
- `logo-stacked.svg` - Vertical stacked version

### Source Assets (`/src/assets`)
- `yieldx-logo.svg` - Primary (same as public)
- `yieldx-logo-monochrome.svg`
- `yieldx-logo-inverted.svg`
- `yieldx-logo-emerald.svg`
- `yieldx-logo-stacked.svg`

## Implementation

### In HTML
```html
<link rel="icon" type="image/svg+xml" href="/logo.svg" />
<img src="/logo.svg" alt="YieldX" width="32" height="32" />
```

### In React
```jsx
import Logo from '@/assets/yieldx-logo.svg';

<img src={Logo} alt="YieldX" className="w-8 h-8" />
```

### In Navbar (Current Implementation)
The Navbar component uses an inline SVG version of the primary logo (32×32px).

## Brand Voice

**Tone:** Professional, trustworthy, innovative, modern
**Adjectives:** Intelligent, Secure, Efficient, Transparent, Approachable
**Positioning:** Enterprise-grade AI crypto investment platform with institutional security and retail accessibility

---

*Last Updated: March 29, 2026*
*Next Review: As needed for brand consistency*
