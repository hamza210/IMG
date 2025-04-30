import React from 'react'
import {useAuth} from './auth'
import { Navigate, Outlet } from 'react-router'

const PrivateRoute = () => {
    const {isLogin} = useAuth()
  return (
    <div>
      {
        isLogin ?
        <Outlet /> :
        <Navigate to='/login' />
      }
    </div>
  )
}

export default PrivateRoute
