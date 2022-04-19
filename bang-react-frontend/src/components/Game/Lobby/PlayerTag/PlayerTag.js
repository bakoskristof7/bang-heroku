import React from 'react'
import avatar from '../../../../img/optimized-wanted.jpg';

const PlayerTag = ({username}) => {
  return (
    <div className="rounded overflow-hidden">
        <img className="w-full rounded-md shadow-lg" src={avatar} alt="Player"/>
        <div className="py-4 text-center">
            <div className="font-bold text-l bg-orange-900 rounded-lg text-white p-1 border-4 border-black">
              <span>{username}</span>
              </div>
        </div>
    </div>
  )
}

export default PlayerTag