// src/components/FilterDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Checkbox,
  FormControlLabel, List, ListItem, TextField, Box, CircularProgress, Typography,
} from '@mui/material';

export default function FilterDialog({ open, onClose, title, items, selectedItems, onApply, isLoading }) {
  const [internalSelection, setInternalSelection] = useState(selectedItems);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Sync selection when the dialog is opened
    if (open) {
      setInternalSelection(selectedItems);
    }
  }, [open, selectedItems]);

  const handleToggle = (itemId) => {
    const currentIndex = internalSelection.indexOf(itemId);
    const newSelection = [...internalSelection];

    if (currentIndex === -1) {
      newSelection.push(itemId);
    } else {
      newSelection.splice(currentIndex, 1);
    }
    setInternalSelection(newSelection);
  };

  const handleApply = () => {
    onApply(internalSelection);
    onClose();
  };

  const handleReset = () => {
    setInternalSelection([]);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: 100 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 2 }}>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Cari ekskul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              <List>
                {filteredItems.map((item) => (
                  <ListItem key={item.id} dense button onClick={() => handleToggle(item.id)}>
                    <Checkbox
                      edge="start"
                      checked={internalSelection.indexOf(item.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                    <FormControlLabel
                      control={<span />}
                      label={item.name}
                      sx={{ width: '100%', cursor: 'pointer' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary">Reset</Button>
        <Button onClick={onClose}>Batal</Button>
        <Button onClick={handleApply} variant="contained">Terapkan</Button>
      </DialogActions>
    </Dialog>
  );
}