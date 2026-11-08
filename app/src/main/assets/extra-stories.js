/* GuteN8 Zusatzbibliothek: 1.000 kombinierte, deterministische Abenteuer.
   Themenillustrationen werden lokal erzeugt; keine Netzwerkverbindung nötig. */
(function(){
const places=[
['im Frühlingsgarten','Frühling','🌷','#8ccf91','zwischen blühenden Tulpen'],
['auf der Sommerwiese','Sommer','☀️','#f5cb6a','im warmen Sonnenschein'],
['am Herbstsee','Herbst','🍁','#dc9759','zwischen bunten Blättern'],
['im verschneiten Wald','Winter','❄️','#8fbde0','unter glitzernden Schneeflocken'],
['in der Halloween-Nacht','Halloween','🎃','#b56dce','zwischen leuchtenden Kürbissen'],
['auf dem Weihnachtsmarkt','Weihnachten','🎄','#76b39e','bei funkelnden Weihnachtslichtern'],
['an einem Adventssonntag','Advent','🕯️','#d7a5a3','im Schein der Adventskerzen'],
['beim Osterfest','Ostern','🐣','#a7d5a3','zwischen bunt bemalten Ostereiern'],
['in der Silvesternacht','Silvester','🎆','#748ed4','unter glitzernden Sternen'],
['beim Geburtstagsfest','Geburtstag','🎂','#d9a1ce','zwischen bunten Girlanden']
];
const quests=[
['die verschwundene Glocke','eine silberne Glocke','die Glocke unter einem Farnblatt','🔔'],
['der geheimnisvolle Schlüssel','einen goldenen Schlüssel','eine kleine Holztür im Baum','🗝️'],
['das verlorene Sternenlicht','einen funkelnden Stern','einen dunklen Weg durch den Wald','⭐'],
['das kleine Papierboot','ein buntes Papierboot','einen Bach mit sanften Wellen','⛵'],
['der fliegende Drachen','einen roten Drachen','eine windige Lichtung','🪁'],
['die geheimnisvolle Schatzkarte','eine alte Schatzkarte','einen Hügel mit drei Steinen','🗺️'],
['das mutige Eichhörnchen','ein schüchternes Eichhörnchen','ein gemütliches Baumhaus','🐿️'],
['der verzauberte Regenschirm','einen gestreiften Regenschirm','eine Wolke in Herzform','☂️'],
['die tanzenden Glühwürmchen','ein winziges Glühwürmchen','eine Wiese voller Lichter','✨'],
['der duftende Kuchen','einen frisch gebackenen Kuchen','eine kleine Waldküche','🍰'],
['die verschwundene Mütze','eine blaue Zipfelmütze','eine Höhle voller weicher Blätter','🧢'],
['das klingende Windspiel','ein Windspiel aus Muscheln','einen stillen Platz am Teich','🎐'],
['die bunte Feder','eine schillernde Feder','ein Vogelnest hoch oben im Baum','🪶'],
['das schlafende Wolkenschaf','ein Wolkenschaf','eine Wolke über den Baumkronen','☁️'],
['der lustige Rucksack','einen viel zu großen Rucksack','eine Brücke aus Wurzeln','🎒'],
['die geheimnisvolle Laterne','eine warme Laterne','einen schmalen Pfad','🏮'],
['das verlorene Lied','eine kleine Melodie','eine Lichtung mit singenden Vögeln','🎵'],
['der magische Kompass','einen winzigen Kompass','eine Kreuzung aus Waldwegen','🧭'],
['die schimmernde Seifenblase','eine riesige Seifenblase','einen Garten voller Blumen','🫧'],
['das kuschelige Kissen','ein besonders weiches Kissen','eine gemütliche Hütte','🛏️']
];
const turns=[
['Hoppel wollte sofort loshüpfen, doch Bobby schlug vor, zuerst gemeinsam nachzudenken. Krümel entdeckte winzige Spuren im weichen Boden.','Gemeinsam fanden sie heraus, dass man mit Geduld oft mehr entdeckt als mit Eile.'],
['Ein Windstoß wirbelte Blätter auf. Bobby hielt sie für tanzende Gespenster und versteckte sich hinter Krümel, der viel kleiner war als er.','Alle mussten lachen, und Bobby lachte am lautesten über seinen eigenen Schreck.'],
['Unterwegs trafen sie eine kleine Maus, die Hilfe brauchte. Obwohl sie es eilig hatten, blieben sie stehen und halfen ihr.','Die Maus bedankte sich, und die Freunde wussten: Freundlichkeit ist der schönste Fund.'],
['Krümel hatte eine Idee, die zunächst verrückt klang. Sie bauten aus Zweigen und Blättern eine kleine Brücke.','Mit vereinten Kräften gelang ihnen etwas, das keiner allein geschafft hätte.'],
['Plötzlich wurde es still. Hoppel lauschte, Bobby schnupperte und Krümel betrachtete ganz genau die Umgebung.','Sie merkten, wie viele wunderbare Dinge man entdeckt, wenn man einen Moment still wird.']
];
const stories=[];
for(let p=0;p<places.length;p++)for(let q=0;q<quests.length;q++)for(let t=0;t<turns.length;t++){
 const [where,season,emoji,color,detail]=places[p], [name,object,discovery,motif]=quests[q], [challenge,lesson]=turns[t];
 const n=p*100+q*5+t+1;
 const intro=['An einem ruhigen Nachmittag','Als die Sonne langsam tiefer sank','Kurz vor dem Abendessen','Nach einem gemütlichen Frühstück','Als der erste Stern erschien'][t];
 const title=name.charAt(0).toUpperCase()+name.slice(1)+' '+where;
 const text=intro+' machten Bobby der Bär, Hoppel der Hase und Krümel das Meerschweinchen einen Ausflug '+where+'. Überall war es wunderschön: '+detail+'.\n\n'+
 '„Schaut mal!“, rief Hoppel. Direkt vor ihnen lag '+object+'. „Wem das wohl gehört?“, fragte Krümel leise. Bobby nahm sich vor, das Rätsel noch vor dem Schlafengehen zu lösen.\n\n'+
 challenge+' Bald erreichten sie '+discovery+'. Dort entdeckten sie einen Hinweis: Drei kleine Sterne waren in die Erde gezeichnet. „Das ist bestimmt kein Zufall“, flüsterte Hoppel.\n\n'+
 'Bobby ging vorsichtig voran. Krümel schaute unter jeden Stein, und Hoppel blickte hinter jeden Busch. Schließlich fanden sie eine freundliche Waldfee, die ihnen erklärte, warum '+object+' an diesem besonderen Ort aufgetaucht war. Es sollte jemanden daran erinnern, wie wichtig gute Freunde sind.\n\n'+
 '„Dann haben wir ja genau das Richtige gefunden“, sagte Bobby und nahm Hoppel und Krümel in die Arme. '+lesson+'\n\n'+
 'Als der Himmel dunkelblau wurde, gingen die drei nach Hause. Sie tranken warmen Kakao, kuschelten sich unter ihre Decken und erzählten sich noch einmal von ihrem Abenteuer '+where+'. „Morgen erleben wir wieder etwas Schönes“, murmelte Krümel. Und bald schliefen alle drei zufrieden ein. Gute Nacht!';
 stories.push({id:'extra-'+String(n).padStart(4,'0'),title,category:season,emoji:motif,color,text,artTheme:p,artMotif:q});
}
window.guten8ExtraStories=stories;
window.guten8SeasonNames=places.map(x=>x[1]);
window.guten8ExtraArt=function(s){
 const theme=places[s.artTheme]||places[0],quest=quests[s.artMotif]||quests[0];
 const bg=theme[3],icon=quest[3],season=theme[2];
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="640" height="440" viewBox="0 0 640 440"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#182d66"/><stop offset="1" stop-color="'+bg+'"/></linearGradient></defs><rect width="640" height="440" fill="url(#sky)"/><circle cx="515" cy="82" r="45" fill="#fff3c5" opacity=".92"/><path d="M0 325 Q140 245 300 320 T640 290 V440 H0Z" fill="#204d5a"/><path d="M0 390 Q170 295 320 375 T640 350 V440 H0Z" fill="#39735e"/><g fill="#153e4a"><path d="M65 340V150 M65 180L15 260H115Z M160 350V125 M160 145L105 260H215Z M565 340V155 M565 175L510 265H620Z" stroke="#153e4a" stroke-width="15"/></g><g font-family="sans-serif" text-anchor="middle"><text x="310" y="170" font-size="110">'+icon+'</text><text x="105" y="90" font-size="60">'+season+'</text><text x="320" y="335" font-size="82">🐻</text><text x="425" y="355" font-size="72">🐰</text><text x="220" y="367" font-size="62">🐹</text></g><g fill="#fff6cb"><circle cx="220" cy="65" r="3"/><circle cx="355" cy="47" r="4"/><circle cx="465" cy="190" r="3"/><circle cx="120" cy="205" r="3"/></g></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
};
})();
