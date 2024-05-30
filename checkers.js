class Checkers {
    table; //DIV amibe generáljuk a mezőket 
    round; // fekete vagy fehér kör ezt majd lépés után meg kell változtatni this.round = this.round === "black" ? "white" : "black"
    highlighted; //hova lépnek a kijelölt játkosok 
    points; //pontok
    blackPointsSpan; //span amibe a fekete potnjai vannak
    whitePointsSpan; //span amibe a fehér pontjai vannak 
    whitePlayers; // fehér játekosok (ők lépnek majd automatikusan)

    constructor() {
        this.table = document.querySelector("#table");
        this.round = "black"; //mert a fekete fog kezdeni 
        this.highlighted = {
            row: -1, //hogy ne legyen alapból megadva egy row ez azért -1, mert olyan biztos, hogy nem lesz
            col: -1,
            player: null, //player meg null ha nem létezik, de majd létre fogjuk hozni, amikor legeneráljuk a table-t 
            possibleSteps: [] //ide fogjuk gyüjteni, hogy majd hova léphet 
        }

        this.blackPointsSpan = document.querySelector("#black-points");
        this.whitePointsSpan = document.querySelector("#white-points");

        this.whitePlayers = []; //egy üres tömb, de majd ide tesszük be azokat amiknek van egy olyan osztálya, hogy white-player classList.contains

        this.points = {
            "black": 0,
            "white": 0
        }

        //mezők generálása 
        this.generateFields();
    }

    showResults() {
        this.blackPointsSpan.innerHTML = points.black;
        this.whitePointsSpan.innerHTML = points.white;

        if (this.points.black === 8) {
            this.blackPointsSpan.innerText = "Nyertes";
        } else if (this.points.white === 8) {
            this.whitePointsSpan.innerText = "Nyertes";
        }
    }

    isDangerousHit(hitRow, hitCol, fieldRow, fieldCol, pRow, pCol) {
        //ebben a függvényben vizsgáljuk, hogyha a fehér tud ütni, akkor az dangerous-e, tehát ahova lép, ott le tudjuk majd ütni 
        if (fieldRow === 8 || fieldCol === 8)
            return false;
        /*
        Ha a fieldRow vagy fieldCol, ahova lép az 8, akkor az biztos, hogy nem dangerous, mert ott van a pálya vége és akkor biztos, hogy nem 
        tudjuk majd leütni!!!! 
        */
        const isBackward = pRow > fieldRow;
        const isLeft = pCol > fieldCol;

        const hitFrontRight = document.querySelector(`#field-${fieldRow + 1}-${fieldCol + 1}`);
        const hitFrontLeft = document.querySelector(`#field-${fieldRow + 1}-${fieldCol - 1}`);

        const hitBackRight = document.querySelector(`#field-${hitRow - 1}-${hitCol + 1}`);
        const hitBackLeft = document.querySelector(`#field-${hitRow - 1}-${hitCol - 1}`);


        //mert ha ilyen írányba ütünk, akkor az ahonnan le tudnának ütni minket az a mező vagy üres vagy ott a white player-e van 
        if (isBackward && isLeft && hitFrontLeft?.children.length === 0 ||
            isBackward && isLeft && hitFrontLeft?.children.classList.contains("white-player")
        ) {
            return false;
        }

        if (isBackward && !isLeft && hitFrontRight?.children.length === 0 ||
            isBackward && !isLeft && hitFrontRight?.children[0].classList.contains("white-player")
        ) {
            return false;
        }

        //vagy ha nincsen semmelyikben semmi 
        if (hitFrontRight?.children.length === 0 && hitFrontLeft?.children.length === 0) {
            return false;
        }

        //jobbra ütés 
        if (hitFrontRight?.children.length === 0 && hitFrontLeft?.children.length !== 0 && hitBackRight?.children.length !== 0) {
            return false;
        }

        //balra ütés 
        if (hitFrontLeft?.children.length === 0 && hitFrontLeft?.children.length !== 0 && hitBackLeft?.children.length !== 0) {
            return false;
        }

        return true;
    }

    /*
    megnézzük, hogy tud-e checkers lenni bekérünk egy pCol illetve egy pRow-ot, hogy megnézzük, hogy a player ahol van onnan tud-e 
    checkers lenni
    melyik mező jó neki, az amelyik biztos, hogy egy row-val előtte van, tehát +1 col meg átlósan tud lépni ezért +1 vagy -1 
    */
    canBeCheckers(pRow, pCol) {
        const leftFront = document.querySelector(`#field-${pRow + 1}-${pCol - 1}`);
        const rightFront = document.querySelector(`#field-${pRow + 1}-${pCol + 1}`);
        //azt return-öljük ha a 7-dik sorban van és nincsen ahova lépne ott semmi
        return leftFront?.children.length === 0 && pRow === 7 || rightFront?.children.length === 0 && pRow === 7
    }

    getOptimalSteps() {
        const optimalSteps = [];

        //végigmegyünk az összes white player-en 
        for (const wp of this.whitePlayers) {
            //összeszedjük neki a lehetséges lépéseket 
            const possibleSteps = this.gatherPossibleSteps(wp);
            /*
            a find megtalálja az elsőt, ahol van ütés, de ha azt akarnánk, hogy az összeset, akkor filter kellene
            de ez így is jó, mert ha van ütés itt megtalálja, hogy melyik az és akkor azzal lépünk meg ütünk mindenképpen
            */
            const hitStep = possibleSteps.find(ps => ps.hit !== null);
            //itt van most a fehér 
            const pCol = parseInt(wp.getAttribute("col"));
            const pRow = parseInt(wp.getAttribute("row"));
            //ebbe a sorba fog lépni meg col-ba!!! 
            const fieldRow = parseInt(hitStep?.field?.getAttribute("row"));
            const fieldCol = parseInt(hitStep?.field?.getAttribute("col"));

            //ha van ütés, akkor adunk neki egy pontot meg ha checkers is tud lenni vele, akkor kap még egy pontot 
            if (hitStep !== undefined && hitStep !== null) {
                let rank = 1;
                //amelyiket leüttöttük annak a row-ja meg a col-ja!! 
                const hitRow = parseInt(hitStep.hit.getAttribute("row"));
                const hitCol = parseInt(hitStep.hit.getAttribute("col"));

                if (fieldRow === 8) {
                    rank++;
                }

                //és ha ez nem dangerous akkor beletesszük az optimalStep-be 
                //mert az isDangerous az return-öl egy true vagy bizonyos esetekben false-t, ami nekünk itt kell, mert akkor nem vesélyes az ütés 
                if (this.isDangerousHit(hitRow, hitCol, fieldRow, fieldCol, pRow, pCol)) {
                    //és ha nem veszélyes, akkor belerakjuk az optimalSteps-be 
                    optimalSteps.push({
                        field: hitStep.field,
                        hit: hitStep.hit,
                        player: wp,
                        isCheckers: fieldRow === 8,
                        rank: rank
                    })
                }
            }


            //itt is beletesszük az optimalStep-be, de viszont ha canBeCheckers az true, akkor biztos, hogy nem lesz dangerous!! nem kell nézni 
            if (hitStep !== undefined && hitStep !== null && this.canBeCheckers(pRow, pCol)) {
                let rank = 1;

                if (hitStep.hit)
                    rank++;

                optimalSteps.push({
                    field: hitStep.field,
                    hit: hitStep.hit,
                    player: wp,
                    isCheckers: fieldRow === 8
                })
            }
        }

        return optimalSteps;
        //ez visszaadja, az tömböt, amibe benne vannak az optimális lépések 
    }

    /*
    kijelőlés, hogy lássuk, hogy honnan léptünk hova, melyik mezőről melyikre 
    */
    highlightedStep(from, to) {
        to?.classList.add("step-to");
        from?.classList.add("step-from");

        setTimeout(() => {
            to?.classList.remove("step-to");
            from?.classList.remove("step-from");
        }, 4000);
    }

    notOptimalStep() {
        let filteredSteps = [];
        let foundStep = false;

        //csinálunk egy for-t ami megy 0-1 és ha ez egyenlő nullával
        for (let i = 0; i < 2; i++) {
            let checkIsDangerous = i === 0;
            for (const player of this.whitePlayers) {
                const pCol = parseInt(player.getAttribute("col"));

                const possibleSteps = this.gatherPossibleSteps(player)
                /*
                itt hívjuk meg ezt ami összegyüjti, hogy mik a possibleSteps-jei minden player-nek (a gatherPossibleSteps-et csak a fehére van)
                possibleSteps.push({
                    field: back,
                    hit: child
                })
                ilyen formában megvan, hogy hova tud lépni, meghogy ha tud ütni olyan lépés, akkor miket tud leütni
                és akkor így minden fehér player-nek tudjuk a lépését!!!!!!!!!!
                */
                for (const step of possibleSteps) {
                    /*
                    Ha nincsen optimális lépés, akkor azért nincsen, mert az ütéssel leüthetnek minket
                    */
                    step.field.classList.remove("possible-step");
                    //megszerezzük a field-eknek, ahova lépünk a col-t meg a row-t 
                    const col = parseInt(step.field.getAttribute("col"));
                    const row = parseInt(step.field.getAttribute("row"));
                    //leftback az az ahova lépünk attól vissza átlósan lesz-e mi bábunk, mert akkor nem dangerous, ha utána mi is tudunk ütni!!!
                    const leftBack = document.querySelector(`#field-${row - 1}-${col - 1}`);
                    //azért nincs rightBack, mert onnan mi jöttünk az ütéssel, ott biztos, hogy nem lesz semmi, azon kivül amit mi leütöttünk már
                    const isLeft = pCol < col;
                    /*
                    A pCol a mi player-ünknek a col-ja az kisebb, mint a col a field-nek a col-ja ahova majd lépünk űtés után 
                    */
                    //mezők az ütésünk után(ahova léptünk), ahonnan majd tud ütni az ellenfél minket ha ott van 
                    const rightFront = document.querySelector(`#field-${row + 1}-${col + 1}`);
                    const leftFront = document.querySelector(`#field-${row + 1}-${col - 1}`);

                    /*
                    1.
                    ha a step.field ahova lépünk az létezik és nincs is ott semmi meg a rightFront, leftFront-ban sem, akkor biztos, hogy ütés 
                    után nem tudnak majd leütni akkor beletesszük ebbe a filteredSteps-es tömbbe, amit létrehoztunk 
                    2. 
                    ha van valami a rightFront-ba de viszont nekünk is a leftBack-be, mert akkor le tud minket ütni, de viszont utána mi is őt 
                    3. 
                    ha meg a checkIsDangerous az nem igaz és tudunk oda lépni 
                    */
                    if (step.field?.children.length === 0 && rightFront?.children.length === 0 && leftFront?.children.length === 0
                        && checkIsDangerous) {
                        filteredSteps.push(step.field);
                    } else if (step.field?.children.length === 0 && leftBack?.children.length !== 0 && rightFront?.children.length !== 0 &&
                        leftFront?.children.length === 0 && checkIsDangerous) {
                        filteredSteps.push(step.field);
                    } else if (!checkIsDangerous && step.field?.children.length === 0) {
                        filteredSteps.push(step.field);
                    }
                }

                /*
                és ha a filteredSteps-ben van valami vagy több valami van, akkor random kiválasztjuk a lépést és oda lépünk vele  
                */
                if(filteredSteps.length !== 0) {
                    const rand = Math.floor(Math.random() * filteredSteps.length);
                    const newStep = filteredSteps[rand];
                    /*
                    a player-nek ahova lép majd frissiteni kell a col-t meg a row-t ez nagyon fontos, amikor mi is lépünk 
                    azt is fissítjük meg kell az appendChild is player-t a mezőre!!! 
                    */
                    player.setAttribute("row", newStep.getAttribute("row"));
                    player.setAttribute("col", newStep.getAttribute("col"));
                    //setAttriburte a player-nek a col-ja az az, hogy amit majd megkapunk a newStep getAttribute.jától, mert ez a mező ahova lépni fog 

                    //meghívjuk a highlightedStep-et és megadjuk neki, hogy honnan lépönk hova!!és akkor az ki lesz jelölve, villogni fognak!! 
                    this.highlightedStep(
                        player.parentElement,
                        newStep
                    )

                    //hozzárakjuk a field-hez a player-t -> appendChild
                    newStep.appendChild(player);
                    //mert itt találtunk lépést és majd ha ez true, akkor true nem keresünk tovább lépéseket másik white player-re 
                    foundStep = true;
                    //és ilyenkor ha találtunk egy lépést akkor break, hogy ne is nézze tovább, hogy van még-e jó lépés 
                    break;
                }
            }

            if(foundStep)
                break;
            /*
            itt meg a white-player-es for ciklusra kell a break a for-ra, mert ha találtunk egy lépést akkor azt lépjük és nem kell 
            hogy még a többi white-player-re is megnézze, hogy van-e lépésük
            */
        }
    }

    automaticStep() {
        //ha fekete köre van, akkor nem tud belépni!!! mert itt csak a fehér körre csináljuk a dolgokat!! 
        if(this.round === "black")
            return;

        /*
        megszerezzük az optimális lépéseket, mert az egy tömböt ad vissza az optimális lépésekkel (objektumok)
        és ott csináltunk egy olyan kulcsot, hogy rank, ami azt mutatja meg, hogy milyen értékes a lépés, aszerint kap rank-ot 
        pl. a twoPoints az az amikor be tud lépni checkers, úgyhogy mellette még le is tud ütni egyet, meg lesznek az egy ponstosok 
        amikor csak simán üt vagy belép checkers-be 

        és itt a find-val megkeressük az első, aminek van 2-je meg azt is aminek van egye 
        így néz ki ez a dolog 
                optimalSteps.push({
                    field: hitStep.field,
                    hit: hitStep.hit,
                    player: wp,
                    isCheckers: fieldRow === 8
                })
        */
        //itt megszerezzük, úgyhogy meghívjuk a getOptimalStep-et, ami visszaadja ezt ami visszaad egy tömböt ilyen objektumokkal mint itt feljebb
        const optimalSteps = this.getOptimalSteps();

        //kiválasztjuk az első objektumot, aminek a rank-ja kettő meg aminek egy a find-val 

        const twoPoints = optimalSteps.find((bs)=> bs.rank === 2);
        const onePoints = optimalSteps.find((bs)=> bs.rank === 1);
        //ha van olyan, tehát van benne valami, akkor azzal lépünk, leütjük és adunk egy pontot a white-nak 
        if(twoPoints) {
            console.log("twoPoints");

            this.highlightedStep(twoPoints.player.parentElement, twoPoints.field); //hogy lássuk ezeket is, hogy honnan hova lép ilyenkor

            //beállítjuk a player-nek a koordinátáit a mezőére, ahova lép 
            twoPoints.player.setAttribute("row", twoPoints.field.getAttribute("row"));
            twoPoints.player.setAttribute("col", twoPoints.field.getAttribute("col"));

            /*
            remove()-val eltüntetjük a html elemet 
            rárakjuk a field-re a player-t, adunk egy pontot a white-nak és meghívjuk a this.showResults(), hogy ez látszodjon is!!! 
            meg a checkers is be kell állítani!!!!! 
            */
            //html elem törlése
            twoPoints.hit.remove();
            //rárakjuk a player-t a mezőre 
            twoPoints.field.appendChild(player);
            //növeljük a pontokat
            this.points.white++;
            //meghívjuk a showResult-ot, hogy látszon is az eredmény!!! 
            this.showResults();

            //beállítjuk a checkers attributumot, hogy tudjon majd visszafele menni is!!! 
            if(twoPoints.isCheckers) {
                twoPoints.player.setAttribute("checkers", true);
            }

            //megfordítjuk a kört és return-ölünk 
            this.round = "black";
            return;
        }

        /*
        ha nem volt ilyen, akkor meg bemegyünk a onePoint-ba, ha ilyen se lesz, akkor meghívjuk a notOptimalSteps-et és aszerint fog lépni!! 
        onePoint-ba teljesen ugyanezeket fogjuk csinálni, mint csináltuk a twoPoints-ba 
        */

        if(onePoints) {
            console.log("onePoints");

            this.highlightedStep(onePoints.player.parentElement, onePoints.field);

            //most itt elöbb apendChild-oltuk a onePoints.player-t, a sorrend nem fontos, mert ez nagyon gyorsan le fog futni és nem üti egymást 
            onePoints.field.appendChild(player);

            //beállítjuk a player attributumait a field-ére row-t meg a col-t 
            onePoints.player.setAttribute("row", onePoints.field.getAttribute("row"));
            onePoints.player.setAttribute("col", onePoints.field.getAttribute("col"));

            //megnézzük, hogy checkers-e hogy azért kapta-e az egy pontot 
            if(onePoints.isCheckers) {
                onePoints.player.setAttribute("checkers", true);
            }

            //itt meg megnézzük, hogy ütöt-e, azért kapta az egy pontot 
            if(onePoints.hit) {
                onePoints.hit.remove()
                this.points.white++;
                this.showResults();
            }

            this.round = "black";
            return;
        }

        //és mi van ha nem tud ütni, akkor lépünk egy sima lépést amit már megcsináltunk a notOptimalStep-be, szóval azt csak itt meghívjuk 
        this.notOptimalStep();

        //a highlighted-ot meg kiírütjük, hogy tudjon a másik is lépni, beletenni a dolgait 
        this.highlighted = {
            row: -1,
            col: -1,
            player: null,
            possibleSteps: []
        }

        //és itt is mindenképpen meg kell fordítani a round-ot 
        this.round = "black";
    }


    generateFields() {
        //64 mezőt kell generálni és erre csináltunk egy ciklust 
        for (let i = 1; i <= 64; i++) {
            //meghatároztuk a sor számát 
            const row = Math.ceil(i / 8);
            //meghatároztuk az oszlopok számát 
            const col = (i - 1) % 8 + 1;

            //elkészítettük a field-eket, de majd csak később kapja meg a .black-bg-t aminek kell 
            const field = document.createElement("div");
            //hogy legyen a field-nek egy olyan attributuma, hogy row="3" meg col="4" ezért mindegyiknek megcsináljuk 
            field.setAttribute("row", row);
            field.setAttribute("col", col);
            //adtunk neki egy class-t, amit csináltunk css-ben 
            field.classList.add("field");

            //létrehoztuk a player-t de még nem adtunk neki értéket, mert nem field-en lesz player!!! 
            let player = null;

            this.step(field, row, col);
            /*
            Ezzel csináltuk még a lépeseket és ez kért egy player-t, amit át tudott helyezni, és kért egy col-t meg row-t, hogy hova
            */

            /*
            itt csináljuk meg, hogy fekete-fehér legyen a tábla a páratlan soroknál a párosok lesznek a feketék meg utána pont fordítva 
            fontos, hogy itt hozzuk létre a player-t de csak úgy, hogy a row >= 7 és row <= 2, mert csak ott lesznek majd 
            */
            if (row % 2 === 1 && col % 2 === 0) {
                field.classList.add("black-bg");
                if (row <= 2 || row >= 7)
                    player.document.createElement("div");
            } else if (row % 2 === 0 && col === 1) {
                field.classList.add("black-bg");
                if (row <= 2 || row >= 7)
                    player.createElement("div");
            }

            //ha a player létezik, akkor adunk egyikeknek amik alul vannak egy white-player class-t ha meg felül akkor meg egy black-player-t
            if (player && row < 3) {
                player.classList.add("player");
                player.classList.add("white-player");
                field.appendChild(player);
            } else if (player && row >= 7) {
                player.classList.add("player");
                player.classList.add("black-player");
                field.appendChild(player);
            }

            //kap egy id-t a field, hogy tudjuk hogy mindegyik field hányadik sorban és oszlopban található
            field.id = `field-${row}-${col}`;

            /*
            és ha létezik a player, akkor megkapja ezeket, mint a field, hogy id meg a attributukmok a col és row-val 
            majd a highlight függvényben is itt adjuk át neki a player-t, amire ott szüksége lesz 
            */
            if (player) {
                player.setAttribute("row", row);
                player.setAttribute("col", col);
                this.highlightedPlayer(player); //és akkor ha már meg van a player, akkor nem kell külön bekérni a row-t meg a col-t!!

                player.id = "player" + i;
                //és akkor lesz player meg amikor elkészül, ezt lehettet volna másképpen is, mert így lesz player-64 is, pedig csak 16 player össz

                //nagyon fontos, itt adjuk meg a white.player tömbnek, hogy mik legyenek benne, az összes player aminek van white-player class-ja 
                if (player.classList.contains("white-player")) {
                    this.whitePlayers.push(player);
                }

            }

            /*
            table-be belerakjuk a field-et mindig ott kell appendChild-olni, ahol elkészült, mert pl. a player-eket két helyen raktuk bele 
            a field-be az if miatt!!! 
            */
            this.table.appendChild(field);
        }

        /*
        Ha fehér van, akkor véletleszerűen ki kell választani egy fehér mezőt és annak összegyüjteni a possibleStep-jét (tömb)
        Ha nem maradt szürés után, akkor újat választani véletlenszerűen!! 
        */
    }
    //vár egy player-t, de majd annak attributumaiból kiszedi a col-t meg a row-t is ez majd már csak az automatic-nál kell!!!!! 
    gatherPossibleSteps(player) {
        const row = parseInt(player.getAttribute("row")); //és ezt fontos, hogy parseInt-elve legyen, mert nekünk number kell nem string
        const col = parseInt(player.getAttribute("col"));

        /*
        Összegyüjtjük a field-eket, ahova alapból tud lépni meg azokat ahova, amikor checkers lesz 
        Utána a possibleSteps-be meg azokat ahova lép miután leüti és még azt is beletesszük, amit leüt, szóval ez egy objektum lesz 
        fontos itt megnézni, hogy létezik-e a field és, hogy van benne valami, mert ha igen, akkor oda nem tudunk lépni 
        meg ha ütünk azt fontos megnézni, hogy milyen színú, mert fehérrel csak feketét szeretnénk ütni 
        */
        const possibleSteps = [];
        const fields = [];
        const isCheckers = player.getAttribute("checkers") !== null;//hogyha van ilyen attributuma, ha nem null akkor isCheckers lesz!!! 

        //meghatározzuk, hogy hova tudnak melyik field-re lépni és ezt ide querySelector-val lementjük!!! 
        const field1 = document.querySelector(`#field-${row - 1}-${col + 1}`);
        const field2 = document.querySelector(`#field-${row - 1}-${col - 1}`);
        const field3 = document.querySelector(`#field-${row + 1}-${col + 1}`);
        const field4 = document.querySelector(`#field-${row + 1}-${col - 1}`);

        /*
        és ha ezek a field-ek megvannak, akkor bepush-oljuk őket a fields-be de mivel most csak a feketét nézzük, ezért fontos 
        hogy csak a field3 meg field4 az alaplépése a field1-re és 2-re csak akkor tud lépni ha isCheckers
        meg fontos, hogy ezeket az alaplépéseket is beletesszük a possibleStep-be, mert azt kell lépnie, ha nem tud ütni 

        mi a különbség if(player) vagy if(player !== null) 
        hogy az elsőben megnézi, hogy truthy value-e ami nem csak null lehet hanem undefined NaN 0 vagy empty string
        ha csak azt nézzük meg, hogy player !== null attól még lehet undefined
        tehát az elsőnél azt nézzük meg, hogy egyáltalán létezik-e, másodiknál meg azt, hogy van valami érték neki adva!!! 
        
        Ez azért, fontos, mert nem szeretnénk lemenni a pályáról és csak azt tegye bele, ami tényleg létezik!! 
        */

        //azért, fontos, hogy ezeket beleraktuk egy tömbbe, mert végigmegyünk rajtuk és megnézzük, hogy van-e valami bennük (ha igen leütés)
        if (field3) {
            fields.push(field3);
        }

        if (field4) {
            fields.push(field4);
        }

        if (isCheckers && field1 !== null) {
            fields.push(field1)
        }

        if (isCheckers && field2 !== null) {
            fields.push(field2)
        }
        //ezeket ha léteznek belerakjuk a possibleSteps-be és nincs children-je akkor a hit az biztos, hogy nem lesz, ezért null!!! 

        if (field3 !== null && field3.children.length === 0) {
            possibleSteps.push({
                field: field3,
                hit: null
            })
        }

        if (field4 !== null && field4.children.length === 0) {
            possibleSteps.push({
                field: field4,
                hit: null
            })
        }
        //ugyanígy megcsináljuk, hogyha isCheckers!!! 

        if (isCheckers && field1 !== null && field1.children.length === 0) {
            possibleSteps.push({
                field: field1,
                hit: null
            })
        }

        if (isCheckers && field2 !== null && field2.children.length === 0) {
            possibleSteps.push({
                field: field2,
                hit: null
            })
        }

        //itt megyünk a field-eken végig és itt már lesz egy child benne, mert child.length > 0 és akkor már hit is!!! 
        for (const field of fields) {
            if (field === null)
                continue; //ha nem létezik a field, akkor azt csak kihagyjuk és a continue-val megnézzük a többit ami benne van
            //hasonló, mint a return csak itt továbbmegyünk az iterációval!!! 

            const children = field.children; //betettük egy változóba, hogy ne kelljen mindig kiírni 
        }

        if (children.length > 0) {
            //tehát van a field-nek children-je!! 
            const child = children[0]; // ez pontosan, ami benne van a children[0] és ezt is beletettük egy változóba, hogy ne kelljen mindig 
            //kiírni
            /*
            lementjük a child-nak a col-ját meg row-t és ennek alapján megcsináljuk a lépésünket -> newCol  
            legalábbis csak col-t, mert a row-t azt majd a mi helyzetünkhőz képest row, ahol most mi vagyunk row
            */
            const childRow = parseInt(player.getAttribute("row"));
            const childCol = parseInt(player.getAttribure("col"));
            const newCol = childCol < col ? childCol - 1 : childCol + 1;
            //ha a child-nak a col-ja kisebb mint a mienk, akkor biztos, hogy egyel kevesebb lesz a col a child-hoz képest hova majd lépünk
            //a front meg a back lesz ahova majd lépünk 
            const front = document.querySelector(`#field-${row + 2}-${newCol}`);
            const back = document.querySelector(`#field-${row - 2}-${newCol}`);

            //megnézzük, hogy létezik-e ez a front és, hogy üres-e meg, hogy a child az black-player legyen, mert most fehérek vagyunk 
            if (front?.children.length === 0 && childRow > row && child.classList.contains("black-player")) {
                possibleSteps.push({
                    field: front,
                    hit: child
                })
            }
            //ha back a lépés, akkor nekünk isCheckers az true kell, hogy legyen 
            if (back?.children.length === 0 && childRow < row && child.classList.contains("black-player")) {
                possibleSteps.push({
                    field: back,
                    hit: child
                })
            }

        }
        //és ez az egész függvény arra lett csinálva, hogy összegyüjtsük a possibleSteps-eket, ezért itt ezt return-üljük!!! 
        return possibleSteps;
    }

    highlightedPlayer(player) {
        player.addEventListener("click", (e) => {
            e.stopPropagation();
            /*
            Csináltunk a field-re egy eventListener-t és azt állítjuk meg itt ha rákattintunk a player-re!! 
            */
            //megnézzük, hogy aktuálisan hol található a player!! 
            const row = parseInt(player.getAttribute("row"));
            const col = parseInt(player.getAttribute("col")); //fontos, hogy parseInt, mert minden amit itt megkapunk az string lesz!!! 

            if (player.classList.contains("white-player"))
                return; //mert azokkal már nem mi lépünk!!!! és nem akarjuk, hogy azokat ki tudjuk jelölni!!! 
            /*
            amikor másodszorra vagy harmadszorra ki akarunk jelöljük ki a player-t akkor már lesznek possibleStep-ek 
            és azoknak a kijelőlését le kell szedni és ugyanígy a player-bekerül egy highlighted-player-be és annak a 
            kijelőlését le akarjuk szedni, mert egy másik player-re kattinktunk, akkor ne legyen az előbbi kijelölve!! 
            */
            //fontos, hogy új player kijelölésénél leszedjük a régi kijelölését, de csak akkor ha létezik ilyen!! 
            if (this.highlighted.player) {
                this.highlighted.player.classList.remove("highlight");
            }
            //itt meg a possibleSteps-be (tömb) vannak objektumok és mindegyiknek van egy field-je és arról le kell szedni a kijelölést  
            for (const s of this.highlighted.possibleSteps) {
                s.field.classList.remove("possible-step");
            }
            //és mivel leszedtük az előzőleg kijelöltről ha volt ilyen itt rárakjuk 
            player.classList.add("highlight");

            //létrehozzuk a fields-et meg a possibleSteps-et a feketének, amivel vagyunk, teljesen ugyanaz, mint gatherPossibleSteps csak fordítva
            const possibleSteps = [];
            const fields = [];

            //lementjük az átlós field-eket, hogy itt is hozzájuk tudjunk férni!!!!!!!!!!!!!!!!!!!!!
            const field1 = document.querySelector(`#field-${row - 1}-${col + 1}`);
            const field2 = document.querySelector(`#field-${row - 1}-${col - 1}`);
            const field3 = document.querySelector(`#field-${row + 1}-${col + 1}`);
            const field4 = document.querySelector(`#field-${row + 1}-${col - 1}`);
            //megnézzük, hogy checkers-e a player
            const isCheckers = player.getAttribute("checkers") !== null;

            //kijelölésnél csak a black-player-ek számítanak!! 
            if (player.classList.contains("black-player")) {
                //alapmezők, amik a player előtt vannak 
                fields.push(field1);
                fields.push(field2);

                //player háta mögötti, akkor kell, hogyha isCheckers az true!! 
                if (isCheckers) {
                    fields.push(field3);
                    fields.push(field4);
                }

                /*
                ha checkers, akkor belerakjuk a possibleSteps-be a field3-at meg 4-et, de csak akkor ha üres mező 
                field.children.length === 0; -> üres mező!!! 
                */
                if (isCheckers && field3 !== null && field3.children.length === 0) {
                    possibleSteps.push({
                        field: field3,
                        hit: null
                    })
                }

                if (isCheckers && field4 !== null && field4.children.length === 0) {
                    possibleSteps.push({
                        field: field4,
                        hit: null
                    })
                }

                //meg belerakjuk a simákat is amkor nem checkers!!

                if (field1 !== null && field1.children.length === 0) {
                    possibleSteps.push({
                        field: field1,
                        hit: null
                    })
                }
                if (field2 !== null && field2.children.length === 0) {
                    possibleSteps.push({
                        field: field2,
                        hit: null
                    })
                }

            }

            for (const field of fields) {
                if (field === null)
                    continue;

                const children = field.children;
                /*
                ha van az adott field-nek child-ja, akkor azt le tudjuk ütni és nem a field-re lépünk, hanem egyel tovább átlósan 
                */
                if (children.length > 0) {
                    const child = children[0];
                    const childCol = parseInt(child.getAttribute("col"));
                    const childRow = parseInt(child.getAttribute("row"));
                    /*
                    A child poziciójától függ, hogy jobbra vagy balra lépünk. Ha a child tölünk balra akkor még egyet balra lépünk ha meg 
                    jobbra, akkor még egyett jobbra!!! 
                    */
                    const newCol = childCol < col ? childCol - 1 : childCol + 1;
                    /*
                    Ha üthetünk akkor hozzánk képest (a player-hez képest) plusz vagy minusz kettő a row
                    */
                    const back = document.querySelector(`field-${row + 2}-${newCol}`);
                    const front = document.querySelector(`field-${row - 2}-${newCol}`);
                    /*
                    Ha tudunk ütni és a front-ban nincs senki (a front ahova lépénk ha üres)
                    Akkor igaz ez, hogyha annak, amit le akarunk ütni a row-ja kisebb, mint a miénk, ilyenkor a front 
                    mezőre léphetünk, mert az van a megfelelő irányban!!!!!!!!! 
                    */
                    if (front?.children.length === 0 && child?.classList.contains("white-player") && childRow < row) {
                        possibleSteps.push({
                            field: front,
                            hit: child
                        })
                    }
                    if (isCheckers && back?.children.length === 0 && child?.classList.contains("white-player") && childRow > row) {
                        possibleSteps.push({
                            field: back,
                            hit: child
                        })
                    }

                }
            }

            /*
            Kijelöljük a lehetséges lépéseket!! 
            */
            for (const step of possibleSteps) {
                step.field.classList.add("possible-step");
            }

            //meghatározzuk a hoghlighted-ba, hogy hova léphet a player!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            this.highlighted = {
                row,
                col,
                player,
                possibleSteps
            }
        });
    }

    step(field, row, col) {
        //rákattintunk a mezőre 
        field.addEventListener("click", () => {
            let canMove = false;

            /*
            ha a highlight.player null, akkor nincs kijelölve egyetlen player sem 
            ilyenkor kilépünk az event-ből!!! 
            */
            if (this.highlighted.player === null)
                return;

            /*
            Végigmegyünk a lehetséges lépéseken és megnézzük, hogy az adott row-val és col-val van-e mező a lépések között 
            ha van akkor canMove true lesz!!!! és ha ráadásul a hit nem null, akkor leszedjük a player-t, amit leüttöttünk 
            és kitöröljük a whitePlayers tömbböl is 
            tehát ki kell törölni a remove()-val a html-ből és kiszedni a tömbböl is!!!!!!!!!!!!!!!
            */

            this.highlighted.possibleSteps.forEach((s) => {
                const id = `field-${row}-${col}`;

                if (s.field.id === id) {
                    canMove = true;

                    if (s.hit) {
                        this.points[this.round]++; //ha van hit, akkor növeljük azoknak a pontjainak a számát, amilyen körben éppen vagyunk 
                        /*
                        ha van olyan id-jű a whitePlayers-ek között, mint itt a highlighted-ba, amire csináltuk a forEach-et, akkor azt töröljük 
                        */
                        const index = this.whitePlayers.findIndex(wp => wp.id === s.hit.id); //!!!!!!!
                        this.whitePlayers.splice(index, 1);
                        //eltávolítás a html szerkezetből 
                        s.hit.remove();
                    }
                }
                /*
mindegyik mezőről leszedjük a possibleStep-et, hogy ne legyen kijelölve!! 
*/
                s.field.classList.remove("possible-step");
            });

            this.highlighted.possibleSteps = [];
            //kiürítjük a possibleStep-et

            /*
            Ha nem tud lépni, akkor erre figyelmeztetjük a játeékost.
            A player-ről is leszedjük a highlight class-t 
            */
            if (!canMove) {
                this.highlighted.player.classList.remove("highlight");
                alert("Oda nem léphetsz!");
            }

            /*
            ha a sor egy, akkor checkers lesz a player -> ez több volt, amikor még fehérnek meg a feketének is meg kellett határozni
            */
            if (row === 1) {
                this.highlighted.player.setAttribute("checkers", true);
            }
            /*
            if(this.round === "black" && row === 1 || this.round === "white" && row === 8) {
                this.highlighted.player.setAttribute("checkers", true);
            }
            */
            //megfordul a kör 
            this.round === this.round === "black" ? "black" : "white";
            /*
            ez nagyon fontos ? :-os dolog, mint a const childCol = childCol > col : childCol + 1 : childCol - 1;
            */
            //ez nagyon fontos itt rakjuk bele az új mezőbe a player-t az appendChild-val!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            field.appendChild(this.highlighted.player);
            //levesszül róla a highlight class-t, hogy már ne legyen kijelölve ha benne van az új mezőbe
            this.highlighted.player.classList.remove("highlight");
            /*
            Ez is nagyon fontos, hogy megadjuk a player-nek az új col-t illetve a row-t is!!!! annak a mezőnek, amire rákattintunk 
            és ugye abba is teszzük be az appendChild-val, mert a field-re van készítve az event!!!!! 
            */
            this.highlighted.player.setAttribute("row", row);
            this.highlighted.player.setAttribute("col", col);

            //kiűrítjük a highlighted objektumot ha már megtörtént a lépés!!!!!
            this.highlighted = {
                row: -1,
                col: -1,
                player: null,
                possibleSteps: []
            }

            //csekkoljuk az eredményt 
            this.showResults();
            //nagyon fontos, meghívjuk a fehér automatikus lépését, mert mi itt már léptünk!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            this.automaticStep();
        });
    }
}

new Checkers();