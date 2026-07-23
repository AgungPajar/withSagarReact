import React, { useState } from 'react';
import axios from 'axios';
import apiClient from '../../utils/axiosConfig';
import Swal from 'sweetalert2';

const TTSForm = () => {
  const [isAnon, setIsAnon] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Isi pesan dulu bro!',
        confirmButtonColor: '#3B82F6',
      });
      return;
    }

    setLoading(true);

    try {
      await apiClient.post('/ttsform', {
        name: isAnon ? 'Anonymous' : name,
        message,
      });

      Swal.fire({
        title: 'DONE CUYY!!',
        text: 'kalau mau ngobrol ngobrol boleh dm ig yaaa @ossagar59',
        icon: 'success',
        confirmButtonText: 'iyaa',
        customClass: {
          confirmButton: 'border-2 border-blue-500 text-blue-500 rounded-lg px-5 py-2 font-semibold transition duration-200 hover:bg-blue-200 hover:text-white hover:border-blue-200',
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/';
        }
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal kirim cuy!',
        text: 'Coba lagi nanti ya.',
        confirmButtonColor: '#EF4444',
      });
    }

    setLoading(false);
  };



  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-400 to-purple-500 px-4 md:px-6 pt-12 pb-8">
      {/* Header */}
      <div className="flex justify-center mb-16 relative w-full px-4">
        {/* Wadah Header */}
        <div className="bg-white border-4 border-blue-500 rounded-full h-[48px] flex items-center justify-between px-6 gap-4 shadow-lg w-full max-w-md">
          <span className="text-blue-700 font-bold text-xs md:text-sm">TALK TO SAGAR</span>
          <div className="w-[60px] h-[60px]"></div>
          <span className="text-blue-700 font-bold text-xs md:text-sm">OSSAGAR 59</span>
        </div>

        {/* Logo Tengah */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] bg-white rounded-full border-4 border-blue-600 flex items-center justify-center shadow-lg z-10">
          <img
            src="/smealogo.png"
            alt="Logo"
            className="w-[60px] h-[60px] object-contain"
          />
        </div>
      </div>

      {/* FROM Box */}
      <div className="mb-8 bg-white p-5 rounded-2xl border-4 border-blue-500 shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-semibold text-sm md:text-base">FROM:</label>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAnon}
              onChange={() => setIsAnon(!isAnon)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="font-medium text-sm md:text-base">Anonymous</span>
          </div>

          {!isAnon && (
            <input
              type="text"
              placeholder="Masukkan nama"
              className="w-full px-4 py-2 rounded-md bg-gray-100 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </form>
      </div>

      {/* Kritik & Saran Box */}
      <div className="mb-20 w-full max-w-md shadow-lg rounded-3xl overflow-hidden border border-black">
        {/* Bagian Atas (Judul) */}
        <div className="bg-white px-5 py-4">
          <h2 className="text-blue-700 font-bold text-center text-lg md:text-xl">
            KIRIM LAPORAN ATAU KRITIK DAN SARAN
          </h2>
        </div>

        {/* Garis Pembatas */}
        <div className="h-[1px] bg-black" />

        {/* Bagian Bawah (Textarea) */}
        <div className=" px-5 py-4 bg-white/20 backdrop-blur-sm rounded-b-3xl">
          <textarea
            placeholder="MASUKAN DISINI..."
            className="w-full bg-transparent placeholder-gray-700 text-lg font-semibold outline-none resize-none min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>


      {/* Tombol Kirim Box */}
      <div className="mb-5 w-full max-w-md">
        <button
          onClick={handleSubmit}
          type="button"
          disabled={loading}
          className={`w-full shadow-md text-white py-3 rounded-xl font-semibold transition ${loading ? 'bg-blue-700 cursor-wait' : 'bg-blue-900 hover:bg-blue-800'
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span>MENGIRIM...</span>
            </div>
          ) : 'KIRIM'}

        </button>

      </div>
    </div>
  );
};

export default TTSForm;