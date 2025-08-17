import {useState, useEffect, useCallback} from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, {STORAGE_URL, getCsrfToken} from '@/utils/axiosConfig'
import Swal from 'sweetalert2'

export const useProfileEditor = (clubId) => {
  const navigate = useNavigate();

  const [club, setClub] = useState(null)
  const [formState, setFormState] = useState({
    username: '',
    name: '',
    description: '',
    groupLink: '',
  })
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const fetchClub = useCallback (async () => {
    if (!clubId) return
    setLoading(true)
    try {
      const res = await apiClient.get(`/clubs/${clubId}`)
      const data = res.data
      setClub(data)
      setFormState({
        username: data.username || '',
        name: data.name || '',
        description: data.description || '',
        groupLink: data.group_link || '',
      });
      setLogoPreview(data.logo_path ? `${STORAGE_URL}/${data.logo_path}` : '/logoeks.png')
    } catch (error) {
      Swal.fire('Error', 'Gagal memuat data klub.', 'error');
    } finally {
      setLoading(false)
    }
  }, [clubId])

  useEffect(() => {
    fetchClub();
  }, [fetchClub])

  const handleInputChange = (e) => {
    const {name, value} = e.target
    setFormState(prevState => ({...prevState, [name]: value}))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  };

  const handleSubmitProfile = async () => {
    setSubmitting(true)
    try {
      const formData = new FormData();
      formData.append('username', formState.username);
      formData.append('name', formState.name);
      formData.append('description', formState.description);
      formData.append('group_link', formState.groupLink);
      if (logoFile) formData.append('logo', logoFile, {
        headers: {'Content-Type' : 'multipart/form-data'},
      });
      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Profil berhasil diperbarui.', timer: 2000, showConfirmButton: false });
      navigate(`/club/${clubId}`);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Oops!', text: error?.response?.data?.message || 'Terjadi kesalahan.' });
    } finally {
      setSubmitting(false)
    }
  };

  const handleChangePassword = () => {
    Swal.fire({
      title: 'Ubah Password',
      html: `
      <div style="position: relative;">
        <input type="password" id="oldPassword" class="swal2-input" placeholder="Password Lama" />
        <span onclick="toggleVisibility('oldPassword', this)" style="position:absolute; right:30px; top:12px; cursor:pointer; font-size:12px;">Show</span>
      </div>
      <div style="position: relative;">
        <input type="password" id="newPassword" class="swal2-input" placeholder="Password Baru" />
        <span onclick="toggleVisibility('newPassword', this)" style="position:absolute; right:30px; top:12px; cursor:pointer; font-size:12px;">Show</span>
      </div>
      <div style="position: relative;">
        <input type="password" id="confirmPassword" class="swal2-input" placeholder="Konfirmasi Password Baru" />
        <span onclick="toggleVisibility('confirmPassword', this)" style="position:absolute; right:30px; top:12px; cursor:pointer; font-size:12px;">Show</span>
      </div>
    `,
      customClass: {
        confirmButton: 'swal2-confirm btn btn-outline-purple',
        cancelButton: 'swal2-cancel btn btn-outline-gray',
      },
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
      reverseButtons: true, // bikin simpan di kanan
      preConfirm: () => {
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!oldPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('Semua kolom harus diisi');
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('Password baru tidak cocok');
          return false;
        }

        return { oldPassword, newPassword, confirmPassword };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.showLoading();
          await getCsrfToken();

          const token = localStorage.getItem('access_token');
          const xsrfToken = document.cookie
            .split(';')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

          await apiClient.post('/profile/update', {
            old_password: result.value.oldPassword,
            new_password: result.value.newPassword,
            new_password_confirmation: result.value.confirmPassword,
          }, {
            headers: {
              ...(token && { Authorization: `Bearer ${token}` }),
              ...(xsrfToken && { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }),
            },
            withCredentials: true,
          });

          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Password berhasil diperbarui',
            timer: 2000,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error('Gagal ubah password:', err);
          Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: err?.response?.data?.message || 'Terjadi kesalahan saat mengubah password',
          });
        }
      }
    });
  };

  return {
    club,
    formState,
    logoPreview,
    loading,
    submitting,
    handleInputChange,
    handleLogoChange,
    handleSubmitProfile,
    handleChangePassword,
  };
}