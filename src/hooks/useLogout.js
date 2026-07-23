import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import apiClient from '../utils/axiosConfig';

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    Swal.fire({
      title: 'Logout',
      text: 'Pilih metode logout yang kamu mau',
      icon: 'question',
      confirmButtonText: 'Logout',
      denyButtonText: 'Logout All Devices',
      showCloseButton: true,
      showCancelButton: false,
      showDenyButton: true,
      customClass: {
        confirmButton: 'my-confirm-btn',
        denyButton: 'my-deny-btn',
        cancelButton: 'my-cancel-btn'
      }
    }).then(async (result) => {
      try {
        let loggedOut = false;
        if (result.isConfirmed) {
          await apiClient.post('/logout');
          loggedOut = true;
        } else if (result.isDenied) {
          await apiClient.post('/logout?all=true');
          loggedOut = true;
        }

        if (loggedOut) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          navigate('/');
        }
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Gagal logout, coba lagi.', 'error');
      }
    });
  };

  return logout;
};