// seed-products.js
// Run with: node seed-products.js

const BASE_URL = 'https://theokallia.onrender.com/v1'
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbW5lN3AwZzAwMDAyc2N3MW14Z2Z6Mmd1IiwiZW1haWwiOiJyZXViZW5hZ2JvcjIwQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NDk1NjQ5NSwiZXhwIjoxNzc0OTU3Mzk1fQ.zXxQf1IVHFo-Z8fwVJiE5imk6lPl90urHeH29hxuSQY'

const headers = {
  'Content-Type': 'application/json',
  'Cookie': `access_token=${ACCESS_TOKEN}`,
}

// ─── Products ────────────────────────────────────────────────────────────────
// Uses categorySlug + subcategorySlug (strings) — matches your DTO

const products = [
  // ── RINGS ────────────────────────────────────────────────────────────────
  {
    name: 'Adaeze',
    slug: 'adaeze-gold-ring',
    description:
      'A timeless 18k gold ring adorned with a delicate floral motif. Handcrafted to perfection, the Adaeze ring is a symbol of grace and femininity, ideal for everyday elegance or special occasions.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800',
      'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=800',
    ],
    inStock: true,
    stock: 15,
    categorySlug: 'rings',
    subcategorySlug: 'gold-rings',
  },
  {
    name: 'Zara',
    slug: 'zara-diamond-ring',
    description:
      'A breathtaking diamond solitaire set in lustrous white gold. The Zara ring captures light from every angle, making it the ultimate statement piece for engagements, anniversaries, or simply celebrating yourself.',
    price: 120000,
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800',
      'https://images.unsplash.com/photo-1616499370260-485b3e5ed653?w=800',
    ],
    inStock: true,
    stock: 8,
    categorySlug: 'rings',
    subcategorySlug: 'diamond-rings',
  },
  {
    name: 'Emeka',
    slug: 'emeka-silver-ring',
    description:
      'A sleek, minimalist sterling silver band with a brushed finish. The Emeka ring speaks to understated luxury — clean lines, cool tones, and effortless versatility for the modern woman.',
    price: 18000,
    images: [
      'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800',
      'https://images.unsplash.com/photo-1573408301185-9519f94804f3?w=800',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800',
    ],
    inStock: true,
    stock: 22,
    categorySlug: 'rings',
    subcategorySlug: 'silver-rings',
  },

  // ── BRACELETS ────────────────────────────────────────────────────────────
  {
    name: 'Temi',
    slug: 'temi-gold-bracelet',
    description:
      'A luxurious 18k gold chain bracelet featuring an intricate link pattern inspired by West African textile designs. The Temi bracelet drapes beautifully on the wrist, catching light with every movement.',
    price: 55000,
    images: [
      'https://images.unsplash.com/photo-1573408301185-9519f94804f3?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800',
    ],
    inStock: true,
    stock: 12,
    categorySlug: 'bracelets',
    subcategorySlug: 'gold-bracelets',
  },
  {
    name: 'Chisom',
    slug: 'chisom-charm-bracelet',
    description:
      'A playful yet refined charm bracelet featuring hand-selected gold and enamel charms. Each charm on the Chisom bracelet tells a story — wear your journey on your wrist.',
    price: 38000,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'https://images.unsplash.com/photo-1573408301185-9519f94804f3?w=800',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    ],
    inStock: true,
    stock: 18,
    categorySlug: 'bracelets',
    subcategorySlug: 'charm-bracelets',
  },
  {
    name: 'Nkechi',
    slug: 'nkechi-silver-bracelet',
    description:
      'A delicate sterling silver tennis bracelet set with sparkling cubic zirconia stones. The Nkechi bracelet offers diamond-like brilliance at an accessible price point, perfect as a gift or personal treat.',
    price: 25000,
    images: [
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      'https://images.unsplash.com/photo-1573408301185-9519f94804f3?w=800',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    ],
    inStock: true,
    stock: 20,
    categorySlug: 'bracelets',
    subcategorySlug: 'silver-bracelets',
  },

  // ── NECKLACES ────────────────────────────────────────────────────────────
  {
    name: 'Amara',
    slug: 'amara-gold-necklace',
    description:
      'A stunning 18k gold layered necklace with a dainty adjustable chain. The Amara necklace sits beautifully at the collarbone, adding warmth and radiance to any neckline — day or evening.',
    price: 62000,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
      'https://images.unsplash.com/photo-1573408301185-9519f94804f3?w=800',
    ],
    inStock: true,
    stock: 10,
    categorySlug: 'necklaces',
    subcategorySlug: 'gold-necklaces',
  },
  {
    name: 'Obiageli',
    slug: 'obiageli-pendant-necklace',
    description:
      'A bold teardrop pendant necklace in 18k rose gold, set with a single cushion-cut amethyst. The Obiageli necklace is a conversation starter — a wearable work of art for the woman who commands attention.',
    price: 85000,
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    ],
    inStock: true,
    stock: 7,
    categorySlug: 'necklaces',
    subcategorySlug: 'pendant-necklaces',
  },
  {
    name: 'Sade',
    slug: 'sade-silver-necklace',
    description:
      'A refined herringbone chain necklace in polished sterling silver. The Sade necklace is minimal, architectural, and endlessly elegant — the kind of piece you wear every single day.',
    price: 22000,
    images: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    ],
    inStock: true,
    stock: 25,
    categorySlug: 'necklaces',
    subcategorySlug: 'silver-necklaces',
  },

  // ── EARRINGS ─────────────────────────────────────────────────────────────
  {
    name: 'Ife',
    slug: 'ife-gold-earrings',
    description:
      'Sculptural 18k gold drop earrings inspired by ancient Ife bronze art. Lightweight yet striking, the Ife earrings frame the face beautifully and celebrate the depth of African heritage through fine jewellery.',
    price: 42000,
    images: [
      'https://images.unsplash.com/photo-1608042314453-ae338d682c93?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
      'https://images.unsplash.com/photo-1573408301185-9519f94804f3?w=800',
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    ],
    inStock: true,
    stock: 14,
    categorySlug: 'earrings',
    subcategorySlug: 'gold-earrings',
  },
  {
    name: 'Folake',
    slug: 'folake-hoop-earrings',
    description:
      'Classic oversized hoop earrings in polished 18k gold vermeil. The Folake hoops are the ultimate wardrobe staple — bold enough to stand alone, versatile enough to complement any look.',
    price: 30000,
    images: [
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
      'https://images.unsplash.com/photo-1608042314453-ae338d682c93?w=800',
      'https://images.unsplash.com/photo-1615655406736-b37892f2a21c?w=800',
      'https://images.unsplash.com/photo-1573408301185-9519f94804f3?w=800',
    ],
    inStock: true,
    stock: 30,
    categorySlug: 'earrings',
    subcategorySlug: 'hoop-earrings',
  },
  {
    name: 'Ngozi',
    slug: 'ngozi-silver-earrings',
    description:
      'Geometric sterling silver stud earrings with a hammered texture finish. The Ngozi studs are small in size but rich in character — the perfect everyday earring for a woman with refined taste.',
    price: 15000,
    images: [
      'https://images.unsplash.com/photo-1615655406736-b37892f2a21c?w=800',
      'https://images.unsplash.com/photo-1608042314453-ae338d682c93?w=800',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    ],
    inStock: true,
    stock: 35,
    categorySlug: 'earrings',
    subcategorySlug: 'silver-earrings',
  },
]

// ─── Seed ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nSeeding ${products.length} products...\n`)
  let success = 0
  let failed = 0

  for (const product of products) {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers,
      body: JSON.stringify(product),
    })

    const data = await res.json()

    if (res.ok) {
      console.log(`✅ Created: ${product.name} (${product.slug})`)
      success++
    } else {
      console.error(`❌ Failed:  ${product.name} — ${JSON.stringify(data?.message ?? data)}`)
      failed++
    }
  }

  console.log(`\n─────────────────────────────────`)
  console.log(`Done. ${success} created, ${failed} failed.`)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})