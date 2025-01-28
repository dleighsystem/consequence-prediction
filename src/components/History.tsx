import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface AIAgentResponse {
  agentName: string;
  analysis: string;
  confidence: number;
  recommendation: 'do' | 'dont' | 'consider';
  keyPoints: string[];
}

interface TrendForecast {
  category: string;
  predictedOutcome: string;
  confidence: number;
  supportingData: {
    historicalTrend: 'increasing' | 'decreasing' | 'stable';
    similarDecisions: number;
    averageSuccess: number;
  };
  financialProjection?: {
    predictedAmount: number;
    range: { min: number; max: number };
    trend: string;
  };
}

interface DecisionCorrelation {
  category1: string;
  category2: string;
  correlationStrength: number;
  description: string;
  confidence: number;
  supportingEvidence: {
    totalPairs: number;
    successfulPairs: number;
    timeframe: string;
  };
}

interface TrendAnalysis {
  recommendationChanges: {
    from: 'do' | 'dont' | 'consider';
    to: 'do' | 'dont' | 'consider';
    timestamp: Date;
    reason: string;
  }[];
  confidenceProgression: {
    value: number;
    timestamp: Date;
  }[];
  financialTrends: {
    category: string;
    amounts: number[];
    dates: Date[];
    trend: 'increasing' | 'decreasing' | 'stable';
  }[];
  decisionPatterns: {
    category: string;
    frequency: number;
    averageConfidence: number;
    successRate: number;
  }[];
  forecasts: TrendForecast[];
  correlations: DecisionCorrelation[];
}

interface DecisionOutcome {
  actualDecision: 'followed' | 'ignored';
  financialImpact: {
    amount: number;
    type: 'saving' | 'loss';
    date: Date;
  };
  satisfaction: number;
  notes: string;
}

interface GameStats {
  totalPoints: number;
  streak: number;
  badges: {
    name: string;
    description: string;
    dateEarned: Date;
    icon: string;
  }[];
  level: number;
  savingsTotal: number;
  correctDecisions: number;
  totalDecisions: number;
}

interface HistoryItem {
  id: number;
  timestamp: Date;
  action: string;
  consequences: Consequence[];
  summary: string;
  recommendation: 'do' | 'dont' | 'consider';
  additionalInfo?: string;
  aiResponse?: AIAgentResponse;
  trends?: TrendAnalysis;
  outcome?: DecisionOutcome;
  gameStats?: GameStats;
}

interface Consequence {
  id: number;
  outcome: string;
  probability: number;
  type: 'positive' | 'negative';
  timeframe: string;
}

interface HistoryProps {
  history: HistoryItem[];
  onDeleteItem: (id: number) => void;
  onUpdateItem: (item: HistoryItem) => void;
  onRequestMoreInfo: (item: HistoryItem) => void;
  onRecordOutcome?: (item: HistoryItem, outcome: DecisionOutcome) => void;
}

function History({ history, onDeleteItem, onUpdateItem, onRequestMoreInfo, onRecordOutcome }: HistoryProps) {
  const [editItem, setEditItem] = useState<HistoryItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedAction, setEditedAction] = useState('');
  const [editedInfo, setEditedInfo] = useState('');
  const [outcomeDialogOpen, setOutcomeDialogOpen] = useState(false);
  const [activeOutcomeItem, setActiveOutcomeItem] = useState<HistoryItem | null>(null);
  const [outcomeForm, setOutcomeForm] = useState<{
    followed: boolean;
    amount: string;
    type: 'saving' | 'loss';
    satisfaction: number;
    notes: string;
  }>({
    followed: true,
    amount: '',
    type: 'saving',
    satisfaction: 7,
    notes: ''
  });

  if (!history.length) {
    return null;
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'do':
        return 'success';
      case 'dont':
        return 'error';
      default:
        return 'warning';
    }
  };

  const handleEdit = (item: HistoryItem) => {
    setEditItem(item);
    setEditedAction(item.action);
    setEditedInfo(item.additionalInfo || '');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editItem) {
      const updatedItem = {
        ...editItem,
        action: editedAction,
        additionalInfo: editedInfo,
        timestamp: new Date() // Update timestamp to show it was modified
      };
      onUpdateItem(updatedItem);
      setEditDialogOpen(false);
      setEditItem(null);
    }
  };

  const handleRequestMoreInfo = (item: HistoryItem) => {
    onRequestMoreInfo(item);
  };

  const handleRecordOutcome = (item: HistoryItem) => {
    setActiveOutcomeItem(item);
    setOutcomeForm({
      followed: true,
      amount: '',
      type: 'saving',
      satisfaction: 7,
      notes: ''
    });
    setOutcomeDialogOpen(true);
  };

  const handleSubmitOutcome = () => {
    if (activeOutcomeItem && onRecordOutcome) {
      const outcome: DecisionOutcome = {
        actualDecision: outcomeForm.followed ? 'followed' : 'ignored',
        financialImpact: {
          amount: parseFloat(outcomeForm.amount) || 0,
          type: outcomeForm.type,
          date: new Date()
        },
        satisfaction: outcomeForm.satisfaction,
        notes: outcomeForm.notes
      };
      onRecordOutcome(activeOutcomeItem, outcome);
      setOutcomeDialogOpen(false);
      setActiveOutcomeItem(null);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3,
        backgroundColor: 'rgba(25, 118, 210, 0.02)',
        borderRadius: 2,
        border: '1px solid rgba(25, 118, 210, 0.1)'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 2,
        borderBottom: '2px solid rgba(25, 118, 210, 0.1)',
        pb: 2
      }}>
        <HistoryIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography variant="h5" color="primary">
          Decision History
        </Typography>
      </Box>
      
      {history.length === 0 ? (
        <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 3 }}>
          No decisions recorded yet. Make your first prediction to start building your history.
        </Typography>
      ) : (
        <List>
          {history.map((item) => (
            <Accordion 
              key={item.id} 
              sx={{ 
                mb: 1,
                '&:before': {
                  display: 'none',
                },
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.02)',
                }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                sx={{ 
                  '& .MuiAccordionSummary-content': { 
                    alignItems: 'center',
                    m: 0,
                    '&.Mui-expanded': { m: 0 }
                  }
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  width: '100%',
                  pr: 1
                }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      flex: 1,
                      fontWeight: 500
                    }}
                  >
                    {item.action}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, minWidth: 150 }}>
                    <Chip
                      label={item.recommendation === 'do' ? 'Recommended' : 
                             item.recommendation === 'dont' ? 'Not Recommended' : 
                             'Consider Carefully'}
                      color={getRecommendationColor(item.recommendation)}
                      size="small"
                      sx={{ 
                        minWidth: 140,
                        fontWeight: 500
                      }}
                    />
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequestMoreInfo(item);
                      }}
                      startIcon={<HistoryIcon />}
                      sx={{ 
                        textTransform: 'none',
                        borderRadius: 2,
                        minWidth: 140,
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.08)',
                        }
                      }}
                    >
                      Tell Me More
                    </Button>
                  </Box>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ minWidth: 80 }}
                  >
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ 
                    ml: 1, 
                    display: 'flex', 
                    gap: 1,
                    minWidth: 80,
                    justifyContent: 'flex-end'
                  }}>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.1)' }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      sx={{ 
                        color: 'error.main',
                        '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                {item.trends && (
                  <Box sx={{ mb: 2, p: 2, backgroundColor: 'rgba(25, 118, 210, 0.02)', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                      Decision Evolution & Forecasts
                    </Typography>
                    
                    {item.trends.recommendationChanges.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                          Recommendation Changes:
                        </Typography>
                        {item.trends.recommendationChanges.map((change, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Chip 
                              label={change.from}
                              size="small"
                              color={getRecommendationColor(change.from)}
                            />
                            <Typography variant="body2">→</Typography>
                            <Chip 
                              label={change.to}
                              size="small"
                              color={getRecommendationColor(change.to)}
                            />
                            <Typography variant="caption" color="text.secondary">
                              ({new Date(change.timestamp).toLocaleDateString()}: {change.reason})
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {item.trends.confidenceProgression.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                          Confidence Trend:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {item.trends.confidenceProgression.map((point, index) => (
                            <Chip
                              key={index}
                              label={`${point.value}%`}
                              size="small"
                              variant={index === item.trends!.confidenceProgression.length - 1 ? 'filled' : 'outlined'}
                              color="primary"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {item.trends.financialTrends.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                          Financial Trends:
                        </Typography>
                        {item.trends.financialTrends.map((trend, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Chip 
                              label={trend.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Typography variant="body2" color={
                              trend.trend === 'increasing' ? 'success.main' :
                              trend.trend === 'decreasing' ? 'error.main' :
                              'text.secondary'
                            }>
                              {trend.trend}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              (Latest: ${trend.amounts[trend.amounts.length - 1]?.toFixed(2)})
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {item.trends.decisionPatterns.length > 0 && (
                      <Box>
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                          Decision Patterns:
                        </Typography>
                        {item.trends.decisionPatterns.map((pattern, index) => (
                          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Chip 
                              label={pattern.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Typography variant="caption" color="text.secondary">
                              {pattern.frequency} decisions, {pattern.averageConfidence.toFixed(1)}% avg. confidence, 
                              {pattern.successRate.toFixed(1)}% success rate
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {item.trends.forecasts && item.trends.forecasts.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Future Predictions:
                        </Typography>
                        {item.trends.forecasts.map((forecast, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              mb: 2,
                              p: 1.5,
                              backgroundColor: 'rgba(25, 118, 210, 0.03)',
                              borderRadius: 1,
                              border: '1px solid rgba(25, 118, 210, 0.08)'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Chip 
                                label={forecast.category}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip 
                                label={`${forecast.confidence}% confidence`}
                                size="small"
                                color={forecast.confidence > 80 ? 'success' : 'primary'}
                                variant="outlined"
                              />
                            </Box>
                            
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {forecast.predictedOutcome}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              <Chip
                                label={`${forecast.supportingData.similarDecisions} similar decisions`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={`${forecast.supportingData.averageSuccess.toFixed(1)}% success rate`}
                                size="small"
                                variant="outlined"
                                color={forecast.supportingData.averageSuccess > 70 ? 'success' : 'default'}
                              />
                              <Chip
                                label={`Trend: ${forecast.supportingData.historicalTrend}`}
                                size="small"
                                variant="outlined"
                                color={
                                  forecast.supportingData.historicalTrend === 'increasing' ? 'success' :
                                  forecast.supportingData.historicalTrend === 'decreasing' ? 'error' :
                                  'default'
                                }
                              />
                            </Box>
                            
                            {forecast.financialProjection && (
                              <Box sx={{ mt: 1.5, p: 1, backgroundColor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                  Financial Projection:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  <Chip
                                    label={`Predicted: $${forecast.financialProjection.predictedAmount.toFixed(2)}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                  <Chip
                                    label={`Range: $${forecast.financialProjection.range.min.toFixed(2)} - $${forecast.financialProjection.range.max.toFixed(2)}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                  <Chip
                                    label={`Trend: ${forecast.financialProjection.trend}`}
                                    size="small"
                                    variant="outlined"
                                    color={
                                      forecast.financialProjection.trend === 'increasing' ? 'success' :
                                      forecast.financialProjection.trend === 'decreasing' ? 'error' :
                                      'default'
                                    }
                                  />
                                </Box>
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    )}

                    {item.trends?.correlations && item.trends.correlations.length > 0 && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Decision Correlations:
                        </Typography>
                        {item.trends.correlations.map((correlation, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              mb: 2,
                              p: 1.5,
                              backgroundColor: 'rgba(25, 118, 210, 0.03)',
                              borderRadius: 1,
                              border: '1px solid rgba(25, 118, 210, 0.08)'
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Chip 
                                label={correlation.category1}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Typography variant="body2">↔</Typography>
                              <Chip 
                                label={correlation.category2}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip 
                                label={`${correlation.confidence}% confidence`}
                                size="small"
                                color={correlation.confidence > 80 ? 'success' : 'primary'}
                                variant="outlined"
                              />
                            </Box>
                            
                            <Typography variant="body2" sx={{ mb: 1 }}>
                              {correlation.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              <Chip
                                label={`${correlation.supportingEvidence.totalPairs} related decisions`}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={`${correlation.supportingEvidence.successfulPairs} aligned outcomes`}
                                size="small"
                                variant="outlined"
                                color={
                                  correlation.supportingEvidence.successfulPairs / correlation.supportingEvidence.totalPairs > 0.7 
                                    ? 'success' 
                                    : 'default'
                                }
                              />
                              <Chip
                                label={`Timeframe: ${correlation.supportingEvidence.timeframe}`}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                )}
                
                {item.aiResponse && (
                  <Box sx={{ 
                    mb: 2,
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.1)',
                    p: 2
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                        {item.aiResponse.agentName}
                      </Typography>
                      <Chip 
                        label={`${item.aiResponse.confidence}% confidence`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {item.aiResponse.analysis}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                      Key Points:
                    </Typography>
                    <List dense sx={{ mb: 2 }}>
                      {item.aiResponse.keyPoints.map((point, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemText 
                            primary={point}
                            primaryTypographyProps={{
                              variant: 'body2',
                              sx: { color: 'text.secondary' }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    p: 2,
                    borderRadius: 1
                  }}
                >
                  {item.summary}
                </Typography>
                {item.additionalInfo && (
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    sx={{ 
                      mb: 2,
                      backgroundColor: 'rgba(25, 118, 210, 0.05)',
                      p: 2,
                      borderRadius: 1
                    }}
                  >
                    Additional Context: {item.additionalInfo}
                  </Typography>
                )}
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2" sx={{ mt: 1, mb: 2, fontWeight: 600 }}>
                  Key Consequences:
                </Typography>
                <List dense sx={{ backgroundColor: 'rgba(0, 0, 0, 0.01)', borderRadius: 1 }}>
                  {item.consequences.map((consequence) => (
                    <ListItem 
                      key={consequence.id}
                      sx={{ 
                        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                        '&:last-child': { borderBottom: 'none' }
                      }}
                    >
                      <ListItemText
                        primary={consequence.outcome}
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            <Chip
                              label={`${consequence.probability}%`}
                              size="small"
                              color={consequence.type === 'positive' ? 'success' : 'error'}
                              sx={{ minWidth: 70 }}
                            />
                            <Chip
                              label={consequence.timeframe}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                {!item.outcome && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleRecordOutcome(item)}
                      startIcon={<CheckCircleIcon />}
                      sx={{ textTransform: 'none' }}
                    >
                      Record Actual Decision & Outcome
                    </Button>
                  </Box>
                )}

                {item.outcome && (
                  <Box sx={{ 
                    mt: 2, 
                    p: 2, 
                    backgroundColor: 'rgba(25, 118, 210, 0.02)', 
                    borderRadius: 2,
                    border: '1px solid rgba(25, 118, 210, 0.1)'
                  }}>
                    <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                      Actual Outcome
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                      <Chip
                        icon={item.outcome.actualDecision === 'followed' ? <CheckCircleIcon /> : <CancelIcon />}
                        label={`${item.outcome.actualDecision === 'followed' ? 'Followed' : 'Ignored'} recommendation`}
                        color={item.outcome.actualDecision === 'followed' ? 'success' : 'error'}
                        variant="outlined"
                      />
                      
                      <Chip
                        icon={<AttachMoneyIcon />}
                        label={`${item.outcome.financialImpact.type === 'saving' ? 'Saved' : 'Lost'} $${item.outcome.financialImpact.amount.toFixed(2)}`}
                        color={item.outcome.financialImpact.type === 'saving' ? 'success' : 'error'}
                        variant="outlined"
                      />
                      
                      <Chip
                        icon={<EmojiEventsIcon />}
                        label={`