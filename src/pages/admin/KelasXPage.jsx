import React, { useEffect, useState } from 'react';
import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import apiClient from '../../utils/axiosConfig';

export default function KelasXPage() {
  const [students, setStudents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [kelasBaru, setKelasBaru] = useState('');

  useEffect(() => {
    // Fetch data siswa kelas X
    const fetchStudents = async () => {
      try {
        const res = await apiClient.get('/students?class=X');
        setStudents(res.data);
      } catch (err) {
        console.error('Gagal ambil data siswa:', err);
      }
    };
    fetchStudents();
  }, []);

  const toggleCheckAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(students.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleCheckbox = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleUbahKelas = async () => {
    if (!kelasBaru) return alert('Pilih kelas baru dulu!');
    try {
      await apiClient.put('/students/update-class', {
        ids: selectedIds,
        newClass: kelasBaru,
      });
      alert('Kelas berhasil diubah!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Gagal ubah kelas');
    }
  };

  return (
    <div className="p-8 md:ml-64">
      <h1 className="text-2xl font-bold mb-6">Seluruh Siswa Kelas X</h1>

      <div className="flex items-center gap-4 mb-4">
        <Checkbox checked={selectedIds.length === students.length} onChange={toggleCheckAll} />
        <span>Check All</span>
        <FormControl size="small">
          <InputLabel>Ubah Kelas</InputLabel>
          <Select
            value={kelasBaru}
            onChange={(e) => setKelasBaru(e.target.value)}
            style={{ minWidth: 120 }}
          >
            <MenuItem value="X">Kelas X</MenuItem>
            <MenuItem value="XI">Kelas XI</MenuItem>
            <MenuItem value="XII">Kelas XII</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleUbahKelas}>Ubah</Button>
      </div>

      <div className="bg-gray-200 p-6 rounded-lg">
        {students.map((siswa) => (
          <div key={siswa.id} className="flex items-center gap-3 mb-2">
            <Checkbox
              checked={selectedIds.includes(siswa.id)}
              onChange={() => toggleCheckbox(siswa.id)}
            />
            <div>{siswa.name} - {siswa.class}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
