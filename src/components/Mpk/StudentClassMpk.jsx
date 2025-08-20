// src/components/pages/MpkClassPage.jsx
import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import SidebarAdminMPK from '@/components/layouts/SidebarMPK';
import useMpkClassData from '@/hooks/Mpk/useStudentDataMpk';
import '../../css/style.css';


export default function MpkClassPage({ classLevel, title }) {
  const {
    students,
    jurusans,
    selectedJurusan,
    setSelectedJurusan,
    isLoading,
  } = useMpkClassData(classLevel);

  const filteredStudents = students.filter(s => !selectedJurusan || s.jurusan?.singkatan === selectedJurusan);

  return (
    <div className="flex">
      <SidebarAdminMPK />
      <main className="flex-1 p-6 pt-24 md:pt-16 md:ml-64 w-full">
        <Typography variant="h5" className="mb-4 font-bold">{title}</Typography>

        <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
          <FormControl size="small" sx={{ minWidth: 200, maxWidth: 250 }}>
            <InputLabel>Filter Jurusan</InputLabel>
            <Select
              value={selectedJurusan}
              label="Filter Jurusan"
              onChange={(e) => setSelectedJurusan(e.target.value)}
            >
              <MenuItem value="">Semua</MenuItem>
              {jurusans.map((j) => (
                <MenuItem key={j.id} value={j.singkatan}>
                  {j.singkatan}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full bg-white text-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-2 w-8 border-l border-r">No</th>
                <th className="p-2 w-40 border-l border-r">NISN</th>
                <th className="p-2 w-64 border-l border-r">Nama</th>
                <th className="p-2 w-40 border-l border-r">Kelas</th>
                <th className="p-2 w-40 border-l border-r">Ekskul</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-500 font-semibold">Memuat Data...</td></tr>
              ) : (
                filteredStudents.map((s, i) => (
                  <tr key={s.id} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-[#e2f4ff]'}`}>
                    <td className="p-2 w-8 border-l border-r">{i + 1}</td>
                    <td className="p-2 w-40 border-l border-r">{s.nisn}</td>
                    <td className="p-2 w-64 border-l border-r">{s.name}</td>
                    <td className="p-2 w-40 border-l border-r">{s.class} {s.jurusan?.singkatan} {s.rombel}</td>
                    <td className="p-2 w-40 border-l border-r">{s.clubs?.map((club) => club.name).join(', ') || '-'}</td>
                  </tr>
                ))
              )}
               {!isLoading && filteredStudents.length === 0 && (
                <tr><td colSpan={5} className="text-center py-6 text-gray-500 font-semibold">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}