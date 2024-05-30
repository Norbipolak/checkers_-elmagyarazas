/*
Fontos, hogy ha van egy függvény és meg kell neki adni dolgokat, tehát vár paraméterbe dolgokat egy másik függvénytől, akkor ezek a paramétereknek 
a neve lehet bármi, csak az lényeg, hogy amikor ez a függvény meg van hívva a másikban, akkor ott fontos, hogy azokat a dolgokat adjuk 
meg névszerint, amit abból a függvényből vár és itt nagyon fontos a sorrendiség!!!!!!!!!!!!!!!!!!!!!!!!!!!

Mert a függvény, ami várja a dolgokat, ott lehet hogy bármi is a neve, de viszont ahol meghívjuk 
->

sampleFunction () {
    const sample = 5
    sampleFunction2(sample)
}

sampleFunction2 (barmi) {
    console.log(barmi)
}

sampleFunction() 

és ilyenkor a console.log(barmi) az 5 lesz!!!! 

mert a másik függvényben meg lett hívva, ahol átadtuk neki a sample-értékét, itt nagyon fontos, hogy mit írunk, mert ha ide írnánk meghíváskor 
hogy bármi, akkor az úgy nagyon nem lenne jó, de viszont a sampleFunction-ba ott lehet írni bármit, mert tudja, hogy meghívásná mit fog megkapni

és akkor a sampleFunction2-vel lehet tovább úgy dolgozni, hogy barmi pl. console.log(barmi.length) vagy alármit is lehet itt vele csinálni, csak 
az a lényeg, hogy itt ebben már bármi lesz!!!! 
**************************
volt egy olyan, amikor bekért egy player-t a függvény meg is kapta de ezt a player-t beleraktuk egy highlighted objektumba és akkor onnantól 
kezdve ha ennek a player-re szüksége van egy másik függvénynek, akkor már nem úgy hívatkozunk rá, hogy player hanem, hogy highlighted.player
-> 

sampleFunction(player) {

    const highlighted = {
        player: player, 
        row: .. akármi is 
    }
}

és egy másik függvénynek is kell ez a player a sampleFunction2-nek 
-> 
sampleFunction2(playerKellNekünk) {
    console.log
}

egy példa arra, hogy több függvény van és hogy megy az átadás 
->
*/

// First function: Initializes a variable
function initializeVariable() {
    const value = 10; // Initialize a variable with a value
    processVariable(value); // Pass the variable to the second function
}

// Second function: Puts the variable into an object
function processVariable(val) {
    const obj = { data: val }; // Put the variable into an object
    utilizeObject(obj); // Pass the object to the third function
}

// Third function: Uses the value from the object
function utilizeObject(obj) {
    console.log(obj.data); // Use the value from the object (logs 10)
}

// Call the first function to start the process
initializeVariable();


/*
Ha van több dolog a data objektumban
->
*/

// First function: Initializes a variable
function initializeVariable() {
    const value = 10; // Initialize a variable with a value
    processVariable(value); // Pass the variable to the second function
}

// Second function: Puts the variable into an object with more key-value pairs
function processVariable(val) {
    const obj = {
        data: val,
        additionalData: "extra",
        anotherField: 42
    }; // Create an object with multiple key-value pairs
    utilizeObject(obj); // Pass the object to the third function
}

// Third function: Extracts specific values from the object
function utilizeObject(obj) {
    const { data, anotherField } = obj; // Destructure the object to get specific values
    console.log(data); // Use the value of the 'data' key (logs 10)
    console.log(anotherField); // Use the value of the 'anotherField' key (logs 42)
}

// Call the first function to start the process
initializeVariable();

/*
Object destructuring fontos, hogyha van egy objektumunk pl. ez 
-> 
*/
const person = {
    name: 'Alice',
    age: 30,
    job: 'Engineer'
};

// Destructuring assignment
const { name, age } = person;

console.log(name); // Outputs: Alice
console.log(age); // Outputs: 30

/*
akkor létre tudunk hozni egy változót az objektumunknak a key-eivel const { name, age } és oda csak azokat írjuk be amire 
szükségünk van, ezért destructuring az egyenlővé tesszük a az objectum nevével és akkor megkapjuk azokat a value-kat amelyik
key-ekre kiváncsiak voltunk 
*/

const obj2 = {
    name2:"Anna",
    hobby:"fencing",
    height:177,
    weight:58
}

/*
és ebből csak arra vagyok kiváncsi, hogy mi a neve meg mi a hobby-ja 
*/

const { name2, hobby } = obj2;
console.log(`${name} ${hobby}`); //alice fencing

/*
nagyon fontos a színtaktika, hogy ezt bele kell rakni egy {}-be és megadni neki kulcsokat és egyenlővé tenni az objektum nevével 
*/

/*
de lehet úgy is, hogy egy function vár paraméter-ben egy objektumnak a valamilyen kulcsit és akkor csak azokat adjuk meg neki 
*/

function displayPerson({ names, job }) {
    console.log(names);
    console.log(job);
}

const person2 = {
    names: "Alice",
    age: 30,
    job: "engineer"
}

displayPerson(person2);
/*
és a console.log(names) -> Alice
console.log(age) -> 

mert megadtuk a kulcsokat, hogy melyikekre vagyunk kiváncsiak egy függvénynek és meghíváskor meg megadtuk neki az egész objektumot 
de a függvény az már tudni fogja, hogy melyik kulcsokra vagyok kivácsiak ebből az objektumból 
*/

const example = (cb)=> {
    const name = "Anna";
    const age = 7;
    cb({data:"Ez nagyon fontos!"});
}

try {
    example((valami)=> console.log(valami));
}catch(err) {
    console.log(err);
}

/*
az example vár egy cb-et amit megadtunk neki, egy olyan függvény, amelyik meghívja saját magát és a try-ban pedig ezt a dolgot, amit vár 
az example függvény ezt itt kikonzolzzuk!!!! meghívásnál ott lehet akármit írni, mert az example függvény tudja, hogy mit vár és csak ott 
abban a függvényben kell egyezni a cb-nek!!!! 

**********************************************************************************************************************************************
*/
/*
checkers fontos dolgok a css-ből 
1. keyframes létrehozunk egy keyframes valamilyen névvel és utána ez a név alapján tudjuk felhasználni valamilyen osztályban 
    ott megadjuk, hogy animation-name: és annak kell lenni, ahogy keyframes-t elneveztük!!!!!! 
    és még ott be lehet állítani dolgokat, hogy pl. animation-duration, meg animation-iteration-count stb.

@keyframes stepFrom {
    from {border: 3px solid #d5d5d5;} 
    to {border: 3px solid transparent;}
}

@keyframes stepTo {
    from {border: 3px solid #87dd62;}
    to {border: 3px solid transparent;}
}

és ezeket meg tudjuk adni egy class-nak 
->
.stepFrom {
    animation-name: stepFrom;
    animation-duration: .2s 
    animation-iteration-count: 5;
}

.stepTo {
    animation-name: stepTo;
    animation-duration: .2s;
    animation-iteration-count: 5;
}

itt van egy példa, hogy még milyenre lehet egy animation-t @keyframes!!!! 

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CSS Animation Example</title>
<style>
@keyframes slideIn {
    0% {
        transform: translateX(-100%);
    }
    50% {
        transform: translateX(50%);
    }
    100% {
        transform: translateX(0);
    }
}

.animated-box {
    width: 100px;
    height: 100px;
    background-color: blue;
    animation-name: slideIn;
    animation-duration: 4s;  4 seconds 
    animation-timing-function: ease-in-out; - ease, ease-in, ease-out, ease-in-out, linear
    animation-delay: 1s;  1 second delay 
    animation-iteration-count: 3;  Repeat 3 times 
    animation-direction: alternate;  Alternate directions - normal, reverse, 
    animation-fill-mode: both;  Retain end state 
    animation-play-state: running; Ensure the animation is running - itt lehet, hogy running vagy paused
}
</style>
</head>
<body>

<div class="animated-box"></div>

</body>
</html>
**************************************************************************************************************
margin-right: -1px; hogyha duplikálodnak a border-ek!!
vagy margin: 0 -1px -1px 0;
**************************************************************************************************************
van ez a radial-gradient amit megadunk egy %-val, hogy akkor milyen legyen a színe meg kell, hogy circle vagy ilyesmi 

.black-player {
    background: rgb(107, 107, 107);
    background: linear-gradient(circle, rgba(107, 107, 107,1) 0%, rgba(46, 46, 46,1)100%);
}

.white-player {
    background: rgb(255, 255, 255);
    background: linear-gradient(circle, rgba(255, 255, 255,1) 0%, rgba(191, 191, 191,1) 100%);
}

ugye nem csak linear-gradient létezik, hanem még másfajta is!!!! meg nem csak circle a linear-gradient-be 
van
1. linear -> amikor ilyen csíkok vannak 
2. radial -> amikor ilyen körök 
3. conic 

az alapbeállyítás az top to bottom 
#grad {
  background-image: linear-gradient(red, yellow);
}
felül piros lesz majd alul sárga 

de ezt meg is lehet határozni, minthogy mi is meghatároztuk, hogy ez circle legyen 
pl. to right
#grad {
  background-image: linear-gradient(to right, red , yellow);
}

itt a bal olal piros majd átmegy sárgára ha a bal oldalra ér 
de meghatárothatjuk azt is, hogy to bottom vagy to top és mág azt is, hogy balra vagy jobbra menjen 

#grad {
  background-image: linear-gradient(to bottom right, red, yellow);
}

itt jobb felül piros lesz majd bal alulra átmegy sárgába!!! 
******
de nem csak két color-t tudunk megadni, hanem többet is 
#grad {
  background-image: linear-gradient(red, yellow, green);
}
piros van felül, középen sárga majd átmegy zöldbe alul!!! 

ez egy ilyen rainbow jobbról balra menően!!! 
#grad {
  background-image: linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet);
}
**********************************
a transparency-t is lehet használni, ahogy mi is tettük!!!!! 
itt ugyanaz a szín csak más lesz a transparency-je erre kell, hogy ne csak rgb legyen hanem rgba!!!!!!! 
hogy meg tudjuk határozni a trnasparency-t is 

#grad {
  background-image: linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1));
}
*********************************************************************
ha van egy osztályunk pl. itt rotating-box és azt szeretnénk, hogy ha e felé megyünk, tehát :hover, akkor forduljon el 45deg-et 
itt fontos, hogy a transform: rotate(45deg)-et majd a :hover-nek kell megadni, a transition-t meg a rotating-box-nak!!!!! 

<style>

.rotating-box {
    width: 100px;
    height: 100px;
    background-color: blue;
    transition: transform 0.5s ease;  Apply transition to the transform property 
}

Rotate the element when it is hovered over 
.rotating-box:hover {
    transform: rotate(45deg);  Rotate 45 degrees on hover 
}
</style>
</head>

itt fontos, dolgok, hogy transition mire vonatkozik -> tranform-ra de lehet azt is írni, hogy all és ilyenkor mindenre fog vonatkotni 
a translate-re is péláúl ha van olyanunk 


ugyanez a példa, csak itt meg adva a rotating-box-nál is egy transform!!! fontos, hogy az az alapállapot, ha befejeződik a :hover, akkor 
oda fog visszaállni a transition-vel meg a folyamatot határozzuk meg, hogy milyen gyorsan menjen végbe, meg hogy milyen formában 
ease, linear stb.  

Initial style for the element 
.rotating-box {
    width: 100px;
    height: 100px;
    background-color: blue;
    transform: rotate(0deg);  Initial rotation 
    transition: transform 0.5s ease; 
}

Rotate the element when it is hovered over 
.rotating-box:hover {
    transform: rotate(45deg);  Rotate 45 degrees on hover 
}
</style>

pseudo osztályok és hogy mit csinálnak!!! 
:hover -> amikor az egér rajta van, felette van 

:active -> amikor egy elem activated pl. egy gomb meg van nyomva 

:focus -> amikor egy elem focus-ban van. pl. egy text-input ki van választva, bele van kattintva 

a:visited -> ez olyan link-ekre van amiket már meglátogattunk 

a:link -> ez olyan linkekre van, amiket még nem láttogattunk meg 

input:checked -> amikor egy radio-button vagy egy checkbox be van pipálva 

van disabled meg enabled olyan elemekre amik le vannak tiltva vagy éppen nem 

:first-child, :last-child, :nth-child(2 vagy even stb.) hogy hányadik gyerek elemre vonatkozik!!! :only-child

:after, :before

.example:after {
    content: "Before: ";
}

inserts content after the element's content 

.example:before {
    content: "After: ";
}

inserts content before the element's content 
*******************************************************************************************************************************************
amikor meg akarjuk adni valaminek a szélességét vagy a magasságát két értékkel, akkor használhatjuk a min-t meg a max-t és akkor 
az ki fogja nekünk választani, hogy melyik a nagyobb vagy a kisebb az adott helyzetben és azt fogja alakalmazni 

pl. 
.table {
    height: max(45vh, 500px);
}

Amig a 45vh az nagyobb, mint az 500px addig az lesz, de amint kisebb akkor beáll 500px-re!!!! vagy itt lehetne akár vw is nem vh 

min-nél ugyanez csak ott azt választja ki elöször ami kisebb!!! 

de van egy olyan, hogy minmax() is, amit általában grid-nél szoktunk használni, hogy megadjuk hogy mennyi legyen egy sorban 
de lehet olyat is, hogy auto-fill

.container {
    display: grid;
    grid-template-columns: repeat(3, minmax(100px, 1fr));
}
itt 3 lehet és akkor 1fr ami azt jelenti, hogyha ez nagyobb, mint 300px (látható szélesség) akkor nőni fognak és nem 100px-esek lesznek!!! 

.container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1));
}

itt meg annyival tölti fel amennyi kifér és egy elem min 200px-esnek kell lennie!!!! 

de ezt lehet úgy is, hogy var és megadunk egy értéket és meghatározzuk egy @media and sreen-vel(max-widht)
hogy mekkorák legyenek ezek a var-os értékek amik egy :root-ban kell, hogy legyenek 


<style>
:root {
    --size1: 100px;
    --size2: 200px;
    --size3: 300px;
}

.container {
    display: grid;
    grid-template-columns: repeat(3, minmax(var(--size1), var(--size3)));
    gap: 10px;
}

.box {
    background-color: lightblue;
    padding: 20px;
    text-align: center;
}

Media queries to change size variables based on screen width 
@media (min-width: 600px) {
    :root {
        --size1: 200px;
        --size2: 300px;
        --size3: 400px;
    }
}

@media (min-width: 900px) {
    :root {
        --size1: 300px;
        --size2: 400px;
        --size3: 500px;
    }
}
</style>

fontos a színtektika!!!! 
    :root {
        --size1: 200px;
        --size2: 300px;
        --size3: 400px;
    }

és így lehet hívatkozni rájuk
minmax(var(--size1), var(--size3)));
-> 
*/