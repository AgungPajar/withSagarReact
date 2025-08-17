import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient, { STORAGE_URL } from '@/utils/axiosConfig';
import SidebarAdmin from '@/components/layouts/SidebarOsis';

export default function ClubsAdminPage() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [search, setSearch] = useState('');

  const fetchClubs = async () => {
    try {
      const res = await apiClient.get('/clubs');
      setClubs(res.data);
    } catch (err) {
      console.error('❌ Gagal memuat ekskul:', err);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus ekskul ini?')) {
      try {
        await apiClient.delete(`/clubs/${id}`);
        setClubs(clubs.filter((club) => club.id !== id));
        alert('Ekskul berhasil dihapus!');
      } catch (err) {
        console.error('❌ Gagal hapus ekskul:', err);
        alert('Gagal menghapus ekskul');
      }
    }
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <SidebarAdmin />

      <main className="flex-1 p-4 pt-24 md:pt-16 md:ml-64 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold">EKSTRAKURIKULER SMKN 1 GARUT</h1>

          <div className="flex gap-2">
            <TextField
              size="small"
              placeholder="Cari Ekstrakurikuler..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => navigate('/admin/ekstrakurikuler/add')}
            >
              Tambah
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredClubs.map((club) => (
            <div
              key={club.id}
              className="flex flex-col sm:flex-row items-center sm:items-center justify-between border rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                <img
                  src={
                    club.logo_path
                      ? `${STORAGE_URL}/${club.logo_path}`
                      : '/logoeks.png'
                  }
                  alt={club.name}
                  className="w-16 h-16 object-cover border rounded"
                />
                <span className="font-semibold text-lg">{club.name}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/clubs/${club.hash_id}`)}
                >
                  Lihat
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/admin/clubs/${club.hash_id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(club.id)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
