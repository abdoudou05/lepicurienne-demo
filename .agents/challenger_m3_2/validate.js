import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '../../');
const htmlPath = path.join(projectRoot, 'client/index.html');
const homeTsxPath = path.join(projectRoot, 'client/src/pages/Home.tsx');

let checksPassed = true;
const log = (msg, pass = true) => {
  if (!pass) checksPassed = false;
  console.log(`${pass ? '✅ [PASS]' : '❌ [FAIL]'} ${msg}`);
};

console.log("=== EMPIRICAL VALIDATION SUITE - CHALLENGER M3-2 ===\n");

// --- TEST 1: JSON-LD Parse & Syntax Validation ---
console.log("--- TEST 1: JSON-LD Syntax Validation ---");
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

const jsonLdRegex = /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
const jsonLdMatches = [...htmlContent.matchAll(jsonLdRegex)];

if (jsonLdMatches.length === 0) {
  log("No JSON-LD script block found in client/index.html", false);
} else {
  log(`Found ${jsonLdMatches.length} JSON-LD script block(s)`);
}

let parsedGraph = [];

jsonLdMatches.forEach((match, idx) => {
  try {
    const rawJson = match[1].trim();
    const parsed = JSON.parse(rawJson);
    log(`JSON-LD block #${idx + 1} parsed successfully as valid JSON`);
    if (parsed['@graph'] && Array.isArray(parsed['@graph'])) {
      parsedGraph = parsedGraph.concat(parsed['@graph']);
    } else {
      parsedGraph.push(parsed);
    }
  } catch (err) {
    log(`Failed to parse JSON-LD block #${idx + 1}: ${err.message}`, false);
  }
});

// --- TEST 2: Product Pricing Verification ---
console.log("\n--- TEST 2: Product Pricing Verification ---");

const expectedProducts = {
  "Gingembre": { price: 12, found: false },
  "Bouye Fraise": { price: 12, found: false },
  "Maad": { price: 15, found: false },
  "Diabolo Menthe": { price: 12, found: false },
  "Bouye (Plain Baobab)": { price: 12, found: false }
};

const productsInJsonLd = parsedGraph.filter(item => {
  const types = Array.isArray(item['@type']) ? item['@type'] : [item['@type']];
  return types.includes('Product') || types.includes('MenuItem');
});

log(`Found ${productsInJsonLd.length} product/menu items in JSON-LD`);

productsInJsonLd.forEach(prod => {
  const name = prod.name;
  const offerPrice = prod.offers ? parseFloat(prod.offers.price) : null;
  
  if (expectedProducts[name]) {
    expectedProducts[name].found = true;
    if (offerPrice === expectedProducts[name].price) {
      log(`JSON-LD Product "${name}": Price is $${offerPrice} (Matches authentic pricing $${expectedProducts[name].price})`);
    } else {
      log(`JSON-LD Product "${name}": Price is $${offerPrice}, expected $${expectedProducts[name].price}`, false);
    }
  } else {
    // Check partial match if name varies slightly
    const matchedKey = Object.keys(expectedProducts).find(k => name.includes(k) || k.includes(name));
    if (matchedKey) {
      expectedProducts[matchedKey].found = true;
      if (offerPrice === expectedProducts[matchedKey].price) {
        log(`JSON-LD Product "${name}" (matches ${matchedKey}): Price is $${offerPrice} (Matches authentic pricing $${expectedProducts[matchedKey].price})`);
      } else {
        log(`JSON-LD Product "${name}": Price is $${offerPrice}, expected $${expectedProducts[matchedKey].price}`, false);
      }
    } else {
      log(`Unexpected product found in JSON-LD: "${name}"`, false);
    }
  }
});

Object.entries(expectedProducts).forEach(([name, info]) => {
  if (!info.found) {
    log(`Expected product "${name}" not found in JSON-LD schema`, false);
  }
});

// Also cross-verify Home.tsx product pricing in code
console.log("\n--- TEST 2b: Cross-verify Home.tsx TSX Product Prices ---");
const homeTsxContent = fs.readFileSync(homeTsxPath, 'utf8');

const expectedHomePrices = [
  { id: 'gingembre', price: 12, formattedPrice: '$12' },
  { id: 'bouye-fraise', price: 12, formattedPrice: '$12' },
  { id: 'maad', price: 15, formattedPrice: '$15' },
  { id: 'diabolo-menthe', price: 12, formattedPrice: '$12' },
  { id: 'bouye', price: 12, formattedPrice: '$12' }
];

expectedHomePrices.forEach(item => {
  const pricePattern = new RegExp(`id:\\s*"${item.id}"[\\s\\S]*?price:\\s*${item.price}`, 'g');
  const formattedPattern = new RegExp(`id:\\s*"${item.id}"[\\s\\S]*?formattedPrice:\\s*"\\$${item.price}"`, 'g');
  
  if (pricePattern.test(homeTsxContent)) {
    log(`Home.tsx product "${item.id}": price is numeric ${item.price}`);
  } else {
    log(`Home.tsx product "${item.id}": failed to find numeric price ${item.price}`, false);
  }

  if (formattedPattern.test(homeTsxContent)) {
    log(`Home.tsx product "${item.id}": formattedPrice is "$${item.price}"`);
  } else {
    log(`Home.tsx product "${item.id}": failed to find formattedPrice "$${item.price}"`, false);
  }
});

// --- TEST 3: OpenGraph and Twitter Card Property Names ---
console.log("\n--- TEST 3: OpenGraph & Twitter Card Property Verification ---");

const requiredMetaTags = [
  { type: 'property', name: 'og:title' },
  { type: 'property', name: 'og:description' },
  { type: 'property', name: 'og:image' },
  { type: 'property', name: 'og:url' },
  { type: 'name', name: 'twitter:card' },
  { type: 'name', name: 'twitter:title' },
  { type: 'name', name: 'twitter:description' },
  { type: 'name', name: 'twitter:image' }
];

requiredMetaTags.forEach(tag => {
  // Check both property="..." and name="..." just in case
  const regexPrimary = new RegExp(`<meta\\s+${tag.type}="${tag.name}"\\s+content="([^"]+)"`, 'i');
  const regexAltType = tag.type === 'property' ? 'name' : 'property';
  const regexAlt = new RegExp(`<meta\\s+${regexAltType}="${tag.name}"\\s+content="([^"]+)"`, 'i');

  const matchPrimary = htmlContent.match(regexPrimary);
  const matchAlt = htmlContent.match(regexAlt);

  if (matchPrimary) {
    log(`Standard meta tag found: ${tag.type}="${tag.name}" content="${matchPrimary[1]}"`);
  } else if (matchAlt) {
    log(`Meta tag found with alternate attribute: ${regexAltType}="${tag.name}" content="${matchAlt[1]}"`);
  } else {
    log(`Missing required meta tag: ${tag.name}`, false);
  }
});

console.log("\n==================================================");
if (checksPassed) {
  console.log("FINAL RESULT: ALL EMPIRICAL CHECKS PASSED ✅");
  process.exit(0);
} else {
  console.log("FINAL RESULT: EMPIRICAL CHECKS FAILED ❌");
  process.exit(1);
}
