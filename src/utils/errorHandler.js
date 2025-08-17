import Swal from 'sweetalert2';

let isLogoutAlertActive = false;

export async function handleUnauthorizedError(error) {
  if (error.response?.status === 401) {
    if (isLogoutAlertActive) return true; // kalau lagi aktif, skip
    isLogoutAlertActive = true;

    await Swal.fire({
      title: 'Anda Telah Logout',
      text: 'Sesi login Anda telah berakhir.',
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });

    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    window.location.href = '/login';

    return true;
  }
  return false;
}

