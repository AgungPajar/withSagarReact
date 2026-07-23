import React, {useState} from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import { motion, AnimatePresence } from 'framer-motion';
import SidebarOsis from "../layouts/SidebarOsis";
import useStudentData from "@/hooks/Osis/useStudentData";
import FilterDialog from "../FilterDialogClubs";
import '../../css/style.css';

export default function StudentClassPage({ classLevel, title }) {
  const {
    students,
    jurusans,
    selectedJurusan,
    setSelectedJurusan,
    selectedStudents,
    isLoading,
    searchQuery,
    setSearchQuery,
    handleSelectAll,
    handleCheckboxChange,
    handleInsertData,
    handleDeleteSelected,
    handleNaikKelas,

    clubs,
    selectedClubs,
    setSelectedClubs,
    isFilterModalOpen,
    setFilterModalOpen,
    isInitialDataLoading,
  } = useStudentData(classLevel)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const filteredStudents = students.filter((s) => {
    const searchLower = searchQuery.toLowerCase();

    const matchesJurusan = !selectedJurusan || s.jurusan?.singkatan === selectedJurusan;

    const matchesSearch =
      s.name.toLowerCase().includes(searchLower) ||
      s.nisn.toLowerCase().includes(searchLower);

    const matchesClubs = selectedClubs.length === 0 ||
      s.clubs.some(club => selectedClubs.includes(club.id))

    return matchesJurusan && matchesSearch && matchesClubs;
  });

  return (
    <div className="flex">
      <SidebarOsis isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded}/>
      <main className={`flex-1 p-6 pt-24 md:pt-16 w-full ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-24'}`}>
        <div className="mb-4">
          <Typography variant="h5" className="font-bold">{title}</Typography>
        </div>

        <div className="mb-6 p-4 bg-white rounded-xl shadow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button
              variant="contained"
              color="success"
              onClick={handleInsertData}
              className="text-xs px-3 py-1.5 sm:text-sm sm:px-4 sm:py-2"
            >
              Insert Data
            </Button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <input
                type="text"
                placeholder="Cari Nama atau Nisn"
                className="border p-2 rounded text-sm w-full sm:w-auto flex-grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filter Jurusan</InputLabel>
                <Select
                  className="border border-gray-300 rounded text-sm shadow-sm"
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

              <Button
                variant="outlined"
                onClick={() => setFilterModalOpen(true)}
                startIcon={<FilterList size={18} />}
              >
                Filter Ekskul
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}   
              exit={{ opacity: 0, y: -10 }}   
              transition={{ duration: 0.2 }}
              className="flex flex-col md:flex-row md:items-center justify-end gap-4 mb-4"
            >
              <div className="flex flex-wrap gap-2">
                <button onClick={handleDeleteSelected} className="text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition">
                  Hapus
                </button>
                <button onClick={handleNaikKelas} className="text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white transition">
                  Naikan Kelas
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="overflow-auto">
          <table className="min-w-full bg-white text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-2 w-6 text-center border-l border-r">
                  <input
                    type="checkbox"
                    checked={filteredStudents.length > 0 && selectedStudents.length === filteredStudents.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-2 w-8 border-l border-r">No</th>
                <th className="p-2 w-40 border-l border-r">NISN</th>
                <th className="p-2 w-64 border-l border-r">Nama</th>
                <th className="p-2 w-40 border-l border-r">Kelas</th>
                <th className="p-2 w-40 border-l border-r">Phone</th>
                <th className="p-2 w-40 border-l border-r">Ekskul</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="text-center py-6 text-gray-500 font-semibold">Memuat Data...</td></tr>
              ) : (
                filteredStudents.map((s, i) => (
                  <tr key={s.id} className={`border-b ${i % 2 === 0 ? 'bg-white' : 'bg-[#e2f4ff]'}`}>
                    <td className="p-2 w-6 text-center border-l border-r">
                      <input type="checkbox" checked={selectedStudents.includes(s.id)} onChange={() => handleCheckboxChange(s.id)} />
                    </td>
                    <td className="p-2 w-8 border-l border-r">{i + 1}</td>
                    <td className="p-2 w-40 border-l border-r">{s.nisn}</td>
                    <td className="p-2 w-64 border-l border-r">{s.name}</td>
                    <td className="p-2 w-40 border-l border-r">{s.class} {s.jurusan?.singkatan} {s.rombel}</td>
                    <td className="p-2 w-64 border-l border-r">{s.phone}</td>
                    <td className="p-2 w-40 border-l border-r">{s.clubs?.map((club) => club.name).join(', ') || '-'}</td>
                  </tr>
                ))
              )}
              {!isLoading && filteredStudents.length === 0 && (
                <tr><td colSpan={7} className="text-center py-6 text-gray-500 font-semibold">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </main>

      <FilterDialog
        open={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Ekstrakurikuler"
        items={clubs}
        selectedItems={selectedClubs}
        onApply={setSelectedClubs}
        isLoading={isInitialDataLoading}
      />

    </div>
  )
}