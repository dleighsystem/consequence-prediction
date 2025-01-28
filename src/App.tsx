import { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  ThemeProvider, 
  createTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Chip
} from '@mui/material'
import ActionInput from './components/ActionInput'
import ConsequenceList from './components/ConsequenceList'
import Visualization from './components/Visualization'
import History from './components/History'
import RelationshipAnalysis from './components/RelationshipAnalysis'
import './App.css'

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

interface Consequence {
  id: number
  outcome: string
  probability: number
  type: 'positive' | 'negative'
  timeframe: string
}

interface AIAnalysisPattern {
  pattern: string;
  impact: number;
  confidence: number;
  description: string;
}

interface FinancialData {
  amount: number;
  type: 'expense' | 'investment' | 'saving';
  date: Date;
  category: string;
  description: string;
}

interface AIAgentResponse {
  agentName: string;
  analysis: string;
  confidence: number;
  recommendation: 'do' | 'dont' | 'consider';
  keyPoints: string[];
  patterns: AIAnalysisPattern[];
  sentiment: 'positive' | 'negative' | 'neutral';
  timeHorizon: 'short-term' | 'medium-term' | 'long-term';
  financialImpact?: FinancialData;
  relationshipPrediction?: RelationshipPrediction;
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
  correlationStrength: number; // -1 to 1
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
  correlations: DecisionCorrelation[]; // Add correlations to TrendAnalysis
}

interface DecisionOutcome {
  actualDecision: 'followed' | 'ignored';
  financialImpact: {
    amount: number;
    type: 'saving' | 'loss';
    date: Date;
  };
  satisfaction: number; // 1-10
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
  id: number
  timestamp: Date
  action: string
  consequences: Consequence[]
  summary: string
  recommendation: 'do' | 'dont' | 'consider'
  additionalInfo?: string
  aiResponse?: AIAgentResponse
  trends?: TrendAnalysis
  outcome?: DecisionOutcome
  gameStats?: GameStats
}

// Enhanced decision categories and prompts
const decisionPrompts = {
  financial: [
    "What's your current financial situation?",
    "Have you considered the long-term financial implications?",
    "Are there any alternative investments or options?",
    "What's your risk tolerance level (low/medium/high)?",
    "How would this affect your monthly budget?",
    "Do you have any existing financial commitments?"
  ],
  health: [
    "What's your current health condition?",
    "Are there any medical considerations?",
    "How does this align with your long-term health goals?",
    "Have you consulted any healthcare professionals?",
    "Are there any potential side effects to consider?",
    "How might this impact your daily routine?"
  ],
  career: [
    "What are your career goals?",
    "How does this align with your skills and interests?",
    "What's the industry outlook for this decision?",
    "How might this affect your work-life balance?",
    "What growth opportunities are available?",
    "Have you considered the impact on your professional network?"
  ],
  relationships: [
    "How might this affect your personal relationships?",
    "Have you discussed this with the involved parties?",
    "What are the long-term implications for your social circle?",
    "Are there any emotional factors to consider?",
    "How does this align with your personal values?"
  ],
  education: [
    "How does this align with your learning goals?",
    "What's the time commitment required?",
    "Have you researched the program/course thoroughly?",
    "What are the potential career benefits?",
    "Are there any prerequisites you need to consider?"
  ],
  lifestyle: [
    "How will this change affect your daily routine?",
    "What's the impact on your quality of life?",
    "Are there any environmental considerations?",
    "How sustainable is this change long-term?",
    "What resources are needed to maintain this change?"
  ],
  general: [
    "What's your motivation for this decision?",
    "Have you tried similar alternatives before?",
    "What are the immediate constraints or limitations?",
    "How does this align with your personal values?",
    "What's the worst-case scenario?"
  ]
} as const;

// Add new interfaces for enhanced prediction
interface RiskFactor {
  type: 'financial' | 'health' | 'social' | 'emotional' | 'professional'
  severity: number // 1-10
  description: string
}

interface Opportunity {
  type: 'growth' | 'learning' | 'financial' | 'social' | 'health'
  potential: number // 1-10
  description: string
}

interface EnhancedConsequence extends Consequence {
  confidence: number // 0-100
  impact: number // 1-10
  risks: RiskFactor[]
  opportunities: Opportunity[]
}

interface RelationshipImpact {
  aspect: string;
  impact: number;
  description: string;
  timeframe: 'short-term' | 'medium-term' | 'long-term';
  emotionalWeight: number;
}

interface RelationshipDynamics {
  trust: number;
  communication: number;
  compatibility: number;
  stability: number;
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

function App() {
  const [action, setAction] = useState('')
  const [consequences, setConsequences] = useState<Consequence[]>([])
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [infoDialogOpen, setInfoDialogOpen] = useState(false)
  const [currentPrompts, setCurrentPrompts] = useState<string[]>([])
  const [responses, setResponses] = useState<{ [key: string]: string }>({})
  const [activeItem, setActiveItem] = useState<HistoryItem | null>(null)
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [financialHistory, setFinancialHistory] = useState<FinancialData[]>([])
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis>({
    recommendationChanges: [],
    confidenceProgression: [],
    financialTrends: [],
    decisionPatterns: [],
    forecasts: [],
    correlations: []
  });
  const [gameStats, setGameStats] = useState<GameStats>({
    totalPoints: 0,
    streak: 0,
    badges: [],
    level: 1,
    savingsTotal: 0,
    correctDecisions: 0,
    totalDecisions: 0
  });

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('decisionHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('decisionHistory', JSON.stringify(history))
  }, [history])

  // Analyze trends whenever history changes
  useEffect(() => {
    if (history.length > 0) {
      analyzeTrends();
    }
  }, [history]);

  const determineDecisionType = (action: string): keyof typeof decisionPrompts => {
    const lowerAction = action.toLowerCase()
    if (lowerAction.includes('money') || lowerAction.includes('buy') || lowerAction.includes('invest') || lowerAction.includes('cost')) {
      return 'financial'
    }
    if (lowerAction.includes('health') || lowerAction.includes('exercise') || lowerAction.includes('diet') || lowerAction.includes('medical')) {
      return 'health'
    }
    if (lowerAction.includes('job') || lowerAction.includes('career') || lowerAction.includes('work') || lowerAction.includes('profession')) {
      return 'career'
    }
    if (lowerAction.includes('study') || lowerAction.includes('learn') || lowerAction.includes('course') || lowerAction.includes('school')) {
      return 'education'
    }
    if (lowerAction.includes('relationship') || lowerAction.includes('friend') || lowerAction.includes('family') || lowerAction.includes('partner')) {
      return 'relationships'
    }
    if (lowerAction.includes('move') || lowerAction.includes('change') || lowerAction.includes('habit') || lowerAction.includes('routine')) {
      return 'lifestyle'
    }
    return 'general'
  }

  const analyzeResponses = (responses: { [key: string]: string }): {
    riskFactors: RiskFactor[]
    opportunities: Opportunity[]
  } => {
    const risks: RiskFactor[] = []
    const opportunities: Opportunity[] = []

    // Analyze financial aspects
    if (responses["What's your current financial situation?"]) {
      const financialSituation = responses["What's your current financial situation?"].toLowerCase()
      if (financialSituation.includes('tight') || financialSituation.includes('limited')) {
        risks.push({
          type: 'financial',
          severity: 8,
          description: 'Current financial constraints may increase risk'
        })
      } else if (financialSituation.includes('good') || financialSituation.includes('stable')) {
        opportunities.push({
          type: 'financial',
          potential: 7,
          description: 'Stable financial position enables growth'
        })
      }
    }

    // Analyze health implications
    if (responses["Are there any medical considerations?"]) {
      const medicalConsiderations = responses["Are there any medical considerations?"].toLowerCase()
      if (medicalConsiderations.includes('yes') || medicalConsiderations.includes('concern')) {
        risks.push({
          type: 'health',
          severity: 9,
          description: 'Medical considerations require careful attention'
        })
      }
    }

    return { riskFactors: risks, opportunities }
  }

  // Extract financial information from responses
  const extractFinancialInfo = (responses: { [key: string]: string }): FinancialData | undefined => {
    const amountMatch = responses["What's your current financial situation?"]?.match(/\$?\d+(?:,\d{3})*(?:\.\d{2})?/);
    const amount = amountMatch ? parseFloat(amountMatch[0].replace(/[$,]/g, '')) : 0;

    if (amount > 0) {
      return {
        amount,
        type: amount > 10000 ? 'investment' : amount > 1000 ? 'expense' : 'saving',
        date: new Date(),
        category: determineFinancialCategory(responses),
        description: responses["What's your current financial situation?"] || ''
      };
    }
    return undefined;
  };

  const determineFinancialCategory = (responses: { [key: string]: string }): string => {
    const situation = responses["What's your current financial situation?"]?.toLowerCase() || '';
    if (situation.includes('car') || situation.includes('vehicle')) return 'transportation';
    if (situation.includes('house') || situation.includes('rent')) return 'housing';
    if (situation.includes('education') || situation.includes('course')) return 'education';
    if (situation.includes('health') || situation.includes('medical')) return 'healthcare';
    return 'general';
  };

  const generateEnhancedSummary = (
    consequences: Consequence[], 
    additionalInfo?: string,
    risks: RiskFactor[] = [],
    opportunities: Opportunity[] = [],
    financialInfo?: FinancialData
  ): { 
    summary: string
    recommendation: 'do' | 'dont' | 'consider' 
  } => {
    let summary = ''
    let recommendationScore = 0

    // Base analysis
    const positiveCount = consequences.filter(c => c.type === 'positive').length
    const totalProbability = consequences.reduce((sum, c) => sum + c.probability, 0) / consequences.length
    const longTermPositives = consequences.filter(c => c.type === 'positive' && c.timeframe === 'long-term').length

    // Factor in risks and opportunities
    const riskScore = risks.reduce((sum, risk) => sum + risk.severity, 0) / (risks.length || 1)
    const opportunityScore = opportunities.reduce((sum, opp) => sum + opp.potential, 0) / (opportunities.length || 1)

    // Calculate weighted recommendation score
    recommendationScore = (
      (totalProbability * 0.3) + 
      (positiveCount / consequences.length * 100 * 0.2) +
      (opportunityScore * 10 * 0.3) -
      (riskScore * 10 * 0.2)
    )

    // Include additional context
    if (additionalInfo) {
      summary += `Based on the additional context provided: ${additionalInfo}. `
    }

    // Add risk analysis
    if (risks.length > 0) {
      summary += `Key risks identified: ${risks.map(r => r.description).join('; ')}. `
    }

    // Add opportunity analysis
    if (opportunities.length > 0) {
      summary += `Potential opportunities: ${opportunities.map(o => o.description).join('; ')}. `
    }

    // Include financial analysis if available
    if (financialInfo) {
      const similarDecisions = financialHistory.filter(f => 
        f.category === financialInfo.category && 
        Math.abs(f.amount - financialInfo.amount) / financialInfo.amount < 0.2
      );

      if (similarDecisions.length > 0) {
        const avgAmount = similarDecisions.reduce((sum, d) => sum + d.amount, 0) / similarDecisions.length;
        summary += `Based on your financial history with similar ${financialInfo.category} decisions (avg: $${avgAmount.toFixed(2)}), `;
        
        if (financialInfo.amount > avgAmount * 1.2) {
          summary += `this amount is ${((financialInfo.amount / avgAmount - 1) * 100).toFixed(0)}% higher than your usual spending in this category. `;
          recommendationScore -= 10;
        } else if (financialInfo.amount < avgAmount * 0.8) {
          summary += `this amount is ${((1 - financialInfo.amount / avgAmount) * 100).toFixed(0)}% lower than your usual spending in this category. `;
          recommendationScore += 10;
        }
      }
    }

    // Determine recommendation
    let recommendation: 'do' | 'dont' | 'consider'
    if (recommendationScore >= 70) {
      recommendation = 'do'
      summary += `This decision appears highly favorable with a strong positive outlook (score: ${Math.round(recommendationScore)}). `
    } else if (recommendationScore <= 40) {
      recommendation = 'dont'
      summary += `This decision carries significant risks and concerns (score: ${Math.round(recommendationScore)}). `
    } else {
      recommendation = 'consider'
      summary += `This decision requires careful consideration with mixed indicators (score: ${Math.round(recommendationScore)}). `
    }

    if (longTermPositives > 0) {
      summary += `There are ${longTermPositives} long-term positive consequences to consider.`
    }

    return { summary, recommendation }
  }

  const handleRequestMoreInfo = (item: HistoryItem) => {
    const decisionType = determineDecisionType(item.action)
    setCurrentPrompts(decisionPrompts[decisionType])
    setActiveItem(item)
    setResponses({})
    setInfoDialogOpen(true)
  }

  const handleSubmitAdditionalInfo = () => {
    if (activeItem) {
      const additionalInfo = Object.entries(responses)
        .map(([question, answer]) => `${question}: ${answer}`)
        .join(' | ');

      // Analyze new responses
      const { riskFactors: newRisks, opportunities: newOpportunities } = analyzeResponses(responses);
      
      // Extract financial information
      const financialInfo = extractFinancialInfo(responses);
      if (financialInfo) {
        setFinancialHistory(prev => [...prev, financialInfo]);
      }

      // Combine existing and new analysis
      const combinedRisks = [...(activeItem.aiResponse?.patterns || []).map(p => ({
        type: 'financial' as const,
        severity: p.impact,
        description: p.description
      })), ...newRisks];

      const combinedOpportunities = opportunities;

      // Generate updated summary and recommendation
      const { summary, recommendation } = generateEnhancedSummary(
        activeItem.consequences,
        additionalInfo,
        combinedRisks,
        combinedOpportunities,
        financialInfo
      );

      // Create updated AI response
      const updatedAIResponse: AIAgentResponse = {
        ...(activeItem.aiResponse || {
          agentName: "AI Decision Assistant",
          confidence: 85,
          patterns: [],
          sentiment: 'neutral' as const,
          timeHorizon: 'medium-term' as const
        }),
        analysis: summary,
        recommendation,
        keyPoints: [
          ...activeItem.aiResponse?.keyPoints || [],
          ...newRisks.map(r => r.description),
          ...newOpportunities.map(o => o.description)
        ],
        confidence: Math.min(95, (activeItem.aiResponse?.confidence || 85) + 5),
        financialImpact: financialInfo
      };
      
      // Update trends with new information
      const updatedTrends = {
        ...activeItem.trends,
        recommendationChanges: [
          ...(activeItem.trends?.recommendationChanges || []),
          {
            from: activeItem.recommendation,
            to: recommendation,
            timestamp: new Date(),
            reason: 'Updated based on additional information'
          }
        ],
        confidenceProgression: [
          ...(activeItem.trends?.confidenceProgression || []),
          {
            value: Math.min(95, (activeItem.aiResponse?.confidence || 85) + 5),
            timestamp: new Date()
          }
        ]
      };

      const updatedItem = {
        ...activeItem,
        additionalInfo,
        summary,
        recommendation,
        timestamp: new Date(),
        aiResponse: updatedAIResponse,
        trends: updatedTrends
      };

      setHistory(prev => prev.map(item => 
        item.id === activeItem.id ? updatedItem : item
      ));

      // Reset states
      setInfoDialogOpen(false);
      setActiveItem(null);
      setResponses({});
      setRiskFactors([]);
      setOpportunities([]);

      if (determineDecisionType(activeItem.action) === 'relationships') {
        updatedAIResponse.relationshipPrediction = generateRelationshipPrediction(
          activeItem.action,
          responses
        );
      }
    }
  };

  const handleDeleteItem = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  const handleUpdateItem = (updatedItem: HistoryItem) => {
    setHistory(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ))
  }

  const predictConsequences = async (actionText: string) => {
    const decisionType = determineDecisionType(actionText);
    
    // Enhanced AI analysis patterns
    const analysisPatterns: AIAnalysisPattern[] = [
      {
        pattern: 'Market Volatility',
        impact: 7,
        confidence: 85,
        description: 'Current market conditions show higher than average price fluctuations'
      },
      {
        pattern: 'Resource Investment',
        impact: 6,
        confidence: 90,
        description: 'Significant initial and ongoing resource commitment required'
      },
      {
        pattern: 'Risk Distribution',
        impact: 5,
        confidence: 80,
        description: 'Multiple risk factors spread across different aspects'
      }
    ];

    // Simulate AI agent response with enhanced analysis
    const mockAIResponse: AIAgentResponse = {
      agentName: "AI Decision Assistant",
      analysis: `Based on comprehensive analysis of ${decisionType} decisions, this choice involves multiple interrelated factors. The current market conditions and economic indicators suggest a measured approach. Historical data shows similar decisions have had mixed outcomes, with success often depending on timing and individual circumstances.`,
      confidence: 85,
      recommendation: 'consider',
      keyPoints: [
        "Current market conditions show above-average volatility",
        "Initial investment and ongoing maintenance costs need consideration",
        "Potential for value appreciation exists but depends on market timing",
        "Risk factors are distributed across multiple categories",
        "Similar decisions historically show mixed but manageable outcomes"
      ],
      patterns: analysisPatterns,
      sentiment: 'neutral',
      timeHorizon: 'medium-term'
    };

    // Add relationship-specific analysis for relationship decisions
    if (decisionType === 'relationships') {
      mockAIResponse.relationshipPrediction = generateRelationshipPrediction(actionText, {});
    }

    // Generate predictions incorporating AI analysis patterns
    const mockPredictions = generateEnhancedPredictions(actionText, decisionType, mockAIResponse);
    
    setConsequences(mockPredictions);

    const { summary, recommendation } = generateEnhancedSummary(
      mockPredictions,
      undefined,
      mockAIResponse.patterns.map(p => ({
        type: 'financial',
        severity: p.impact,
        description: p.description
      }))
    );

    const historyItem: HistoryItem = {
      id: Date.now(),
      timestamp: new Date(),
      action: actionText,
      consequences: mockPredictions,
      summary: `${mockAIResponse.analysis}\n\nAI Analysis (${mockAIResponse.confidence}% confidence):\n${mockAIResponse.keyPoints.join('\n- ')}\n\nTime Horizon: ${mockAIResponse.timeHorizon}\nOverall Sentiment: ${mockAIResponse.sentiment}`,
      recommendation: mockAIResponse.recommendation,
      aiResponse: mockAIResponse
    };

    setHistory(prev => [historyItem, ...prev]);
  };

  const generateEnhancedPredictions = (
    action: string, 
    type: keyof typeof decisionPrompts,
    aiResponse: AIAgentResponse
  ): Consequence[] => {
    const predictions: Consequence[] = [];
    const baseTime = Date.now();

    // Use AI patterns to generate more nuanced predictions
    aiResponse.patterns.forEach((pattern, index) => {
      predictions.push({
        id: baseTime + index,
        outcome: pattern.description,
        probability: pattern.confidence,
        type: pattern.impact > 6 ? 'negative' : 'positive',
        timeframe: pattern.impact > 7 ? 'short-term' : 'long-term'
      });
    });

    // Add type-specific predictions
    switch (type) {
      case 'financial':
        predictions.push(
          {
            id: baseTime + predictions.length,
            outcome: 'Potential for asset appreciation',
            probability: 75,
            type: 'positive',
            timeframe: 'long-term'
          },
          {
            id: baseTime + predictions.length + 1,
            outcome: 'Initial capital requirement',
            probability: 90,
            type: 'negative',
            timeframe: 'short-term'
          }
        );
        break;
      // Add more cases as needed
    }

    return predictions;
  };

  const analyzeTrends = () => {
    const newTrends: TrendAnalysis = {
      recommendationChanges: [],
      confidenceProgression: [],
      financialTrends: [],
      decisionPatterns: [],
      forecasts: [],
      correlations: []
    };

    // Analyze recommendation changes
    history.forEach((item, index) => {
      if (index > 0 && item.aiResponse) {
        const prevItem = history[index - 1];
        if (prevItem.recommendation !== item.recommendation) {
          newTrends.recommendationChanges.push({
            from: prevItem.recommendation,
            to: item.recommendation,
            timestamp: item.timestamp,
            reason: `Changed based on ${item.additionalInfo ? 'new information' : 'initial analysis'}`
          });
        }
      }
    });

    // Track confidence progression
    history.forEach(item => {
      if (item.aiResponse) {
        newTrends.confidenceProgression.push({
          value: item.aiResponse.confidence,
          timestamp: item.timestamp
        });
      }
    });

    // Analyze financial trends by category
    const financialData = history
      .filter(item => item.aiResponse?.financialImpact)
      .reduce((acc, item) => {
        const impact = item.aiResponse?.financialImpact;
        if (impact) {
          const category = impact.category;
          if (!acc[category]) {
            acc[category] = { amounts: [], dates: [] };
          }
          acc[category].amounts.push(impact.amount);
          acc[category].dates.push(impact.date);
        }
        return acc;
      }, {} as Record<string, { amounts: number[], dates: Date[] }>);

    // Calculate trends for each financial category
    Object.entries(financialData).forEach(([category, data]) => {
      const trend = calculateTrend(data.amounts);
      newTrends.financialTrends.push({
        category,
        amounts: data.amounts,
        dates: data.dates,
        trend
      });
    });

    // Analyze decision patterns
    const patterns = history.reduce((acc, item) => {
      const type = determineDecisionType(item.action);
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          confidenceSum: 0,
          successCount: 0
        };
      }
      acc[type].count++;
      if (item.aiResponse) {
        acc[type].confidenceSum += item.aiResponse.confidence;
        if (item.recommendation === 'do') {
          acc[type].successCount++;
        }
      }
      return acc;
    }, {} as Record<string, { count: number, confidenceSum: number, successCount: number }>);

    newTrends.decisionPatterns = Object.entries(patterns).map(([category, data]) => ({
      category,
      frequency: data.count,
      averageConfidence: data.confidenceSum / data.count,
      successRate: (data.successCount / data.count) * 100
    }));

    // Generate forecasts based on historical patterns
    const forecasts = generateForecasts(history, financialHistory);
    newTrends.forecasts = forecasts;

    // Add correlation analysis
    newTrends.correlations = analyzeDecisionCorrelations(history);

    setTrendAnalysis(newTrends);
  };

  const calculateTrend = (amounts: number[]): 'increasing' | 'decreasing' | 'stable' => {
    if (amounts.length < 2) return 'stable';
    const firstHalf = amounts.slice(0, Math.floor(amounts.length / 2));
    const secondHalf = amounts.slice(Math.floor(amounts.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    const difference = secondAvg - firstAvg;
    if (difference > firstAvg * 0.1) return 'increasing';
    if (difference < -firstAvg * 0.1) return 'decreasing';
    return 'stable';
  };

  const generateForecasts = (
    history: HistoryItem[],
    financialHistory: FinancialData[]
  ): TrendForecast[] => {
    const forecasts: TrendForecast[] = [];
    const categories = new Set(history.map(item => determineDecisionType(item.action)));

    categories.forEach(category => {
      const categoryDecisions = history.filter(
        item => determineDecisionType(item.action) === category
      );

      if (categoryDecisions.length >= 2) {
        const recentDecisions = categoryDecisions.slice(-5); // Look at last 5 decisions
        const successRate = recentDecisions.filter(d => d.recommendation === 'do').length / recentDecisions.length;
        const confidenceTrend = calculateConfidenceTrend(recentDecisions);
        
        // Financial projections for financial decisions
        let financialProjection;
        if (category === 'financial') {
          const categoryFinancials = financialHistory.filter(f => f.type === 'expense');
          if (categoryFinancials.length >= 2) {
            const amounts = categoryFinancials.map(f => f.amount);
            const trend = calculateTrend(amounts);
            const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
            const stdDev = calculateStdDev(amounts);
            
            financialProjection = {
              predictedAmount: avg,
              range: {
                min: avg - stdDev,
                max: avg + stdDev
              },
              trend: trend
            };
          }
        }

        forecasts.push({
          category,
          predictedOutcome: generatePredictedOutcome(category, successRate, confidenceTrend),
          confidence: Math.min(95, 60 + (successRate * 30) + (categoryDecisions.length * 2)),
          supportingData: {
            historicalTrend: confidenceTrend,
            similarDecisions: categoryDecisions.length,
            averageSuccess: successRate * 100
          },
          financialProjection
        });
      }
    });

    return forecasts;
  };

  const calculateConfidenceTrend = (decisions: HistoryItem[]): 'increasing' | 'decreasing' | 'stable' => {
    if (decisions.length < 2) return 'stable';
    const confidences = decisions.map(d => d.aiResponse?.confidence || 0);
    return calculateTrend(confidences);
  };

  const calculateStdDev = (numbers: number[]): number => {
    const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  };

  const generatePredictedOutcome = (
    category: string,
    successRate: number,
    trend: string
  ): string => {
    if (successRate > 0.7) {
      return `High likelihood of positive outcomes in ${category} decisions based on historical success`;
    } else if (successRate < 0.3) {
      return `Exercise caution with ${category} decisions based on historical challenges`;
    } else {
      return `Mixed outcomes likely in ${category} decisions, careful evaluation recommended`;
    }
  };

  const analyzeDecisionCorrelations = (decisions: HistoryItem[]): DecisionCorrelation[] => {
    const correlations: DecisionCorrelation[] = [];
    const categories = Array.from(new Set(decisions.map(d => determineDecisionType(d.action))));

    // Analyze correlations between each pair of categories
    for (let i = 0; i < categories.length; i++) {
      for (let j = i + 1; j < categories.length; j++) {
        const cat1 = categories[i];
        const cat2 = categories[j];

        const cat1Decisions = decisions.filter(d => determineDecisionType(d.action) === cat1);
        const cat2Decisions = decisions.filter(d => determineDecisionType(d.action) === cat2);

        // Only analyze if we have enough decisions in both categories
        if (cat1Decisions.length >= 2 && cat2Decisions.length >= 2) {
          const pairs = findRelatedDecisionPairs(cat1Decisions, cat2Decisions);
          const correlation = calculateCorrelation(pairs);

          if (correlation.strength !== 0) {
            correlations.push({
              category1: cat1,
              category2: cat2,
              correlationStrength: correlation.strength,
              description: generateCorrelationDescription(cat1, cat2, correlation),
              confidence: correlation.confidence,
              supportingEvidence: {
                totalPairs: pairs.length,
                successfulPairs: correlation.successfulPairs,
                timeframe: `${new Date(pairs[0]?.decision1.timestamp).toLocaleDateString()} - ${new Date(pairs[pairs.length - 1]?.decision1.timestamp).toLocaleDateString()}`
              }
            });
          }
        }
      }
    }

    return correlations;
  };

  const findRelatedDecisionPairs = (decisions1: HistoryItem[], decisions2: HistoryItem[]): Array<{
    decision1: HistoryItem;
    decision2: HistoryItem;
    timeDiff: number;
  }> => {
    const pairs: Array<{
      decision1: HistoryItem;
      decision2: HistoryItem;
      timeDiff: number;
    }> = [];

    // Look for decisions that occurred within 30 days of each other
    const maxTimeDiff = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    decisions1.forEach(d1 => {
      decisions2.forEach(d2 => {
        const timeDiff = Math.abs(new Date(d1.timestamp).getTime() - new Date(d2.timestamp).getTime());
        if (timeDiff <= maxTimeDiff) {
          pairs.push({ decision1: d1, decision2: d2, timeDiff });
        }
      });
    });

    return pairs.sort((a, b) => a.timeDiff - b.timeDiff);
  };

  const calculateCorrelation = (pairs: Array<{
    decision1: HistoryItem;
    decision2: HistoryItem;
    timeDiff: number;
  }>): {
    strength: number;
    confidence: number;
    successfulPairs: number;
  } => {
    if (pairs.length < 2) {
      return { strength: 0, confidence: 0, successfulPairs: 0 };
    }

    let successCount = 0;
    let totalWeight = 0;

    pairs.forEach(pair => {
      const weight = 1 - (pair.timeDiff / (30 * 24 * 60 * 60 * 1000)); // Higher weight for closer decisions
      const success1 = pair.decision1.recommendation === 'do';
      const success2 = pair.decision2.recommendation === 'do';

      if (success1 === success2) {
        successCount += weight;
      }
      totalWeight += weight;
    });

    const strength = (successCount / totalWeight) * 2 - 1; // Convert to -1 to 1 scale
    const confidence = Math.min(95, 50 + (pairs.length * 5)); // Increase confidence with more pairs

    return {
      strength,
      confidence,
      successfulPairs: Math.round(successCount)
    };
  };

  const generateCorrelationDescription = (
    category1: string,
    category2: string,
    correlation: { strength: number; confidence: number }
  ): string => {
    const strengthDesc = correlation.strength > 0 ? 'positive' : 'negative';
    const magnitudeDesc = Math.abs(correlation.strength) > 0.7 ? 'strong' : 
                         Math.abs(correlation.strength) > 0.4 ? 'moderate' : 'weak';

    return `${magnitudeDesc} ${strengthDesc} correlation between ${category1} and ${category2} decisions ` +
           `(${Math.abs(correlation.strength * 100).toFixed(1)}% correlation strength)`;
  };

  // Add new function to handle decision outcomes
  const handleDecisionOutcome = (item: HistoryItem, outcome: DecisionOutcome) => {
    // Update history item with outcome
    const updatedItem = {
      ...item,
      outcome,
      gameStats: calculateGameStats(outcome, gameStats)
    };

    // Update history
    setHistory(prev => prev.map(historyItem =>
      historyItem.id === item.id ? updatedItem : historyItem
    ));

    // Update overall game stats
    setGameStats(prevStats => calculateGameStats(outcome, prevStats));
  };

  const calculateGameStats = (outcome: DecisionOutcome, prevStats: GameStats): GameStats => {
    let points = 0;
    let newBadges = [...prevStats.badges];
    let newStreak = prevStats.streak;
    let newSavingsTotal = prevStats.savingsTotal;
    let newCorrectDecisions = prevStats.correctDecisions;

    // Points for following recommendation
    if (outcome.actualDecision === 'followed') {
      points += 100;
      newStreak++;
      newCorrectDecisions++;
    } else {
      newStreak = 0;
    }

    // Points for financial impact
    if (outcome.financialImpact.type === 'saving') {
      points += Math.floor(outcome.financialImpact.amount / 10);
      newSavingsTotal += outcome.financialImpact.amount;
    }

    // Streak bonuses
    if (newStreak === 3) {
      points += 500;
      newBadges.push({
        name: 'Hot Streak',
        description: 'Made 3 good decisions in a row',
        dateEarned: new Date(),
        icon: '🔥'
      });
    }

    // Savings milestones
    if (newSavingsTotal >= 1000 && !prevStats.badges.some(b => b.name === 'Money Maestro')) {
      newBadges.push({
        name: 'Money Maestro',
        description: 'Saved over $1,000 through good decisions',
        dateEarned: new Date(),
        icon: '💰'
      });
    }

    // Decision milestones
    if (newCorrectDecisions === 10 && !prevStats.badges.some(b => b.name === 'Decision Expert')) {
      newBadges.push({
        name: 'Decision Expert',
        description: 'Made 10 correct decisions',
        dateEarned: new Date(),
        icon: '🎯'
      });
    }

    // Calculate new level
    const newLevel = Math.floor(prevStats.totalPoints / 1000) + 1;

    return {
      totalPoints: prevStats.totalPoints + points,
      streak: newStreak,
      badges: newBadges,
      level: newLevel,
      savingsTotal: newSavingsTotal,
      correctDecisions: newCorrectDecisions,
      totalDecisions: prevStats.totalDecisions + 1
    };
  };

  const generateRelationshipPrediction = (action: string, responses: { [key: string]: string }): RelationshipPrediction => {
    const lowerAction = action.toLowerCase();
    
    // Enhanced pattern detection
    const isConflict = lowerAction.includes('conflict') || lowerAction.includes('argument') || lowerAction.includes('disagree');
    const isCommitment = lowerAction.includes('marry') || lowerAction.includes('move in') || lowerAction.includes('commit');
    const isChange = lowerAction.includes('change') || lowerAction.includes('transition') || lowerAction.includes('shift');
    const isBoundary = lowerAction.includes('limit') || lowerAction.includes('space') || lowerAction.includes('boundary');
    const isEmotional = lowerAction.includes('feel') || lowerAction.includes('emotion') || lowerAction.includes('hurt');

    // Initialize base metrics
    const metrics: RelationshipMetrics = {
      emotionalIntelligence: 75,
      conflictResolution: 70,
      boundaryRespect: 80,
      mutualGrowth: 75,
      supportLevel: 85
    };

    // Initialize emotional states
    const emotionalStates: EmotionalState[] = [];
    
    // Initialize conflict patterns
    const conflictPatterns: ConflictPattern[] = [];

    // Adjust metrics and generate predictions based on decision type
    if (isConflict) {
      metrics.conflictResolution -= 20;
      metrics.emotionalIntelligence -= 10;
      
      emotionalStates.push({
        primary: 'anger',
        intensity: 7,
        triggers: ['unmet expectations', 'communication breakdown', 'value differences'],
        copingStrategies: ['time-out periods', 'active listening', 'emotion labeling']
      });

      conflictPatterns.push({
        type: 'Active Conflict',
        frequency: 0.7,
        resolutionRate: 0.6,
        commonTriggers: ['miscommunication', 'unmet needs', 'external stress'],
        effectiveStrategies: ['structured dialogue', 'cooling-off period', 'compromise solutions']
      });
    }

    if (isCommitment) {
      metrics.mutualGrowth += 15;
      metrics.supportLevel += 10;
      
      emotionalStates.push({
        primary: 'anticipation',
        intensity: 8,
        triggers: ['future planning', 'shared goals', 'relationship milestones'],
        copingStrategies: ['open communication', 'shared decision-making', 'mutual support']
      });

      conflictPatterns.push({
        type: 'Growth Tension',
        frequency: 0.4,
        resolutionRate: 0.8,
        commonTriggers: ['lifestyle adjustments', 'shared responsibilities', 'personal space'],
        effectiveStrategies: ['expectation setting', 'compromise', 'regular check-ins']
      });
    }

    if (isChange) {
      metrics.adaptability -= 15;
      metrics.mutualGrowth += 10;
      
      emotionalStates.push({
        primary: 'fear',
        intensity: 6,
        triggers: ['uncertainty', 'loss of control', 'adaptation stress'],
        copingStrategies: ['gradual adjustment', 'mutual reassurance', 'maintaining routines']
      });
    }

    if (isBoundary) {
      metrics.boundaryRespect -= 10;
      metrics.emotionalIntelligence += 5;
      
      emotionalStates.push({
        primary: 'anticipation',
        intensity: 5,
        triggers: ['personal space', 'time management', 'emotional energy'],
        copingStrategies: ['clear communication', 'respect for limits', 'balanced engagement']
      });
    }

    // Generate relationship-specific consequences
    const consequences: Consequence[] = [
      {
        id: Date.now(),
        outcome: generateEmotionalOutcome(emotionalStates),
        probability: calculateEmotionalProbability(metrics),
        type: determineOutcomeType(metrics),
        timeframe: determineTimeframe(action)
      },
      {
        id: Date.now() + 1,
        outcome: generateConflictOutcome(conflictPatterns),
        probability: calculateConflictProbability(metrics),
        type: determineConflictType(metrics),
        timeframe: 'medium-term'
      },
      {
        id: Date.now() + 2,
        outcome: generateGrowthOutcome(metrics),
        probability: calculateGrowthProbability(metrics),
        type: 'positive',
        timeframe: 'long-term'
      }
    ];

    // Consider responses for additional insights
    if (responses["Have you discussed this with the involved parties?"]) {
      const discussed = responses["Have you discussed this with the involved parties?"].toLowerCase();
      if (discussed.includes('yes')) {
        metrics.emotionalIntelligence += 10;
        metrics.conflictResolution += 15;
      } else {
        metrics.communication -= 15;
        consequences.push({
          id: Date.now() + 3,
          outcome: "Communication gap may lead to misunderstandings",
          probability: 75,
          type: 'negative',
          timeframe: 'short-term'
        });
      }
    }

    return {
      impacts: generateRelationshipImpacts(metrics, emotionalStates),
      dynamics: generateRelationshipDynamics(metrics),
      recommendedActions: generateRecommendedActions(metrics, conflictPatterns),
      emotionalConsiderations: generateEmotionalConsiderations(emotionalStates),
      metrics,
      emotionalStates,
      conflictPatterns
    };
  };

  const generateEmotionalOutcome = (states: EmotionalState[]): string => {
    const primaryEmotion = states[0]?.primary || 'neutral';
    const intensity = states[0]?.intensity || 5;
    
    if (intensity > 7) {
      return `Strong ${primaryEmotion} response likely to significantly impact relationship dynamics`;
    } else if (intensity > 4) {
      return `Moderate ${primaryEmotion} response may influence relationship interactions`;
    } else {
      return `Mild ${primaryEmotion} response with manageable impact on relationship`;
    }
  };

  const calculateEmotionalProbability = (metrics: RelationshipMetrics): number => {
    return Math.min(95, Math.floor(
      (metrics.emotionalIntelligence * 0.4) +
      (metrics.supportLevel * 0.3) +
      (metrics.conflictResolution * 0.3)
    ));
  };

  const determineOutcomeType = (metrics: RelationshipMetrics): 'positive' | 'negative' => {
    const averageScore = (
      metrics.emotionalIntelligence +
      metrics.conflictResolution +
      metrics.boundaryRespect +
      metrics.mutualGrowth +
      metrics.supportLevel
    ) / 5;
    
    return averageScore >= 70 ? 'positive' : 'negative';
  };

  const generateConflictOutcome = (patterns: ConflictPattern[]): string => {
    const mainPattern = patterns[0];
    if (!mainPattern) return "Normal relationship dynamics expected";
    
    return `${mainPattern.type} pattern may emerge, with ${Math.floor(mainPattern.resolutionRate * 100)}% chance of positive resolution`;
  };

  const calculateConflictProbability = (metrics: RelationshipMetrics): number => {
    return Math.min(90, Math.floor(
      ((100 - metrics.conflictResolution) * 0.5) +
      ((100 - metrics.emotionalIntelligence) * 0.3) +
      ((100 - metrics.boundaryRespect) * 0.2)
    ));
  };

  const determineConflictType = (metrics: RelationshipMetrics): 'positive' | 'negative' => {
    return metrics.conflictResolution >= 65 ? 'positive' : 'negative';
  };

  const generateGrowthOutcome = (metrics: RelationshipMetrics): string => {
    const growthPotential = metrics.mutualGrowth;
    
    if (growthPotential >= 80) {
      return "Significant opportunity for mutual growth and relationship strengthening";
    } else if (growthPotential >= 60) {
      return "Moderate potential for relationship development with proper effort";
    } else {
      return "Limited growth potential without addressing underlying issues";
    }
  };

  const calculateGrowthProbability = (metrics: RelationshipMetrics): number => {
    return Math.min(95, Math.floor(
      (metrics.mutualGrowth * 0.4) +
      (metrics.supportLevel * 0.3) +
      (metrics.emotionalIntelligence * 0.3)
    ));
  };

  const determineTimeframe = (action: string): string => {
    if (action.toLowerCase().includes('immediate') || action.toLowerCase().includes('urgent')) {
      return 'short-term';
    } else if (action.toLowerCase().includes('future') || action.toLowerCase().includes('plan')) {
      return 'long-term';
    } else {
      return 'medium-term';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          {/* Game Stats Display */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              mb: 4, 
              backgroundColor: 'rgba(25, 118, 210, 0.02)',
              borderRadius: 2,
              border: '1px solid rgba(25, 118, 210, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h6" color="primary">Level {gameStats.level}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {gameStats.totalPoints} points
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" color="success.main">
                  ${gameStats.savingsTotal.toFixed(2)} saved
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {gameStats.correctDecisions}/{gameStats.totalDecisions} correct decisions
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" color="primary">
                  {gameStats.streak} 🔥
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current streak
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {gameStats.badges.slice(-3).map((badge, index) => (
                  <Chip
                    key={index}
                    label={`${badge.icon} ${badge.name}`}
                    title={badge.description}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          <Typography variant="h3" component="h1" gutterBottom align="center">
            Consequence Prediction
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Make better decisions by understanding their potential consequences
          </Typography>
          
          <ActionInput 
            action={action}
            setAction={setAction}
            onPredict={predictConsequences}
          />

          {/* Decision History shown first */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, color: 'primary.main' }}>
              Your Decision History
            </Typography>
            <History 
              history={history}
              onDeleteItem={handleDeleteItem}
              onUpdateItem={handleUpdateItem}
              onRequestMoreInfo={handleRequestMoreInfo}
              onRecordOutcome={handleDecisionOutcome}
            />
          </Box>
          
          {/* Current Prediction Section */}
          {consequences.length > 0 && (
            <>
              <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, color: 'primary.main' }}>
                Current Prediction Analysis
              </Typography>
              
              {determineDecisionType(action) === 'relationships' && (
                <RelationshipAnalysis 
                  prediction={generateRelationshipPrediction(action, {})} 
                />
              )}
              
              <ConsequenceList consequences={consequences} />
              
              <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4, color: 'primary.main' }}>
                Probability Visualization
              </Typography>
              <Visualization consequences={consequences} />
            </>
          )}
        </Box>

        <Dialog 
          open={infoDialogOpen} 
          onClose={() => setInfoDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Additional Information Needed</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please provide more context to help refine the prediction:
            </Typography>
            <List>
              {currentPrompts.map((prompt, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={
                      <TextField
                        fullWidth
                        label={prompt}
                        multiline
                        rows={2}
                        variant="outlined"
                        value={responses[prompt] || ''}
                        onChange={(e) => setResponses(prev => ({
                          ...prev,
                          [prompt]: e.target.value
                        }))}
                        sx={{ mt: 1 }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInfoDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitAdditionalInfo} 
              variant="contained"
              disabled={Object.keys(responses).length === 0}
            >
              Update Prediction
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  )
}

export default App
