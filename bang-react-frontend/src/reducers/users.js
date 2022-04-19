

export default (users = [], action) => {
    switch(action.type) {
        case 'FETCH_ALL' :
            console.log('Going in FETCHALL');
            return [...users, ...action.payload];
        default:
            return users;
    }
}