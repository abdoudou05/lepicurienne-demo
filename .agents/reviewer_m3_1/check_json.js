const fs = require('fs');
const html = fs.readFileSync('client/index.html', 'utf8');
const scriptMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error("JSON-LD script not found");
  process.exit(1);
}
try {
  const parsed = JSON.parse(scriptMatch[1]);
  console.log("JSON-LD parse SUCCESS!");
  console.log("@graph length:", parsed['@graph'].length);
  parsed['@graph'].forEach((item, idx) => {
    console.log(`Item ${idx+1}: @type =`, item['@type'], '| name =', item.name);
  });
} catch (err) {
  console.error("JSON-LD parse ERROR:", err);
  process.exit(1);
}
