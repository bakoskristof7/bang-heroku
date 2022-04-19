import * as api from '../api';

// Action Creators

export const getUsers = () => async (dispatch) => {

    try {
        const { data } = await api.fetchUsers();

        console.log('Dispatching fetch_all');
        
        dispatch({ type : 'FETCH_ALL', payload : data });
    } catch (error) {
        console.log(error.message);
    }
}