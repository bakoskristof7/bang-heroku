
export function createRobot () {
    return {
        user : 'Robot',
        role : '',
        health : 0,
        character : { name : '', specialAbility : '' },
        cardsInHand : [],
        cardsOnTable : [], 
        range : 1, // Colt-45
        isInJail : false,
        hasDynamite : false,
        isRobot : true
      }
}