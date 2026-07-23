import React from 'react';
import { Box } from '@mui/material';

export default function PublicFooter() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        py: 2,
        fontSize: 14,
        color: '#666',
        borderTop: '1px solid #ddd',
      }}
    >
      © 2025 OSSAGAR'59 | <a
            href="https://instagram.com/jarss_pajar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-semibold transition"
          > 
            created by jarss
          </a>
    </Box>
  );
}