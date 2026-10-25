import { Link } from 'react-router-dom';

const BRAND_GLYPH = '/manus-storage/brand-glyph-ink_46c72a38.svg';
const BRAND_GLYPH_INVERSE = '/manus-storage/brand-glyph-inverse_95f73485.svg';

interface BrandProps {
  inverse?: boolean;
  tagline?: boolean;
  compact?: boolean;
}

export default function Brand({ inverse = false, tagline = false, compact = false }: BrandProps) {
  return (
    <Link className={`brand-lockup${inverse ? ' brand-lockup-inverse' : ''}${compact ? ' brand-lockup-compact' : ''}`} to="/" aria-label="CodeDarpan home">
      <img src={inverse ? BRAND_GLYPH_INVERSE : BRAND_GLYPH} alt="" width="34" height="34" />
      <span className="brand-word-stack">
        <span className="brand-word">CodeDarpan</span>
        {tagline && <span className="brand-tagline">Understand the code behind the code.</span>}
      </span>
    </Link>
  );
}
