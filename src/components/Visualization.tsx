import React from 'react';
import { Paper, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Consequence {
  id: number;
  outcome: string;
  probability: number;
  type: 'positive' | 'negative';
  timeframe: string;
}

interface VisualizationProps {
  consequences: Consequence[];
}

function Visualization({ consequences }: VisualizationProps) {
  if (!consequences.length) {
    return null;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Consequence Probability Analysis'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Probability (%)'
        }
      }
    }
  };

  const data = {
    labels: consequences.map(c => c.outcome),
    datasets: [
      {
        label: 'Probability',
        data: consequences.map(c => c.probability),
        backgroundColor: consequences.map(c =>
          c.type === 'positive' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        ),
        borderColor: consequences.map(c =>
          c.type === 'positive' ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)'
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Visualization
      </Typography>
      <Bar options={options} data={data} />
    </Paper>
  );
}

export default Visualization; 