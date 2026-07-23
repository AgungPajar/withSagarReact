import React, { useEffect, useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { Autoplay, Navigation, EffectCoverflow } from 'swiper/modules';
import apiClient, { STORAGE_URL } from '../utils/axiosConfig';
import { motion } from 'framer-motion';
import { Button } from '@mui/material'

const EkskulSlider = React.forwardRef(({ onLoadFinish }, ref) => {
  const [clubs, setClubs] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await apiClient.get('clubs');
        setClubs(response.data);
      } catch (error) {
        console.error('Gagal mengambil data ekskul:', error);
      } finally {
        if (onLoadFinish) onLoadFinish();
      }
    };

    fetchClubs();
  }, [onLoadFinish]);

  return (
    <div ref={ref} className="bg-gradient-to-b from-white via-color-main/60 to-white py-10 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-0">
      <div className="max-w-6xl mx-auto px-4 pt-7 sm:px-6 lg:px-8 relative">
        <h1 className='text-2xl sm:text-4xl font-bold text-center text-color-main pb-12'>EKSTRAKURIKULLER</h1>
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
            <SwiperSlide key={club.hash_id} className="flex justify-center px-14 sm:px-0">
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
                  className="bg-gradient-to-br from-white via-blue-50 to-blue-100 border-2 border-color-secondary shadow-[0_4px_20px_rgba(0,0,0,0.4)] rounded-2xl p-6 text-center w-full max-w-xs"
                >
                  <div className="bg-gray-200 aspect-square flex items-center justify-center mb-4 rounded-lg overflow-hidden p-4 max-h-32 mx-auto">
                    {club.logo_path ? (
                      <img
                        src={`${STORAGE_URL}/${club.logo_path}`}
                        alt={club.name}
                        className="object-contain w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                      />
                    ) : (
                      <span className="text-black font-bold">LOGO</span>
                    )}
                  </div>
                  <h3 className="font-bold text-blue-700">{club.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{club.description}</p>
                </motion.div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* <div className='flex justify-center pt-8'>
          <button className='text-color-secondary font-medium text-lg bg-color-main py-2 px-4 rounded-lg'>
            Lihat Detail
          </button>
        </div> */}

      </div>
    </div>
  );
});

export default EkskulSlider;
