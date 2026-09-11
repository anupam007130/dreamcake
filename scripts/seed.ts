import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get } from 'firebase/database'
import bcrypt from 'bcryptjs'

const firebaseConfig = {
  apiKey: "AIzaSyCPzn82r-tCthlsPNsrl0NpUIUviYI9drQ",
  authDomain: "sweet-cake-2519e.firebaseapp.com",
  databaseURL: "https://sweet-cake-2519e-default-rtdb.firebaseio.com",
  projectId: "sweet-cake-2519e",
  storageBucket: "sweet-cake-2519e.firebasestorage.app",
  messagingSenderId: "272960498568",
  appId: "1:272960498568:web:866dd261b13a33f82d283d",
}

const app = initializeApp(firebaseConfig)
const db = getDatabase(app)

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
}

async function main() {
  console.log('Seeding Firebase database...')

  const adminSnapshot = await get(ref(db, 'admins'))
  const admins = adminSnapshot.val() || {}
  if (Object.keys(admins).length === 0) {
    const adminId = generateId()
    const adminPassword = await bcrypt.hash('admin123', 12)
    await set(ref(db, `admins/${adminId}`), {
      id: adminId, fullName: 'Super Admin', email: 'admin@sweetcake.com',
      password: adminPassword, role: 'SUPER_ADMIN', isActive: true, createdAt: new Date().toISOString(),
    })
    console.log('Admin created: admin@sweetcake.com / admin123')
  }

  const catSnapshot = await get(ref(db, 'categories'))
  const cats = catSnapshot.val() || {}
  if (Object.keys(cats).length === 0) {
    const categories = [
      { name: 'Birthday Cake', slug: 'birthday-cake', sortOrder: 1 },
      { name: 'Chocolate Cake', slug: 'chocolate-cake', sortOrder: 2 },
      { name: 'Black Forest', slug: 'black-forest', sortOrder: 3 },
      { name: 'Red Velvet', slug: 'red-velvet', sortOrder: 4 },
      { name: 'Wedding Cake', slug: 'wedding-cake', sortOrder: 5 },
      { name: 'Anniversary Cake', slug: 'anniversary-cake', sortOrder: 6 },
      { name: 'Custom Cake', slug: 'custom-cake', sortOrder: 7 },
      { name: 'Kids Cake', slug: 'kids-cake', sortOrder: 8 },
    ]
    for (const cat of categories) {
      const id = generateId()
      await set(ref(db, `categories/${id}`), { id, ...cat, isActive: true, createdAt: new Date().toISOString() })
    }
    console.log('Categories created')
  }

  const prodSnapshot = await get(ref(db, 'products'))
  const prods = prodSnapshot.val() || {}
  if (Object.keys(prods).length === 0) {
    const catsSnap = await get(ref(db, 'categories'))
    const allCats = catsSnap.val() || {}
    const catMap: Record<string, string> = {}
    Object.values(allCats).forEach((c: any) => { catMap[c.slug] = c.id })

    const products = [
      { title: 'Classic Chocolate Truffle', slug: 'classic-chocolate-truffle', description: 'Rich and decadent chocolate truffle cake made with premium cocoa and dark chocolate ganache.', price: 799, primaryImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500', categorySlug: 'chocolate-cake' },
      { title: 'Black Forest Delight', slug: 'black-forest-delight', description: 'Traditional black forest cake with layers of chocolate sponge, whipped cream, and fresh cherries.', price: 699, primaryImage: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500', categorySlug: 'black-forest' },
      { title: 'Red Velvet Royale', slug: 'red-velvet-royale', description: 'Stunning red velvet cake with cream cheese frosting.', price: 899, primaryImage: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=500', categorySlug: 'red-velvet' },
      { title: 'Birthday Special Cake', slug: 'birthday-special-cake', description: 'Colorful and festive birthday cake with sprinkles.', price: 599, primaryImage: 'https://images.unsplash.com/photo-1562436051-75bfb09bfd38?w=500', categorySlug: 'birthday-cake' },
      { title: 'Premium Wedding Cake', slug: 'premium-wedding-cake', description: 'Elegant multi-tier wedding cake with intricate fondant work.', price: 2999, primaryImage: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=500', categorySlug: 'wedding-cake' },
      { title: 'Kids Animal Cake', slug: 'kids-animal-cake', description: 'Fun and colorful animal-themed cake that kids love!', price: 649, primaryImage: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500', categorySlug: 'kids-cake' },
      { title: 'Anniversary Heart Cake', slug: 'anniversary-heart-cake', description: 'Beautiful heart-shaped cake perfect for celebrating your love.', price: 849, primaryImage: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500', categorySlug: 'anniversary-cake' },
      { title: 'Custom Photo Cake', slug: 'custom-photo-cake', description: 'Upload your favorite photo and we create a delicious edible print cake.', price: 999, primaryImage: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=500', categorySlug: 'custom-cake' },
    ]
    for (const prod of products) {
      const id = generateId()
      await set(ref(db, `products/${id}`), {
        id, title: prod.title, slug: prod.slug, description: prod.description,
        price: prod.price, primaryImage: prod.primaryImage, categoryId: catMap[prod.categorySlug],
        status: 'ACTIVE', availability: true, images: [], createdAt: new Date().toISOString(),
      })
    }
    console.log('Products created')
  }

  const settingsSnapshot = await get(ref(db, 'settings'))
  const settings = settingsSnapshot.val() || {}
  if (Object.keys(settings).length === 0) {
    await set(ref(db, 'settings'), {
      brand_name: 'Sweet Cake', cod_advance_amount: '100', urgent_threshold_days: '2',
      urgent_charge: '100', urgent_charge_enabled: 'true', delivery_charge: '0',
      minimum_delivery_days: '1', free_delivery_threshold: '500', payment_environment: 'TEST',
      contact_number: '+91 98765 43210', contact_email: 'hello@sweetcake.com',
      address: '123 Bakery Street, Sweet Town, India',
    })
    console.log('Settings created')
  }

  const bannerSnapshot = await get(ref(db, 'banners'))
  const banners = bannerSnapshot.val() || {}
  if (Object.keys(banners).length === 0) {
    const id = generateId()
    await set(ref(db, `banners/${id}`), {
      id, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200',
      heading: 'Freshly Baked Happiness', subtitle: 'Premium cakes delivered to your doorstep',
      buttonText: 'Order Now', buttonLink: '/cakes', sortOrder: 1, isActive: true, createdAt: new Date().toISOString(),
    })
    console.log('Banners created')
  }

  console.log('Seed completed!')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
