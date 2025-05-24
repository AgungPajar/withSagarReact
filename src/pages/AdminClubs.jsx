import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminClubs() {
  const [clubs, setClubs] = useState([]);
  const [newClubName, setNewClubName] = useState('');
    const navigate = useNavigate();
  
  // 🔹 State tambahan untuk form pengurus ekskul
  const [selectedClubId, setSelectedClubId] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/admin/clubs');
      setClubs(res.data);
    } catch (error) {
      alert('Gagal mengambil data ekskul');
    }
  };

  const addClub = async () => {
    if (!newClubName.trim()) {
      alert('Nama ekskul tidak boleh kosong');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/admin/clubs', {
        name: newClubName,
      });

      setClubs([...clubs, res.data]);
      setNewClubName('');
    } catch (err) {
      alert('Gagal menambahkan ekskul');
    }
  };

  const deleteClub = async (id) => {
    if (!window.confirm('Yakin ingin hapus ekskul ini?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/admin/clubs/${id}`);
      setClubs(clubs.filter(club => club.id !== id));
    } catch (err) {
      alert('Gagal menghapus ekskul');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/')
  };

  const addAdmin = async () => {
    if (!selectedClubId || !newAdminUsername) {
      alert('Isi semua field');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/admin/users', {
        username: newAdminUsername,
        club_id: selectedClubId,
        password: 'default_password_123',
        role: 'club_pengurus'
      });

      setNewAdminUsername('');
      alert('Pengurus berhasil ditambahkan');
    } catch (err) {
      alert('Gagal menambahkan pengurus');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Kelola Ekskul</h1>

      {/* Tambah Ekskul */}
      <div className="mb-4 flex gap-2">
        <input
          placeholder="Nama Ekskul"
          value={newClubName}
          onChange={(e) => setNewClubName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <button onClick={addClub} className="bg-blue-500 text-white px-4 py-2 rounded">
          Tambah
        </button>
      </div>

      {/* Daftar Ekskul */}
      <ul className="mt-4">
        {clubs.map((club) => (
          <li key={club.id} className="flex justify-between items-center border-b py-2">
            <span>{club.name}</span>
            <button onClick={() => deleteClub(club.id)} className="text-red-500">
              Hapus
            </button>
          </li>
        ))}
      </ul>

      {/* Form Tambah Pengurus Ekskul */}
      <div className="mt-6">
        <h2 className="font-bold mb-2">Tambah Pengurus Ekskul</h2>
        <select
          value={selectedClubId}
          onChange={(e) => setSelectedClubId(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="">Pilih Ekskul</option>
          {clubs.map(club => (
            <option key={club.id} value={club.id}>{club.name}</option>
          ))}
        </select>

        <input
          placeholder="Username"
          value={newAdminUsername}
          onChange={(e) => setNewAdminUsername(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <button onClick={addAdmin} className="bg-green-500 text-white px-4 py-2 rounded">
          Tambah Pengurus
        </button>
        <button onClick={handleLogout} className="bg-green-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>
    </div>
  );
}