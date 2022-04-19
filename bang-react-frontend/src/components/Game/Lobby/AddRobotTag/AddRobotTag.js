import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addRobotWaitingPlayer } from '../../../../actions/game';
import robotAvatar from '../../../../img/optimized-robot.jpg';

const AddRobotTag = ({robotId, username, reRenderRobots}) => {

  const dispatch = useDispatch();

  const game = useSelector((state) => state.game);

  const handleCreateRobot = () => {
    dispatch(addRobotWaitingPlayer({
        username : 'Robot ' + robotId, 
        isRobot : true,
        roomId : 'Robot'
      })
    )
  }


  return (
    <button 
    className="rounded overflow-hidden opacity-60 hover:border-2 border-4"
    onClick={() => {
      if (game.waitingPlayers[0].username === localStorage.getItem('auth_username')){
        handleCreateRobot();
        reRenderRobots();
      }
    }
    }
    >
        <div className='relative text-center align-middle justify-center items-center'>
            <img className="w-full rounded-md shadow-lg" src={robotAvatar} alt="Robot"/>
            <div className='absolute font-extrabold text-xl w-full top-1/3 text-gray-800 opacity-100 bg-white rounded-xl p-2'>Add Robot</div>
        </div>
        <div className="py-4 text-center">
            <div className="font-bold text-l bg-orange-900 rounded-lg text-white p-1 border-4 border-black"><span>{username}</span></div>
        </div>
    </button>
  )
}

export default AddRobotTag