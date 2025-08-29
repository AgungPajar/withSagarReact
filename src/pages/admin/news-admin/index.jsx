import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '@/utils/axiosConfig';
import SidebarOsis from '@/components/layouts/SidebarOsis';

function NewsOverview() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await apiClient.get('/news');
        setNews(response.data.data);
      } catch (err) {
        setError('Gagal mengambil data berita.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin mau hapus berita ini?')) {
      return;
    }

    const token = localStorage.getItem('authToken');

    try {
      await apiClient.delete(`/admin/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNews(news.filter(item => item.id !== id));
      alert('Berita berhasil dihapus!');

    } catch (err) {
      alert('Gagal menghapus berita.');
      console.error(err);
    }
  };

  if (isLoading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarOsis isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} /> f
      <div className={`flex-1 flex flex-col p-4 pt-24 md:pt-16 w-full overflow-hidden transition-all duration-300 ${isSidebarExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">News</h1>
          <Link
            to="/admin/news/create"
            className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Tambah Berita
          </Link>
        </div>

        <div className="space-y-4">
          {news.length > 0 ? (
            news.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-32 h-32 sm:w-40 sm:h-auto object-cover"
                />
                <div className="p-4 flex flex-col justify-between flex-grow">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 line-clamp-2">{item.title}</h2>
                  </div>
                  <div className="flex items-center space-x-3 mt-4">
                    <Link
                      to={`/admin/news/edit/${item.id}`}
                      className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Belum ada berita.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsOverview;