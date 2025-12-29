import React from 'react'
import Avatar from 'react-avatar'


const User = (props) => {

  return (
    <div className="flex flex-col  gap-1 text-white" >

       <Avatar name={props.username} size='60' className="rounded-xl " />

      <span className='username'>{props.username}</span>
    </div>
  ) 
}

export default User
