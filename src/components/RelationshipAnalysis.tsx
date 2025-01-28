import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  LinearProgress,
  Rating,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import GroupIcon from '@mui/icons-material/Group';
import MoodIcon from '@mui/icons-material/Mood';
import TimerIcon from '@mui/icons-material/Timer';
import PsychologyIcon from '@mui/icons-material/Psychology';
import BalanceIcon from '@mui/icons-material/Balance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface RelationshipImpact {
  aspect: string;
  impact: number; // 0-100
  description: string;
  timeframe: 'short-term' | 'medium-term' | 'long-term';
  emotionalWeight: number; // 1-5
}

interface RelationshipDynamics {
  trust: number; // 0-100
  communication: number; // 0-100
  compatibility: number; // 0-100
  stability: number; // 0-100
}

interface RelationshipMetrics {
  emotionalIntelligence: number;
  conflictResolution: number;
  boundaryRespect: number;
  mutualGrowth: number;
  supportLevel: number;
}

interface EmotionalState {
  primary: 'joy' | 'fear' | 'anger' | 'sadness' | 'anticipation';
  intensity: number;
  triggers: string[];
  copingStrategies: string[];
}

interface ConflictPattern {
  type: string;
  frequency: number;
  resolutionRate: number;
  commonTriggers: string[];
  effectiveStrategies: string[];
}

interface RelationshipPrediction {
  impacts: RelationshipImpact[];
  dynamics: RelationshipDynamics;
  recommendedActions: string[];
  emotionalConsiderations: string[];
  metrics: RelationshipMetrics;
  emotionalStates: EmotionalState[];
  conflictPatterns: ConflictPattern[];
}

interface RelationshipAnalysisProps {
  prediction: RelationshipPrediction;
}

const RelationshipAnalysis: React.FC<RelationshipAnalysisProps> = ({ prediction }) => {
  const getImpactColor = (impact: number) => {
    if (impact >= 70) return 'success';
    if (impact >= 40) return 'warning';
    return 'error';
  };

  const getTimeframeIcon = (timeframe: string) => {
    switch (timeframe) {
      case 'short-term':
        return '⚡';
      case 'medium-term':
        return '📅';
      case 'long-term':
        return '🎯';
      default:
        return '⏳';
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'joy':
        return '#4caf50';
      case 'fear':
        return '#ff9800';
      case 'anger':
        return '#f44336';
      case 'sadness':
        return '#2196f3';
      case 'anticipation':
        return '#9c27b0';
      default:
        return '#757575';
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, backgroundColor: 'rgba(25, 118, 210, 0.02)' }}>
      <Typography variant="h6" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FavoriteIcon /> Relationship Impact Analysis
      </Typography>

      {/* Enhanced Metrics */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PsychologyIcon /> Relationship Metrics
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(prediction.metrics).map(([key, value]) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </Typography>
                  <Typography variant="body2" color={getImpactColor(value)}>
                    {value}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={value}
                  color={getImpactColor(value)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Emotional States */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MoodIcon /> Emotional Analysis
        </Typography>
        <Grid container spacing={2}>
          {prediction.emotionalStates.map((state, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: getEmotionColor(state.primary) }}>
                      {state.primary.charAt(0).toUpperCase() + state.primary.slice(1)}
                    </Typography>
                    <Chip
                      label={`Intensity: ${state.intensity}/10`}
                      color={getImpactColor(state.intensity * 10)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Triggers:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {state.triggers.map((trigger, i) => (
                        <Chip key={i} label={trigger} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Coping Strategies:</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {state.copingStrategies.map((strategy, i) => (
                        <Chip
                          key={i}
                          label={strategy}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Conflict Patterns */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BalanceIcon /> Conflict Analysis
        </Typography>
        {prediction.conflictPatterns.map((pattern, index) => (
          <Card variant="outlined" sx={{ mb: 2 }} key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{pattern.type}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={`${Math.round(pattern.frequency * 100)}% Frequency`}
                    size="small"
                    color={pattern.frequency > 0.5 ? 'warning' : 'success'}
                  />
                  <Chip
                    label={`${Math.round(pattern.resolutionRate * 100)}% Resolution`}
                    size="small"
                    color={pattern.resolutionRate > 0.7 ? 'success' : 'warning'}
                  />
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Common Triggers:</Typography>
                  <List dense>
                    {pattern.commonTriggers.map((trigger, i) => (
                      <ListItem key={i}>
                        <ListItemText primary={trigger} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Effective Strategies:</Typography>
                  <List dense>
                    {pattern.effectiveStrategies.map((strategy, i) => (
                      <ListItem key={i}>
                        <ListItemText primary={strategy} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Original Impact Timeline */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon /> Impact Timeline
        </Typography>
        {prediction.impacts.map((impact, index) => (
          <Box 
            key={index} 
            sx={{ 
              mb: 2,
              p: 2,
              backgroundColor: 'white',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body1">{impact.aspect}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`${impact.impact}% Impact`}
                  color={getImpactColor(impact.impact)}
                  size="small"
                />
                <Chip 
                  label={`${getTimeframeIcon(impact.timeframe)} ${impact.timeframe}`}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {impact.description}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Emotional Weight:
              </Typography>
              <Rating 
                value={impact.emotionalWeight} 
                readOnly 
                size="small"
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteIcon fontSize="inherit" />}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Growth Trajectory */}
      <Box>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUpIcon /> Recommended Actions
        </Typography>
        <Grid container spacing={1}>
          {prediction.recommendedActions.map((action, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box 
                sx={{ 
                  p: 1.5,
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Typography variant="body2">
                  {index + 1}. {action}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default RelationshipAnalysis; 