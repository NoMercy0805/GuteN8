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
for(const art of ['bedtime-friends.svg','sleeping-friends.svg','parchment.svg','storybook-night.svg','enchanted-forest.svg']){
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
assert((html.match(/class="nav-icon"/g)||[]).length===4,'Reference layout uses exactly four matching navigation tabs');
assert(css.includes("url('art/enchanted-forest.svg')"),'Screens must share the illustrated forest');
assert(!html.includes('class="sleep-stars"'),'No extra moon or stars outside the bedtime illustration');
assert(css.includes('#favorites .collection-shell')&&css.includes('#bookmarks .collection-shell'),'Collection layout must be shared');
assert(html.includes('src="art/reference-home.svg"'),'Home must render the actual original reference art');
const homeSvg=fs.readFileSync(root+'art/reference-home.svg','utf8');
const encoded=(homeSvg.match(/data:image\/webp;base64,([^"]+)/)||[])[1];
assert(encoded&&encoded.length>35000,'Home reference image must be high-resolution, not the blurry 176px variant');
const decoded=Buffer.from(encoded,'base64');
assert.equal(decoded.toString('ascii',0,4),'RIFF','Embedded asset must be RIFF WebP');
assert.equal(decoded.toString('ascii',8,12),'WEBP','Embedded asset must be WebP');
assert(homeSvg.includes('viewBox="0 0 384 663"'),'Use 384 × 663 reference art rather than thumbnail');
let check=2166136261;for(const ch of encoded)check=Math.imul(check^ch.charCodeAt(0),16777619)>>>0;
assert.equal(check,0xd4bc3e86,'Reference illustration must remain byte-for-byte unchanged');
assert(html.indexOf('href="home-focus.css"')>html.indexOf('href="storybook-theme.css"'),'Focused homepage styles must load last');
const homeCss=fs.readFileSync(root+'home-focus.css','utf8');
assert(homeCss.includes('transform:none!important'),'Bottom nav must override historic -50% shift');
assert(homeCss.includes('grid-template-columns:repeat(4,minmax(0,1fr))'),'Footer must have four equal columns');
assert(homeCss.includes('.hero-scene .hero-reference'),'Homepage must size original illustration responsively');
assert(html.includes('class="home-cta-text"'),'Discovery CTA must have reference two-line title');
assert(html.includes('class="recent-heading"'),'Recent-story card needs open-book heading');
assert(homeCss.includes('background:linear-gradient(180deg,#fffefb,#fff8ed)'),'Navigation must use ivory reference palette');

assert(!css.includes("url('art/wooden-button.svg')"),'Avoid overlaid duplicate wood plaques');
for(const art of ['bedtime-friends.svg','sleeping-friends.svg']){
 const svg=fs.readFileSync(root+'art/'+art,'utf8');
 assert(svg.startsWith('<svg ')&&svg.endsWith('</svg>'),'Malformed scene boundary '+art);
 assert(svg.includes('<defs>')&&svg.includes('</defs>'),'Scene gradients missing '+art);
 assert(!svg.includes('<rect width="420" height="420" fill="url(#sky)"/>'),'Figure art must not cover shared forest with a square backdrop: '+art);
}
assert(css.includes('background-image:linear-gradient(180deg,#5991e4'),'Selected reference uses blue story CTA');
assert(css.includes('mask-image:none!important'),'Illustrations should not be boxed or clipped by radial masks');
assert(html.includes('href="home-focus.css"'),'Focused home and navigation theme must be loaded');
assert(css.includes("url('art/enchanted-forest.svg')"),'Forest background must remain integrated');
console.log('GuteN8 scene/theme asset checks passed');
