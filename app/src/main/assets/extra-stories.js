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
const resolutions=[
 "Unter einem Farnblatt hörten sie ein leises Klingeln. Eine junge Eule hatte ihre Glocke verloren. Als Bobby sie zurückgab, schlug die Eule vor Freude dreimal mit den Flügeln.",
 "Der goldene Schlüssel passte zu einer winzigen Tür im Baum. Dahinter hatte eine Hasenfamilie ihre Wintervorräte verstaut und sich schon Sorgen gemacht.",
 "Der Stern war ein kleines Licht, das vom Weg abgekommen war. Krümel stellte eine Laterne auf, damit es den Weg zurück zum Nachthimmel fand.",
 "Das Papierboot gehörte zwei Mäusekindern. Hoppel schob es mit einem Schilfhalm ans Ufer, und die Mäuse bedankten sich mit einer selbstgemalten Kapitänsurkunde.",
 "Der rote Drachen hing hoch in einer Birke. Bobby hielt den Ast vorsichtig fest, während Hoppel die Schnur befreite.",
 "Die Schatzkarte führte nicht zu Gold, sondern zu einer Kiste voller Briefe. Jeder Brief erzählte von einer guten Tat, die jemand im Wald getan hatte.",
 "Das Eichhörnchen hatte Angst vor seiner ersten großen Klettertour. Krümel zeigte ihm, wie man kleine Schritte macht und zwischendurch Pause einlegt.",
 "Der Regenschirm gehörte einer alten Schildkröte. Sie hatte ihn vergessen, als die Sonne herauskam, und freute sich über die unerwarteten Besucher.",
 "Die Glühwürmchen übten für ihren ersten Lichtertanz. Die Freunde klatschten leise im Takt und wurden zu ihrem allerersten Publikum.",
 "Der Kuchen war für ein Überraschungsfest bestimmt. Gemeinsam brachten sie ihn zur Lichtung und schmückten den Tisch mit Blüten und Blättern.",
 "Die Mütze hatte der kleine Dachs auf dem Heimweg verloren. Bobby setzte sie ihm auf und zog sie so tief, dass nur noch seine Nasenspitze herausschaute.",
 "Das Windspiel hatte sich in einem Zweig verfangen. Als Hoppel es löste, erklang eine sanfte Melodie, die sogar die Vögel für einen Moment verstummen ließ.",
 "Die Feder gehörte einem jungen Vogel, der sein Nest suchte. Von einem Hügel aus entdeckten sie den Baum und begleiteten ihn nach Hause.",
 "Das Wolkenschaf konnte nicht einschlafen. Bobby erzählte ihm von weichen Moosbetten, bis es ganz langsam über den Mond davontrieb.",
 "Im großen Rucksack steckten nur drei winzige Kekse und eine Decke. Krümel fand, dass man für ein Abenteuer vor allem gute Freunde brauchte.",
 "Die Laterne zeigte den Weg zu einer kleinen Hütte. Dort wartete ein Igel auf seine Familie, und die Freunde blieben bei ihm, bis alle wieder zusammen waren.",
 "Die verlorene Melodie versteckte sich im Rauschen der Blätter. Als alle still wurden, konnten sie sie hören und gemeinsam weitersummen.",
 "Der Kompass zeigte nicht nach Norden, sondern zu einem alten Baum mit einer Bank. Dort fanden die Freunde den schönsten Platz für eine Pause.",
 "Die Seifenblase trug einen winzigen Marienkäfer über den Bach. Hoppel fing sie behutsam mit einem Blatt auf, bevor sie zerplatzte.",
 "Das Kissen war für ein krankes Mäusekind genäht worden. Bobby trug es vorsichtig zu seinem Bettchen und die Maus lächelte zum ersten Mal an diesem Tag."
];
const seasonalScenes=["Zwischen den Blumen summten Hummeln, und Hoppel musste niesen, weil eine Blüte seine Nase kitzelte.","Die Sonne wärmte ihre Rücken. Am Bach kühlten sie ihre Pfoten und lauschten dem fröhlichen Plätschern.","Bunte Blätter segelten auf den Weg. Krümel sammelte das schönste und steckte es Bobby hinter das Ohr.","Der Schnee knirschte leise unter ihren Füßen. Bobby pustete kleine Atemwölkchen in die klare Luft.","Kürbislaternen leuchteten am Weg. Hinter einer Hecke raschelte es, doch es war nur ein Igel mit einem Blatt auf dem Kopf.","Es duftete nach Zimt und gebrannten Mandeln. In den Fenstern spiegelten sich kleine goldene Lichter.","Ein Adventskranz stand auf dem Tisch, und die erste Kerze flackerte ruhig. Alle sprachen besonders leise.","Überall lagen bunte Eier versteckt. Krümel fand eines im Moos und zeigte es stolz den anderen.","Die Sterne funkelten über den Bäumen. Die Freunde schmiedeten gute Vorsätze für das neue Jahr.","Bunte Girlanden flatterten zwischen den Bäumen. Hoppel übte heimlich ein Geburtstagslied."];
const characterMoments=["„Wartet kurz“, sagte Krümel, „ich glaube, ich habe etwas entdeckt!“ Bobby kniete sich zu ihm hinunter.","Bobby wollte schon weitergehen, aber Hoppel hob die Ohren. „Hört ihr das auch?“","„Ein Abenteuer ist schöner, wenn wir zusammenbleiben“, meinte Bobby und reichte Krümel seine Tatze.","Hoppel machte einen besonders großen Satz und landete mitten in einem Haufen weicher Blätter.","Krümel zog eine winzige Lupe aus seiner Tasche. „Für Rätsel braucht man manchmal einen genauen Blick.“"];
const stories=[];
for(let p=0;p<places.length;p++)for(let q=0;q<quests.length;q++)for(let t=0;t<turns.length;t++){
 const [where,season,emoji,color,detail]=places[p], [name,object,discovery,motif]=quests[q], [challenge,lesson]=turns[t];
 const n=p*100+q*5+t+1;
 const intro=['An einem ruhigen Nachmittag','Als die Sonne langsam tiefer sank','Kurz vor dem Abendessen','Nach einem gemütlichen Frühstück','Als der erste Stern erschien'][t];
 const title=name.charAt(0).toUpperCase()+name.slice(1)+' '+where;
 const text=intro+' machten Bobby der Bär, Hoppel der Hase und Krümel das Meerschweinchen einen Ausflug '+where+'. Überall war es wunderschön: '+detail+'.\n\n'+
 seasonalScenes[p]+'\n\n'+characterMoments[(q+t)%characterMoments.length]+' „Schaut mal!“, rief Hoppel. Direkt vor ihnen lag '+object+'. „Wem das wohl gehört?“, fragte Krümel leise. Bobby nahm sich vor, das Rätsel noch vor dem Schlafengehen zu lösen.\n\n'+
 challenge+' Bald erreichten sie '+discovery+'. Dort entdeckten sie einen Hinweis: Drei kleine Sterne waren in die Erde gezeichnet. „Das ist bestimmt kein Zufall“, flüsterte Hoppel.\n\n'+
 'Bobby ging vorsichtig voran. Krümel schaute unter jeden Stein, und Hoppel blickte hinter jeden Busch. '+resolutions[q]+'\n\n'+
 '„Dann haben wir ja genau das Richtige gefunden“, sagte Bobby und nahm Hoppel und Krümel in die Arme. '+lesson+'\n\n'+
 'Als der Himmel dunkelblau wurde, gingen die drei nach Hause. Sie tranken warmen Kakao, kuschelten sich unter ihre Decken und erzählten sich noch einmal von ihrem Abenteuer '+where+'. „Morgen erleben wir wieder etwas Schönes“, murmelte Krümel. Und bald schliefen alle drei zufrieden ein. Gute Nacht!';
 stories.push({id:'extra-'+String(n).padStart(4,'0'),title,category:season,emoji:motif,color,text,artTheme:p,artMotif:q});
}
window.guten8ExtraStories=stories;
window.guten8SeasonNames=places.map(x=>x[1]);
const seasonalDecor=[
 '<g fill="#ffe1f0"><circle cx="95" cy="290" r="14"/><circle cx="145" cy="320" r="11"/><circle cx="535" cy="305" r="15"/></g><path d="M92 310v55m50-30v40m395-55v65" stroke="#86bf77" stroke-width="5"/>',
 '<circle cx="530" cy="85" r="51" fill="#ffe69c"/><path d="M0 370Q180 320 340 365T640 350V440H0Z" fill="#e7bc69"/>',
 '<g fill="#eeb16c"><ellipse cx="85" cy="335" rx="20" ry="8" transform="rotate(35 85 335)"/><ellipse cx="520" cy="310" rx="22" ry="9" transform="rotate(-25 520 310)"/><ellipse cx="580" cy="375" rx="17" ry="8"/></g>',
 '<g fill="#f7f9ff"><circle cx="90" cy="90" r="6"/><circle cx="160" cy="200" r="4"/><circle cx="520" cy="215" r="6"/><circle cx="570" cy="140" r="5"/></g><path d="M0 365Q150 340 300 370T640 350V440H0Z" fill="#e6f3ff"/>',
 '<g fill="#e88b39"><ellipse cx="110" cy="340" rx="42" ry="30"/><ellipse cx="535" cy="355" rx="35" ry="27"/></g><path d="M110 300v16m425 5v12" stroke="#527b43" stroke-width="9"/>',
 '<g fill="#f3d56e"><circle cx="90" cy="170" r="5"/><circle cx="140" cy="120" r="5"/><circle cx="520" cy="200" r="5"/></g><path d="M95 345L140 215L185 345ZM490 355L535 215L580 355Z" fill="#1e795b"/>',
 '<g fill="#ffe4a1"><rect x="90" y="265" width="15" height="60" rx="4"/><rect x="535" y="270" width="15" height="60" rx="4"/></g><g fill="#ffc47e"><path d="M98 263q-19-19 0-38q18 20 0 38M543 268q-19-19 0-38q18 20 0 38"/></g>',
 '<g fill="#f5c1d5"><ellipse cx="100" cy="340" rx="19" ry="26"/><ellipse cx="540" cy="350" rx="19" ry="26"/></g><path d="M95 300q-14-20-25-12m30 12q15-22 25-14" stroke="#fff" stroke-width="5" fill="none"/>',
 '<g stroke="#ffe6a8" stroke-width="4"><path d="M120 95l0 55m-25-27h50M510 125v55m-25-27h50"/></g>',
 '<g fill="#ffd5e8"><path d="M95 270l15 22l-15 22l-15-22ZM540 285l15 22l-15 22l-15-22Z"/></g><path d="M70 115Q320 175 575 105" fill="none" stroke="#ffdc9e" stroke-width="5"/>'
];
window.guten8ExtraArt=function(s){
 const theme=places[s.artTheme]||places[0],quest=quests[s.artMotif]||quests[0];
 const bg=theme[3],icon=quest[3],season=theme[2],decor=seasonalDecor[s.artTheme]||'';
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="640" height="440" viewBox="0 0 640 440"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#182d66"/><stop offset="1" stop-color="'+bg+'"/></linearGradient></defs><rect width="640" height="440" fill="url(#sky)"/><circle cx="515" cy="82" r="45" fill="#fff3c5" opacity=".92"/><path d="M0 325 Q140 245 300 320 T640 290 V440 H0Z" fill="#204d5a"/><path d="M0 390 Q170 295 320 375 T640 350 V440 H0Z" fill="#39735e"/><g fill="#153e4a"><path d="M65 340V150 M65 180L15 260H115Z M160 350V125 M160 145L105 260H215Z M565 340V155 M565 175L510 265H620Z" stroke="#153e4a" stroke-width="15"/></g><g font-family="sans-serif" text-anchor="middle"><text x="310" y="170" font-size="110">'+icon+'</text><text x="105" y="90" font-size="60">'+season+'</text><text x="320" y="335" font-size="82">🐻</text><text x="425" y="355" font-size="72">🐰</text><text x="220" y="367" font-size="62">🐹</text></g><g fill="#fff6cb"><circle cx="220" cy="65" r="3"/><circle cx="355" cy="47" r="4"/><circle cx="465" cy="190" r="3"/><circle cx="120" cy="205" r="3"/></g></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
};
})();
