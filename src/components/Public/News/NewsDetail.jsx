import React, { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiUser, FiMessageSquare, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import { useParams, Link } from 'react-router-dom';
import apiClient from '@/utils/axiosConfig';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function NewsDetail() {
  const { slug } = useParams();
  const [news, setNews] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [nextPost, setNextPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      setNews(null);
      try {
        const [newsResponse, recentResponse] = await Promise.all([
          apiClient.get(`/news/${slug}`),
          apiClient.get('/news/random')
        ]);

        const currentNews = newsResponse.data.data;
        const recentData = recentResponse.data.data;

        setNews(currentNews);
        setRecentPosts(recentData);

        const currentIndex = recentData.findIndex(p => p.id === currentNews.id);
        if (currentIndex !== -1 && currentIndex < recentData.length - 1) {
          setNextPost(recentData[currentIndex + 1]);
        } else {
          setNextPost(null);
        }
        // ------------------------------------

      } catch (error) {
        console.error("Gagal mengambil detail berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [slug]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) return <LoadingSpinner/>
  if (!news) return <div className="text-center py-20">Berita tidak ditemukan.</div>;

  return (
    <div className="bg-white font-sans">
      <div className="container mx-auto max-w-6xl px-4 py-8 lg:py-12">
        <Link to="/" className="relative flex items-center mb-8 text-gray-700 hover:text-main">
          <FiArrowLeft className="text-2xl" />

          <span className="absolute left-1/2 -translate-x-1/2 font-semibold text-lg">
            Back To Dashboard
          </span>
        </Link>
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          <main className="w-full lg:w-2/3">
            <article>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                {news.title}
              </h1>

              <div className="flex items-center space-x-4 text-gray-500 text-sm mb-6">
                <div className="flex items-center space-x-2"><FiCalendar /><span>{formatDate(news.created_at)}</span></div>
                <div className="flex items-center space-x-2"><FiUser /><span>{news.author}</span></div>
              </div>

              <img src={news.imageUrl} alt={news.title} className="w-full h-auto max-h-[500px] object-cover rounded-lg mb-8" />

              <div className="prose max-w-none text-gray-700 space-y-4">
                <p>{news.content}</p>
              </div>

              <div className="mt-8">
                <span className="font-semibold mr-2">Tags:</span>
                {news.tags.map(tag => (
                  <span key={tag} className="inline-block bg-gray-100 text-gray-600 text-sm rounded-md px-3 py-1 mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>

              {nextPost && (
                <div className="mt-10 border-t border-gray-200 pt-6 flex justify-end">
                  <Link to={`/news/${nextPost.id}`} className="text-right group">
                    <span className="text-sm text-gray-500">Next Post</span>
                    <p className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {nextPost.title}
                    </p>
                  </Link>
                </div>
              )}
            </article>
          </main>

          <aside className="w-full lg:w-1/3 mt-12 lg:mt-0">
            <div className="sticky top-8 space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4 pb-2 border-b-2 border-indigo-500 inline-block">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.filter(p => p.id !== news.id).slice(0, 3).map((post) => (
                    <Link to={`/news/${post.id}`} key={post.id} className="flex items-center space-x-4 group">
                      <img src={post.imageUrl} alt={post.title} className="w-20 h-20 object-cover rounded-md" />
                      <div>
                        <p className="font-semibold text-gray-800 group-hover:text-indigo-600 leading-tight">{post.title}</p>
                        <span className="text-sm text-gray-500 mt-1 flex items-center"><FiCalendar className="mr-1.5" />{formatDate(post.created_at)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}