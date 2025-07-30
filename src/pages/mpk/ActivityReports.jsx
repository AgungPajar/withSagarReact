import { useEffect, useState } from "react";
import apiClient from "../../utils/axiosConfig";
import SidebarAdmin from "../../components/SidebarMPK"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function AdminActivityReport() {
  const [allReports, setAllReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    fetchReports();
  }, []);
  useEffect(() => {
    const formattedDate = selectedDate.format("YYYY-MM-DD");

    const filtered = allReports.filter((r) => r.date === formattedDate);
    setFilteredReports(filtered);
  }, [allReports]); // jalan pas allReports ke-load


  const fetchReports = async () => {
    try {
      const res = await apiClient.get("/admin/activity-reports");
      setAllReports(res.data.data);
      setFilteredReports(res.data.data); // default: tampil semua
    } catch (err) {
      console.error("Gagal fetch laporan", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);

    if (!newValue) {
      setFilteredReports(allReports);
      return;
    }

    const formattedDate = newValue.format("YYYY-MM-DD");

    const filtered = allReports.filter((r) => r.date === formattedDate);
    setFilteredReports(filtered);
  };


  return (
    <div className="min-h-screen bg-white flex font-poppins">
      <SidebarAdmin />
      <main className="flex-1 p-4 pt-24 md:pt-16 md:ml-64 w-full">
        <h1 className="text-2xl font-bold mb-4">Semua Laporan Kegiatan Ekskul</h1>

        <div className="py-6 ">
          <label className="font-medium mr-5">Filter Tanggal: </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Tanggal"
              value={selectedDate}
              format="YYYY-MM-DD"
              onChange={handleDateChange}
            />
          </LocalizationProvider>

        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2 ">No</th>
                  <th className="text-left px-4 py-2">Foto</th>
                  <th className="text-left px-4 py-2">Nama Ekskul</th>
                  <th className="text-left px-4 py-2">Materi</th>
                  <th className="text-left px-4 py-2">Tempat</th>
                  <th className="text-left px-4 py-2">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report, index) => (
                  <tr key={report.id}>
                    <td className="px-4 py-2 text-center w-8">{index + 1}</td>
                    <td className="px-4 py-2 w-10">
                      <img
                        src={report.photo_url}
                        alt="Foto"
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">{report.club?.name || "N/A"}</td>
                    <td className="px-4 py-2">{report.materi}</td>
                    <td className="px-4 py-2">{report.tempat}</td>
                    <td className="px-4 py-2">{report.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
