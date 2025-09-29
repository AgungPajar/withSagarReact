import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '@/utils/axiosConfig';
import { ArrowLeft } from 'lucide-react';

function CreateNewsPage() {
  const navigate = useNavigate(); 

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(''); 

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setErrors({});

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tags);
    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }

    try {
      await apiClient.post('/admin/news', formData,);

      alert('Berita berhasil diposting!');
      navigate('/admin/news'); 
      
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setMessage('Gagal memposting. Cek kembali isian Anda.');
        setErrors(error.response.data.errors);
      } else {
        setMessage('Terjadi kesalahan pada server. Silakan coba lagi.');
        console.error('Submit error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/admin/news" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4">
          <ArrowLeft size={20} />
          Kembali ke Daftar Berita
        </Link>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Tambah Berita Baru</h2>
          
          {message && <div className={`p-3 mb-4 rounded-md text-sm ${Object.keys(errors).length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Judul Berita</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Isi Konten</label>
              <textarea id="content" rows="8" value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content[0]}</p>}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (pisahkan dengan koma)</label>
              <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="contoh: sekolah, prestasi, lomba" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags[0]}</p>}
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Gambar Utama</label>
              <input type="file" id="imageUrl" onChange={handleImageChange} required  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 rounded-md max-h-48" />}
              {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl[0]}</p>}
            </div>

            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
                {isLoading ? 'Menyimpan...' : 'Simpan Berita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateNewsPage;