
export interface QuizResults {
  overallScore: number;
  categoryScores: {
    sleep: number;
    diet: number;
    exercise: number;
    stress: number;
    health: number;
  };
  recommendations: {
    supplements: boolean;
    ketogenic: boolean;
    paleo: boolean;
    specificSupplements: string[];
  };
  vitality: 'Low' | 'Moderate' | 'Good' | 'Excellent';
}

export const calculateResults = (answers: Record<string, any>): QuizResults => {
  let totalScore = 0;
  let maxScore = 0;
  
  // Category scores
  const categoryScores = {
    sleep: 0,
    diet: 0,
    exercise: 0,
    stress: 0,
    health: 0
  };

  // Sleep scoring
  const sleepHours = answers.sleep_hours || 0;
  const sleepQuality = answers.sleep_quality;
  const sleepConsistency = answers.sleep_consistency;

  let sleepScore = 0;
  if (sleepHours >= 7 && sleepHours <= 9) sleepScore += 10;
  else if (sleepHours >= 6 && sleepHours <= 10) sleepScore += 7;
  else sleepScore += 3;

  const qualityScores = { 'Excellent': 10, 'Good': 8, 'Fair': 6, 'Poor': 4, 'Very Poor': 2 };
  sleepScore += qualityScores[sleepQuality as keyof typeof qualityScores] || 0;

  const consistencyScores = { 'Always': 10, 'Usually': 8, 'Sometimes': 6, 'Rarely': 4, 'Never': 2 };
  sleepScore += consistencyScores[sleepConsistency as keyof typeof consistencyScores] || 0;

  categoryScores.sleep = Math.round((sleepScore / 30) * 100);

  // Diet scoring
  const dietType = answers.diet_type;
  const processedFoods = answers.processed_foods;
  const vegetablesFruits = answers.vegetables_fruits;
  const waterIntake = answers.water_intake || 0;

  let dietScore = 0;
  const dietScores = { 'Mediterranean': 10, 'Ketogenic': 9, 'Paleo': 9, 'Vegetarian': 8, 'Vegan': 8, 'Standard Western Diet': 4, 'Other': 6 };
  dietScore += dietScores[dietType as keyof typeof dietScores] || 0;

  const processedScores = { 'Never': 10, 'Rarely': 8, 'Weekly': 6, 'Several times a week': 4, 'Daily': 2 };
  dietScore += processedScores[processedFoods as keyof typeof processedScores] || 0;

  const veggieScores = { '8 or more': 10, '6-7': 8, '4-5': 6, '2-3': 4, 'Less than 2': 2 };
  dietScore += veggieScores[vegetablesFruits as keyof typeof veggieScores] || 0;

  if (waterIntake >= 8) dietScore += 10;
  else if (waterIntake >= 6) dietScore += 8;
  else if (waterIntake >= 4) dietScore += 6;
  else dietScore += 3;

  categoryScores.diet = Math.round((dietScore / 40) * 100);

  // Exercise scoring
  const exerciseFreq = answers.exercise_frequency || 0;
  const exerciseIntensity = answers.exercise_intensity;
  const exerciseTypes = answers.exercise_types || [];

  let exerciseScore = 0;
  if (exerciseFreq >= 5) exerciseScore += 10;
  else if (exerciseFreq >= 3) exerciseScore += 8;
  else if (exerciseFreq >= 1) exerciseScore += 6;
  else exerciseScore += 2;

  const intensityScores = { 'High intensity': 10, 'Moderate intensity': 8, 'Low intensity': 6, 'I don\'t exercise regularly': 2 };
  exerciseScore += intensityScores[exerciseIntensity as keyof typeof intensityScores] || 0;

  if (Array.isArray(exerciseTypes)) {
    exerciseScore += Math.min(exerciseTypes.length * 2, 10);
  }

  categoryScores.exercise = Math.round((exerciseScore / 30) * 100);

  // Stress scoring
  const stressLevel = answers.stress_level;
  const stressManagement = answers.stress_management;
  const meditation = answers.meditation_relaxation;

  let stressScore = 0;
  const stressScores = { 'Very Low': 10, 'Low': 8, 'Moderate': 6, 'High': 4, 'Very High': 2 };
  stressScore += stressScores[stressLevel as keyof typeof stressScores] || 0;

  const managementScores = { 'Daily': 10, 'Weekly': 8, 'Occasionally': 6, 'Rarely': 4, 'Never': 2 };
  stressScore += managementScores[stressManagement as keyof typeof managementScores] || 0;
  stressScore += managementScores[meditation as keyof typeof managementScores] || 0;

  categoryScores.stress = Math.round((stressScore / 30) * 100);

  // Health scoring
  const jointPain = answers.joint_pain;
  const fatigue = answers.fatigue;
  const earRinging = answers.ear_ringing;
  const gutSkinIssues = answers.gut_skin_issues;
  const smoking = answers.smoking;
  const alcohol = answers.alcohol;
  const energyLevels = answers.energy_levels;
  const digestiveHealth = answers.digestive_health;
  const skinCondition = answers.skin_condition;
  const mentalClarity = answers.mental_clarity;
  const moodStability = answers.mood_stability;
  const caffeineIntake = answers.caffeine_intake;
  const sunExposure = answers.sun_exposure;
  const socialConnections = answers.social_connections;

  let healthScore = 0;
  const symptomScores = { 'Never': 10, 'Rarely': 8, 'Sometimes': 6, 'Frequently': 4 };
  healthScore += symptomScores[jointPain as keyof typeof symptomScores] || 0;
  healthScore += symptomScores[fatigue as keyof typeof symptomScores] || 0;
  healthScore += symptomScores[earRinging as keyof typeof symptomScores] || 0;

  if (gutSkinIssues === 'No') healthScore += 10;
  else healthScore += 5;

  const smokingScores = { 'Never': 10, 'Former smoker': 8, 'Yes, occasionally': 4, 'Yes, regularly': 2 };
  healthScore += smokingScores[smoking as keyof typeof smokingScores] || 0;

  const alcoholScores = { 'Never': 10, 'Rarely': 10, 'Monthly': 8, 'Weekly': 6, 'Several times a week': 4, 'Daily': 2 };
  healthScore += alcoholScores[alcohol as keyof typeof alcoholScores] || 0;

  // Additional health factors
  const energyScores = { 'Consistently high': 10, 'Generally good with some dips': 8, 'Moderate with afternoon crashes': 6, 'Low most of the time': 4, 'Extremely low': 2 };
  healthScore += energyScores[energyLevels as keyof typeof energyScores] || 0;

  const digestiveScores = { 'Excellent, no issues': 10, 'Good, occasional minor issues': 8, 'Fair, some regular discomfort': 6, 'Poor, frequent problems': 4, 'Very poor, daily issues': 2 };
  healthScore += digestiveScores[digestiveHealth as keyof typeof digestiveScores] || 0;

  const skinScores = { 'Clear and healthy': 10, 'Generally good with minor issues': 8, 'Moderate issues (acne, dryness, etc.)': 6, 'Poor with frequent problems': 4, 'Very poor, multiple skin concerns': 2 };
  healthScore += skinScores[skinCondition as keyof typeof skinScores] || 0;

  const clarityScores = { 'Sharp and focused': 10, 'Generally good': 8, 'Moderate, some brain fog': 6, 'Poor, frequent brain fog': 4, 'Very poor, constant mental cloudiness': 2 };
  healthScore += clarityScores[mentalClarity as keyof typeof clarityScores] || 0;

  const moodScores = { 'Very stable and positive': 10, 'Generally stable': 8, 'Moderate fluctuations': 6, 'Frequent mood swings': 4, 'Very unstable': 2 };
  healthScore += moodScores[moodStability as keyof typeof moodScores] || 0;

  const caffeineScores = { 'None': 10, '1-2 cups of coffee/tea': 8, '3-4 cups of coffee/tea': 6, '5+ cups of coffee/tea': 4, 'Multiple energy drinks': 2 };
  healthScore += caffeineScores[caffeineIntake as keyof typeof caffeineScores] || 0;

  const sunScores = { '30+ minutes outdoors': 10, '15-30 minutes outdoors': 8, '5-15 minutes outdoors': 6, 'Mostly indoors': 4, 'Almost no sunlight': 2 };
  healthScore += sunScores[sunExposure as keyof typeof sunScores] || 0;

  const socialScores = { 'Very strong support network': 10, 'Good relationships': 8, 'Moderate social connections': 6, 'Limited social connections': 4, 'Isolated/lonely': 2 };
  healthScore += socialScores[socialConnections as keyof typeof socialScores] || 0;

  categoryScores.health = Math.round((healthScore / 120) * 100);

  // Calculate overall score
  const overallScore = Math.round(
    (categoryScores.sleep + categoryScores.diet + categoryScores.exercise + categoryScores.stress + categoryScores.health) / 5
  );

  // Determine vitality level
  let vitality: 'Low' | 'Moderate' | 'Good' | 'Excellent';
  if (overallScore >= 85) vitality = 'Excellent';
  else if (overallScore >= 70) vitality = 'Good';
  else if (overallScore >= 55) vitality = 'Moderate';
  else vitality = 'Low';

  // Determine recommendations
  const needsSupplements = 
    jointPain === 'Frequently' || jointPain === 'Sometimes' ||
    fatigue === 'Frequently' || fatigue === 'Sometimes' ||
    earRinging === 'Frequently' || earRinging === 'Sometimes' ||
    energyLevels === 'Low most of the time' || energyLevels === 'Extremely low';

  const specificSupplements = [];
  if (gutSkinIssues === 'Yes, both' || gutSkinIssues === 'Yes, gut issues' || gutSkinIssues === 'Yes, skin issues' ||
      digestiveHealth === 'Poor, frequent problems' || digestiveHealth === 'Very poor, daily issues' ||
      skinCondition === 'Poor with frequent problems' || skinCondition === 'Very poor, multiple skin concerns') {
    specificSupplements.push('PrimeBiome');
  }
  if (earRinging === 'Frequently' || earRinging === 'Sometimes') {
    specificSupplements.push('Quietum Plus');
  }
  if (answers.prostate_concerns === 'Yes, significant concerns' || answers.prostate_concerns === 'Yes, some concerns') {
    specificSupplements.push('ProstaVive');
  }
  if (answers.belly_fat === 'Yes, significantly' || answers.belly_fat === 'Yes, somewhat' ||
      energyLevels === 'Low most of the time' || energyLevels === 'Extremely low') {
    specificSupplements.push('HepatoBurn');
  }

  const recommendations = {
    supplements: needsSupplements || specificSupplements.length > 0,
    ketogenic: !needsSupplements && (dietType !== 'Ketogenic' && dietType !== 'Paleo'),
    paleo: !needsSupplements && (dietType !== 'Ketogenic' && dietType !== 'Paleo'),
    specificSupplements
  };

  return {
    overallScore,
    categoryScores,
    recommendations,
    vitality
  };
};
