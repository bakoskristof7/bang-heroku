
export const initializeGame = () => (dispatch) => {
    dispatch({ type : 'INITIALIZE_GAME' });
}

export const addPlayer = (data) => (dispatch) => {
    dispatch({ type : 'ADD_PLAYER', payload : data });
}

export const addWaitingPlayer = (data) => (dispatch) => {
    dispatch({ type : 'ADD_WAITING_PLAYER', payload : data });
}

export const addRobotWaitingPlayer = (data) => (dispatch) => {
    dispatch({ type : 'ADD_ROBOT_WAITING_PLAYER', payload : data });
}

export const removeWaitingPlayer = (data) => (dispatch) => {
    dispatch({ type : 'REMOVE_WAITING_PLAYER', payload : data });
}

export const setWaitingPlayers = (data) => (dispatch) => {
    dispatch({ type : 'SET_WAITING_PLAYERS', payload : data });
}

export const nextPlayer = () => (dispatch) => {
    dispatch({ type : 'NEXT_PLAYER' });
}

export const assignRole = (role, username) => (dispatch) => {
    dispatch({ type : 'ASSIGN_ROLE', payload : {role, username} });
}

export const addPickedCard = (card, username) => (dispatch) => {
    dispatch({ type : 'ADD_PICKED_CARD', payload : {card, username} });
}

export const setGamePhase = (gamePhase) => (dispatch) => {
    dispatch({ type : 'SET_GAME_PHASE', payload : gamePhase });
}

export const startGame = () => (dispatch) => {
    dispatch({ type : 'START_GAME' });
}

export const draw = (data) => (dispatch) => {
    dispatch({ type : 'DRAW', payload : data.from });
}

export const actionCardEffect = (card, player) => (dispatch) => {
    dispatch({ type : 'ACTION_CARD_EFFECT', payload : card, player });
}

export const actionByType = (player, card, range) => (dispatch) => {
    dispatch({ type : 'ACTION_BY_TYPE', payload : {player, card, range} });
}

export const syncState = (data) => (dispatch) => {
    dispatch({ type : 'SYNC_STATE', payload : data });
}