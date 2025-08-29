import React from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { getMpkMenuItems } from '../Config/SidebarConfig'
import apiClient from '@/utils/axiosConfig'
import Swal from 'sweetalert2'

export default function SidebarMPK({ isExpanded, setIsExpanded })  {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const menuItems = getMpkMenuItems(user,navigate,apiClient,Swal)

  return (
    <Sidebar
      role="mpk"
      title="MPK ADMIN"
      menuItems={menuItems}
      isExpanded={isExpanded} 
      setIsExpanded={setIsExpanded}
    />
  )
}