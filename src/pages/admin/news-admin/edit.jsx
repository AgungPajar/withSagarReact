import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import apiClient from '@/utils/axiosConfig';
import { TextField, Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowLeft } from 'lucide-react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function EditNewsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await apiClient.get(`/admin/news/${id}`);
        const newsData = response.data.data;

        setTitle(newsData.title);
        setContent(newsData.content);
        setTags(newsData.tags.join(', '));
        setExistingImageUrl(newsData.imageUrl);

      } catch (error) {
        setMessage('Gagal mengambil data berita.');
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewsData();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');
    setErrors({});

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', tags);
    if (imageFile) {
      formData.append('imageUrl', imageFile);
    }
    formData.append('_method', 'PUT');

    try {
      await apiClient.post(`/admin/news/${id}`, formData);
      alert('Berita berhasil diupdate!');
      navigate('/admin/news');

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setMessage('Gagal update. Cek kembali isian Anda.');
        setErrors(error.response.data.errors);
      } else {
        setMessage('Terjadi kesalahan pada server.');
        console.error('Update error:', error);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading data...</div>;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Link to="/admin/news" style={{ textDecoration: 'none' }}>
          <Button startIcon={<ArrowLeft />} sx={{ mb: 2, textTransform: 'none' }}>
            Kembali ke Daftar Berita
          </Button>
        </Link>

        <Box component="div" sx={{ bgcolor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h5" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
            Edit Berita
          </Typography>

          {message && <Alert severity={Object.keys(errors).length > 0 ? 'error' : 'success'} sx={{ mb: 2 }}>{message}</Alert>}

          <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Judul Berita"
              variant="outlined"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title ? errors.title[0] : ''}
            />
            <TextField
              label="Isi Konten"
              variant="outlined"
              fullWidth
              multiline
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={!!errors.content}
              helperText={errors.content ? errors.content[0] : ''}
            />
            <TextField
              label="Tags (pisahkan dengan koma)"
              variant="outlined"
              fullWidth
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              error={!!errors.tags}
              helperText={errors.tags ? errors.tags[0] : ''}
            />

            <Box>
              <Button component="label" variant="outlined">
                Ganti Gambar Utama
                <VisuallyHiddenInput type="file" onChange={handleImageChange} />
              </Button>
              <Typography variant="body2" sx={{ display: 'inline', ml: 2 }}>
                {imageFile ? imageFile.name : 'No file chosen'}
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary" mb={1}>Preview:</Typography>
                <img
                  src={imagePreview || existingImageUrl}
                  alt="Preview"
                  style={{ borderRadius: '8px', maxHeight: '200px', width: 'auto' }}
                />
              </Box>
              {errors.imageUrl && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.imageUrl[0]}</Typography>}
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isUpdating}
              sx={{ py: 1.5 }}
            >
              {isUpdating ? <CircularProgress size={24} color="inherit" /> : 'Simpan Perubahan'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default EditNewsPage;