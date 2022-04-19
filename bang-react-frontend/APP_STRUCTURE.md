Frontend:
 Játék létrehozása -> Lobby -> Játék indítása -> Game

A játék tárolja redux:
 - active_player
 - players [...players]
	Player: {
		username,
		role,
		health,
		character : { name, specialAbility }
		cardsInHand : []
		cardsOnTable : [] -> ha a játékosra akar valami lapot tenni akkor length > 0 val gyorsan ellenőrizhető, hogy van-e
		isInJail : bool
		hasDynamite : bool
        isRobot : bool
		}
 - currentGameState (pl. Choosing)
 - drawingDeck
 - throwingDeck
 - pickCardsFrom

Lehetne kategoriakra bontani a special ability könnyitese miatt pl 'drawing', 'healthloss', 'shooting'
Kell egy GameRules js ami tárolja a megfelelő kiválasztásokat abilitinként meg 
pl. role seteket meghatározza játékosokszámából
ebből exportálni metódusokat az inicializáláshoz, döntésekhez.

Játékba kerülés utáni lépések:

1. Game Init 
	- Paklik keverés,
	- játékosok inicializálása, random sorrend
	- Meghatározni a játékosok száma szerint milyen roleok kellenek

2. Mindenki sorban választ role-t, karaktert, vagy random sorsolás (Modal ?)

3. Mindenki kap 5 lapot

4. Serif kezd

5. a) A játékos először húz dinamit vagy börtön szerint (talán?)
   b) Ha okés húz kettőt (vagy kivétel special ability)

5. Játékos lehetséges lépései:
	- kör alakú avatárban a karakterkártya, rávivve az egeret tooltip név, ability
	- kijátsz bármennyi kártyát
	- a lapok kijátszás után a dobópakliba kerülnek (Ha 7 alá kerül újratölteni a decket)
	- 1 banget játszhat ki (kivételek : specialAbility)
	- kártyára vivve az egeret tooltip	
	- a köre végén rányom a végeztem gombra

Kártyák:
 - Dinamit : rákattintunk, highlighted lesz a többi személy, akire lehet, majd utána egy személyre és rákerül
 - Börtön : ugyanaz, mint a dinamit
 - Cartel izé: választható sorban -> MODAL egy pickCardsFrom
 - Indiánok : mindenki veszít egy életet
 - Postakocsi : 3 db lap kézbe





Backenden:

- Megtámad valaki valakit/valakiket -> gamePhase = ATTACK_DEFENSE, defendYourselfWith : Bang, Missed -> Bekerülnek a megtámadottak nevei egy tömbbe (playersBeingAttacked = {attackerName, victimName})

Frontenden (Game.js):

- useEffect a playersBeingAttacked.length-en:
		ha lesz támadott (length > 0), akkor nézze meg, hogy az auth_name megvan-e támadva in (playersBeingAttacked ):
			- ha igen, akkor MissedModal, ha nem, akkor várakozás a többi játékosra modal:
				-> modalban megjelenített missed kártyákra kattintva eltávolítja a játékost és kivédei, ha nem akkor sebződik és ugyanez -> ha length === 0 lett akkor gamephase = action



 Feladatok:

  1. Kiegészíteni a huzást, hogyha börtönben van vagy jailben van
  2. A robotok száma befolyásolhatja mennyien vagyunk, nem elég a users.length, kell a waitingplayers.length
  3. Ha kilépünk a szobából akkor ha van nemrobot játékos akkor ő lesz a szoba owner (akinél a roomId lesz), ha nincs akkor close the szoba
  4. Csak akkor csinálhassunk dolgokat, hogyha activeplayer.user === auth_username || védekezések, ott ha benne vagyunk a támadottak között!