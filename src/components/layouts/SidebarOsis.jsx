import React from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { getOsisMenuItems } from '../Config/SidebarConfig'
import apiClient from '@/utils/axiosConfig'
import Swal from 'sweetalert2'

export default function SidebarOsis()  {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const menuItems = getOsisMenuItems(user,navigate,apiClient,Swal)

  return (
    <Sidebar
      role="osis"
      title="OSIS ADMIN"
      menuItems={menuItems}
    />
  )
}