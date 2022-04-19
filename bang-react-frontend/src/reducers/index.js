import {combineReducers} from 'redux';

import users from './users';
import game from './game';

export default combineReducers({ users, game });