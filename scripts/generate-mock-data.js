
const fs = require('fs');
const path = require('path');

const categories = [
  { id: 'themes', name: 'Themes', slug: 'themes', description: 'OpenCart themes with modern designs.' },
  { id: 'modules', name: 'Modules', slug: 'modules', description: 'Extend OpenCart functionality.' },
  { id: 'xml-integrations', name: 'XML Integrations', slug: 'xml-integrations', description: 'Product feeds and stock synchronization.' },
  { id: 'payment', name: 'Payment Modules', slug: 'payment', description: 'Gateways like Stripe, PayPal, and more.' },
  { id: 'marketing', name: 'Marketing Tools', slug: 'marketing', description: 'SEO, newsletters, and promo tools.' }
];

const developers = [
  { id: 'dev-1', name: 'Stitch Themes', avatar: 'https://i.pravatar.cc/150?u=dev-1', rating: 4.9, reviews: 340, products: 12, joined: '2023-01-15', description: 'Premium OpenCart themes for modern stores.' },
  { id: 'dev-2', name: 'Opentify Solutions', avatar: 'https://i.pravatar.cc/150?u=dev-2', rating: 4.7, reviews: 120, products: 5, joined: '2022-11-20', description: 'We build the best marketing tools.' },
  { id: 'dev-3', name: 'Codex Masters', avatar: 'https://i.pravatar.cc/150?u=dev-3', rating: 4.8, reviews: 290, products: 8, joined: '2021-05-10', description: 'Payment and shipping integrations.' },
  { id: 'dev-4', name: 'Nova Modules', avatar: 'https://i.pravatar.cc/150?u=dev-4', rating: 4.5, reviews: 85, products: 15, joined: '2023-08-05', description: 'Affordable utility modules for every store.' },
  { id: 'dev-5', name: 'XML Sync Pro', avatar: 'https://i.pravatar.cc/150?u=dev-5', rating: 4.6, reviews: 150, products: 3, joined: '2020-03-22', description: 'High performance XML dropshipping tools.' },
  { id: 'dev-6', name: 'Design Ninja', avatar: 'https://i.pravatar.cc/150?u=dev-6', rating: 5.0, reviews: 45, products: 2, joined: '2024-01-10', description: 'Handcrafted themes with extreme attention to detail.' }
];

const adjectives = ['Pro', 'Ultra', 'Ultimate', 'Advanced', 'Smart', 'Elite', 'Premium', 'Essential', 'Dynamic', 'SEO'];
const nouns = ['Theme', 'Checkout', 'Filter', 'Slider', 'Menu', 'Blog', 'Export', 'Cache', 'Sync', 'Popup'];

const products = [];
for (let i = 1; i <= 35; i++) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const dev = developers[Math.floor(Math.random() * developers.length)];
  let name = '';
  if (category.id === 'themes') {
    name = `${adjectives[i % adjectives.length]} Store Theme`;
  } else {
    name = `${adjectives[i % adjectives.length]} OpenCart ${nouns[i % nouns.length]}`;
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + i;

  products.push({
    id: `prod-${i}`,
    slug,
    name,
    shortDescription: `A highly rated ${category.name.toLowerCase()} that boosts conversion and looks amazing on all devices.`,
    description: `Full description for ${name}. This product provides outstanding value for any OpenCart owner looking to improve their store. Includes free support and lifetime updates. Features: - Easy install - Fast performance - Clean code.`,
    price: Math.floor(Math.random() * 80) + 19,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5 to 5.0
    installs: Math.floor(Math.random() * 5000) + 10,
    categoryId: category.id,
    developerId: dev.id,
    compatibility: Math.random() > 0.5 ? ['3.0.3.8', '4.0.2.3'] : ['4.0.2.3'],
    images: [
      `https://picsum.photos/seed/${slug}1/800/600`,
      `https://picsum.photos/seed/${slug}2/800/600`,
      `https://picsum.photos/seed/${slug}3/800/600`
    ],
    features: ['Responsive Design', 'One-click Install', 'SEO Optimized'],
    tags: [category.slug, 'premium', 'fast'],
    createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedAt: new Date().toISOString()
  });
}

const reviews = [
  ...products.map((p, i) => ({
    id: `rev-${i}a`,
    productId: p.id,
    rating: 5,
    author: 'John Doe',
    date: '2024-02-15',
    content: 'Perfect module, does exactly what it says. Support was helpful.'
  })),
  ...products.map((p, i) => ({
    id: `rev-${i}b`,
    productId: p.id,
    rating: 4,
    author: 'Jane Smith',
    date: '2024-01-10',
    content: 'Good features but could use a bit more documentation.'
  }))
];

const writeJson = (filename, data) => {
  fs.writeFileSync(path.join(__dirname, '../src/data', filename), JSON.stringify(data, null, 2));
};

writeJson('categories.json', categories);
writeJson('developers.json', developers);
writeJson('products.json', products);
writeJson('reviews.json', reviews);
writeJson('orders.json', []);
writeJson('licenses.json', []);

console.log('Mock JSON data generated in src/data/');
