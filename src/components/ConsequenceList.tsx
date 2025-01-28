import React from 'react';
import { 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Chip,
  Box 
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface Consequence {
  id: number;
  outcome: string;
  probability: number;
  type: 'positive' | 'negative';
  timeframe: string;
}

interface ConsequenceListProps {
  consequences: Consequence[];
}

function ConsequenceList({ consequences }: ConsequenceListProps) {
  if (!consequences.length) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        Predicted Consequences
      </Typography>
      <List>
        {consequences.map((consequence) => (
          <ListItem
            key={consequence.id}
            sx={{
              mb: 2,
              backgroundColor: consequence.type === 'positive' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              borderRadius: 1,
            }}
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {consequence.type === 'positive' ? (
                    <TrendingUpIcon color="success" />
                  ) : (
                    <TrendingDownIcon color="error" />
                  )}
                  <Typography variant="body1">
                    {consequence.outcome}
                  </Typography>
                </Box>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`${consequence.probability}% Probability`}
                    color={consequence.type === 'positive' ? 'success' : 'error'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={consequence.timeframe}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ConsequenceList; 