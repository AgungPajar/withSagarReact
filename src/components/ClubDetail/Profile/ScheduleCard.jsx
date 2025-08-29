import React, { useState } from 'react';
import { Paper, Typography, Button, Box, Select, MenuItem, IconButton, Chip } from '@mui/material';
import { Edit, Save, X, Trash2, Plus } from 'lucide-react';

export default function ScheduleCard({ schedules, onAdd, onDelete, clubId, isOwner }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newDay, setNewDay] = useState('Senin');
  
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  const handleAdd = () => {
    onAdd(clubId, { day_of_week: newDay });
  };

  return (
    <Paper elevation={3} className="p-6 rounded-2xl shadow-lg bg-white mb-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="font-bold">Jadwal Kegiatan</Typography>
        {isOwner && (isEditing ? (
          <Button variant="text" size="small" onClick={() => setIsEditing(false)} startIcon={<X size={16} />}>Selesai</Button>
        ) : (
          <Button variant="outlined" size="small" color="warning" onClick={() => setIsEditing(true)} startIcon={<Edit size={16} />}>Edit</Button>
        ))}
      </Box>

      {/* Tampilan View */}
      <div className="flex flex-wrap gap-2">
        {schedules.map(schedule => (
          <div key={schedule.id} className="flex items-center">
            <Chip label={schedule.day_of_week} />
            {isEditing && (
              <IconButton color="error" size="small" onClick={() => onDelete(schedule.id)} sx={{ ml: -1 }}>
                <X size={14} />
              </IconButton>
            )}
          </div>
        ))}
        {schedules.length === 0 && !isEditing && <Typography variant="body2" color="text.secondary">Belum ada jadwal.</Typography>}
      </div>

      {/* Form Tambah Jadwal (Mode Edit) */}
      {isEditing && (
        <div className="mt-4 pt-4 border-t flex flex-wrap gap-2 items-center">
          <Select size="small" value={newDay} onChange={e => setNewDay(e.target.value)}>
            {days.map(day => <MenuItem key={day} value={day}>{day}</MenuItem>)}
          </Select>
          <Button variant="contained" onClick={handleAdd} startIcon={<Plus size={16}/>}>Tambah Hari</Button>
        </div>
      )}
    </Paper>
  );
}