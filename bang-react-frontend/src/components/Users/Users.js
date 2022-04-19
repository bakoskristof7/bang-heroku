import React from 'react'
import { useSelector } from 'react-redux';

import User from './User/User';

const Users = () => {

const users = useSelector((state) => state.users);
const state = useSelector((state) => state);

console.log('State:', state);
console.log(users);

  return (
    <>
      <User/>
    </>
  )

}

export default Users