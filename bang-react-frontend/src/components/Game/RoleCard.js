import React from 'react'
import { useDispatch } from 'react-redux';
import { assignRole } from '../../actions/game';

const RoleCard = ({role, mobile, setShowModal, activePlayer}) => {

    const dispatch = useDispatch();
    const cardName = role + '.JPG';
    const image = require('../../img/cards/back-1.JPG'); //require('../../img/cards/role/'+ cardName ); showra nincs is szükség max később

    return (
            <img 
            src={image} 
            alt="" 
            className={`px-1 w-20 sm:w-24 md:w-32 rounded-xl mx-2 ${!mobile ? 'hover:rotate-1 hover:translate-y-4 transition-all w-48' : ''}`}
            onClick={() => { 
                if (activePlayer.user === localStorage.getItem('auth_username') || activePlayer.isRobot) {
                    dispatch(assignRole(role, activePlayer.user));
                    setShowModal(false);
                }
            }}
            />  
    )
}

export default RoleCard