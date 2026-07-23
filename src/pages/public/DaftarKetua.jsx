import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import apiClient from '../../utils/axiosConfig';

// Custom Searchable Dropdown with Neobrutalism Style
const NeobrutalSelect = ({ options, value, onChange, name, placeholder, isObject, allowCreate, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  // Filter options based on search
  const filteredOptions = options.filter((opt) => {
    const label = isObject ? opt.name || opt.nama : opt;
    return label?.toLowerCase().includes(search.toLowerCase());
  });

  // Get display value
  const displayValue = () => {
    if (!value) return placeholder;
    if (isObject) {
      const selected = options.find((opt) => opt.id === value || opt.hash_id === value);
      return selected ? (selected.name || selected.nama) : value; // value as fallback if created
    }
    return value;
  };

  const handleSelect = (selectedValue) => {
    onChange({ target: { name, value: selectedValue } });
    setIsOpen(false);
    setSearch('');
  };

  const handleCreate = () => {
    if (search.trim() !== '') {
      onChange({ target: { name, value: search.trim() } });
      setIsOpen(false);
      setSearch('');
    }
  };

  const exactMatchExists = filteredOptions.some((opt) => {
    const label = isObject ? opt.name || opt.nama : opt;
    return label?.toLowerCase() === search.toLowerCase();
  });

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full border-4 border-black p-3 font-bold outline-none flex justify-between items-center transition-all ${
          disabled 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
            : 'bg-white cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px]'
        }`}
      >
        <span className="truncate">{displayValue()}</span>
        <span className="ml-2 font-black">▼</span>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="p-2 border-b-4 border-black bg-gray-100">
            <input 
              type="text" 
              placeholder="Cari atau ketik..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-2 border-black p-2 bg-white font-bold outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, index) => {
                const optValue = isObject ? (opt.hash_id || opt.id) : opt;
                const optLabel = isObject ? (opt.name || opt.nama) : opt;
                return (
                  <div 
                    key={index}
                    onClick={() => handleSelect(optValue)}
                    className="p-3 font-bold border-b-2 border-gray-200 cursor-pointer hover:bg-lime-300 hover:border-black transition-colors"
                  >
                    {optLabel}
                  </div>
                );
              })
            ) : null}

            {filteredOptions.length === 0 && !allowCreate && (
              <div className="p-3 font-bold text-gray-500 text-center">
                Tidak ditemukan
              </div>
            )}

            {allowCreate && search.trim() !== '' && !exactMatchExists && (
              <div 
                onClick={handleCreate}
                className="p-3 font-bold bg-yellow-300 border-t-2 border-black cursor-pointer hover:bg-yellow-400 transition-colors text-center"
              >
                + Tambahkan "{search}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function DaftarKetua() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State untuk data dari Backend
  const [clubs, setClubs] = useState([]);
  const [jurusans, setJurusans] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    ekskul: '',
    grup_wa: '',
    nisn: '',
    nama: '',
    username: '',
    tingkatan: '',
    jurusan: '',
    kelas: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const dummyTingkatan = ['X', 'XI', 'XII'];

  // 1. Dapatkan singkatan jurusan jika sudah milih jurusan
  let singkatanJurusan = '';
  if (formData.jurusan && jurusans.length > 0) {
    const selectedJurusan = jurusans.find(j => j.id === formData.jurusan || j.hash_id === formData.jurusan);
    if (selectedJurusan) {
      singkatanJurusan = selectedJurusan.singkatan || selectedJurusan.nama;
    } else {
      // kalau input manual hasil creatable
      singkatanJurusan = formData.jurusan;
    }
  }

  // 2. Generate opsi kelas secara dinamis
  let opsiKelasDinamis = [];
  if (formData.tingkatan && singkatanJurusan) {
    opsiKelasDinamis = [
      `${formData.tingkatan} ${singkatanJurusan} 1`,
      `${formData.tingkatan} ${singkatanJurusan} 2`,
      `${formData.tingkatan} ${singkatanJurusan} 3`,
    ];
  } else {
    opsiKelasDinamis = ['1', '2', '3', '4', '5', '6'];
  }

  useEffect(() => {
    // Ambil ekskul dan jurusan dari backend
    const fetchData = async () => {
      try {
        const [resClubs, resJurusans] = await Promise.all([
          apiClient.get('/clubs'),
          apiClient.get('/jurusans')
        ]);
        
        // Asumsi response format Laravel resource collection atau array biasa
        setClubs(resClubs.data.data || resClubs.data || []);
        
        // Kadang di api getJurusans balikin array string, kadang array of object. Kita handle.
        const jurData = resJurusans.data.data || resJurusans.data || [];
        setJurusans(jurData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  // Kalau tingkatan ganti, reset jurusan dan kelas
  // Kalau jurusan ganti, reset kelas
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'tingkatan') {
        newData.jurusan = '';
        newData.kelas = '';
      }
      if (name === 'jurusan') {
        newData.kelas = '';
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      Swal.fire('Error', 'Password dan Konfirmasi Password tidak cocok!', 'error');
      return;
    }
    
    if (!formData.ekskul || !formData.tingkatan || !formData.jurusan || !formData.kelas) {
        Swal.fire('Error', 'Harap isi semua dropdown yang wajib!', 'warning');
        return;
    }

    setIsLoading(true);
    try {
      console.log('Data yang disubmit:', formData);
      
      // Request aslinya (Buka komentar ini kalau endpoint backend udah siap)
      // await apiClient.post('/register-ketua', formData);
      
      // Simulasi
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Pendaftaran Ketua Ekskul berhasil dikirim (simulasi).',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none'
        },
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Gagal!', 
        text: 'Gagal mendaftar. Silakan coba lagi.', 
        icon: 'error',
        customClass: {
          confirmButton: 'border-4 border-black bg-red-500 text-white font-black px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all',
          popup: 'border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-none'
        },
        buttonsStyling: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF4E0] py-12 px-4 font-mono text-black selection:bg-pink-400">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Title */}
        <div className="mb-10 text-center">
          <div className="inline-block bg-pink-400 border-4 border-black px-6 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-2">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Daftar Ketua Ekskul</h1>
          </div>
          <p className="mt-6 font-bold text-lg max-w-md mx-auto bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-1">
            SEMANGATT PENGURUSSS!!!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Data Ekskul */}
          <div className="bg-cyan-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-4 -left-4 bg-yellow-300 border-4 border-black px-4 py-1 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              #1 DATA EKSKUL
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col space-y-2">
                <label className="font-bold text-black uppercase">Pilih Ekskul</label>
                <NeobrutalSelect 
                  options={clubs}
                  value={formData.ekskul}
                  onChange={handleChange}
                  name="ekskul"
                  placeholder={clubs.length === 0 ? "Loading Ekskul..." : "-- Pilih Ekskul --"}
                  isObject={true}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-bold text-black uppercase">Link Grup WA</label>
                <input 
                  type="text"
                  name="grup_wa"
                  value={formData.grup_wa}
                  onChange={handleChange}
                  required
                  placeholder="https://chat.whatsapp.com/..."
                  className="w-full border-4 border-black p-3 bg-white font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all placeholder-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Data Pribadi */}
          <div className="bg-fuchsia-300 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-4 -right-4 bg-lime-400 border-4 border-black px-4 py-1 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              #2 DATA PRIBADI
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col space-y-2">
                <label className="font-bold text-black uppercase">NISN</label>
                <input 
                  type="number"
                  name="nisn"
                  value={formData.nisn}
                  onChange={handleChange}
                  required
                  className="w-full border-4 border-black p-3 bg-white font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-bold text-black uppercase">Nama Lengkap</label>
                <input 
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="w-full border-4 border-black p-3 bg-white font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-bold text-black uppercase">Tingkatan</label>
                <NeobrutalSelect 
                  options={dummyTingkatan}
                  value={formData.tingkatan}
                  onChange={handleChange}
                  name="tingkatan"
                  placeholder="-- Pilih Tingkatan --"
                  isObject={false}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-bold text-black uppercase">Jurusan</label>
                <NeobrutalSelect 
                  options={jurusans}
                  value={formData.jurusan}
                  onChange={handleChange}
                  name="jurusan"
                  placeholder={
                    !formData.tingkatan ? "Pilih Tingkatan Dulu" : 
                    jurusans.length === 0 ? "Loading Jurusan..." : "-- Pilih Jurusan --"
                  }
                  isObject={typeof jurusans[0] === 'object'} 
                  allowCreate={true}
                  disabled={!formData.tingkatan}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-bold text-black uppercase">Kelas / Rombel</label>
                <NeobrutalSelect 
                  options={opsiKelasDinamis}
                  value={formData.kelas}
                  onChange={handleChange}
                  name="kelas"
                  placeholder={!formData.jurusan ? "Pilih Jurusan Dulu" : "Ketik Kelas Baru / Pilih"}
                  isObject={false}
                  allowCreate={true}
                  disabled={!formData.jurusan}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Data Akun */}
          <div className="bg-orange-400 border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute -top-4 -left-4 bg-white border-4 border-black px-4 py-1 font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              #3 DATA AKUN
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="flex flex-col space-y-2">
                <label className="font-bold text-black uppercase">Username</label>
                <input 
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full border-4 border-black p-3 bg-white font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="font-bold text-black uppercase">Email</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-4 border-black p-3 bg-white font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all"
                />
              </div>
              
              <div className="flex flex-col space-y-2 relative">
                <label className="font-bold text-black uppercase">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border-4 border-black p-3 bg-white font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all pr-12"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 border-2 border-black bg-yellow-300 p-1 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 relative">
                <label className="font-bold text-black uppercase">Konfirmasi Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    className="w-full border-4 border-black p-3 bg-white font-bold outline-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all pr-12"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 border-2 border-black bg-yellow-300 p-1 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    {showConfirmPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
                {formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation && (
                  <span className="text-white bg-red-600 border-2 border-black font-bold p-1 mt-2 text-xs inline-block">
                    PASSWORD TIDAK SAMA!
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 pb-12 flex flex-col items-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`text-2xl w-full max-w-lg font-black uppercase bg-lime-400 border-4 border-black py-4 px-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-lime-500 hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all flex items-center justify-center gap-3 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {isLoading ? 'Mendaftarkan...' : 'GASS DAFTAR!'}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate('/login')}
              className="mt-6 font-bold bg-white border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              Udah punya akun? Balik ke Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
