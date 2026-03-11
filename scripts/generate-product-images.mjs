#!/usr/bin/env node
/**
 * Generates SVG preview images for all 25 products
 * Output: /public/images/products/<slug>.svg
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '../public/images/products');

fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Colour palettes ───────────────────────────────────────────────────────────
const PALETTES = {
  theme:   { bg: '#0f172a', panel: '#1e293b', accent: '#6366f1', text: '#f1f5f9', sub: '#94a3b8', stripe: '#1e293b' },
  module:  { bg: '#0d1117', panel: '#161b22', accent: '#10b981', text: '#f0fdf4', sub: '#6ee7b7', stripe: '#161b22' },
  xml:     { bg: '#0c0a20', panel: '#1a1535', accent: '#f59e0b', text: '#fefce8', sub: '#fcd34d', stripe: '#1a1535' },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const esc = (s) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

function wrap(text, maxLen = 28) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > maxLen) { lines.push(cur.trim()); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur.trim());
  return lines;
}

// ─── Store Theme SVG ──────────────────────────────────────────────────────────
function makeThemeSVG({ slug, name, shortDesc, price, palette, themeStyle }) {
  const p = palette;
  const lines = wrap(name, 26);
  const descLines = wrap(shortDesc, 40);

  const isDark = themeStyle === 'dark';
  const isFashion = themeStyle === 'fashion';
  const isMinimal = themeStyle === 'minimal';

  const headerBg = isDark ? '#1a1a2e' : isFashion ? '#1a1a1a' : isMinimal ? '#ffffff' : '#4f46e5';
  const navBg    = isDark ? '#16213e' : isFashion ? '#111111' : isMinimal ? '#fafafa' : '#4338ca';
  const heroGrad = isDark
    ? 'url(#heroGradDark)'
    : isFashion
    ? 'url(#heroGradFashion)'
    : isMinimal
    ? 'url(#heroGradMinimal)'
    : 'url(#heroGrad)';

  const accentCol = isFashion ? '#c9a96e' : isMinimal ? '#111111' : isDark ? '#7c3aed' : '#6366f1';
  const cardBg    = isDark ? '#1e1e3a' : isFashion ? '#1a1a1a' : isMinimal ? '#fff' : '#fff';
  const cardBord  = isDark ? '#2d2d5e' : isFashion ? '#333' : isMinimal ? '#e5e7eb' : '#e2e8f0';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="heroBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="${p.panel}"/>
    </linearGradient>
    <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4f46e5"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
    <linearGradient id="heroGradDark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#4f46e5"/>
    </linearGradient>
    <linearGradient id="heroGradFashion" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#2d2d2d"/>
    </linearGradient>
    <linearGradient id="heroGradMinimal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#f1f5f9"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.15"/>
    </filter>
    <clipPath id="screenClip"><rect x="60" y="80" width="680" height="420" rx="8"/></clipPath>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="url(#heroBg)"/>

  <!-- Browser chrome -->
  <rect x="60" y="55" width="680" height="445" rx="10" fill="${p.panel}" filter="url(#shadow)"/>
  <!-- Browser bar -->
  <rect x="60" y="55" width="680" height="28" rx="10" fill="${isDark||isFashion ? '#0f0f1a' : '#334155'}"/>
  <rect x="60" y="72" width="680" height="11" fill="${isDark||isFashion ? '#0f0f1a' : '#334155'}"/>
  <circle cx="83" cy="69" r="5" fill="#ff5f56"/>
  <circle cx="100" cy="69" r="5" fill="#ffbd2e"/>
  <circle cx="117" cy="69" r="5" fill="#27c93f"/>
  <rect x="150" y="61" width="420" height="16" rx="8" fill="${isDark ? '#1a1a2e' : '#475569'}"/>
  <text x="360" y="73" fill="${isDark ? '#6366f1' : '#94a3b8'}" font-size="8" text-anchor="middle" font-family="monospace">localhost/opencart/</text>

  <!-- Store content clipped to screen -->
  <g clip-path="url(#screenClip)">
    <!-- Header -->
    <rect x="60" y="83" width="680" height="36" fill="${headerBg}"/>
    <rect x="72" y="93" width="60" height="16" rx="3" fill="${accentCol}"/>
    <text x="102" y="105" fill="white" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">NOVA</text>
    ${isFashion
      ? `<text x="200" y="105" fill="#888" font-size="8" font-family="sans-serif">WOMEN</text><text x="255" y="105" fill="#888" font-size="8" font-family="sans-serif">MEN</text><text x="300" y="105" fill="#888" font-size="8" font-family="sans-serif">SALE</text>`
      : `<text x="200" y="105" fill="${isMinimal?'#888':'#aaa'}" font-size="8" font-family="sans-serif">Shop</text><text x="235" y="105" fill="${isMinimal?'#888':'#aaa'}" font-size="8" font-family="sans-serif">Sale</text><text x="265" y="105" fill="${isMinimal?'#888':'#aaa'}" font-size="8" font-family="sans-serif">Blog</text>`
    }
    <text x="680" y="105" fill="${isMinimal?'#333':'white'}" font-size="8" text-anchor="end" font-family="sans-serif">Cart (0)</text>

    <!-- Hero -->
    <rect x="60" y="119" width="680" height="130" fill="${heroGrad}"/>
    ${isFashion
      ? `<rect x="60" y="119" width="680" height="130" fill="#111"/>
         <rect x="360" y="119" width="380" height="130" fill="#1a1a1a"/>
         <text x="200" y="160" fill="#c9a96e" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="4">NEW COLLECTION</text>
         <text x="200" y="180" fill="white" font-size="20" font-weight="bold" text-anchor="middle" font-family="serif">EDITORIAL</text>
         <text x="200" y="195" fill="white" font-size="20" font-weight="bold" text-anchor="middle" font-family="serif">FASHION</text>
         <rect x="155" y="210" width="90" height="18" fill="#c9a96e"/>
         <text x="200" y="223" fill="black" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">SHOP NOW</text>`
      : isMinimal
      ? `<text x="380" y="165" fill="#111" font-size="26" font-weight="300" text-anchor="middle" font-family="sans-serif">Designed for</text>
         <text x="380" y="195" fill="#111" font-size="26" font-weight="700" text-anchor="middle" font-family="sans-serif">Premium Brands</text>
         <rect x="330" y="210" width="100" height="18" fill="#111"/>
         <text x="380" y="223" fill="white" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">EXPLORE</text>`
      : `<text x="380" y="165" fill="white" font-size="22" font-weight="bold" text-anchor="middle" font-family="sans-serif">Summer Collection</text>
         <text x="380" y="188" fill="rgba(255,255,255,0.7)" font-size="11" text-anchor="middle" font-family="sans-serif">Discover trending products</text>
         <rect x="330" y="200" width="100" height="20" rx="4" fill="white"/>
         <text x="380" y="215" fill="${accentCol}" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">Shop Now</text>`
    }

    <!-- Product cards row -->
    <rect x="60" y="249" width="680" height="100" fill="${isDark ? '#0f0f1a' : isFashion ? '#111' : '#f8fafc'}"/>
    ${[0,1,2,3].map(i => {
      const cx = 90 + i * 168;
      return `
        <rect x="${cx}" y="258" width="148" height="80" rx="4" fill="${cardBg}" stroke="${cardBord}" stroke-width="0.5"/>
        <rect x="${cx}" y="258" width="148" height="45" rx="4" fill="${isDark?'#1e1e3a':isFashion?'#222':'#e2e8f0'}"/>
        <rect x="${cx}" y="${258+45+8}" width="90" height="6" rx="3" fill="${isDark?'#3b3b6e':isFashion?'#444':'#cbd5e1'}"/>
        <rect x="${cx}" y="${258+45+20}" width="55" height="5" rx="2.5" fill="${accentCol}" opacity="0.7"/>
      `;
    }).join('')}

    <!-- Footer strip -->
    <rect x="60" y="349" width="680" height="152" fill="${isDark ? '#08080f' : isFashion ? '#0a0a0a' : '#1e293b'}"/>
    <rect x="72" y="362" width="50" height="12" rx="2" fill="${accentCol}" opacity="0.7"/>
    ${[0,1,2,3].map(i=>`<rect x="${130+i*120}" y="362" width="80" height="6" rx="3" fill="${isDark?'#2d2d5e':isFashion?'#333':'#334155'}"/>`).join('')}
    ${[0,1,2,3].map(i=>`<rect x="${130+i*120}" y="374" width="60" height="4" rx="2" fill="${isDark?'#1e1e3a':isFashion?'#222':'#1e293b'}"/>`).join('')}
  </g>

  <!-- Label banner at bottom -->
  <rect x="0" y="525" width="800" height="75" fill="${p.panel}"/>
  <rect x="0" y="525" width="800" height="3" fill="${accentCol}"/>

  <!-- Product name -->
  ${lines.map((l,i) => `<text x="30" y="${552 + i*22}" fill="${p.text}" font-size="${lines.length > 1 ? 18 : 22}" font-weight="bold" font-family="sans-serif">${esc(l)}</text>`).join('\n  ')}

  <!-- Price badge -->
  <rect x="680" y="535" width="90" height="30" rx="6" fill="${accentCol}"/>
  <text x="725" y="556" fill="white" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">$${price.toFixed(2)}</text>

  <!-- Category tag -->
  <rect x="30" y="562" width="50" height="16" rx="4" fill="${accentCol}" opacity="0.15"/>
  <text x="55" y="574" fill="${accentCol}" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">THEME</text>
</svg>`;
}

// ─── Module SVG ───────────────────────────────────────────────────────────────
function makeModuleSVG({ slug, name, shortDesc, price, palette, icon }) {
  const p = palette;
  const lines = wrap(name, 26);
  const descLines = wrap(shortDesc, 42).slice(0, 2);

  const icons = {
    cart:     `<rect x="330" y="175" width="140" height="110" rx="8" fill="#0d2d24" stroke="#10b981" stroke-width="1.5"/>
               <text x="400" y="220" fill="#10b981" font-size="32" text-anchor="middle" font-family="sans-serif">🛒</text>
               <text x="400" y="250" fill="#6ee7b7" font-size="10" text-anchor="middle" font-family="sans-serif">AJAX Cart</text>`,
    announce: `<rect x="80" y="180" width="640" height="50" rx="6" fill="#0d2d24" stroke="#10b981" stroke-width="1.5"/>
               <text x="400" y="200" fill="#6ee7b7" font-size="9" text-anchor="middle" font-family="sans-serif">📣  Free shipping on orders over $50 — Code: FREESHIP</text>
               <rect x="750" y="188" width="0" height="34" fill="#10b981"/>`,
    compare:  `<rect x="180" y="165" width="180" height="130" rx="8" fill="#0d2d24" stroke="#10b981" stroke-width="1.5"/>
               <rect x="440" y="165" width="180" height="130" rx="8" fill="#0d2d24" stroke="#6ee7b7" stroke-width="1.5"/>
               <rect x="195" y="178" width="150" height="70" rx="4" fill="#0a1f17"/>
               <rect x="455" y="178" width="150" height="70" rx="4" fill="#0a1f17"/>
               <text x="270" y="265" fill="#10b981" font-size="8" text-anchor="middle" font-family="sans-serif">Product A</text>
               <text x="530" y="265" fill="#6ee7b7" font-size="8" text-anchor="middle" font-family="sans-serif">Product B</text>
               <text x="400" y="230" fill="#10b981" font-size="20" text-anchor="middle">⇄</text>`,
    megamenu: `<rect x="80" y="160" width="640" height="30" rx="0" fill="#0a1f17" stroke="#10b981" stroke-width="1"/>
               <text x="120" y="179" fill="#6ee7b7" font-size="9" font-family="sans-serif">Home</text>
               <text x="165" y="179" fill="#10b981" font-size="9" font-family="sans-serif">Shop ▾</text>
               <text x="215" y="179" fill="#6ee7b7" font-size="9" font-family="sans-serif">Blog</text>
               <rect x="145" y="190" width="280" height="120" rx="4" fill="#0d2d24" stroke="#10b981" stroke-width="1"/>
               <rect x="155" y="200" width="120" height="100" rx="2" fill="#0a1f17"/>
               <rect x="285" y="200" width="130" height="45" rx="2" fill="#0a1f17"/>
               <rect x="285" y="255" width="130" height="45" rx="2" fill="#0a1f17"/>`,
    newsletter:`<rect x="150" y="150" width="500" height="200" rx="12" fill="#0d2d24" stroke="#10b981" stroke-width="1.5"/>
               <text x="400" y="205" fill="#f0fdf4" font-size="18" font-weight="bold" text-anchor="middle" font-family="sans-serif">Get 10% Off</text>
               <text x="400" y="225" fill="#6ee7b7" font-size="10" text-anchor="middle" font-family="sans-serif">Subscribe to our newsletter</text>
               <rect x="195" y="248" width="290" height="28" rx="4" fill="#0a1f17" stroke="#10b981" stroke-width="1"/>
               <text x="330" y="267" fill="#4b5563" font-size="9" font-family="sans-serif">Enter your email address</text>
               <rect x="495" y="248" width="80" height="28" rx="4" fill="#10b981"/>
               <text x="535" y="267" fill="white" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">Subscribe</text>`,
    labels:   `<rect x="200" y="165" width="160" height="180" rx="8" fill="#0d2d24" stroke="#10b981" stroke-width="1.5"/>
               <rect x="210" y="175" width="140" height="90" rx="4" fill="#0a1f17"/>
               <rect x="210" y="175" width="55" height="20" rx="2" fill="#ef4444"/>
               <text x="237" y="189" fill="white" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">SALE</text>
               <rect x="210" y="175" width="0" height="0"/>
               <rect x="274" y="175" width="55" height="20" rx="2" fill="#10b981"/>
               <text x="301" y="189" fill="white" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">NEW</text>
               <rect x="210" y="274" width="90" height="10" rx="2" fill="#1a3a2a"/>
               <rect x="210" y="292" width="55" height="8" rx="2" fill="#10b981" opacity="0.6"/>
               <rect x="440" y="165" width="160" height="180" rx="8" fill="#0d2d24" stroke="#6ee7b7" stroke-width="1"/>
               <rect x="450" y="175" width="140" height="90" rx="4" fill="#0a1f17"/>
               <rect x="450" y="175" width="60" height="20" rx="2" fill="#f59e0b"/>
               <text x="480" y="189" fill="white" font-size="8" font-weight="bold" text-anchor="middle" font-family="sans-serif">HOT</text>`,
    quickview:`<rect x="150" y="145" width="500" height="215" rx="12" fill="#0d2d24" stroke="#10b981" stroke-width="1.5"/>
               <rect x="165" y="158" width="180" height="145" rx="6" fill="#0a1f17"/>
               <rect x="360" y="158" width="275" height="20" rx="3" fill="#0a1f17"/>
               <rect x="360" y="186" width="200" height="10" rx="2" fill="#1a3a2a"/>
               <rect x="360" y="202" width="160" height="8" rx="2" fill="#1a3a2a"/>
               <rect x="360" y="218" width="180" height="8" rx="2" fill="#1a3a2a"/>
               <rect x="360" y="242" width="80" height="24" rx="4" fill="#10b981"/>
               <text x="400" y="259" fill="white" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">Add to Cart</text>`,
    recent:   `<text x="400" y="170" fill="#6ee7b7" font-size="10" text-anchor="middle" font-family="sans-serif">Recently Viewed</text>
               ${[0,1,2,3].map(i=>`
               <rect x="${100+i*155}" y="182" width="130" height="110" rx="6" fill="#0d2d24" stroke="#10b981" stroke-width="1"/>
               <rect x="${110+i*155}" y="192" width="110" height="65" rx="3" fill="#0a1f17"/>
               <rect x="${110+i*155}" y="265" width="80" height="7" rx="2" fill="#1a3a2a"/>
               <rect x="${110+i*155}" y="278" width="50" height="6" rx="2" fill="#10b981" opacity="0.5"/>`).join('')}`,
    scroll:   `<circle cx="400" cy="220" r="70" fill="#0d2d24" stroke="#10b981" stroke-width="2"/>
               <text x="400" y="215" fill="#10b981" font-size="36" text-anchor="middle" font-family="sans-serif">↑</text>
               <text x="400" y="240" fill="#6ee7b7" font-size="10" text-anchor="middle" font-family="sans-serif">Back to Top</text>`,
    sizeguide:`<rect x="150" y="145" width="500" height="215" rx="12" fill="#0d2d24" stroke="#10b981" stroke-width="1.5"/>
               <text x="400" y="175" fill="#f0fdf4" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">Size Guide</text>
               ${['XS','S','M','L','XL','XXL'].map((s,i)=>`
               <rect x="${170+i*75}" y="188" width="60" height="24" rx="4" fill="${i===2?'#10b981':'#0a1f17'}" stroke="#10b981" stroke-width="1"/>
               <text x="${200+i*75}" y="205" fill="${i===2?'white':'#6ee7b7'}" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">${s}</text>`).join('')}
               <rect x="160" y="225" width="480" height="1" fill="#1a3a2a"/>
               ${['Chest','Waist','Hip'].map((row,ri)=>`
               <text x="175" y="${248+ri*18}" fill="#6ee7b7" font-size="9" font-family="sans-serif">${row}</text>
               ${['32-34','34-36','36-38','38-40','40-42','42-44'].map((v,ci)=>`
               <text x="${220+ci*75}" y="${248+ri*18}" fill="${p.sub}" font-size="9" text-anchor="middle" font-family="sans-serif">${v}</text>`).join('')}`).join('')}`,
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="${p.panel}"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="url(#bg)"/>

  <!-- Grid lines -->
  ${Array.from({length:12},(_,i)=>`<line x1="${i*67}" y1="0" x2="${i*67}" y2="600" stroke="${p.accent}" stroke-width="0.2" opacity="0.15"/>`).join('\n  ')}
  ${Array.from({length:9},(_,i)=>`<line x1="0" y1="${i*67}" x2="800" y2="${i*67}" stroke="${p.accent}" stroke-width="0.2" opacity="0.15"/>`).join('\n  ')}

  <!-- Glow orb -->
  <circle cx="400" cy="250" r="200" fill="${p.accent}" opacity="0.06" filter="url(#glow)"/>

  <!-- Module preview illustration -->
  ${icons[icon] || `<text x="400" y="240" fill="${p.accent}" font-size="60" text-anchor="middle">⚡</text>`}

  <!-- Label area -->
  <rect x="0" y="525" width="800" height="75" fill="${p.panel}"/>
  <rect x="0" y="525" width="800" height="3" fill="${p.accent}"/>

  ${lines.map((l,i) => `<text x="30" y="${552 + i*22}" fill="${p.text}" font-size="${lines.length > 1 ? 18 : 22}" font-weight="bold" font-family="sans-serif">${esc(l)}</text>`).join('\n  ')}

  ${price === 0
    ? `<rect x="680" y="535" width="90" height="30" rx="6" fill="#1a3a2a"/><text x="725" y="556" fill="${p.accent}" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">FREE</text>`
    : `<rect x="680" y="535" width="90" height="30" rx="6" fill="${p.accent}"/><text x="725" y="556" fill="white" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">$${price.toFixed(2)}</text>`
  }

  <rect x="30" y="562" width="60" height="16" rx="4" fill="${p.accent}" opacity="0.15"/>
  <text x="60" y="574" fill="${p.accent}" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">MODULE</text>
</svg>`;
}

// ─── XML Feed SVG ─────────────────────────────────────────────────────────────
function makeXMLSVG({ slug, name, shortDesc, price, palette, marketplace, logo }) {
  const p = palette;
  const lines = wrap(name, 28);

  const mColors = {
    google:       { primary: '#4285f4', secondary: '#34a853', bg: '#1a1a2e' },
    meta:         { primary: '#1877f2', secondary: '#42b72a', bg: '#0d1117' },
    trendyol:     { primary: '#ff6000', secondary: '#ff8c00', bg: '#1a0f00' },
    hepsiburada:  { primary: '#ff6000', secondary: '#ff8c00', bg: '#1a0f00' },
    n11:          { primary: '#7b2ff7', secondary: '#9b4fff', bg: '#150020' },
    gittigidiyor: { primary: '#ff0000', secondary: '#cc0000', bg: '#1a0000' },
    ciceksepeti:  { primary: '#e91e8c', secondary: '#c0156e', bg: '#1a0010' },
    pttavm:       { primary: '#c8a000', secondary: '#e6b800', bg: '#1a1400' },
    amazon:       { primary: '#ff9900', secondary: '#f5a623', bg: '#1a1200' },
    idefix:       { primary: '#0066cc', secondary: '#0088ff', bg: '#00091a' },
  };

  const mc = mColors[marketplace] || { primary: p.accent, secondary: p.sub, bg: p.bg };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.bg}"/>
      <stop offset="100%" stop-color="${p.panel}"/>
    </linearGradient>
    <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${mc.primary}"/>
      <stop offset="100%" stop-color="${mc.secondary}"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="url(#bg)"/>

  <!-- Glow orb -->
  <circle cx="400" cy="250" r="180" fill="${mc.primary}" opacity="0.06" filter="url(#glow)"/>

  <!-- Center card -->
  <rect x="120" y="100" width="560" height="330" rx="16" fill="#0d1117" stroke="${mc.primary}" stroke-width="1.5" opacity="0.9"/>

  <!-- XML Feed visual -->
  <!-- Top bar with marketplace brand colour -->
  <rect x="120" y="100" width="560" height="48" rx="16" fill="url(#barGrad)"/>
  <rect x="120" y="132" width="560" height="16" fill="url(#barGrad)"/>

  <!-- Marketplace name -->
  <text x="400" y="132" fill="white" font-size="18" font-weight="bold" text-anchor="middle" font-family="sans-serif" letter-spacing="1">${esc(logo || marketplace.toUpperCase())}</text>

  <!-- XML rows simulating product feed -->
  <text x="148" y="172" fill="${mc.primary}" font-size="9" font-family="monospace">&lt;products&gt;</text>
  ${[0,1,2].map((row) => `
  <text x="165" y="${190+row*50}" fill="#4b5563" font-size="9" font-family="monospace">&lt;item&gt;</text>
  <rect x="182" y="${197+row*50}" width="${180+row*20}" height="6" rx="3" fill="${row===0?mc.primary:mc.secondary}" opacity="${0.7-row*0.15}"/>
  <rect x="182" y="${208+row*50}" width="${120+row*15}" height="4" rx="2" fill="#1e293b"/>
  <rect x="182" y="${216+row*50}" width="${90+row*10}" height="4" rx="2" fill="#1e293b"/>
  <text x="165" y="${225+row*50}" fill="#4b5563" font-size="9" font-family="monospace">&lt;/item&gt;</text>`).join('')}
  <text x="148" y="382" fill="${mc.primary}" font-size="9" font-family="monospace">&lt;/products&gt;</text>

  <!-- Arrow icon -->
  <circle cx="680" cy="265" r="22" fill="${mc.primary}" opacity="0.15" stroke="${mc.primary}" stroke-width="1"/>
  <text x="680" y="273" fill="${mc.primary}" font-size="18" font-weight="bold" text-anchor="middle" font-family="sans-serif">→</text>

  <!-- Stats bar -->
  <rect x="120" y="430" width="560" height="55" fill="#161b22"/>
  <text x="180" y="452" fill="#6b7280" font-size="9" font-family="sans-serif">Products synced</text>
  <text x="180" y="470" fill="${mc.primary}" font-size="14" font-weight="bold" font-family="sans-serif">Auto</text>
  <text x="340" y="452" fill="#6b7280" font-size="9" font-family="sans-serif">Format</text>
  <text x="340" y="470" fill="${mc.secondary}" font-size="14" font-weight="bold" font-family="sans-serif">XML</text>
  <text x="500" y="452" fill="#6b7280" font-size="9" font-family="sans-serif">Install</text>
  <text x="500" y="470" fill="${p.sub}" font-size="14" font-weight="bold" font-family="sans-serif">OCMOD</text>

  <!-- Label area -->
  <rect x="0" y="525" width="800" height="75" fill="${p.panel}"/>
  <rect x="0" y="525" width="800" height="3" fill="${mc.primary}"/>

  ${lines.map((l,i) => `<text x="30" y="${552 + i*22}" fill="${p.text}" font-size="${lines.length > 1 ? 17 : 21}" font-weight="bold" font-family="sans-serif">${esc(l)}</text>`).join('\n  ')}

  ${price === 0
    ? `<rect x="680" y="535" width="90" height="30" rx="6" fill="${mc.primary}" opacity="0.2"/><text x="725" y="556" fill="${mc.primary}" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">FREE</text>`
    : `<rect x="680" y="535" width="90" height="30" rx="6" fill="${mc.primary}"/><text x="725" y="556" fill="white" font-size="14" font-weight="bold" text-anchor="middle" font-family="sans-serif">$${price.toFixed(2)}</text>`
  }

  <rect x="30" y="562" width="60" height="16" rx="4" fill="${mc.primary}" opacity="0.15"/>
  <text x="60" y="574" fill="${mc.primary}" font-size="9" font-weight="bold" text-anchor="middle" font-family="sans-serif">XML FEED</text>
</svg>`;
}

// ─── Product definitions ───────────────────────────────────────────────────────
const products = [
  // THEMES
  { file: 'novakur.svg',           fn: makeThemeSVG,   args: { slug:'novakur',           name:'NovaKur Theme for OpenCart 4',          shortDesc:'Full-featured OpenCart 4 theme',         price:29.99, palette:PALETTES.theme, themeStyle:'default'  } },
  { file: 'novakur-base.svg',      fn: makeThemeSVG,   args: { slug:'novakur-base',       name:'NovaKur Base Theme',                    shortDesc:'Lightweight base OpenCart 4 theme',      price:19.99, palette:PALETTES.theme, themeStyle:'default'  } },
  { file: 'novakur-dark-theme.svg',fn: makeThemeSVG,   args: { slug:'novakur-dark-theme', name:'NovaKur Dark Theme for OpenCart 4',     shortDesc:'Sleek dark-mode OpenCart 4 theme',       price:19.99, palette:PALETTES.theme, themeStyle:'dark'     } },
  { file: 'novakur-fashion.svg',   fn: makeThemeSVG,   args: { slug:'novakur-fashion',    name:'NovaKur Fashion Theme',                 shortDesc:'Editorial fashion OpenCart 4 theme',     price:39.99, palette:PALETTES.theme, themeStyle:'fashion'  } },
  { file: 'novakur-minimal.svg',   fn: makeThemeSVG,   args: { slug:'novakur-minimal',    name:'NovaKur Minimal Theme',                 shortDesc:'Ultra-clean premium OpenCart 4 theme',   price:34.99, palette:PALETTES.theme, themeStyle:'minimal'  } },

  // MODULES
  { file: 'nk-ajax-cart.svg',          fn: makeModuleSVG, args: { slug:'nk-ajax-cart',          name:'NovaKur AJAX Cart',           shortDesc:'Add to cart without page reload',         price:0,    palette:PALETTES.module, icon:'cart'       } },
  { file: 'nk-announcement-bar.svg',   fn: makeModuleSVG, args: { slug:'nk-announcement-bar',   name:'NovaKur Announcement Bar',    shortDesc:'Sticky promotion announcement bar',       price:0,    palette:PALETTES.module, icon:'announce'   } },
  { file: 'nk-compare.svg',            fn: makeModuleSVG, args: { slug:'nk-compare',             name:'NovaKur Compare Products',    shortDesc:'Side-by-side product comparison',         price:0,    palette:PALETTES.module, icon:'compare'    } },
  { file: 'nk-mega-menu.svg',          fn: makeModuleSVG, args: { slug:'nk-mega-menu',           name:'NovaKur Mega Menu',           shortDesc:'Multi-column dropdown mega menu',         price:0,    palette:PALETTES.module, icon:'megamenu'   } },
  { file: 'nk-popup-newsletter.svg',   fn: makeModuleSVG, args: { slug:'nk-popup-newsletter',    name:'NovaKur Popup Newsletter',    shortDesc:'Email subscription popup modal',          price:0,    palette:PALETTES.module, icon:'newsletter' } },
  { file: 'nk-product-labels.svg',     fn: makeModuleSVG, args: { slug:'nk-product-labels',      name:'NovaKur Product Labels',      shortDesc:'Sale, New, Hot product badge labels',     price:0,    palette:PALETTES.module, icon:'labels'     } },
  { file: 'nk-quick-view.svg',         fn: makeModuleSVG, args: { slug:'nk-quick-view',          name:'NovaKur Quick View',          shortDesc:'Product quick view modal popup',          price:0,    palette:PALETTES.module, icon:'quickview'  } },
  { file: 'nk-recently-viewed.svg',    fn: makeModuleSVG, args: { slug:'nk-recently-viewed',     name:'NovaKur Recently Viewed',     shortDesc:'Recently viewed products section',        price:0,    palette:PALETTES.module, icon:'recent'     } },
  { file: 'nk-scroll-top.svg',         fn: makeModuleSVG, args: { slug:'nk-scroll-top',          name:'NovaKur Scroll To Top',       shortDesc:'Smooth scroll to top button',             price:0,    palette:PALETTES.module, icon:'scroll'     } },
  { file: 'nk-size-guide.svg',         fn: makeModuleSVG, args: { slug:'nk-size-guide',          name:'NovaKur Size Guide',          shortDesc:'Popup size guide for clothing stores',    price:0,    palette:PALETTES.module, icon:'sizeguide'  } },

  // XML FEEDS
  { file: 'nk-xml-google.svg',        fn: makeXMLSVG, args: { slug:'nk-xml-google',        name:'Google Shopping XML Feed',        shortDesc:'Google Merchant Center product feed',    price:9.99,  palette:PALETTES.xml, marketplace:'google',       logo:'Google Shopping' } },
  { file: 'nk-xml-meta.svg',          fn: makeXMLSVG, args: { slug:'nk-xml-meta',          name:'Meta / Facebook Product Feed',    shortDesc:'Facebook & Instagram shopping feed',     price:9.99,  palette:PALETTES.xml, marketplace:'meta',         logo:'Meta / Facebook' } },
  { file: 'nk-xml-trendyol.svg',      fn: makeXMLSVG, args: { slug:'nk-xml-trendyol',      name:'Trendyol XML Feed',               shortDesc:'Trendyol marketplace product feed',      price:9.99,  palette:PALETTES.xml, marketplace:'trendyol',     logo:'Trendyol' } },
  { file: 'nk-xml-hepsiburada.svg',   fn: makeXMLSVG, args: { slug:'nk-xml-hepsiburada',   name:'Hepsiburada XML Feed',            shortDesc:'Hepsiburada marketplace product feed',   price:9.99,  palette:PALETTES.xml, marketplace:'hepsiburada',  logo:'Hepsiburada' } },
  { file: 'nk-xml-n11.svg',           fn: makeXMLSVG, args: { slug:'nk-xml-n11',           name:'n11 XML Feed',                    shortDesc:'n11 marketplace product feed',           price:9.99,  palette:PALETTES.xml, marketplace:'n11',          logo:'n11' } },
  { file: 'nk-xml-gittigidiyor.svg',  fn: makeXMLSVG, args: { slug:'nk-xml-gittigidiyor',  name:'GittiGidiyor XML Feed',           shortDesc:'GittiGidiyor marketplace product feed',  price:9.99,  palette:PALETTES.xml, marketplace:'gittigidiyor', logo:'GittiGidiyor' } },
  { file: 'nk-xml-ciceksepeti.svg',   fn: makeXMLSVG, args: { slug:'nk-xml-ciceksepeti',   name:'ÇiçekSepeti XML Feed',            shortDesc:'ÇiçekSepeti marketplace product feed',   price:9.99,  palette:PALETTES.xml, marketplace:'ciceksepeti',  logo:'ÇiçekSepeti' } },
  { file: 'nk-xml-pttavm.svg',        fn: makeXMLSVG, args: { slug:'nk-xml-pttavm',        name:'PTT AVM XML Feed',                shortDesc:'PTT AVM marketplace product feed',       price:9.99,  palette:PALETTES.xml, marketplace:'pttavm',       logo:'PTT AVM' } },
  { file: 'nk-xml-amazon-tr.svg',     fn: makeXMLSVG, args: { slug:'nk-xml-amazon-tr',     name:'Amazon Turkey XML Feed',          shortDesc:'Amazon.com.tr seller product feed',      price:9.99,  palette:PALETTES.xml, marketplace:'amazon',       logo:'Amazon TR' } },
  { file: 'nk-xml-idefix.svg',        fn: makeXMLSVG, args: { slug:'nk-xml-idefix',        name:'İdefix XML Feed',                 shortDesc:'İdefix marketplace product feed',        price:9.99,  palette:PALETTES.xml, marketplace:'idefix',       logo:'İdefix' } },
];

// ─── Generate ──────────────────────────────────────────────────────────────────
let generated = 0;
for (const { file, fn, args } of products) {
  const svg = fn(args);
  const outPath = path.join(OUT_DIR, file);
  fs.writeFileSync(outPath, svg, 'utf8');
  console.log(`✓ ${file}`);
  generated++;
}

console.log(`\n✅ Generated ${generated} product images → public/images/products/`);
