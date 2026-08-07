const fs = require('fs');
const html = fs.readFileSync('client/index.html', 'utf8');

// 1. JSON-LD checks
const scriptMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error("FAIL: JSON-LD script not found");
  process.exit(1);
}

const parsed = JSON.parse(scriptMatch[1]);
const graph = parsed['@graph'];

const restaurant = graph.find(item => item['@type'] === 'Restaurant');
if (!restaurant) {
  console.error("FAIL: Restaurant schema missing");
  process.exit(1);
}

console.log("Restaurant name:", restaurant.name);
console.log("Restaurant address:", restaurant.address);
console.log("Restaurant phone:", restaurant.telephone);
console.log("Restaurant email:", restaurant.email);
console.log("Restaurant priceRange:", restaurant.priceRange);
console.log("Restaurant sameAs:", restaurant.sameAs);

const products = graph.filter(item => Array.isArray(item['@type']) && item['@type'].includes('Product'));
console.log("Products count:", products.length);

products.forEach(p => {
  console.log(`Product [${p.name}]: price = $${p.offers.price} ${p.offers.priceCurrency}, unit = ${p.offers.eligibleQuantity.value}${p.offers.eligibleQuantity.unitText}`);
  console.log(`  description: ${p.description}`);
});

// 2. OpenGraph checks
const ogTags = [
  'og:type', 'og:url', 'og:title', 'og:description', 'og:image', 'og:locale', 'og:site_name'
];
ogTags.forEach(tag => {
  const match = html.match(new RegExp(`<meta property="${tag}" content="(.*?)"`));
  if (match) {
    console.log(`PASS ${tag}: ${match[1]}`);
  } else {
    console.error(`FAIL missing ${tag}`);
  }
});

// 3. Twitter Card checks
const twitterTags = ['twitter:card', 'twitter:url', 'twitter:title', 'twitter:description', 'twitter:image'];
twitterTags.forEach(tag => {
  const match = html.match(new RegExp(`<meta name="${tag}" content="(.*?)"`));
  if (match) {
    console.log(`PASS ${tag}: ${match[1]}`);
  } else {
    console.error(`FAIL missing ${tag}`);
  }
});

// 4. Canonical & Viewport
const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/);
console.log("Canonical:", canonicalMatch ? canonicalMatch[1] : "MISSING");

const viewportMatch = html.match(/<meta\s+name="viewport"\s+content="(.*?)"/);
console.log("Viewport:", viewportMatch ? viewportMatch[1] : "MISSING");
