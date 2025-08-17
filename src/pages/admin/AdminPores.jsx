import React, { useEffect, useState } from 'react';
import apiClient from '@/utils/axiosConfig';
import { Typography, TextField, Paper, Table, TableRow, TableHead, TableCell, TableBody, Button } from '@mui/material';
import SidebarAdmin from '@/components/layouts/SidebarOsis';


const AdminPores = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/pendaftaran');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus?")) {
      try {
        await apiClient.delete(`/pendaftaran/${id}`);
        fetchData();
      } catch (error) {
        console.error("Gagal menghapus", error);
        alert("Gagal Menghapus Data.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <SidebarAdmin />

      <main className="flex-1 p-4 pt-20 md:pt-16 md:ml-64 w-full">
        <Typography variant="h5" align="center" className='mb-4 font-bold' >
          DATA PENDAFTARAN PORES 2025
        </Typography>

        <TextField
          placeholder="SEARCH"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ maxWidth: 300, mb: 3 }}
        />

        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Kelas</TableCell>
                <TableCell>No_Hp</TableCell>
                <TableCell>Cabor</TableCell>
                <TableCell>Nama Tim</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.kelas}</TableCell>
                  <TableCell>{item.nomor_hp}</TableCell>
                  <TableCell>{item.cabang_olahraga}</TableCell>
                  <TableCell>{item.nama_tim || '-'}</TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small" color="primary">
                      Edit
                    </Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(item.id)} style={{ marginLeft: 8 }}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </main>
    </div>
  );
};

export default AdminPores;