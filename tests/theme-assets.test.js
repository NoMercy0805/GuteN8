// Run with: node tests/theme-assets.test.js
// Smoke checks for the UI art and the single final visual theme.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const root='app/src/main/assets/';
const html=fs.readFileSync(root+'index.html','utf8');
const css=fs.readFileSync(root+'storybook-theme.css','utf8');
assert.match(html,/<link rel="stylesheet" href="storybook-theme\.css">/,'Finishing theme must load after inline styles');
assert(html.indexOf('</style>')<html.indexOf('href="storybook-theme.css"'),'Theme must override old inline CSS');
for(const element of ['home','library','reader','favorites','settings']){
 assert(html.includes('id="'+element+'"'),'Missing screen '+element);
}
for(const art of ['bedtime-friends.svg','sleeping-friends.svg','parchment.svg','storybook-night.svg','enchanted-forest.svg']){
 assert(fs.statSync(root+'art/'+art).size>400,'Missing illustration '+art);
}
for(const section of ['#home','#library','#reader','#favorites','#settings','.nav']){
 assert(css.includes(section),'Theme missing '+section);
}
assert(!html.includes('id="bookmarks"'),'Lesezeichen screen removed');
assert(!html.includes('id="readerBookmark"'),'Reader bookmark button removed');
assert(!html.includes('id="bookmarkCards"'),'Lesezeichen cards removed');
assert(!html.includes('function renderBookmarks()'),'Lesezeichen render logic removed');
assert(!html.includes('function bookmark()'),'Lesezeichen action removed');
assert(!html.includes("bookmarks=get('bookmarks'"),'Lesezeichen persistence removed');
assert(!html.includes('id="readerSpeak"'),'Narration button must stay removed');
assert(!html.includes('id="settingsSpeak"'),'Narration settings must stay removed');
assert(!html.includes('class="home-night home-action"'),'Night-mode home toggle must not exist');
assert(!html.includes('id="sleepAction"'),'After-story actions removed');
assert(!html.includes('id="updateInstall"')&&!html.includes('function checkUpdate()'),'Updates are handled by MyAppHub');
assert(!html.includes('window.onUpdateResult'),'Remove update callback');
assert(html.includes('id="fontSlider"')&&html.includes('id="brightness"'),'Reading controls must be retained');
assert(html.includes('id="version"'),'App version remains available');

assert(html.includes('class="hero-scene"'),'Hero must be a single illustrated scene');
assert((html.match(/class="collection-shell"/g)||[]).length===1,'Favorites retain their unified illustration card');
assert(!html.includes('class="sleep-scene-img"'),'Settings hero image must be removed on request');
assert((html.match(/class="nav-icon"/g)||[]).length===3,'Footer uses exactly three navigation tabs');
const nav=html.slice(html.indexOf('<nav class="nav"'),html.indexOf('</nav>'));
assert(nav.includes('aria-label="Bibliothek" onclick="show(\'home\')"'),'Bibliothek tab must open the illustrated landing screen');

assert(html.includes('class="primary" onclick="show(\'library\')"'),'Discover stories button must still open all stories');
assert(html.includes("if(active.id==='reader'){show(readerReturnList);return true}show('home');return true"),'Back gesture must restore the reader origin list');
assert(html.includes("storyListScroll[from]=Math.max(0,window.scrollY||0)"),'Leaving a story list must save scroll position');
assert(html.includes("const restoreList=(from==='reader'&&(id==='library'||id==='favorites'))"),'Returning from reading must restore list scroll');
assert(html.includes("window.scrollTo(0,Math.min(target,Math.max(0,document.documentElement.scrollHeight-innerHeight)))"),'Restored list scroll must remain within available range');
assert(html.includes("const selected=b.getAttribute('onclick')===\"show('\"+(id==='library'?'home':id)+\"')\""),'Library list and landing page must share active footer selection');

assert(!nav.includes('Lesezeichen'),'Bookmark tab must not exist');
assert(nav.includes('aria-label="Favoriten" onclick="show(\'favorites\')"'),'Favorites tab must open favorites');
assert(nav.includes('aria-label="Einstellungen" onclick="show(\'settings\')"'),'Settings tab must open settings');
assert(css.includes("url('art/enchanted-forest.svg')"),'Screens must share the illustrated forest');
assert(!html.includes('class="sleep-stars"'),'No extra moon or stars outside the bedtime illustration');
assert(css.includes('#favorites .collection-shell'),'Favorites card styling must remain');
assert(html.includes('src="art/reference-home.svg"'),'Home must render the complete high-resolution original cover without internal SVG masks');
const homeSvg=fs.readFileSync(root+'art/reference-home.svg','utf8');
const encoded=(homeSvg.match(/data:image\/webp;base64,([^"]+)/)||[])[1];
assert(encoded&&encoded.length>35000,'Home reference image must be high-resolution, not the blurry 176px variant');
const decoded=Buffer.from(encoded,'base64');
assert.equal(decoded.toString('ascii',0,4),'RIFF','Embedded asset must be RIFF WebP');
assert.equal(decoded.toString('ascii',8,12),'WEBP','Embedded asset must be WebP');
assert(homeSvg.includes('viewBox="0 0 384 663"'),'Preserve homepage layout and artwork placement');
const hq=fs.readFileSync(root+'art/reference-home-hq.webp');
assert.equal(hq.toString('ascii',0,4),'RIFF','Higher-resolution cover must be WebP');
assert.equal(hq.toString('ascii',8,12),'WEBP','Higher-resolution cover must have valid header');
assert(decoded.equals(hq),'Displayed embedded cover must be the exact uploaded high-resolution original');
assert(hq.length>150000,'Use genuine high-resolution image rather than low-res preview');
assert(html.indexOf('href="home-focus.css"')>html.indexOf('href="storybook-theme.css"'),'Focused homepage styles must load last');
const homeCss=fs.readFileSync(root+'home-focus.css','utf8');
assert(homeCss.includes('transform:none!important'),'Bottom nav must override historic -50% shift');
assert(homeCss.includes('grid-template-columns:repeat(3,minmax(0,1fr))'),'Footer must have three equal columns');
assert(homeCss.includes('.hero-scene .hero-reference'),'Homepage must size original illustration responsively');
assert(homeCss.includes("background:url('art/reference-home.svg') center center/cover no-repeat"),'Blurred sides must reuse the same original artwork');
assert(homeCss.includes('filter:blur(13px)'),'Keep soft blur confined to the narrow background sides');
assert(homeCss.includes('width:86%!important;max-width:86%!important'),'Sharp illustration must leave controlled side margins');
assert(homeCss.includes('object-fit:contain!important'),'Never crop the home title lettering');
assert(homeCss.includes('height:100dvh!important')&&homeCss.includes('flex:1 1 0!important'),'Home must fill a fixed viewport and flex its artwork to available room');
assert(homeCss.includes('object-fit:cover!important'),'Full-width art must preserve character proportions');
assert(!homeCss.includes('object-fit:fill!important'),'Never stretch illustrations to fit the viewport');
assert(homeCss.includes('.hero-scene::after'),'Hero-to-forest edge should have a soft finishing transition');
assert(homeCss.includes('background:#fff9ed!important'),'Footer background should stay warm ivory');
assert(homeCss.includes('width:100%!important;max-width:none!important'),'Hero must extend to phone edges');
assert(html.includes('class="home-cta-text"'),'Discovery CTA must have reference two-line title');
assert(html.includes('class="recent-heading"'),'Recent-story card needs open-book heading');
assert(html.includes('<body class="home-screen-active">'),'Startup must lock home scrolling');
assert(html.includes("document.body.classList.toggle('home-screen-active',id==='home')"),'Scrolling must unlock on other screens');
assert(homeCss.includes('body.home-screen-active')&&homeCss.includes('overflow:hidden!important'),'Home must not scroll');
assert(homeCss.includes('--g8-footer-height:66px'),'Bottom tab bar must be compact');
assert(homeCss.includes('height:var(--g8-footer-height)!important'),'Footer must use single defined height');

assert(homeCss.includes('background:#fff9ed!important'),'Navigation must use ivory reference palette');

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

const libraryCss=fs.readFileSync(root+'library-focus.css','utf8');
assert(html.includes('href="library-focus.css"'),'Bright woodland library styles must be loaded');
assert(html.indexOf('href="library-focus.css"')>html.indexOf('href="home-focus.css"'),'Library theme must load after home theme');
for(const screen of ['#library','#favorites','#settings']){
  assert(libraryCss.includes(screen),'Shared blue woodland theme missing '+screen);
}
assert(libraryCss.includes("url('art/library-day-forest.svg')"),'Shared daytime forest SVG must be used');
assert(fs.existsSync(root+'art/library-day-forest.svg'),'Daytime forest background file must exist');
assert(html.includes('class="library-title-icon"'),'Library must have book title icon');
assert(/class="[^"]*\blibrary-search-trigger\b[^"]*"/.test(html),'Library must have round search trigger');
assert(html.includes('id="librarySearchOptions"'),'Advanced library filters must remain accessible');
assert(html.includes('function toggleLibrarySearch(force)'),'Library search drawer must open and close');
assert(libraryCss.includes('grid-template-columns:repeat(2,minmax(0,1fr))'),'Library needs two cover columns on phones');
assert(libraryCss.includes('#library .cards .card-heart'),'Library favorite hearts must remain available');

for(const type of ['heart']){
 assert(html.includes('class="section-title-icon section-title-icon-'+type+'"'),'Missing unified title icon '+type);
}
assert(libraryCss.includes('#favorites:not(.has-stories) .collection-characters'),'Favorites must use illustrated scene');






const polish=fs.readFileSync(root+'ui-polish.css','utf8');
assert(html.includes('href="ui-polish.css"'),'Polished collection and settings styles must be loaded');
assert(html.indexOf('href="ui-polish.css"')>html.indexOf('href="reader-focus.css"'),'Polish styles must load last');
assert(polish.includes('#settings .sleep-art,#settings .sleep-subtitle{display:none!important}'),'Settings hero must be hidden');
assert(polish.includes('#favorites:not(.has-stories) .collection-characters'),'Favorites duplicate poster must be hidden');

assert(!html.includes('id="nightToggle"'),'Night mode switch must be removed');
assert(!html.includes('function toggleNight('),'Night mode behavior must be removed');
assert(html.includes('class="favorite-heart-icon"'),'Story heart must use a consistent SVG icon');
assert(polish.includes('.card-heart.is-favorite .favorite-heart-icon'),'Saved hearts should be filled');

assert(html.includes("let cats=['Alle','Gelesen','Ungelesen'];"),'Library must expose only the three requested read-state filters');
assert(!html.includes('id="unreadOnly"')&&html.includes('id="librarySort"'),'Remove duplicate unread checkbox while preserving sorting');
assert(html.includes("(category==='Gelesen'&&completed.includes(s.id))")&&html.includes("(category==='Ungelesen'&&!completed.includes(s.id))"),'Read/unread chips must use explicit completion state');
assert(html.includes('id="readerFloatingProgress"')&&html.includes('id="readerFloatingProgressFill"'),'Reader must show a persistent minimal progress indicator');
assert(html.includes("readerFloatingProgressFill').style.width=pct+'%'"),'Floating progress must update during scroll');

assert(css.includes("url('art/enchanted-forest.svg')"),'Forest background must remain integrated');
console.log('GuteN8 scene/theme asset checks passed');


// Read badges reflect explicit 'Als gelesen markieren', not merely opening a story.
assert(html.includes("completed.includes(s.id)?'<span class=\"read-badge\""),'Completed stories must show a visible Gelesen badge');
assert(html.includes("story-wrap '+(completed.includes(s.id)?'is-read':'')"),'Completed cards must have a distinct read-state class');
const readBadgeCss=fs.readFileSync(root+'library-focus.css','utf8');
assert(readBadgeCss.includes('.story-wrap .read-badge'),'Read badges must be styled for the library and favorites');
assert(readBadgeCss.includes('background:#196b3f!important'),'Read badge must be visibly colored');
