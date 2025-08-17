import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AddMemberDialog = ({ open, onClose, searchName, setSearchName, students, onAdd }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>
      Tambah Anggota Baru
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers>
      <TextField
        fullWidth
        label="Cari Nama atau NISN"
        variant='outlined'
        size='small'
        className='mb-3'
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />

      <div className='space-y-2 max-h-[300px] overflow-y-auto'>
        {students.length === 0 ? (
          <Typography variant='body2' color='textSecondary'>
            Tidak ada siswa ditemukan
          </Typography>
        ) : (
          students.map((siswa) => (
            <div key={siswa.id} className='flex justify-between items-center border rounded p-2'>
              <div className='flex gap-2'>
                <p className='font-medium'>
                  {siswa.nisn}
                </p>
                <p className='font-medium'>
                  {siswa.name}
                </p>
                <p>
                  {siswa.class} {siswa.jurusan?.singkatan} {siswa.rombel}
                </p>
              </div>
              <Button variant='contained' size='small' onClick={() => onAdd(siswa.id)}>
                Tambah
              </Button>
            </div>
          ))
        )}
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Tutup</Button>
    </DialogActions>
  </Dialog>
)

export default AddMemberDialog; 