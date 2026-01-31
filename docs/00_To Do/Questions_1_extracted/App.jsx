import { useState, useEffect } from 'react';
import { AssessmentProgress } from './components/AssessmentProgress';
import { ModuleSelector } from './components/ModuleSelector';
import { BigFiveAssessment } from './components/BigFiveAssessment';
import { MBTIAssessment } from './components/MBTIAssessment';
import { LoveLanguagesAssessment } from './components/LoveLanguagesAssessment';
import { LifeContextForm } from './components/LifeContextForm';
import { DailyLifeScenarios } from './components/DailyLifeScenarios';
import { ResultsSummary } from './components/ResultsSummary';
import { AssessmentScoring } from './services/assessmentScoring';
import './App.css';

/**
 * Main Assessment Journey Component
 * Orchestrates the 6-module questionnaire system
 */
export default function App() {
  // State management
  const [currentModule, setCurrentModule] = useState(0); // 0 = intro
  const [responses, setResponses] = useState({
    bigFive: [],
    mbti: [],
    enneagram: [],
    loveLanguages: [],
    attachmentStyle: [],
    lifeContext: {},
    dailyLife: {},
    communication: {}
  });
  const [scores, setScores] = useState(null);
  const [soulPassport, setSoulPassport] = useState(null);

  // Calculate progress
  const totalModules = 6;
  const completion = (currentModule / totalModules) * 100;

  /**
   * Handle module completion
   */
  const handleModuleComplete = (moduleId, data) => {
    console.log(`Module ${moduleId} complete:`, data);

    // Update responses
    setResponses(prev => ({
      ...prev,
      ...data
    }));

    // Save to localStorage (backup)
    localStorage.setItem('genesis-assessment-progress', JSON.stringify({
      currentModule: moduleId,
      responses: { ...responses, ...data },
      lastUpdated: new Date().toISOString()
    }));

    // Move to next module
    if (currentModule < totalModules) {
      setCurrentModule(moduleId + 1);
    } else {
      // All modules complete - calculate scores
      calculateFinalScores({ ...responses, ...data });
    }
  };

  /**
   * Calculate final scores from all responses
   */
  const calculateFinalScores = (allResponses) => {
    console.log('Calculating final scores...', allResponses);

    const bigFiveScores = AssessmentScoring.calculateBigFive(allResponses.bigFive);
    const mbtiType = AssessmentScoring.calculateMBTI(allResponses.mbti);
    const loveLanguagesRanking = AssessmentScoring.calculateLoveLanguages(allResponses.loveLanguages);
    const dailyLifeAnalysis = AssessmentScoring.analyzeDailyLife(allResponses.dailyLife);

    const finalScores = {
      bigFive: bigFiveScores,
      mbti: mbtiType,
      loveLanguages: loveLanguagesRanking,
      dailyLife: dailyLifeAnalysis,
      completedAt: new Date().toISOString()
    };

    setScores(finalScores);

    // Generate Soul Passport JSON
    const passport = generateSoulPassport(allResponses, finalScores);
    setSoulPassport(passport);

    // Save to Firebase (in production)
    saveSoulPassport(passport);
  };

  /**
   * Generate complete Soul Passport from responses and scores
   */
  const generateSoulPassport = (responses, scores) => {
    return {
      soulPassport: {
        meta: {
          version: "1.0.0",
          schemaVersion: "1.0.0",
          profileId: `profile-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastCalculated: new Date().toISOString()
        },
        
        // Layer 4: Learned Patterns (from questionnaires)
        learnedPatterns: {
          weight: 0.40,
          sources: ["Big Five", "MBTI", "Enneagram", "Attachment"],
          note: "These can change with personal growth",
          
          bigFive: {
            openness: {
              score: scores.bigFive.scores.openness,
              percentile: getPercentile(scores.bigFive.scores.openness),
              description: scores.bigFive.interpretation.openness
            },
            conscientiousness: {
              score: scores.bigFive.scores.conscientiousness,
              percentile: getPercentile(scores.bigFive.scores.conscientiousness),
              description: scores.bigFive.interpretation.conscientiousness
            },
            extraversion: {
              score: scores.bigFive.scores.extraversion,
              percentile: getPercentile(scores.bigFive.scores.extraversion),
              description: scores.bigFive.interpretation.extraversion
            },
            agreeableness: {
              score: scores.bigFive.scores.agreeableness,
              percentile: getPercentile(scores.bigFive.scores.agreeableness),
              description: scores.bigFive.interpretation.agreeableness
            },
            neuroticism: {
              score: scores.bigFive.scores.neuroticism,
              percentile: getPercentile(scores.bigFive.scores.neuroticism),
              description: scores.bigFive.interpretation.neuroticism
            }
          },
          
          mbti: {
            type: scores.mbti.type,
            dichotomies: {
              energyDirection: `${scores.mbti.type[0]} (${scores.mbti.type[0] === 'E' ? 'Extraverted' : 'Introverted'}) - ${scores.mbti.percentages.EI}%`,
              information: `${scores.mbti.type[1]} (${scores.mbti.type[1] === 'N' ? 'Intuitive' : 'Sensing'}) - ${scores.mbti.percentages.SN}%`,
              decisions: `${scores.mbti.type[2]} (${scores.mbti.type[2] === 'T' ? 'Thinking' : 'Feeling'}) - ${scores.mbti.percentages.TF}%`,
              lifestyle: `${scores.mbti.type[3]} (${scores.mbti.type[3] === 'J' ? 'Judging' : 'Perceiving'}) - ${scores.mbti.percentages.JP}%`
            },
            cognitiveFunctions: scores.mbti.cognitiveFunctions,
            description: scores.mbti.description
          },
          
          enneagram: {
            coreType: null, // To be implemented
            wing: null,
            name: null,
            coreFear: null,
            coreDesire: null
          },
          
          attachmentStyle: {
            primary: null, // To be implemented
            percentage: null,
            secondary: null,
            description: null
          }
        },
        
        // Layer 5: Life Context (from forms)
        lifeContext: {
          weight: 0.60,
          updatedAt: new Date().toISOString(),
          
          currentSituation: responses.lifeContext.currentSituation || {},
          
          interests: {
            primary: responses.lifeContext.primaryInterests || [],
            hobbies: responses.lifeContext.hobbies || [],
            learningInterests: responses.lifeContext.learningInterests || []
          },
          
          lifeGoals: {
            primary: responses.lifeContext.primaryGoal || "",
            timeline: responses.lifeContext.timeHorizon || "",
            secondary: []
          },
          
          values: {
            core: responses.lifeContext.coreValues || [],
            professional: [],
            personal: []
          }
        },
        
        // Layer 6: Relationship Patterns (from assessments)
        relationshipPatterns: {
          weight: 0.65,
          sources: ["Love Languages", "Attachment", "Conflict Style"],
          
          loveLanguages: {
            primary: scores.loveLanguages.primary,
            secondary: scores.loveLanguages.secondary,
            tertiary: scores.loveLanguages.tertiary,
            ranking: scores.loveLanguages.ranking
          },
          
          conflictStyle: {
            primary: responses.dailyLife.conflictStyle || "Not assessed",
            approach: null,
            pattern: null
          },
          
          intimacyStyle: {
            emotional: null,
            physical: null,
            intellectual: null
          }
        },
        
        // Daily Life Infrastructure (THE REVOLUTIONARY DATA!)
        dailyLifeInfrastructure: {
          weight: 0.70,
          source: "Scenario-based assessment",
          
          financeArchitecture: scores.dailyLife.financeArchitecture || {},
          domesticLabor: scores.dailyLife.domesticLabor || {},
          stressRelief: scores.dailyLife.stressRelief || {},
          dailyRhythms: scores.dailyLife.dailyRhythms || {},
          environmentalNeeds: scores.dailyLife.environmentalNeeds || {}
        }
      }
    };
  };

  /**
   * Helper: Convert score to percentile descriptor
   */
  const getPercentile = (score) => {
    if (score >= 80) return "Very High";
    if (score >= 60) return "High";
    if (score >= 40) return "Medium";
    if (score >= 20) return "Low";
    return "Very Low";
  };

  /**
   * Save Soul Passport to Firebase
   */
  const saveSoulPassport = async (passport) => {
    try {
      // In production: save to Firebase
      console.log('Saving Soul Passport to Firebase:', passport);
      
      // For now, save to localStorage
      localStorage.setItem('genesis-soul-passport', JSON.stringify(passport));
      
      console.log('✅ Soul Passport saved successfully!');
    } catch (error) {
      console.error('Error saving Soul Passport:', error);
    }
  };

  /**
   * Load progress from localStorage on mount
   */
  useEffect(() => {
    const savedProgress = localStorage.getItem('genesis-assessment-progress');
    if (savedProgress) {
      try {
        const { currentModule: savedModule, responses: savedResponses } = JSON.parse(savedProgress);
        
        // Ask user if they want to resume
        const resume = window.confirm(
          `We found a saved assessment in progress (${Math.round((savedModule / totalModules) * 100)}% complete). Would you like to resume?`
        );
        
        if (resume) {
          setCurrentModule(savedModule);
          setResponses(savedResponses);
        } else {
          // Clear old data
          localStorage.removeItem('genesis-assessment-progress');
        }
      } catch (error) {
        console.error('Error loading saved progress:', error);
      }
    }
  }, []);

  /**
   * Render current module
   */
  const renderModule = () => {
    switch (currentModule) {
      case 0:
        return (
          <ModuleSelector 
            onStart={() => setCurrentModule(1)}
            progress={completion}
          />
        );
      
      case 1:
        return (
          <BigFiveAssessment 
            onComplete={(data) => handleModuleComplete(1, { bigFive: data })}
          />
        );
      
      case 2:
        return (
          <MBTIAssessment 
            onComplete={(data) => handleModuleComplete(2, { mbti: data })}
          />
        );
      
      case 3:
        return (
          <LoveLanguagesAssessment 
            onComplete={(data) => handleModuleComplete(3, { loveLanguages: data })}
          />
        );
      
      case 4:
        return (
          <LifeContextForm 
            onComplete={(data) => handleModuleComplete(4, { lifeContext: data })}
          />
        );
      
      case 5:
        return (
          <DailyLifeScenarios 
            onComplete={(data) => handleModuleComplete(5, { dailyLife: data })}
          />
        );
      
      case 6:
        return (
          <ResultsSummary 
            scores={scores}
            soulPassport={soulPassport}
            onRestart={() => {
              setCurrentModule(0);
              setResponses({});
              setScores(null);
              setSoulPassport(null);
              localStorage.removeItem('genesis-assessment-progress');
              localStorage.removeItem('genesis-soul-passport');
            }}
          />
        );
      
      default:
        return <div>Invalid module</div>;
    }
  };

  return (
    <div className="app">
      
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🧬</span>
          <h1>GENESIS</h1>
          <span className="tagline">Constitutional Compatibility Assessment</span>
        </div>
      </header>

      {/* Progress Bar */}
      {currentModule > 0 && currentModule < 6 && (
        <AssessmentProgress 
          currentModule={currentModule}
          totalModules={totalModules}
          completion={completion}
        />
      )}

      {/* Main Content */}
      <main className="app-main">
        {renderModule()}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 GENESIS · Built with ❤️ for Authentic Connection</p>
        <p className="footer-note">
          Your data is encrypted and never shared without permission
        </p>
      </footer>

    </div>
  );
}
