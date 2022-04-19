import React from 'react'

const MenuItem = ({text, createRoom, joinRoom}) => {
  return (
    <div className='w-3/4'>
        <button 
        type='submit'
        className='
        w-full
        text-center 
        bg-white 
        p-6 
        my-4
        rounded-md 
        hover:bg-slate-100
        font-bold
        '
        onClick={ () => {
          createRoom();
          joinRoom();
        }
        }
        >
            {text}
        </button>   
    </div>
  )
}

MenuItem.defaultProps = {
  createRoom : () => null,
  joinRoom : () => null
};


export default MenuItem