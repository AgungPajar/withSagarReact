import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

export default function SecurityCard({ handleChangePassword }) {
  return (
    <Paper elevation={3} className="p-6 shadow-lg bg-white flex-col gap-4">
      <Typography variant="h6" className="font-bold mb-4">Keamanan</Typography>
      <Button
        variant='outlined'
        color="secondary"
        onClick={handleChangePassword}
      >
        Ubah Password
      </Button>
    </Paper>
  );
}