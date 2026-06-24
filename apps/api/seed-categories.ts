const BASE_URL = process.env.SEED_API_URL
const ACCESS_TOKEN = process.env.SEED_ACCESS_TOKEN

if (!BASE_URL || !ACCESS_TOKEN) {
  console.error('Missing SEED_API_URL or SEED_ACCESS_TOKEN in environment')
  process.exit(1)
}

const headers = {
  'Content-Type': 'application/json',
  Cookie: `access_token=${ACCESS_TOKEN}`,
}

// Categories

const categories = [
  {
    name: 'Rings',
    slug: 'rings',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
  },
  {
    name: 'Bracelets',
    slug: 'bracelets',
    image:
      'https://images.unsplash.com/photo-1573408301185-9519f94804f3?w=800',
  },
  {
    name: 'Necklaces',
    slug: 'necklaces',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
  },
  {
    name: 'Earrings',
    slug: 'earrings',
    image:
      'https://images.unsplash.com/photo-1608042314453-ae338d682c93?w=800',
  },
]

// Subcategories

const subcategories = [
  // Rings
  {
    name: 'Gold Rings',
    slug: 'gold-rings',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800',
    categorySlug: 'rings',
  },
  {
    name: 'Diamond Rings',
    slug: 'diamond-rings',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    categorySlug: 'rings',
  },
  {
    name: 'Silver Rings',
    slug: 'silver-rings',
    image:
      'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=800',
    categorySlug: 'rings',
  },

  // Bracelets
  {
    name: 'Gold Bracelets',
    slug: 'gold-bracelets',
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    categorySlug: 'bracelets',
  },
  {
    name: 'Charm Bracelets',
    slug: 'charm-bracelets',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    categorySlug: 'bracelets',
  },
  {
    name: 'Silver Bracelets',
    slug: 'silver-bracelets',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800',
    categorySlug: 'bracelets',
  },

  // Necklaces
  {
    name: 'Gold Necklaces',
    slug: 'gold-necklaces',
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    categorySlug: 'necklaces',
  },
  {
    name: 'Pendant Necklaces',
    slug: 'pendant-necklaces',
    image:
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800',
    categorySlug: 'necklaces',
  },
  {
    name: 'Silver Necklaces',
    slug: 'silver-necklaces',
    image:
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=800',
    categorySlug: 'necklaces',
  },

  // Earrings
  {
    name: 'Gold Earrings',
    slug: 'gold-earrings',
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    categorySlug: 'earrings',
  },
  {
    name: 'Hoop Earrings',
    slug: 'hoop-earrings',
    image:
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800',
    categorySlug: 'earrings',
  },
  {
    name: 'Silver Earrings',
    slug: 'silver-earrings',
    image:
      'https://images.unsplash.com/photo-1615655406736-b37892f2a21c?w=800',
    categorySlug: 'earrings',
  },
]

// Seed

async function main() {
  console.log(`\nSeeding ${categories.length} categories...\n`)
  let catsCreated = 0
  let catsFailed = 0

  for (const cat of categories) {
    const res = await fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(cat),
    })

    const data = await res.json()

    if (res.ok) {
      console.log(`✅ Created category: ${cat.name} (${cat.slug})`)
      catsCreated++
    } else {
      console.error(
        `❌ Failed category: ${cat.name} — ${JSON.stringify(data?.message ?? data)}`,
      )
      catsFailed++
    }
  }

  console.log(`\nSeeding ${subcategories.length} subcategories...\n`)
  let subsCreated = 0
  let subsFailed = 0

  for (const sub of subcategories) {
    const { categorySlug, ...body } = sub
    const res = await fetch(
      `${BASE_URL}/categories/${categorySlug}/subcategories`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      },
    )

    const data = await res.json()

    if (res.ok) {
      console.log(`✅ Created subcategory: ${sub.name} (${sub.slug})`)
      subsCreated++
    } else {
      console.error(
        `❌ Failed subcategory: ${sub.name} — ${JSON.stringify(data?.message ?? data)}`,
      )
      subsFailed++
    }
  }

  console.log(`\nDone. ${catsCreated} categories created, ${catsFailed} failed. ${subsCreated} subcategories created, ${subsFailed} failed.`)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})

export {}
