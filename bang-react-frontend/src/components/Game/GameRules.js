
export const selectRolesBasedOnNumberOfPlayers = (numberOfPlayers) => {
    if (numberOfPlayers === 4) return ['sheriff', 'renegade', 'bandit', 'bandit'];
    if (numberOfPlayers === 5) return ['sheriff', 'deputy', 'renegade', 'bandit', 'bandit'];
    if (numberOfPlayers === 6) return ['sheriff', 'deputy', 'renegade', 'bandit', 'bandit', 'bandit'];
    if (numberOfPlayers === 7) return ['sheriff', 'deputy', 'deputy', 'renegade', 'bandit', 'bandit', 'bandit'];
}

export const isGameOver = (players) => {

    let bandits = 0;
    let deputies = 0;
    let sheriff = 0;
    let renegades = 0;

    for(let player of players) {
        switch (player.role) {
            case 'bandit' : if (player.health > 0) bandits++; break;
            case 'deputy' : if (player.health > 0) deputies++; break;
            case 'renegade' : if (player.health > 0) renegades++; break;
            case 'sheriff': if (player.health > 0) sheriff++; break;
            default : break;
        }
    }

    if (bandits === 0 && renegades === 0 && sheriff === 1) {
        //Sheriff and deputies won
        return {
            isOver : true,
            message : 'The sheriff and the deputies have won!'
        }
    }

    if (sheriff === 0) {
        return {
            isOver : true,
            message : 'The bandits have won!'
        }
    }

    if (bandits === 0 && sheriff === 0 && deputies === 0 && renegades === 1) {
        return {
            isOver : true,
            message : 'The renegade has won!'
        }
    }

    return {
        isOver : false,
        message : 'The game goes on!'
    }

}

