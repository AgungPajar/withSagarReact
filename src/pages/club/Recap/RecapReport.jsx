// src/pages/.../RecapReportPage.jsx (atau apapun nama file lo)

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Typography, Button } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

import SidebarClub from '@/components/ClubDetail/SidebarClub';
import Footer from '@/components/layouts/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRecapReport } from '@/hooks/Clubs/useRecapRep';

export default function RecapReportPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { clubId } = useParams();

  const {
    loading,
    filteredReports,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    clearFilters,
  } = useRecapReport(clubId);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarClub isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

      <div className="flex-1 flex flex-col">
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex-1 p-6 transition-all duration-300 mt-20 sm:mt-2 ${isExpanded ? 'md:ml-[17vw]' : 'md:ml-[7vw]'}`}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full"><LoadingSpinner /></div>
          ) : (
            <Paper className="p-4 sm:p-6 rounded-xl shadow-lg">
							<Typography variant="h5" className="font-bold text-center pb-6">Rekap Laporan Kegiatan</Typography>
              
              {/* Filter Section */}
              <div className="mb-4 p-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row flex-wrap items-center gap-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Dari Tanggal" value={fromDate} onChange={setFromDate} format="DD/MM/YYYY" />
                  <DatePicker label="Sampai Tanggal" value={toDate} onChange={setToDate} format="DD/MM/YYYY" />
                </LocalizationProvider>
                <Button variant="outlined" onClick={clearFilters} sx={{ height: '56px' }}>
                  Reset Filter
                </Button>
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto">
                <table className="min-w-full border text-sm text-left">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border px-3 py-2">No</th>
                      <th className="border px-3 py-2">Tanggal</th>
                      <th className="border px-3 py-2">Foto</th>
                      <th className="border px-3 py-2">Materi</th>
                      <th className="border px-3 py-2">Tempat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-500">
                          Tidak ada laporan ditemukan.
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report, index) => (
                        <tr key={report.id} className="hover:bg-gray-50">
                          <td className="border px-3 py-2 w-10 text-center">{index + 1}</td>
                          <td className="border px-3 py-2 whitespace-nowrap">
                            {dayjs(report.date).format('DD MMMM YYYY')}
                          </td>
                          <td className="border px-3 py-2 text-center">
                            <a href={report.photo_url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={report.photo_url}
                                alt={`Laporan ${report.date}`}
                                className="w-20 h-20 object-cover rounded-md hover:scale-105 transition"
                              />
                            </a>
                          </td>
                          <td className="border px-3 py-2 min-w-[200px]">{report.materi}</td>
                          <td className="border px-3 py-2">{report.tempat}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Paper>
          )}
        </motion.main>
        <Footer />
      </div>
    </div>
  );
}