// Run with: node tests/reader-pagination.test.js
// Regression tests for the same pagination algorithm used in app/src/main/assets/index.html.
const fs=require('node:fs');
const assert=require('node:assert/strict');
const source=fs.readFileSync('app/src/main/assets/index.html','utf8');
const start=source.indexOf('function chunks(s){');
const end=source.indexOf('\nlet touchStart=null;',start);
assert(start>=0&&end>start,'Pagination implementation not found');
const storyPageCache=new Map();
const chunks=new Function('storyPageCache',source.slice(start,end)+';return chunks;')(storyPageCache);
const normalize=s=>s.replace(/\s+/g,' ').trim();
const samples=[
 {id:'short',text:'Bobby lacht.\n\nHoppel träumt und Krümel schläft.'},
 {id:'long',text:('Bobby erzählt eine Geschichte. Hoppel hört zu! Krümel lächelt? ').repeat(120)},
 {id:'unbroken',text:('Ein sehr langer Satz ohne abschließendes Satzzeichen ').repeat(100)},
 {id:'unicode',text:('Mondschein ✨ und süße Träume 🌙. ').repeat(100)},
 {id:'empty',text:''}
];
for(const sample of samples){
 const pages=chunks(sample);
 assert(pages.length>=1,'At least one page');
 assert(pages.every(p=>p.length<=1150),'Page must not exceed target size');
 assert.equal(normalize(pages.join(' ')),normalize(sample.text),'No story text may be lost');
 assert.deepEqual(chunks(sample),pages,'Repeated reads must be stable');
}
assert(source.includes("'readerText').textContent=arr[page]"),'Reader must render only selected page');
assert(source.includes("page!==arr.length-1"),'Completion button must appear only on last page');
console.log('GuteN8 reader pagination checks passed ('+samples.length+' samples)');
