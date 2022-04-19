import { bangs, barrels, beers, catbaloues, characters, duels, dynamites, gatlings, generalStores, indians, jails, missedCards, mustangs, panics, saloons, scopes, stageCoaches, weapons, wellsFargoes } from "../components/Game/game-data/cards";
import { isGameOver, selectRolesBasedOnNumberOfPlayers } from "../components/Game/GameRules";


let initialState = {
    activePlayer : {},
    players : [],
    roomId : '',
    waitingPlayers : [],
    playersBeingAttacked : [],
    deadPlayers : [],
    roles : [],
    drawingDeck : [],
    throwingDeck: [],
    pickCardsFrom : [],
    gamePhase : '',
    gameMaster : '',
    isPlaying : false
}


const createPlayer = (waitingPlayer, length) => {
    return {
        id: length,
        isActive : false,
        user : waitingPlayer.username,
		role : '',
		health : 0,
        maxHealth : 0,
		character : { name : '', specialAbility : '' },
        ranges : [],
		cardsInHand : [],
		cardsOnTable : [], //Alapból Colt-45
        numberOfDrawnCards : 0,
        range : 1, // Colt-45
		isInJail : false,
		hasDynamite : false,
        playedABangCard : false,
        isRobot : waitingPlayer.isRobot
    }
}

const shuffle = (array) => {
    let shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled;
}

const calculateRanges = (newState) => {

    let alivePlayers = [];

    for (let player of newState.players) {
        if (player.health > 0) {
            alivePlayers.push(player);
        } else {
            newState.deadPlayers.push(player)
        }
    }

    newState.players = alivePlayers;

    for (let myId = 0; myId < newState.players.length; myId++) {
        newState.players[myId].ranges = [];
        let half = newState.players.length / 2;
        let countHelper = newState.players.length % 2 === 0 ? Math.floor(newState.players.length / 2)-1 : Math.floor(newState.players.length / 2);
        
        for (let compareableId = 0; compareableId < newState.players.length; compareableId++) {

            let difference = Math.abs(myId - compareableId);

            if ( difference <=  half) {
                newState.players[myId].ranges.push({
                    playerName : newState.players[compareableId].user,
                    rangeFromMe : difference
                })
            } else {
                if (myId > half) {
                    newState.players[myId].ranges.push({
                        playerName : newState.players[compareableId].user,
                        rangeFromMe : (newState.players.length - myId) + compareableId
                    })
                } else {
                    newState.players[myId].ranges.push({
                        playerName : newState.players[compareableId].user,
                        rangeFromMe : countHelper
                    })
                    countHelper = countHelper -1;
                }
            } 
        }
    }
    return newState;
}

const initializeDeck = () => {
//
    //let roleCards = selectRolesBasedOnNumberOfPlayers();
    //let characterCards = [];
    //https://bang.dvgiochi.com/cardslist.php?id=1#q_result
    //https://tarsasjatekrendeles.hu/shop_ordered/7237/pic/Gemklub/bang_jatekszabaly.pdf

    let deck = [
        ...barrels,
        ...dynamites,
        ...jails,
        ...mustangs,
        ...weapons,
        ...bangs,
        ...beers,
        ...catbaloues,
        ...scopes,
        ...duels,
        ...gatlings,
        ...generalStores,
        ...indians,
        ...missedCards,
        ...panics,
        ...saloons,
        ...stageCoaches,
        ...wellsFargoes
    ];

    return deck;
}

const initializeDeckFromThrowingDeck = (newState) => {
    newState.drawingDeck = shuffle([...newState.throwingDeck]);
    newState.throwingDeck = [];
    return newState;
}

const nextActivePlayer = (newState) => {
    for (let i = 0; i < newState.players.length; i++){
        if (newState.players[i].isActive){

            if (!newState.gamePhase.includes('ACTION_')) {
                newState.players[i].playedABangCard = false;
                newState.players[i].numberOfDrawnCards = 0;
            }

            newState.players[i].isActive = false;

            if (i + 1 === newState.players.length){
                //Első élő játékos megtalálása az elejétől, mivel ez egy kör
                for (let j = 0; j < newState.players.length; j++) {
                    if (newState.players[j].health > 0) {
                        newState.players[j].isActive = true;
                        newState.activePlayer = newState.players[j];
                        return newState;
                    }
                }
            } else {
                //Első élő játékos megtalálása a játékos után
                for (let j = i+1; j < newState.players.length; j++) {
                    if (newState.players[j].health > 0) {
                        newState.players[j].isActive = true;
                        newState.activePlayer = newState.players[j];
                        return newState;
                    }
                }
            }

        }
    }
}

const mergePlayersWithActive = (newState) => {
    //Megkeresni és az aktív placeholder játékos beállított paramétereit átadni
    for (let player of newState.players){
        if (player.user === newState.activePlayer.user) {
            player = newState.activePlayer;
            return newState;
        }
    }
}

const mergePlayerWithPlayers = (newState, modifiedPlayer) => {
    for (let player of newState.players){
        if (player.user === modifiedPlayer.user) {
            player = modifiedPlayer;
        }
    }
    return newState;
}

const areCardsEqual = (card1, card2) => {
    return (card1.type === card2.type && card1.pattern === card2.pattern && card1.number === card2.number);
}

const randomNumberBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const canBeerSaveHim = (newState, index) => {
        //Ha meghalna megnézi, hogy van-e sör nála ami megmentheti az életét

        const cardIndex = newState.players[index].cardsInHand.findIndex(card => card.type === 'beer');

        if (cardIndex !== -1) {
            //Ha van sör ami megmentheti, felhasználja automatikusan

                newState.newState.players[index].health++;

                //Kivenni a kártyát és a dobópaklira tenni
                newState.throwingDeck.push(newState.players[index].cardsInHand.splice(cardIndex, 1)[0]);

                console.log(newState.players[index].user + ': Thank god I had that last beer, it saved me from dying!');
        } else {
            //Ha nincs nála sör, akkor meghalt
            console.log(newState.players[index].user + ': Im dead now. :(');
            newState = calculateRanges(newState);
        }
    return newState;
}

const setPlayersWithBarrelStatus = (newState) =>{
    let barrels = [];

    //Hordók leellenőrzése minden játékoson
    for (let player of newState.players) {
        if (player.user !== newState.activePlayer.user) {
            const barrelIndex = player.cardsOnTable.findIndex(card => card.type === 'barrel');

            if (barrelIndex !== -1) {
                //Van
                barrels.push({
                    username : player.user,
                    hasBarrel : true,
                    missedWhen : player.cardsOnTable[barrelIndex].missedWhen
                })
            } else {
                //Nincs barrelje
                barrels.push({
                    username : player.user,
                    hasBarrel : false
                })
            }
        }
    }
    return barrels;
}

const gatlingMissedAction = (newState, action) => {
    //Itt már biztos, hogy in range a target

    //Mindenki megtámadva aki nem az aktív játékos
    for (let player of newState.players) {
        if (player.user !== newState.activePlayer.user) {
            newState.playersBeingAttacked.push(player.user);
        }
    }

    let playersWithBarrelStatus = setPlayersWithBarrelStatus(newState);

    for (let player of playersWithBarrelStatus) {
        if (player.hasBarrel) {
            //Lehet opt. később, hogy ne kelljen mindig megnézni, hogy üres-e

            if (newState.drawingDeck.length-1 === 0) {
                newState = initializeDeckFromThrowingDeck(newState);
            }

            let drawnCard = newState.drawingDeck.pop();
            newState.throwingDeck.push(drawnCard);

            if (drawnCard.pattern === player.barrelMissedWhen) {
                //Itt valami jelzés, hogy a hordó kivédte, mondjuk majd egy tájékoztató modal 2mp-re
                console.log(player.username + ': A gatling missed by:' + newState.activePlayer.user + ', thanks barrel!');

                //Melyik játékost kell kivenni a beingAttacked listából
                const removeIndex = newState.playersBeingAttacked.findIndex(username => username === player.username);

                //Kivenni a játékost, mivel a hordó kivédte
                newState.playersBeingAttacked.splice(removeIndex, 1);

                if (newState.playersBeingAttacked.length === 0) {
                    newState.gamePhase = 'ACTION';
                }

                return newState;
            } else {
                console.log('Barrel didnt save this gatling, better luck next time!');
                //Nincs barrelje, védekezhet Missed carddal

                //Melyik játékos ez akit megtámadtak
                const index = newState.players.findIndex(p => p.user === player.username);

                if (newState.players[index].cardsInHand.some(card => card.type === 'missed')) {
                    //Van missed card, lehetőséget kap, hogy védekezzen
                    console.log(newState.players[index].user + ': Van Nem talált kártyám, felhasználhatom a gatling ellen!');

                    //.playersBeingAttacked.push(newState.players[index].user);

                    newState.gamePhase = 'BANG_OR_MISSED';

                    return newState;

                }

                //Nincs missed cardja, automatikusan -1 élet

                // VAGY Speciális kivételek ide Pl. speciális képesség
                //
                //
                //Egy életpont vesztése
                newState.players[index].health--;   
                
                if (newState.players[index].health === 0 && newState.players.length > 2) {
                    newState = canBeerSaveHim(newState, index); //megmentette-e tájékoztatás
                }

            } 
        } else {

            //Nincs barrelje, csak Missed carddal védekezhet

            //Melyik játékos ez akit megtámadtak
            const index = newState.players.findIndex(p => p.user === player.username);

            if (newState.players[index].cardsInHand.some(card => card.type === 'missed')) {
                //Van missed card, lehetőséget kap, hogy védekezzen
                console.log(newState.players[index].user + ': Van Nem talált kártyám, felhasználhatom a gatling ellen!');

                newState.gamePhase = 'BANG_OR_MISSED';

                return newState;

            }

            //Nincs missed cardja, automatikusan -1 élet

                // VAGY Speciális kivételek ide Pl. speciális képesség
                //
                //
                //Egy életpont vesztése
                newState.players[index].health--;   
                
                //Melyik játékost kell kivenni a beingAttacked listából
                const removeIndex = newState.playersBeingAttacked.findIndex(username => username === player.username);

                //Kivenni a játékost, elszenvedett egy sebzést
                newState.playersBeingAttacked.splice(removeIndex, 1);

                if (newState.players[index].health === 0 && newState.players.length > 2) {
                    newState = canBeerSaveHim(newState, index); //megmentette-e tájékoztatás
                }
        }
    }

    newState.gamePhase = 'ACTION';

    if (isGameOver(newState.players).isOver) {
        newState.isPlaying = false;
    }

    return newState;
}

const bangMissedAction = (newState, action, attackAction) => {
    //Itt már biztos, hogy in range a target

    //Hordó leellenőrzése
    let hasBarrel = false;
    let barrelMissedWhen = '';

    for (let tableCard of action.payload.player.cardsOnTable) {
        if (tableCard.type === 'barrel') {
            hasBarrel = true;
            barrelMissedWhen = tableCard.missedWhen;
            break;
        }
    }

    if (hasBarrel) {
        //Lehet opt. később, hogy ne kelljen mindig megnézni, hogy üres-e

        if (newState.drawingDeck.length-1 === 0) {
            newState = initializeDeckFromThrowingDeck(newState);
        }

        let drawnCard = newState.drawingDeck.pop();
        newState.throwingDeck.push(drawnCard);

        if (drawnCard.pattern === barrelMissedWhen) {
            //Itt valami jelzés, hogy a hordó kivédte, mondjuk majd egy tájékoztató modal 2mp-re
            console.log(action.payload.player.user + ': A shot missed by:' + newState.activePlayer.user + ', thanks barrel!');

            //Melyik játékost kell kivenni a beingAttacked listából
            const removeIndex = newState.playersBeingAttacked.findIndex(username => username === action.payload.player.user);

            //Kivenni a játékost, mivel a hordó kivédte
            newState.playersBeingAttacked.splice(removeIndex, 1);

            if (newState.playersBeingAttacked.length === 0) {
                newState.gamePhase = 'ACTION';
            }

            return newState;
        } else {
            console.log('Barrel didnt save, better luck next time!');
        //Nincs barrelje, védekezhet Missed carddal

        //Melyik játékos ez akit megtámadtak
        const index = newState.players.findIndex(player => player.user === action.payload.player.user);

        if (newState.players[index].cardsInHand.some(card => card.type === 'missed')) {
            //Van missed card, lehetőséget kap, hogy védekezzen
            console.log(newState.players[index].user + ': Van Nem talált kártyám, felhasználhatom!');

            if (newState.activePlayer.character.name !== 'Willy The Kid' &&  !newState.activePlayer.cardsOnTable.some(card => card.type === 'volcanic')) {
                newState.activePlayer.playedABangCard = true;
            } 

            newState.playersBeingAttacked.push(newState.players[index].user);

            newState.gamePhase = 'BANG_OR_MISSED';

            return newState;

            }

            //Nincs missed cardja, automatikusan -1 élet

            // VAGY Speciális kivételek ide Pl. speciális képesség
            //
            //
            //Egy életpont vesztése
            newState.players[index].health--;   
            
            if (newState.players[index].health === 0 && newState.players.length > 2) {
                newState = canBeerSaveHim(newState, index); //megmentette-e tájékoztatás
            }
        } 
    } else {

        //Nincs barrelje, védekezhet Missed carddal

        //Melyik játékos ez akit megtámadtak
        const index = newState.players.findIndex(player => player.user === action.payload.player.user);

        if (newState.players[index].cardsInHand.some(card => card.type === 'missed')) {
            //Van missed card, lehetőséget kap, hogy védekezzen
            console.log(newState.players[index].user + ': Van Nem talált kártyám, felhasználhatom!');

            if (newState.activePlayer.character.name !== 'Willy The Kid' &&  !newState.activePlayer.cardsOnTable.some(card => card.type === 'volcanic')) {
                newState.activePlayer.playedABangCard = true;
            } 

            newState.playersBeingAttacked.push(newState.players[index].user);

            newState.gamePhase = 'BANG_OR_MISSED';

            return newState;

        }

        //Nincs missed cardja, automatikusan -1 élet

            // VAGY Speciális kivételek ide Pl. speciális képesség
            //
            //
            //Egy életpont vesztése
            newState.players[index].health--;   
            
            if (newState.players[index].health === 0 && newState.players.length > 2) {
                newState = canBeerSaveHim(newState, index); //megmentette-e tájékoztatás
            }
    }

    newState.gamePhase = 'ACTION';

    // VAGY SPECIÁLIS KIVÉTELEK IDE PL. Volcanic vagy Billie
    //
    //

    if (newState.activePlayer.character.name !== 'Willy The Kid' &&  !newState.activePlayer.cardsOnTable.some(card => card.type === 'volcanic')) {
        newState.activePlayer.playedABangCard = true;
    } 

    if (isGameOver(newState.players).isOver) {
        newState.isPlaying = false;
    }

    return newState;
}

const game = (state = initialState, action) => {
    switch (action.type) {
        
        case 'INITIALIZE_GAME' : {
            let newState = {...state};

            for (let waitingPlayer of newState.waitingPlayers) {
                let player = createPlayer(waitingPlayer, newState.players.length);
                newState.players.push(player);
            }

            newState.isPlaying = true;

            //Játékfázis
            newState.gamePhase = 'CHOOSING_ROLE';

            //Pakli
            let tempDeck = initializeDeck();
            newState.drawingDeck = shuffle(tempDeck);

            //Roleok meghatározása - választás az elején
            newState.roles = selectRolesBasedOnNumberOfPlayers(newState.players.length);
            newState.roles = shuffle(newState.roles);

            //Karakterek hozzárendelése - egyelőre automatikus, később lehet választás az elején
            let shuffledCharacters = shuffle(characters)
            let charactersToAssign = shuffledCharacters.slice(0, newState.players.length);

            //Első játékos active - jelenleg mindenkinek önmaga
            newState.players[0].isActive = true;
            newState.activePlayer = newState.players[0];

            for (let i = 0; i < newState.players.length; i++) {

                //Karakter sorsolása
                newState.players[i].character = charactersToAssign[i];

                //Karakter szerint élet beállítása
                newState.players[i].health = newState.players[i].character.hp;
                newState.players[i].maxHealth = newState.players[i].health;
                
                //Élet szerint kártyák száma - választáskor ez serif + 1 külön method
                for (let j = 0; j < newState.players[i].health; j++) {
                    newState.players[i].cardsInHand.push(newState.drawingDeck.pop());
                }

                if (newState.players[i].isRobot) {
                    newState.players[i].user = newState.players[i].character.name;
                }
                
            }
            
            //Rangek kiszámítása - kör alakú asztal
            newState = calculateRanges(newState);

            window.channel.whisper('StateChanged', {
                state: newState, 
                roomId : newState.roomId
            });

            return newState;
        }

        case 'SYNC_STATE' : {
            let newState = {...action.payload.state};
            return newState;
        }

        case 'SET_WAITING_PLAYERS' : {
            let newState = {...state};

            newState.waitingPlayers = [];

            console.log('payload:', action.payload);

            if (action.payload.length === 1) {
                newState.gameMaster = action.payload[0].username;
            }

            for (let player of action.payload) {
                newState.waitingPlayers.push({
                    username : player.username,
                    roomId : player.roomId,
                    isRobot : player.isRobot
                });
            }

            return newState;

        }

        case 'ADD_WAITING_PLAYER' : {

            let newState = {...state};

            if (newState.waitingPlayers.length === 0) {
                newState.roomId = action.payload.roomId;
            }

            newState.waitingPlayers.push({
                username : action.payload.username,
                roomId : action.payload.roomId,
                isRobot : action.payload.isRobot
            });

            if (newState.gameMaster === localStorage.getItem('auth_username')) {
                window.channel.whisper('StateChanged', {
                    state: newState, 
                    roomId : newState.roomId
                });
            }

            return newState;
        }

        case 'ADD_ROBOT_WAITING_PLAYER' : {

            let newState = {...state};

            newState.waitingPlayers.push({
                username : action.payload.username,
                roomId : action.payload.roomId,
                isRobot : action.payload.isRobot
            });

            window.channel.whisper('StateChanged', {
                state: newState, 
                roomId : action.payload.roomId
            });

            return newState;
        }

        case 'REMOVE_WAITING_PLAYER' : {

            let newState = {...state};

            const index = newState.waitingPlayers.findIndex(player => player.username === action.payload.username);

            if (index > -1) {
                newState.waitingPlayers.splice(index, 1);
            }

            return newState;
        }

        case 'ASSIGN_ROLE' : {
            let newState = {...state};
            
            for(let player of newState.players) {

                if (player.user === action.payload.username){
                    player.role = action.payload.role;
                    const index = newState.roles.indexOf(action.payload.role);
                    newState.roles.splice(index, 1);

                    //Sheriff +1 élettel rendelkezik
                    if (player.role === 'sheriff') {
                        player.health++;
                        player.maxHealth++;
                        player.cardsInHand.push(newState.drawingDeck.pop());
                    }

                    newState = nextActivePlayer(newState);

                    window.channel.whisper('StateChanged', {
                        state: newState, 
                        roomId : newState.roomId
                    });

                    return newState;
                }

            }

            //Ide soha nem jut el
            return state;
        }

        case 'ADD_PICKED_CARD' : {

            let newState = {...state};

            //Hol a választott kártya:
            const index = newState.pickCardsFrom.findIndex(card => {
                return areCardsEqual(card, action.payload.card);
            });

            //Kivenni a kártyát és a dobópaklira tenni
            newState.activePlayer.cardsInHand.push(newState.pickCardsFrom.splice(index, 1)[0]);
            
            if (newState.pickCardsFrom.length === 0) {
                newState.gamePhase = 'ACTION';
            }

            newState = nextActivePlayer(newState);

            window.channel.whisper('StateChanged', {
                state: newState, 
                roomId : newState.roomId
            });

            return newState;

        }

        case 'SET_GAME_PHASE' : {

            let newState = {...state, gamePhase : action.payload};

            window.channel.whisper('StateChanged', {
                state: newState, 
                roomId : newState.roomId
            });

            return newState;
        }

        case 'START_GAME' : {
            let newState = {...state};

            newState.gamePhase = 'DRAWING';

            for (let player of newState.players) {

                if (player.role !== 'sheriff' && player.isActive) {
                    player.isActive = false;
                }

                if (player.role === 'sheriff') {
                    newState.activePlayer = player;
                    player.isActive = true;
                }
            }

            window.channel.whisper('StateChanged', {
                state: newState, 
                roomId : newState.roomId
            });

            return newState;
        }

        case 'DRAW' : {
            // SOCKET ID == MIÉNK AKKOR CSAK MAJD if (newState.activePlayer.user === localStorage.getItem('auth_username')) {
            let newState = {...state};

            if (newState.gamePhase === 'DRAWING') {
                //Ha 1. húzófázisban vagyunk
                    if (newState.activePlayer.numberOfDrawnCards < 2) {
                        //Ha én vagyok az aktív játékos és nem húztam még 2-t
                        switch (action.payload) {
                            case 'DECK' : {

                                //Pakliból : kivesz egyet, a kezembe teszi
                                newState.activePlayer.cardsInHand.push(newState.drawingDeck.pop());
                                newState.activePlayer.numberOfDrawnCards += 1; 

                                //2. Fázis: kijátszás, ha megvolt az első fázis
                                if (newState.activePlayer.numberOfDrawnCards === 2) {
                                    newState.gamePhase = 'ACTION';
                                }

                                if ( newState.drawingDeck.length === 0 ) {
                                    newState = initializeDeckFromThrowingDeck(newState);
                                }

                                window.channel.whisper('StateChanged', {
                                    state: newState, 
                                    roomId : newState.roomId
                                });

                                return newState;
                                
                            }
                            default : return newState; 
                        }
                    }

                //}

                //Ha nincs teendő
                return state;
            }

            return state;

        }

        case 'NEXT_PLAYER' : {
            let newState = {...state};
            newState.gamePhase = 'DRAWING';

            newState = nextActivePlayer(newState);

            window.channel.whisper('StateChanged', {
                state: newState, 
                roomId : newState.roomId
            });

            return newState;
        }

        case 'ACTION_CARD_EFFECT' : {
            
            // SOCKET ID == MIÉNK && ISACTIVE AKKOR CSAK MAJD if (newState.activePlayer.user === localStorage.getItem('auth_username')) {

            if (state.gamePhase.includes('ACTION') || action.payload.type === 'missed') {

                let newState = {...state};

                switch(action.payload.type) {
                    case 'beer' : {
                        //Ha nem max életen vagyunk
                        if(newState.activePlayer.health < newState.activePlayer.maxHealth && newState.players.length > 2) {
                    
                            newState.activePlayer.health++;

                            //Melyik kártyát kell kivenni:
                            const index = newState.activePlayer.cardsInHand.findIndex(card => {
                                return areCardsEqual(card, action.payload);
                            });
    
                            //Kivenni a kártyát és a dobópaklira tenni
                            newState.throwingDeck.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);
    
                            window.channel.whisper('StateChanged', {
                                state: newState, 
                                roomId : newState.roomId
                            });

                            return newState;
                        }

                        return newState;
                    }

                    case 'barrel' : {

                        if (!newState.activePlayer.cardsOnTable.some(card => card.type === 'barrel')) {
                            //Ha nincs még hordó lerakva

                            //Melyik kártyát kell kivenni:
                            const index = newState.activePlayer.cardsInHand.findIndex(card => {
                                return areCardsEqual(card, action.payload);
                            });

                            //Kivenni a kártyát és az asztalra tenni
                            newState.activePlayer.cardsOnTable.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                            window.channel.whisper('StateChanged', {
                                state: newState, 
                                roomId : newState.roomId
                            });

                            return newState;
                        }

                        //Ha van hordó lerakva már
                        return newState;
                    }

                    case 'bang' : {
                        //Ha még nem lőtt a körben, vagy speciális kivételek ide 
                        if (!newState.activePlayer.playedABangCard){
                            newState.gamePhase = 'ACTION_BANG';

                            //Melyik kártyát kell kivenni:
                            const index = newState.activePlayer.cardsInHand.findIndex(card => {
                                return areCardsEqual(card, action.payload);
                            });
    
                            //Kivenni a kártyát és a dobópaklira tenni
                            newState.throwingDeck.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);
    
                            window.channel.whisper('StateChanged', {
                                state: newState, 
                                roomId : newState.roomId
                            });

                            return newState;
                        }

                        return newState;
                    }

                    /*
                    case 'gatling' : {
                        //Melyik kártyát kell kivenni:
                        const index = newState.activePlayer.cardsInHand.findIndex(card => {
                            return areCardsEqual(card, action.payload);
                        });

                        //Kivenni a kártyát és a dobópaklira tenni
                        newState.throwingDeck.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                        newState = gatlingMissedAction(newState, action);

                        return newState;
                    }
                    */
                   
                    case 'missed' : {
                        if (newState.gamePhase.includes('MISSED')){

                            //Melyik játékos rakott Nem talált! lapot
                            const playerIndex = newState.players.findIndex(player => player.user === action.player);
                            console.log('playerIndex', playerIndex)

                            //Melyik kártyát kell kivenni a kezéből:
                            const cardIndex = newState.players[playerIndex].cardsInHand.findIndex(card => {
                                return areCardsEqual(card, action.payload);
                            });

                            //Kivenni a kártyát és a dobópaklira tenni
                            newState.throwingDeck.push(newState.players[playerIndex].cardsInHand.splice(cardIndex, 1)[0]);

                            //Melyik játékost kell kivenni a beingAttacked listából
                            const removeIndex = newState.playersBeingAttacked.findIndex(username => username === action.player);

                            //Kivenni a játékost, rendben van
                            newState.playersBeingAttacked.splice(removeIndex, 1);

                            if (newState.playersBeingAttacked.length === 0) {
                                newState.gamePhase = 'ACTION';
                            }

                            window.channel.whisper('StateChanged', {
                                state: newState, 
                                roomId : newState.roomId
                            });

                            return newState;
                        }

                        return newState;
                    }

                    case 'catbalou' : {
                        newState.gamePhase = newState.gamePhase !== 'ACTION_CAT_BALOU' ? 'ACTION_CAT_BALOU' : 'ACTION';

                        //Melyik kártyát kell kivenni:
                        const index = newState.activePlayer.cardsInHand.findIndex(card => {
                            return areCardsEqual(card, action.payload);
                        });

                        //Kivenni a kártyát és a dobópaklira tenni
                        newState.throwingDeck.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                        window.channel.whisper('StateChanged', {
                            state: newState, 
                            roomId : newState.roomId
                        });

                        return newState;
                    }

                    case 'panic' : {
                        newState.gamePhase = 'ACTION_PANIC';

                        //Hol a pánik kártya:
                        const index = newState.activePlayer.cardsInHand.findIndex(card => {
                            return areCardsEqual(card, action.payload);
                        });

                        //Kivenni a kártyát és a dobópaklira tenni
                        newState.throwingDeck.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                        window.channel.whisper('StateChanged', {
                            state: newState, 
                            roomId : newState.roomId
                        });

                        return newState;
                    }

                    case 'stagecoach' : {

                        //Melyik kártyát kell kivenni a kezemből:
                        const index = newState.activePlayer.cardsInHand.findIndex(card => {
                            return areCardsEqual(card, action.payload);
                        });

                        //Kivenni a kártyát a kezemből és a dobópaklira tenni
                        newState.throwingDeck.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                        //Két kártya húzása, kell-e újrakeverés
                        if ( (newState.drawingDeck.length-2) < 0 ) {
                            newState = initializeDeckFromThrowingDeck(newState);
                        } else {
                            newState.activePlayer.cardsInHand.push(newState.drawingDeck.pop());
                            newState.activePlayer.cardsInHand.push(newState.drawingDeck.pop());
                        }

                        //Ha nem maradt kártya újrakeverés
                        if (newState.drawingDeck.length === 0) {
                            newState = initializeDeckFromThrowingDeck(newState);
                        }

                        window.channel.whisper('StateChanged', {
                            state: newState, 
                            roomId : newState.roomId
                        });

                        return newState;

                    }

                    case 'wellsfargo' : {

                        //Melyik kártyát kell kivenni a kezemből:
                        const index = newState.activePlayer.cardsInHand.findIndex(card => {
                            return areCardsEqual(card, action.payload);
                        });

                        //Kivenni a kártyát a kezemből és a dobópaklira tenni
                        newState.throwingDeck.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                        //Két kártya húzása, kell-e újrakeverés
                        if ( (newState.drawingDeck.length-3) < 0 ) {
                            newState = initializeDeckFromThrowingDeck(newState);
                        } else {
                            newState.activePlayer.cardsInHand.push(newState.drawingDeck.pop());
                            newState.activePlayer.cardsInHand.push(newState.drawingDeck.pop());
                            newState.activePlayer.cardsInHand.push(newState.drawingDeck.pop());
                        }

                        //Ha nem maradt kártya újrakeverés
                        if (newState.drawingDeck.length === 0) {
                            newState = initializeDeckFromThrowingDeck(newState);
                        }

                        window.channel.whisper('StateChanged', {
                            state: newState, 
                            roomId : newState.roomId
                        });

                        return newState;

                    }

                    case 'generalstore' : {
                        newState.gamePhase = 'ACTION_GENERAL_STORE';

                        //Hol a kártya amit kijátszottam:
                        const index = newState.activePlayer.cardsInHand.findIndex(card => {
                            return areCardsEqual(card, action.payload);
                        });

                        //Kivenni a kártyát és a dobópaklira tenni
                        newState.throwingDeck.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                        //Annyi lapot kitenni ahány játékos van
                        for (let i = 0; i < newState.players.length; i++){
                           newState.pickCardsFrom.push(newState.drawingDeck.pop()); 
                        }

                        window.channel.whisper('StateChanged', {
                            state: newState, 
                            roomId : newState.roomId
                        });

                        return newState;
                    }

                    case 'saloon' : {

                        //Hol a kártya amit kijátszottam:
                        const index = newState.activePlayer.cardsInHand.findIndex(card => {
                            return areCardsEqual(card, action.payload);
                        });

                        //Kivenni a kártyát és a dobópaklira tenni
                        newState.throwingDeck.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                        for (let player of newState.players) {
                            if (player.health < player.maxHealth) {
                                player.health++;
                            }
                        }

                        window.channel.whisper('StateChanged', {
                            state: newState, 
                            roomId : newState.roomId
                        });

                        return newState;
                    }

                    case 'mustang' : {

                        //Hol a kártya amit kijátszottam:
                        const index = newState.activePlayer.cardsInHand.findIndex(card => {
                            return areCardsEqual(card, action.payload);
                        });

                        //Kivenni a kártyát és a dobópaklira tenni
                        newState.activePlayer.cardsOnTable.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                        for (let player of newState.players) {
                            if (player.user !== newState.activePlayer.user) {
                                for (let range of player.ranges) {
                                    if (range.playerName === newState.activePlayer.user) {
                                        range.rangeFromMe++;
                                        break;
                                    }
                                }
                            }
                        }

                        window.channel.whisper('StateChanged', {
                            state: newState, 
                            roomId : newState.roomId
                        });

                        return newState;

                    }

                    case 'schofield':
                    case 'remington':
                    case 'carabine':
                    case 'volcanic':
                    case 'winchester': {

                        let newState = {...state};

                        if (newState.activePlayer.cardsOnTable.length === 0) {

                            //Melyik kártyát kell kivenni:
                            const index = newState.activePlayer.cardsInHand.findIndex(card => {
                                return areCardsEqual(card, action.payload);
                            });

                            //Kivenni a kártyát és az asztalra tenni
                            newState.activePlayer.cardsOnTable.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                            //Range beállítása
                            newState.activePlayer.range = action.payload.range;

                            window.channel.whisper('StateChanged', {
                                state: newState, 
                                roomId : newState.roomId
                            });

                            return newState;
                        } else {
                            //Megnézni, hogy van-e már lerakott fegyver
                            const weapons = ['remington', 'schofield', 'volcanic', 'winchester', 'carabine'];

                            if (newState.activePlayer.cardsOnTable.some(card => weapons.includes(card.type))) {
                                //Van lerakott fegyver:

                                //Melyik kártyát kell kivenni a kezemből:
                                const indexInHand = newState.activePlayer.cardsInHand.findIndex(card => {
                                    return areCardsEqual(card, action.payload);
                                });

                                //Kivenni a kártyát a kezemből
                                let placeableCard = newState.activePlayer.cardsInHand.splice(indexInHand, 1)[0];

                                //Melyik kártyát kell kicserélni:
                                const indexOnTable = newState.activePlayer.cardsOnTable.findIndex(card => {
                                    return weapons.includes(card.type);
                                });

                                //Kártya kicserélése az asztalon:
                                let cardOntoThrowingDeck = newState.activePlayer.cardsOnTable.splice(indexOnTable, 1, placeableCard)[0];
                                
                                //Kártya ráhelyezése a dobópaklira
                                newState.throwingDeck.push(cardOntoThrowingDeck);

                                //Range beállítása
                                newState.activePlayer.range = action.payload.range;

                                window.channel.whisper('StateChanged', {
                                    state: newState, 
                                    roomId : newState.roomId
                                });

                                return newState;
                            } else {
                                //Nincs még lerakott fegyver:

                                //Melyik kártyát kell kivenni:
                                const index = newState.activePlayer.cardsInHand.findIndex(card => {
                                    return areCardsEqual(card, action.payload);
                                });

                                //Kivenni a kártyát és az asztalra tenni
                                newState.activePlayer.cardsOnTable.push(newState.activePlayer.cardsInHand.splice(index, 1)[0]);

                                //Range beállítása
                                newState.activePlayer.range = action.payload.range;

                                window.channel.whisper('StateChanged', {
                                    state: newState, 
                                    roomId : newState.roomId
                                });

                                return newState;
                            }
                        }

                    }

                    default : return newState; 
                }

            }

            // }
            //else
            return state;
        }

        case 'ACTION_BY_TYPE' : {
            // SOCKET ID == MIÉNK && ISACTIVE AKKOR CSAK MAJD if (newState.activePlayer.user === localStorage.getItem('auth_username')) {
            let newState = {...state};
            switch (newState.gamePhase) {
                case 'ACTION_CAT_BALOU' : {
                    
                    if (action.payload.player.user !== newState.activePlayer.user) {

                        if (action.payload.card !== null) {
                        // Ha az asztalról van

                            //Megkeresem melyik az az asztalról
                            const tableCardindex = action.payload.player.cardsOnTable.findIndex(card => {
                                return areCardsEqual(card, action.payload.card);
                            });

                            //Ha musztáng akkor visszaállítani az eredeti távolságokat
                            if (action.payload.player.cardsOnTable[tableCardindex].type === 'mustang') {
                                for (let player of newState.players) {
                                    if (player.user !== action.payload.player.user) {
                                        for (let range of player.ranges) {
                                            if (range.playerName === action.payload.player.user) {
                                                range.rangeFromMe--;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            //Eldobatni vele és a dobópaklira tenni
                            newState.throwingDeck.push(action.payload.player.cardsOnTable.splice(tableCardindex, 1)[0]);
                            
                            newState.gamePhase = 'ACTION';

                            newState = mergePlayerWithPlayers(newState, action.payload.player);
    
                            window.channel.whisper('StateChanged', {
                                state: newState, 
                                roomId : newState.roomId
                            });

                            return newState;

                        } else {
                            if (action.payload.player.cardsInHand.length !== 0) {

                                //Random kártyát eldobatni vele
                                let victimHandCardIndex = randomNumberBetween(0 , action.payload.player.cardsInHand.length-1);
                                
                                //Eldobatni vele és a dobópaklira tenni
                                newState.throwingDeck.push(action.payload.player.cardsInHand.splice(victimHandCardIndex, 1)[0]);

                                newState.gamePhase = 'ACTION';

                                newState = mergePlayersWithActive(mergePlayerWithPlayers(newState, action.payload.player));

                                window.channel.whisper('StateChanged', {
                                    state: newState, 
                                    roomId : newState.roomId
                                });

                                return newState;
                            }

                            return newState;
                        }

                    }

                    return newState;
                }

                case 'ACTION_PANIC' : {
                    // Ha az asztalról van ( !== NULL)
                    if (action.payload.player.user !== newState.activePlayer.user && action.payload.range === 1) {

                        if (action.payload.card !== null) {

                            //Megkeresem melyik az az asztalról
                            const tableCardindex = action.payload.player.cardsOnTable.findIndex(card => {
                                return areCardsEqual(card, action.payload.card);
                            });
    
                            //Ha musztáng akkor visszaállítani az eredeti távolságokat
                            if (action.payload.player.cardsOnTable[tableCardindex].type === 'mustang') {
                                for (let player of newState.players) {
                                    if (player.user !== action.payload.player.user) {
                                        for (let range of player.ranges) {
                                            if (range.playerName === action.payload.player.user) {
                                                range.rangeFromMe--;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }

                            //Eldobatni vele és a kezembe tenni
                            newState.activePlayer.cardsInHand.push(action.payload.player.cardsOnTable.splice(tableCardindex, 1)[0]);
                            
                            newState.gamePhase = 'ACTION';

                            newState = mergePlayerWithPlayers(newState, action.payload.player);
    
                            window.channel.whisper('StateChanged', {
                                state: newState, 
                                roomId : newState.roomId
                            });

                            return newState;

                        } else {
                            if (action.payload.player.cardsInHand.length !== 0) {

                                //Random kártyát eldobatni vele
                                let victimHandCardIndex = randomNumberBetween(0 , action.payload.player.cardsInHand.length-1);
                                
                                //Eldobatni vele és a kezembe tenni
                                newState.activePlayer.cardsInHand.push(action.payload.player.cardsInHand.splice(victimHandCardIndex, 1)[0]);

                                newState.gamePhase = 'ACTION';

                                newState = mergePlayersWithActive(mergePlayerWithPlayers(newState, action.payload.player));

                                window.channel.whisper('StateChanged', {
                                    state: newState, 
                                    roomId : newState.roomId
                                });

                                return newState;
                            }
                            return newState;
                        }

                    }
                    return newState;
                }

                case 'ACTION_BANG' : {
                    //action.payload.player
                    newState = bangMissedAction(newState, action, 'BANG');

                    window.channel.whisper('StateChanged', {
                        state: newState, 
                        roomId : newState.roomId
                    });

                    return newState;
                }
                default : return newState;
            }
            //}
        }

        default:
            return state;
    }
}

export default game;