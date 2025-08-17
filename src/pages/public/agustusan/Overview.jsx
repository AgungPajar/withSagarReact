import {
  Button,
  Paper,
  Typography,
  Box,
} from '@mui/material';

export default function overview() {
  const games = [
    { href: "/agustusan/fd", img: "/assets/1.png", name: "Futsal Daster" },
    { href: "/agustusan/ti", img: "/assets/2.png", name: "Tarik Tambang Putra" },
    { href: "/agustusan/ti", img: "/assets/2i.png", name: "Tarik Tambang Putri" },
    { href: "/agustusan/bk", img: "/assets/3.png", name: "Bakiak" },
    { href: "/agustusan/ka", img: "/assets/4.png", name: "Balap Karung" },
    { href: "/agustusan/ke", img: "/assets/5.png", name: "Balap Kelereng" },
    { href: "/agustusan/bn", img: "/assets/6.png", name: "Buntut Naga" },
    { href: "/agustusan/kk", img: "/assets/8.png", name: "Makan Kerupuk" },
    { href: "/agustusan/pb", img: "/assets/7.png", name: "PBBAB" },
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-6 flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/lombabg.jpg')",  // Ganti dengan URL gambar kamu
        filter: 'brightness(1)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f5f5f5', // Fallback warna jika gambar gagal dimuat
        backgroundAttachment: 'fixed', // Optional: agar efek parallax saat scroll
      }}
    >

      <Paper
        className="p-6 mt-10 w-full max-w-md"
        sx={{
          borderRadius: '20px',
          border: '2px solid #ED1C24', // Biru muda
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Box shadow hitam
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box align="center" sx={{ mb: 2 }}>
          <img
            src="/smealogo.png"
            alt="Logo OSSAGAR"
            style={{
              width: '100px',
              height: 'auto',
            }}
          />
        </Box>

        {/* Judul OSSAGAR 59 */}
        <Typography variant="h4" align="center" gutterBottom>
          OSSAGAR 59
        </Typography>

        {/* Subjudul (Pendaftaran Lomba POREST 2025) */}
        <Typography variant="h6" align="center" gutterBottom>
          <span className='font-bold text-xl'><span className='text-red-600'>SORAK</span> 2025 </span>
          <br />
          Lomba Agustusan 2025
        </Typography>

        {/* Deskripsi Pendaftaran */}
        <Typography variant="body1" className='border-b border-gray-500 pb-3' align="start" sx={{ mt: 2 }}>
          Halo sobat sagar 👋🏻 Salam Kemerdekaan 💪🏻 <br /> <br />

          Indonesia sudah merdeka selama 80 tahun, dan ini saatnya kita semua memeriahkan kemerdekaan ini dengan mengikuti berbagai macam lomba sebagai salah satu cara kita untuk berpartisipasi memeriahkan kemerdekaan yang ke-80 ini! <br /> <br />

          Ini adalah formulir pendaftaran bagi kalian yang akan berpartisipasi untuk memeriahkan acara Carnaval Independent Day di tahun ini, selamat bersaing dengan sehat dan seruu 🤩
        </Typography>

        {/* Batas Akhir Pendaftaran */}
        <Typography variant="body1" align="start" sx={{ mt: 2 }}>
          Batas akhir pendaftaran:
        </Typography>

        <Typography variant="body1" align="start" sx={{ mt: 2 }}>
          GUIDE BOOK PERLOMBAAN
          <br />
          <Button
            variant="contained"
            color="primary"
            href="https://drive.google.com/drive/folders/1TuR40dNPGASyPTOMztYLnDQfk_PXp8P_?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textTransform: 'none',
              backgroundColor: '#90caf9',
              '&:hover': {
                backgroundColor: '#36a4fe',
              },
              mt: 2
            }}
          >
            Buka Guide Book Lomba
          </Button>
        </Typography>
      </Paper>

      <Paper className="p-6 mt-10 w-full max-w-md" sx={{
        borderRadius: '20px',
        border: '2px solid #ED1C24',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }}>

        <Typography variant="h5" align="center" gutterBottom>
          PILIH MATA LOMBA
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map((game, index) => (
            <a
              key={index}
              href={game.href}
              className="text-center font-semibold text-gray-600 group"
            >
              <div className="border border-black/20 rounded-xl overflow-hidden shadow-md transition-all">
                <div className="relative">
                  <img
                    src={game.img}
                    alt={game.name}
                    className="w-full h-auto aspect-[1/1] object-cover"
                  />
                  <div className="absolute inset-0 bg-transparent group-hover:bg-black/50 transition-all duration-150 flex flex-col justify-center items-center text-white text-center px-4">
                    <div className="w-50 hidden group-hover:block">
                      <p className="font-bold text-lg text-white font-fredoka">
                        {game.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </Paper>

      {/* Footer */}
      <Box sx={{ mt: 2, mb: 5 }}>
        <Typography variant="body2" align="center">
          2025 © OSIS SMKN 1 GARUT
        </Typography>

        <Typography variant="body1" align="center" sx={{ mt: 2 }}>
          by{' '}
          <a
            href="https://www.instagram.com/jarss_pajar"  // Ganti dengan URL Instagram sebenarnya
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#1976d2', // Biru untuk PPLG
              textDecoration: 'underline', // Garis bawah
              cursor: 'pointer', // Menunjukkan pointer saat dihover
            }}
          >
            JARSS
          </a>
        </Typography>
      </Box>

    </div>
  );
};
