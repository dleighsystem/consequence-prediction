import React from 'react';
import { TextField, Button, Box, Paper } from '@mui/material';

interface ActionInputProps {
  action: string;
  setAction: (action: string) => void;
  onPredict: (action: string) => void;
}

function ActionInput({ action, setAction, onPredict }: ActionInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action.trim()) {
      onPredict(action);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="What action are you considering?"
            variant="outlined"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="e.g., Should I skip the gym today?"
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!action.trim()}
            sx={{ minWidth: '120px' }}
          >
            Predict
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default ActionInput; 