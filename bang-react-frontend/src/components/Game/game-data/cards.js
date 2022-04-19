import { bangInfo, barrelInfo, beerInfo, catBalouInfo, duelInfo, dynamiteInfo, gatlingInfo, generalStoreInfo, indiansInfo, missedInfo, panicInfo, saloonInfo, scopeInfo, stageCoachInfo, wellsFargoInfo } from "../CardInfos";

   // KÉK KÁRTYÁK ---------------------------------------------------------------

    //Hordó
    const barrels = [         
        {
            type : 'barrel',
            pattern : 'spades',
            number : 12,
            missedWhen: 'heart',
            info : barrelInfo
        },
        {
            type : 'barrel',
            pattern : 'spades',
            number : 13,
            missedWhen: 'heart',
            info : barrelInfo
        }
    ];

    //Dinamit
    const dynamites = [
        {
            type : 'dynamite',
            pattern : 'hearts',
            number : 2,
            exploding : {
                from : 2,
                to : 9,
                pattern : 'spades'
            },
            info : dynamiteInfo
        }
    ];

    //Börtön
    const jails = [         
        {
            type : 'jail',
            pattern : 'spades',
            number : 11,
            free : 'hearts'
        },
        {
            type : 'jail',
            pattern : 'spades',
            number : 10,
            free : 'hearts' //NOT SURE, CHECK CARD
        },
        {
            type : 'jail',
            pattern : 'hearts',
            number : 4,
            free : 'hearts'  //NOT SURE, CHECK CARD
        }
    ];

    //Musztáng
    const mustangs = [         
        {
            type : 'mustang',
            pattern : 'hearts',
            number : 8
        },
        {
            type : 'mustang',
            pattern : 'hearts',
            number : 9
        }
    ];

    //Fegyverek
    const weapons = [
        {
            type : 'remington',
            range : 3,
            pattern : 'clubs',
            number : 13
        },
        {
            type : 'carabine',
            range : 4,
            pattern : 'clubs',
            number : 14
        },
        {
            type : 'schofield',
            range : 2,
            pattern : 'clubs',
            number : 11
        },
        {
            type : 'schofield',
            range : 2,
            pattern : 'clubs',
            number : 12
        },
        {
            type : 'schofield',
            range : 2,
            pattern : 'spades',
            number : 13
        },
        {
            type : 'volcanic',
            range : 1,
            pattern : 'clubs',
            number : 10
        },
        {
            type : 'volcanic',
            range : 1,
            pattern : 'spades',
            number : 10
        },
        {
            type : 'winchester',
            range : 5,
            pattern : 'spades',
            number : 8
        },
    ];

    // BARNA KÁRTYÁK ---------------------------------------------------------------

    //Bangek
    const bangs = [
        {
            type : 'bang',
            pattern : 'spades',
            number : 14,
            info : bangInfo
        },
        {
            type : 'bang',
            pattern : 'hearts',
            number : 12,
            info : bangInfo
        },
        {
            type : 'bang',
            pattern : 'hearts',
            number : 13,
            info : bangInfo
        },
        {
            type : 'bang',
            pattern : 'hearts',
            number : 14,
            info : bangInfo
        }
    ];

    for (let i = 2; i < 15; i++) {
        bangs.push({
            type : 'bang',
            pattern : 'diamonds',
            number : i,
            info : bangInfo
        });
    }

    for (let i = 2; i < 10; i++) {
        bangs.push({
            type : 'bang',
            pattern : 'clubs',
            number : i,
            info : bangInfo
        });
    }

    //Sörök
    const beers = [];
    for (let i = 6; i < 12; i++) {
        beers.push({
            type : 'beer',
            pattern : 'hearts',
            number : i,
            info : beerInfo
        });
    }

    //Cat Balou
    const catbaloues = [
        {
            type : 'catbalou',
            pattern : 'hearts',
            number : 13,
            info : catBalouInfo
        }
    ];

    for (let i = 9; i < 12; i++) {
        catbaloues.push({
            type : 'catbalou',
            pattern : 'diamonds',
            number : i,
            info : catBalouInfo
        });
    }

    //Távcső
    const scopes = [
        {
            type : 'scope',
            pattern : 'spades',
            number : 14,
            info : scopeInfo
        }
    ];

    //Párbaj
    const duels = [
        {
            type : 'duel',
            pattern : 'diamonds',
            number : 12,
            info : duelInfo
        },
        {
            type : 'duel',
            pattern : 'spades',
            number : 11,
            info : duelInfo
        },
        {
            type : 'duel',
            pattern : 'clubs',
            number : 8,
            info : duelInfo
        }
    ];

    //Gatling
    const gatlings = [
        {
            type : 'gatling',
            pattern : 'hearts',
            number : 10,
            info : gatlingInfo
        }
    ];

    //Szatócsbolt
    const generalStores = [
        {
            type : 'generalstore',
            pattern : 'clubs',
            number : 9,
            info : generalStoreInfo
        },
        {
            type : 'generalstore',
            pattern : 'spades',
            number : 12,
            info : generalStoreInfo
        }
    ];

    //Indiánok
    const indians = [
        {
            type : 'indians',
            pattern : 'diamonds',
            number : 13,
            info : indiansInfo
        },
        {
            type : 'indians',
            pattern : 'diamonds',
            number : 14,
            info : indiansInfo
        }
    ];

    //Nem talált! lapok
    const missedCards = [];

    for (let i = 10; i < 15; i++) {
        missedCards.push({
            type : 'missed',
            pattern : 'clubs',
            number : i,
            info : missedInfo
        });
    }

    for (let i = 2; i < 9; i++) {
        missedCards.push({
            type : 'missed',
            pattern : 'spades',
            number : i,
            info : missedInfo
        });
    }

    //Pánikok
    const panics = [
        {
            type : 'panic',
            pattern : 'hearts',
            number : 11,
            info : panicInfo
        },
        {
            type : 'panic',
            pattern : 'hearts',
            number : 12,
            info : panicInfo
        },
        {
            type : 'panic',
            pattern : 'hearts',
            number : 14,
            info : panicInfo
        },
        {
            type : 'panic',
            pattern : 'diamonds',
            number : 8,
            info : panicInfo
        }
    ];

    //Kocsma
    const saloons = [
        {
            type : 'saloon',
            pattern : 'hearts',
            number : 5,
            info : saloonInfo
        }
    ];

    //Postakocsik
    const stageCoaches = [
        {
            type : 'stagecoach',
            pattern : 'spades',
            number : 9,
            info : stageCoachInfo
        },
        {
            type : 'stagecoach',
            pattern : 'spades',
            number : 9,
            info : stageCoachInfo
        }
    ];

    //Wells Fargo
    const wellsFargoes = [
        {
            type : 'wellsfargo',
            pattern : 'hearts',
            number : 3,
            info : wellsFargoInfo
        }
    ];

    //Karakterek
    const characters = [
        {
            name : 'Bart Cassidy',
            specialAbility : 'Valahányszor eltalálják, húz egy lapot.',
            hp : 4
        },
        {
            name : 'Willy The Kid',
            specialAbility : 'Akárhány BANG! kártyát kijátszhat.',
            hp : 4
        },
        {
            name : 'El Gringo',
            specialAbility : 'Valahányszor eltalálják, húz egy lapot annak a játékosnak a kezéből, aki eltalálta.',
            hp : 3
        },
        {
            name : 'Paul Regret',
            specialAbility : 'A többi játékos 1-gyel messzebbről látja.',
            hp : 3
        },
        {
            name : 'Pedro Ramirez',
            specialAbility : 'Első lapját a dobott lapok pakli tetejéről is húzhatja.',
            hp : 4
        },
        {
            name : 'Rose Doolan',
            specialAbility : '1-gyel közelebbről látja a többi játékost.',
            hp : 4
        },
        {
            name : 'Sid Ketchum',
            specialAbility : 'Ha eldob 2 lapot, visszanyer 1 életpontot.',
            hp : 4
        }

        // Később bővíthető
    ];

    export { 
        barrels,
        dynamites,
        jails,
        mustangs,
        weapons,
        bangs,
        beers,
        catbaloues,
        scopes,
        duels,
        gatlings,
        generalStores,
        indians,
        missedCards,
        panics,
        saloons,
        stageCoaches,
        wellsFargoes,
        characters
    }