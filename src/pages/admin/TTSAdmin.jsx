import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import apiClient from '@/utils/axiosConfig';
import SiderbarAdmin from '@/components/layouts/SidebarOsis';
import Swal from 'sweetalert2';

const AdminTTSList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await apiClient.get('/admin/ttsform');
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedback:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleDownload = async (id) => {
    const original = document.getElementById(`card-${id}`);
    if (!original) return;

    const clone = original.cloneNode(true);
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.width = getComputedStyle(original).width;
    clone.style.borderRadius = '1rem';
    clone.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
    clone.style.background = '#ffffff';
    clone.style.padding = '1rem';
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.boxSizing = 'border-box';

    // Label
    const label = clone.querySelector('.label-text');
    if (label) {
      label.style.padding = '4px 12px';
      label.style.paddingBottom = '12px';
      label.style.fontWeight = '800';
      label.style.backgroundColor = '#7dd3fc';
      label.style.color = '#1e3a8a';
      label.style.fontSize = '10px';
      label.style.borderTopRightRadius = '0.5rem';
      label.style.borderBottomLeftRadius = '0.5rem';
      label.style.whiteSpace = 'nowrap';
    }

    // Name
    const maxChars = 14;
    const name = clone.querySelector('.name-text');
    if (name) {
      let originalName = name.textContent;
      if (originalName.length > maxChars) {
        name.textContent = originalName.substring(0, maxChars) + '...';
      }
      name.style.whiteSpace = 'nowrap';
      name.style.overflow = 'hidden';
      name.style.textOverflow = 'ellipsis';
      name.style.fontSize = '11px';
      name.style.maxWidth = '100px';
      name.style.paddingBottom = '8px';
      name.style.fontWeight = '500';
      name.style.color = '#1f2937';
    }

    // Message
    const message = clone.querySelector('.message-content');
    if (message) {
      message.style.fontSize = '16px';
      message.style.lineHeight = '1.5';
      message.style.whiteSpace = 'pre-wrap';
      message.style.display = 'block';
      message.style.overflow = 'visible';
      message.style.webkitLineClamp = 'unset';
      message.style.maxHeight = 'none';
    }

    // Hide dropdown & titik tiga
    const menu = clone.querySelector('.dropdown-menu');
    if (menu) menu.style.display = 'none';

    const menuBtn = clone.querySelector('.menu-button');
    if (menuBtn) menuBtn.style.display = 'none';

    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      backgroundColor: null,
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `feedback-${id}.png`;
    link.click();

    document.body.removeChild(clone);
  };

  const handleDownloadAll = async () => {
    for (const item of feedbacks) {
      await handleDownload(item.id);
      // kasih delay dikit biar browser gak nge-freeze
      await new Promise((r) => setTimeout(r, 300));
    }
  };


  return (
    <div className="min-h-screen bg-white flex font-poppins">
      <SiderbarAdmin />
      <main className="flex-1 p-4 pt-24 md:pt-16 md:ml-64 w-full">
        <h1 className="text-2xl font-bold mb-6">TALK TO SAGAR</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={handleDownloadAll}
        >
          ⬇️ Download Semua
        </button>


        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {feedbacks.map((item) => (
              <div key={item.id} className="flex justify-center">
                <div
                  id={`card-${item.id}`}
                  className="w-full max-w-md bg-white rounded-2xl border-2 border-blue-500 shadow-lg p-4 relative"
                  onClick={() =>
                    Swal.fire({
                      title: `<strong class="text-lg text-blue-700">${item.name}</strong>`,
                      html: `<p class="text-sm text-gray-700">${item.message}</p>`,
                      imageUrl: '/ttslogo.png',
                      imageWidth: 90,
                      imageAlt: 'TTS LOGO',
                      showCloseButton: true,
                      showCancelButton: true,
                      focusConfirm: false,
                      confirmButtonText: 'Tutup',
                      cancelButtonText: 'Download',
                      background: '#fff',
                      customClass: {
                        popup: 'rounded-2xl border-2 border-blue-500 shadow-md p-4',
                        title: 'font-semibold',
                        confirmButton: 'bg-red-300 text-black px-4 py-2 rounded-lg hover:bg-red-400 transition',
                        cancelButton: 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition',
                        htmlContainer: 'mt-2 text-left',
                      },
                    }).then((result) => {
                      if (result.dismiss === Swal.DismissReason.cancel) {
                        handleDownload(item.id);
                      }
                    })
                  }
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="label-text bg-sky-300 px-4 py-1 rounded-tr-lg rounded-bl-lg font-extrabold text-blue-800 text-[10px] shadow-sm tracking-wide uppercase">
                        TALK TO SAGAR
                      </div>
                      <span className="name-text text-[11px] text-gray-800 font-medium truncate max-w-[100px]">
                        {item.name}
                      </span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenu(activeMenu === item.id ? null : item.id)
                        }
                        className="menu-button text-gray-700 hover:text-black"
                        title="Menu"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M6 10a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z" />
                        </svg>
                      </button>
                      {activeMenu === item.id && (
                        <div className="dropdown-menu absolute right-0 mt-2 bg-white border rounded shadow-lg z-20 w-40">
                          {/* Titik Tiga */}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <p className="message-content text-[16px] text-black font-medium leading-relaxed whitespace-pre-wrap overflow-hidden line-clamp-6">
                    {item.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
        }
      </main >
    </div >
  );
};

export default AdminTTSList;
