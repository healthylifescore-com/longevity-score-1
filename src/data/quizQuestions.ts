
export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  type: 'radio' | 'checkbox' | 'number' | 'select';
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

export const quizQuestions: QuizQuestion[] = [
  // Sleep Quality
  {
    id: 'sleep_hours',
    category: 'Sleep',
    question: 'How many hours of sleep do you typically get per night?',
    type: 'number',
    min: 0,
    max: 12,
    unit: 'hours'
  },
  {
    id: 'sleep_quality',
    category: 'Sleep',
    question: 'How would you rate your overall sleep quality?',
    type: 'radio',
    options: ['Excellent', 'Good', 'Fair', 'Poor', 'Very Poor']
  },
  {
    id: 'sleep_consistency',
    category: 'Sleep',
    question: 'Do you maintain a consistent sleep schedule?',
    type: 'radio',
    options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never']
  },

  // Diet & Nutrition
  {
    id: 'diet_type',
    category: 'Diet',
    question: 'Which best describes your current diet?',
    type: 'radio',
    options: ['Standard Western Diet', 'Mediterranean', 'Ketogenic', 'Paleo', 'Vegetarian', 'Vegan', 'Other']
  },
  {
    id: 'processed_foods',
    category: 'Diet',
    question: 'How often do you eat processed foods?',
    type: 'radio',
    options: ['Daily', 'Several times a week', 'Weekly', 'Rarely', 'Never']
  },
  {
    id: 'vegetables_fruits',
    category: 'Diet',
    question: 'How many servings of vegetables and fruits do you eat daily?',
    type: 'radio',
    options: ['Less than 2', '2-3', '4-5', '6-7', '8 or more']
  },
  {
    id: 'water_intake',
    category: 'Diet',
    question: 'How many glasses of water do you drink daily?',
    type: 'number',
    min: 0,
    max: 20,
    unit: 'glasses'
  },

  // Supplements
  {
    id: 'current_supplements',
    category: 'Supplements',
    question: 'Do you currently take any dietary supplements?',
    type: 'radio',
    options: ['Yes, regularly', 'Yes, occasionally', 'No, but interested', 'No, not interested']
  },

  // Exercise
  {
    id: 'exercise_frequency',
    category: 'Exercise',
    question: 'How many days per week do you exercise?',
    type: 'number',
    min: 0,
    max: 7,
    unit: 'days'
  },
  {
    id: 'exercise_intensity',
    category: 'Exercise',
    question: 'What is the typical intensity of your workouts?',
    type: 'radio',
    options: ['High intensity', 'Moderate intensity', 'Low intensity', 'I don\'t exercise regularly']
  },
  {
    id: 'exercise_types',
    category: 'Exercise',
    question: 'What types of exercise do you do? (Select all that apply)',
    type: 'checkbox',
    options: ['Cardio/Aerobic', 'Strength Training', 'Flexibility/Yoga', 'Sports', 'Walking', 'None']
  },

  // Stress Management
  {
    id: 'stress_level',
    category: 'Stress',
    question: 'How would you rate your current stress level?',
    type: 'radio',
    options: ['Very High', 'High', 'Moderate', 'Low', 'Very Low']
  },
  {
    id: 'stress_management',
    category: 'Stress',
    question: 'Do you practice stress management techniques?',
    type: 'radio',
    options: ['Daily', 'Weekly', 'Occasionally', 'Rarely', 'Never']
  },
  {
    id: 'meditation_relaxation',
    category: 'Stress',
    question: 'Do you practice meditation, deep breathing, or other relaxation techniques?',
    type: 'radio',
    options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never']
  },

  // Health Symptoms
  {
    id: 'joint_pain',
    category: 'Health',
    question: 'Do you experience joint pain or stiffness?',
    type: 'radio',
    options: ['Frequently', 'Sometimes', 'Rarely', 'Never']
  },
  {
    id: 'fatigue',
    category: 'Health',
    question: 'Do you experience fatigue or lack of energy?',
    type: 'radio',
    options: ['Frequently', 'Sometimes', 'Rarely', 'Never']
  },
  {
    id: 'ear_ringing',
    category: 'Health',
    question: 'Do you experience ear ringing or hearing issues?',
    type: 'radio',
    options: ['Frequently', 'Sometimes', 'Rarely', 'Never']
  },
  {
    id: 'gut_skin_issues',
    category: 'Health',
    question: 'Are you experiencing gut health or skin issues?',
    type: 'radio',
    options: ['Yes, both', 'Yes, gut issues', 'Yes, skin issues', 'No']
  },
  {
    id: 'prostate_concerns',
    category: 'Health',
    question: 'Do you have concerns about prostate health? (Men only)',
    type: 'radio',
    options: ['Yes, significant concerns', 'Yes, some concerns', 'No concerns', 'Not applicable']
  },
  {
    id: 'belly_fat',
    category: 'Health',
    question: 'Do you struggle with stubborn belly fat?',
    type: 'radio',
    options: ['Yes, significantly', 'Yes, somewhat', 'No', 'Not sure']
  },
  {
    id: 'energy_levels',
    category: 'Health',
    question: 'How would you rate your overall energy levels throughout the day?',
    type: 'radio',
    options: ['Consistently high', 'Generally good with some dips', 'Moderate with afternoon crashes', 'Low most of the time', 'Extremely low']
  },
  {
    id: 'digestive_health',
    category: 'Health',
    question: 'How is your digestive health?',
    type: 'radio',
    options: ['Excellent, no issues', 'Good, occasional minor issues', 'Fair, some regular discomfort', 'Poor, frequent problems', 'Very poor, daily issues']
  },
  {
    id: 'skin_condition',
    category: 'Health',
    question: 'How would you describe your skin condition?',
    type: 'radio',
    options: ['Clear and healthy', 'Generally good with minor issues', 'Moderate issues (acne, dryness, etc.)', 'Poor with frequent problems', 'Very poor, multiple skin concerns']
  },
  {
    id: 'mental_clarity',
    category: 'Health',
    question: 'How is your mental clarity and focus?',
    type: 'radio',
    options: ['Sharp and focused', 'Generally good', 'Moderate, some brain fog', 'Poor, frequent brain fog', 'Very poor, constant mental cloudiness']
  },
  {
    id: 'mood_stability',
    category: 'Health',
    question: 'How stable is your mood throughout the day?',
    type: 'radio',
    options: ['Very stable and positive', 'Generally stable', 'Moderate fluctuations', 'Frequent mood swings', 'Very unstable']
  },

  // Lifestyle
  {
    id: 'age',
    category: 'Lifestyle',
    question: 'What is your age?',
    type: 'number',
    min: 18,
    max: 100,
    unit: 'years'
  },
  {
    id: 'smoking',
    category: 'Lifestyle',
    question: 'Do you smoke or use tobacco products?',
    type: 'radio',
    options: ['Yes, regularly', 'Yes, occasionally', 'Former smoker', 'Never']
  },
  {
    id: 'alcohol',
    category: 'Lifestyle',
    question: 'How often do you consume alcohol?',
    type: 'radio',
    options: ['Daily', 'Several times a week', 'Weekly', 'Monthly', 'Rarely', 'Never']
  },
  {
    id: 'caffeine_intake',
    category: 'Lifestyle',
    question: 'How much caffeine do you consume daily?',
    type: 'radio',
    options: ['None', '1-2 cups of coffee/tea', '3-4 cups of coffee/tea', '5+ cups of coffee/tea', 'Multiple energy drinks']
  },
  {
    id: 'sun_exposure',
    category: 'Lifestyle',
    question: 'How much sunlight exposure do you get daily?',
    type: 'radio',
    options: ['30+ minutes outdoors', '15-30 minutes outdoors', '5-15 minutes outdoors', 'Mostly indoors', 'Almost no sunlight']
  },
  {
    id: 'social_connections',
    category: 'Lifestyle',
    question: 'How would you rate your social connections and relationships?',
    type: 'radio',
    options: ['Very strong support network', 'Good relationships', 'Moderate social connections', 'Limited social connections', 'Isolated/lonely']
  }
];
