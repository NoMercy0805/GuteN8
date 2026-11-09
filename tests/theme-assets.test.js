// Run with: node tests/theme-assets.test.js
// Smoke checks for the UI art and the single final visual theme.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const root='app/src/main/assets/';
const html=fs.readFileSync(root+'index.html','utf8');
const css=fs.readFileSync(root+'storybook-theme.css','utf8');
assert.match(html,/<link rel="stylesheet" href="storybook-theme\.css">/,'Finishing theme must load after inline styles');
assert(html.indexOf('</style>')<html.indexOf('href="storybook-theme.css"'),'Theme must override old inline CSS');
for(const element of ['home','library','reader','bookmarks','favorites','settings']){
 assert(html.includes('id="'+element+'"'),'Missing screen '+element);
}
for(const art of ['bedtime-friends.svg','sleeping-friends.svg','parchment.svg','storybook-night.svg']){
 assert(fs.statSync(root+'art/'+art).size>400,'Missing illustration '+art);
}
for(const section of ['#home','#library','#reader','#favorites','#bookmarks','#settings','.nav']){
 assert(css.includes(section),'Theme missing '+section);
}
assert(!html.includes('id="readerSpeak"'),'Narration button must stay removed');
assert(!html.includes('id="settingsSpeak"'),'Narration settings must stay removed');
assert(html.includes('class="hero-scene"'),'Hero must be a single illustrated scene');
assert((html.match(/class="collection-shell"/g)||[]).length===2,'Favorites and bookmarks must use unified illustration cards');
assert(html.includes('class="sleep-scene-img"'),'Bedtime uses one image without duplicated moon decoration');
assert(!html.includes('class="sleep-stars"'),'No extra moon or stars outside the bedtime illustration');
assert(css.includes('#favorites .collection-shell')&&css.includes('#bookmarks .collection-shell'),'Collection layout must be shared');
assert(css.includes('#home .hero-scene .art img'),'Illustration must integrate into hero rather than a tiled image');

assert(!css.includes("url('art/wooden-button.svg')"),'Avoid overlaid duplicate wood plaques');
for(const art of ['bedtime-friends.svg','sleeping-friends.svg']){
 const svg=fs.readFileSync(root+'art/'+art,'utf8');
 assert(svg.startsWith('<svg ')&&svg.endsWith('</svg>'),'Malformed scene boundary '+art);
 assert(svg.includes('<defs>')&&svg.includes('</defs>'),'Scene gradients missing '+art);
}
console.log('GuteN8 scene/theme asset checks passed');
