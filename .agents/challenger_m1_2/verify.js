import fs from 'fs';

const filePath = 'c:/Users/Hajji/OneDrive - Webryk Studio/Documents/Clients/Demo/L\'Épicurienne By Waycha/lepicurienne-demo/client/src/pages/Home.tsx';
const content = fs.readFileSync(filePath, 'utf8');

const copyStartIndex = content.indexOf('const copy = {');
let braceCount = 0;
let started = false;
let endIndex = -1;

for (let i = copyStartIndex; i < content.length; i++) {
  if (content[i] === '{') {
    braceCount++;
    started = true;
  } else if (content[i] === '}') {
    braceCount--;
    if (started && braceCount === 0) {
      endIndex = i;
      break;
    }
  }
}

const copyObjStr = content.substring(copyStartIndex + 'const copy = '.length, endIndex + 1)
  .replace(/as JuiceItem\[\]/g, '')
  .replace(/as const/g, '');

const copy = eval('(' + copyObjStr + ')');

const reqFields = [
  'id',
  'name',
  'tagline',
  'description',
  'longDescription',
  'tasteProfile',
  'ingredients',
  'healthBenefits',
  'price',
  'formattedPrice',
  'volume',
  'image',
  'color'
];

const expectedIds = ['gingembre', 'bouye-fraise', 'maad', 'diabolo-menthe', 'bouye'];

let passed = true;
const testResults = [];

const log = (msg, ok = true) => {
  const resultStr = (ok ? '[PASS] ' : '[FAIL] ') + msg;
  console.log(resultStr);
  testResults.push(resultStr);
  if (!ok) passed = false;
};

// Test 1: Languages
if (copy.fr && copy.en) {
  log('Both FR and EN copies present');
} else {
  log('Missing FR or EN copy', false);
}

// Test 2: Product Counts
log('FR juices count is 5: ' + (copy.fr.flavors.juices.length === 5), copy.fr.flavors.juices.length === 5);
log('EN juices count is 5: ' + (copy.en.flavors.juices.length === 5), copy.en.flavors.juices.length === 5);

// Test 3: Product IDs
const frIds = copy.fr.flavors.juices.map(j => j.id);
const enIds = copy.en.flavors.juices.map(j => j.id);

log('FR IDs match expected 5: ' + (JSON.stringify(frIds) === JSON.stringify(expectedIds)), JSON.stringify(frIds) === JSON.stringify(expectedIds));
log('EN IDs match expected 5: ' + (JSON.stringify(enIds) === JSON.stringify(expectedIds)), JSON.stringify(enIds) === JSON.stringify(expectedIds));

// Test 4: Field completeness for all products in FR and EN
['fr', 'en'].forEach(lang => {
  copy[lang].flavors.juices.forEach(juice => {
    reqFields.forEach(field => {
      const val = juice[field];
      if (val === undefined || val === null || val === '') {
        log(lang + '.' + juice.id + '.' + field + ' is missing or empty', false);
      } else if (Array.isArray(val)) {
        if (val.length === 0) {
          log(lang + '.' + juice.id + '.' + field + ' is an empty array', false);
        } else if (val.some(item => typeof item !== 'string' || item.trim() === '')) {
          log(lang + '.' + juice.id + '.' + field + ' contains invalid/empty string item', false);
        } else {
          log(lang + '.' + juice.id + '.' + field + ' (' + val.length + ' items)', true);
        }
      } else {
        log(lang + '.' + juice.id + '.' + field + ' ok', true);
      }
    });
  });
});

// Test 5: Check Specific R1 Data requirements
const checkR1 = (lang) => {
  const juices = copy[lang].flavors.juices;
  const g = juices.find(j => j.id === 'gingembre');
  const bf = juices.find(j => j.id === 'bouye-fraise');
  const m = juices.find(j => j.id === 'maad');
  const dm = juices.find(j => j.id === 'diabolo-menthe');
  const b = juices.find(j => j.id === 'bouye');

  log('[' + lang + '] Gingembre price = 12 ($12): ' + (g.price === 12 && g.formattedPrice === '$12'), g.price === 12 && g.formattedPrice === '$12');
  log('[' + lang + '] Bouye Fraise price = 12 ($12): ' + (bf.price === 12 && bf.formattedPrice === '$12'), bf.price === 12 && bf.formattedPrice === '$12');
  log('[' + lang + '] Maad price = 15 ($15): ' + (m.price === 15 && m.formattedPrice === '$15'), m.price === 15 && m.formattedPrice === '$15');
  log('[' + lang + '] Diabolo Menthe price = 12 ($12): ' + (dm.price === 12 && dm.formattedPrice === '$12'), dm.price === 12 && dm.formattedPrice === '$12');
  log('[' + lang + '] Bouye price = 12 ($12): ' + (b.price === 12 && b.formattedPrice === '$12'), b.price === 12 && b.formattedPrice === '$12');

  [g, bf, m, dm, b].forEach(j => {
    log('[' + lang + '] ' + j.id + ' volume = 1L: ' + (j.volume === '1L'), j.volume === '1L');
  });
};

checkR1('fr');
checkR1('en');

// Test 6: Translation Discrepancy & Completeness Check
console.log('\n--- TRANSLATION DISCREPANCY & QUALITY CHECKS ---');
expectedIds.forEach(id => {
  const frJ = copy.fr.flavors.juices.find(j => j.id === id);
  const enJ = copy.en.flavors.juices.find(j => j.id === id);

  ['tagline', 'description', 'longDescription', 'tasteProfile'].forEach(field => {
    const isDifferent = frJ[field] !== enJ[field];
    log('Translation distinction [' + id + '.' + field + ']: FR !== EN -> ' + isDifferent, isDifferent);
  });

  const ingDiff = JSON.stringify(frJ.ingredients) !== JSON.stringify(enJ.ingredients);
  log('Translation distinction [' + id + '.ingredients]: FR !== EN -> ' + ingDiff, ingDiff);

  const benDiff = JSON.stringify(frJ.healthBenefits) !== JSON.stringify(enJ.healthBenefits);
  log('Translation distinction [' + id + '.healthBenefits]: FR !== EN -> ' + benDiff, benDiff);
});

console.log('\nOVERALL TEST RESULT: ' + (passed ? 'ALL PASSED' : 'SOME FAILED'));
process.exit(passed ? 0 : 1);
