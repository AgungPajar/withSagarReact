import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient, { STORAGE_URL, getCsrfToken } from '@/utils/axiosConfig'
import Swal from 'sweetalert2'

export const useProfileEditor = ({ role, clubId }) => {
  const [profileData, setProfileData] = useState(null);
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
  const [initialState, setInitialState] = useState(null);
  const [schedules, setSchedules] = useState([]);
  

  const fetchProfile = useCallback(async () => {
    const endpoint = role === 'osis' ? '/admin/profile' : `/clubs/${clubId}`
    if (!endpoint || (role === 'club' && !clubId)) return

    setLoading(true)
    try {
      const res = await apiClient.get(endpoint)
      const dataFromServer = res.data;

      let formattedData = {}
      let logoPath = null
      if (role === 'osis') {
        formattedData = {
          name: dataFromServer.name || '',
          username: dataFromServer.username || '',
          description: dataFromServer.club?.description || '',
          groupLink: dataFromServer.club?.group_link || '',
        };
        logoPath = dataFromServer.club?.logo_path;
        console.log('--- DEBUG LOGO OSIS ---');
        console.log('Data dari Server:', dataFromServer);
        console.log('Path Logo yang didapat:', logoPath);
        console.log('URL Final untuk Logo:', logoPath ? `${STORAGE_URL}/${logoPath}` : 'Tidak ada logo');
      } else {
        formattedData = {
          name: dataFromServer.name || '',
          username: dataFromServer.username || '',
          description: dataFromServer.description || '',
          groupLink: dataFromServer.group_link || '',
        };
        logoPath = dataFromServer.logo_path;
      }

      if (role === 'club' && clubId) {
        const scheduleRes = await apiClient.get(`/clubs/${clubId}/schedules`);
        setSchedules(scheduleRes.data);
      }

      setFormState(formattedData);
      setInitialState(formattedData);
      setProfileData(dataFromServer);
      setLogoPreview(logoPath ? `${STORAGE_URL}/${dataFromServer.logo_path}` : '/logoeks.png')
    } catch (error) {
      Swal.fire('Error', `Gagal memuat profil ${role}.`, 'error');
    } finally {
      setLoading(false)
    }
  }, [role, clubId])

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState(prevState => ({ ...prevState, [name]: value }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  };

  const handleSaveLogo = async () => {
    if (!logoFile) return;
    setSubmitting(true);
    const endpoint = role === 'osis' ? '/admin/profile' : `/clubs/${clubId}`;
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      await apiClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setLogoFile(null); // Sembunyikan lagi tombol simpan
      await fetchProfile(); // Ambil data terbaru (termasuk path logo baru)
      Swal.fire('Sukses!', 'Logo berhasil diperbarui.', 'success');
    } catch (err) {
      Swal.fire('Gagal!', 'Gagal memperbarui logo.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelLogoChange = () => {
    setLogoFile(null)
    const originalLogoPath = initialState?.logoPath
    setLogoPreview(originalLogoPath ? `${STORAGE_URL}/${originalLogoPath}` : '/logoeks.png');
  }

  const handleSubmitProfile = async () => {
    setSubmitting(true)
    const endpoint = role === 'osis' ? '/admin/profile' : `/clubs/${clubId}`

    try {
      const formData = new FormData();
      formData.append('username', formState.username);
      formData.append('name', formState.name);
      formData.append('description', formState.description);
      formData.append('group_link', formState.groupLink);

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const response = await apiClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await fetchProfile()
      setLogoFile(null)

      Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Profil berhasil diperbarui.', timer: 2000, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Oops!', text: error?.response?.data?.message || 'Terjadi kesalahan.' });
    } finally {
      setSubmitting(false)
    }
  };

  const addSchedule = async (clubIdentifier, newScheduleData) => {
    try {
      const res = await apiClient.post(`/clubs/${clubIdentifier}/schedules`, newScheduleData);
      setSchedules(currentSchedules => [...currentSchedules, res.data]);
      Swal.fire('Sukses', 'Jadwal berhasil ditambahkan.', 'success');
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.day_of_week[0] || 'Gagal menambahkan jadwal.';
      Swal.fire('Gagal', errorMsg, 'error');
    }
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      await apiClient.delete(`/schedules/${scheduleId}`);
      setSchedules(currentSchedules => currentSchedules.filter(s => s.id !== scheduleId));
      Swal.fire('Sukses', 'Jadwal berhasil dihapus.', 'success');
    } catch (err) {
      Swal.fire('Gagal', 'Gagal menghapus jadwal.', 'error');
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
      reverseButtons: true,
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
    profileData,
    formState,
    setFormState,
    initialState,
    logoPreview,
    logoFile,
    loading,
    submitting,
    handleInputChange,
    handleLogoChange,
    handleCancelLogoChange,
    handleSaveLogo,
    handleSubmitProfile,
    handleChangePassword,
    schedules,
    addSchedule,
    deleteSchedule,
  };
}