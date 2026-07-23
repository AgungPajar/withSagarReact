import React, { useState, useEffect } from 'react'
import apiClient from '@/utils/axiosConfig'
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react'
import SkeletonCard from '../News/SkeletonCard'

function LatestNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRandomNews = async () => {
      try {
        const response = await apiClient.get('/news/random')
        setNews(response.data.data.slice(0, 4))
      } catch (error) {
        console.error("Gagal mengambil berita terbaru:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRandomNews()
  }, [])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

 if (loading) {
    return (
      <section className="bg-[#f0f2f5] py-12 px-4 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-8">
            <p className="text-[#b8860b] font-bold tracking-widest">NEWS</p>
            <h2 className="text-3xl font-bold text-[#333]">Informasi Terbaru</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#f0f2f5] py-12 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[#b8860b] font-bold tracking-widest">NEWS</p>
          <h2 className="text-3xl font-bold text-[#333]">Informasi Terbaru</h2>
        </div>

        {/* Grid berita */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((item) => (
            <Link to={`/news/${item.slug}`} key={item.id} className="block w-full h-full">
              <div
                key={item.id}
                className="flex flex-col md:flex-row w-full h-full bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer overflow-hidden"
              >
                {/* Image */}
                <div className="w-full md:w-[300px] min-h-[220px] sm:min-h-[250px] md:min-h-[280px] max-h-[250px]">

                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>


                {/* Content */}
                <div className="flex-1 flex flex-col p-4 min-h-[200px] md:min-h-[250px]">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar size={16} className="mr-2" />
                    <span className="text-sm">{formatDate(item.created_at)}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[#333] line-clamp-2 break-words">
                    {item.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestNews
