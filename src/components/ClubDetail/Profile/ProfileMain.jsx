import React from 'react';
import { Paper, Typography, Button, Grid, TextField, Box } from '@mui/material';
import { Edit, Save, X } from 'lucide-react';

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row py-4 border-b border-gray-100 last:border-b-0">
    <div className="w-full sm:w-1/3">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </div>
    <div className="w-full sm:w-2/3">
      <Typography variant="body1" className="font-semibold text-gray-800">{value || '-'}</Typography>
    </div>
  </div>
);

export default function ProfileMain({
  title,
  fields,
  data,
  onEdit,
}) {
  return (
    <Paper elevation={3} className="p-6 rounded-2xl shadow-lg bg-white mb-6">
      <Box className="flex justify-between items-center mb-4">
        <Typography variant="h6" className="font-bold">{title}</Typography>
        <Button variant="outlined" color="warning" onClick={onEdit} startIcon={<Edit size={16} />}>Edit</Button>
      </Box>
      <div>
        {fields.map(field => (
          <InfoRow key={field.name} label={field.label} value={data[field.name]} />
        ))}
      </div>
    </Paper>
  );
}