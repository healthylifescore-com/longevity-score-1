
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Activity, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import NameForm from '@/components/NameForm';
import QuizContainer from '@/components/QuizContainer';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'name' | 'quiz'>('landing');
  const [userName, setUserName] = useState({ firstName: '', lastName: '' });

  const handleStartQuiz = () => {
    setCurrentStep('name');
  };

  const handleNameSubmit = (name: { firstName: string; lastName: string }) => {
    setUserName(name);
    setCurrentStep('quiz');
  };

  if (currentStep === 'name') {
    return <NameForm onSubmit={handleNameSubmit} />;
  }

  if (currentStep === 'quiz') {
    return <QuizContainer userName={userName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            What's Your <span className="text-blue-600">Longevity Score</span>?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover your biological vitality with our comprehensive assessment covering sleep, diet, 
            supplements, exercise, and stress management. Get personalized recommendations to optimize 
            your health and extend your lifespan.
          </p>
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Heart className="h-12 w-12 text-red-500" />
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Mental Clarity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Enhance cognitive function and mental sharpness</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Physical Vitality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Boost energy levels and physical performance</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Disease Prevention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Reduce risk of age-related health conditions</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Longevity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Extend your healthy lifespan naturally</p>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Areas */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Comprehensive Holistic Assessment
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">😴</span>
              </div>
              <h3 className="font-semibold text-gray-900">Sleep Quality</h3>
              <p className="text-sm text-gray-600">Rest & Recovery</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">🥗</span>
              </div>
              <h3 className="font-semibold text-gray-900">Nutrition</h3>
              <p className="text-sm text-gray-600">Diet & Supplements</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">🏃</span>
              </div>
              <h3 className="font-semibold text-gray-900">Exercise</h3>
              <p className="text-sm text-gray-600">Physical Activity</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="font-semibold text-gray-900">Stress</h3>
              <p className="text-sm text-gray-600">Mental Wellness</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">🔬</span>
              </div>
              <h3 className="font-semibold text-gray-900">Health Markers</h3>
              <p className="text-sm text-gray-600">Biomarkers & Symptoms</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Biological Vitality?</h2>
          <p className="text-lg mb-6 opacity-90">
            Take our 5-minute assessment and get personalized recommendations to optimize your health
          </p>
          <Button 
            onClick={handleStartQuiz}
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
          >
            Start Your Longevity Assessment
          </Button>
          <p className="text-sm mt-4 opacity-75">
            ✓ Free Assessment ✓ Personalized Results ✓ Science-Based Recommendations
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm">
              © 2024 Healthy Life Score. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <Link 
                to="/privacy-policy" 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
