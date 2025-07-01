import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { Autoplay, Navigation, EffectCoverflow } from 'swiper/modules';
import apiClient, { STORAGE_URL } from '../utils/axiosConfig';
import { motion } from 'framer-motion';
import '../css/EkskulSliderHome.css';

const EkstrakurikulerSlider = () => {
  const [clubs, setClubs] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await apiClient.get('clubs');
        setClubs(response.data);
      } catch (error) {
        console.error('Gagal mengambil data ekstrakurikuler:', error);
      }
    };
    fetchClubs();
  }, []);

  return (
    <div className="bg-blue-100 py-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
      <div className="max-w-6xl mx-auto px-4 pt-7 sm:px-6 lg:px-8 relative">
        {/* Navigasi Panah */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-200"
        >
          ◀
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white shadow rounded-full hover:bg-gray-200"
        >
          ▶
        </button>

        <Swiper
          effect="coverflow"
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={25}
          centeredSlides={true}
          pagination={false}
          navigation={false}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[Autoplay, Navigation, EffectCoverflow]}
          className="!overflow-visible overflow-x-hidden"
        >
          {clubs.map((club) => (
            <SwiperSlide key={club.hash_id} className="flex justify-center px-4 sm:px-0">
              {({ isActive }) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: isActive ? 1.05 : 0.9,
                    opacity: isActive ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl border shadow p-6 text-center w-full max-w-xs"
                >
                  <div className="bg-gray-200 aspect-square flex items-center justify-center mb-4 rounded-lg overflow-hidden p-4 max-h-32 mx-auto">
                    {club.logo_path ? (
                      <img
                        src={
                          club?.logo_path
                            ? `${STORAGE_URL}/${club.logo_path}`
                            : '/logoeks.png'
                        }
                        alt={club.name}
                        className="object-contain w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28"
                      />
                    ) : (
                      <span className="text-black font-bold">LOGO</span>
                    )}
                  </div>
                  <h3 className="font-bold">{club.name}</h3>
                  <p className="text-sm text-gray-500">{club.description}</p>
                  <button className="mt-2 px-4 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300">
                    Lihat
                  </button>
                </motion.div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default EkstrakurikulerSlider;
