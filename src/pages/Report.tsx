import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Mail, TrendingUp, AlertTriangle } from 'lucide-react';
import { generateRedirectUrl } from '@/data/affiliateLinks';

interface ReportData {
  overallScore: number;
  vitality: string;
  categoryScores: {
    sleep: number;
    diet: number;
    exercise: number;
    stress: number;
    health: number;
  };
  recommendations: {
    supplements: boolean;
    specificSupplements: string[];
  };
  userName: string;
}

const Report = () => {
  const [searchParams] = useSearchParams();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const email = searchParams.get('email');

  useEffect(() => {
    // In a real implementation, you would fetch the report data from your database
    // For now, we'll simulate with sample data based on the logs
    if (email) {
      // Simulate API call
      setTimeout(() => {
        setReportData({
          overallScore: 66,
          vitality: 'Moderate',
          categoryScores: {
            sleep: 77,
            diet: 60,
            exercise: 60,
            stress: 47,
            health: 86
          },
          recommendations: {
            supplements: true,
            specificSupplements: ['PrimeBiome', 'Quietum Plus', 'ProstaVive', 'HepatoBurn']
          },
          userName: 'toudjida'
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [email]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-700';
    if (score >= 40) return 'text-orange-700';
    return 'text-red-700';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (!email || !reportData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Report Not Found</h1>
          <p className="text-muted-foreground mb-4">
            We couldn't find your longevity report. Please check your email link.
          </p>
          <Button asChild>
            <a href="/">Take Assessment</a>
          </Button>
        </Card>
      </div>
    );
  }

  const categoryItems = [
    { name: 'Sleep', score: reportData.categoryScores.sleep, color: 'bg-blue-100' },
    { name: 'Diet', score: reportData.categoryScores.diet, color: 'bg-yellow-100' },
    { name: 'Exercise', score: reportData.categoryScores.exercise, color: 'bg-orange-100' },
    { name: 'Stress', score: reportData.categoryScores.stress, color: 'bg-red-100' },
    { name: 'Health', score: reportData.categoryScores.health, color: 'bg-green-100' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm">
              Access the report
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              Email me this report (optional)
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Longevity Report, {reportData.userName}!
          </h1>
          <p className="text-muted-foreground">
            Comprehensive analysis of your biological vitality and personalized recommendations
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Your Longevity Score</h2>
            <div className="text-6xl font-bold mb-2">{reportData.overallScore}</div>
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-5 w-5" />
              <span>Biological Vitality: {reportData.vitality}</span>
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="mb-8 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-xl font-semibold">Category Breakdown</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryItems.map((category) => (
              <div key={category.name} className={`p-4 rounded-lg ${category.color}`}>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-1">{category.name}</div>
                  <div className={`text-3xl font-bold ${getScoreColor(category.score)}`}>
                    {category.score}
                  </div>
                  <div className="text-xs text-gray-500">out of 100</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Priority Recommendations */}
        <Card className="mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-lg font-semibold">URGENT: Top Priority Recommendations</h3>
            </div>
            <p className="text-sm mt-1 text-red-100">
              Based on your health profile, these are the most critical areas to address immediately for maximum longevity impact!
            </p>
          </div>
          
          <div className="p-6">
            {reportData.recommendations.specificSupplements.map((supplement, index) => (
              <div key={supplement} className="mb-6 last:mb-0">
                <div className="bg-orange-500 text-white p-3 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⚡ TOP PRIORITY FOR YOUR ENERGY & BELLY FAT CONCERNS ⚡</span>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-orange-200 rounded-b-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {supplement} - Breakthrough Discovery
                  </h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Scientists have discovered a hidden root cause of stubborn belly fat that's been keeping you stuck. 
                    This breakthrough solution targets the real problem - not just the symptoms. Users report:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>More Energy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Healthier Skin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Better Sleep</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Reduced Hunger</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Clearer Thinking</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>Improved Health</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => {
                        let linkId = '';
                        switch (supplement) {
                          case 'PrimeBiome':
                            linkId = 'primebiome';
                            break;
                          case 'Quietum Plus':
                            linkId = 'quietum-plus';
                            break;
                          case 'ProstaVive':
                            linkId = 'prostav-ive';
                            break;
                          case 'HepatoBurn':
                            linkId = 'hepato-burn';
                            break;
                          default:
                            linkId = supplement.toLowerCase().replace(' ', '-');
                        }
                        window.open(generateRedirectUrl(linkId, email), '_blank');
                      }}
                    >
                      🔥 DISCOVER THE ROOT CAUSE - Limited Time Offer! 🔥
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Additional Recommendations */}
        <Card className="mb-8">
          <div className="bg-purple-500 text-white p-4">
            <div className="flex items-center gap-2">
              <span>⭐</span>
              <h3 className="text-lg font-semibold">DOCTOR-ENDORSED FOR YOUR GUT & SKIN ISSUES</h3>
              <span>⭐</span>
            </div>
          </div>
          
          <div className="bg-purple-50 p-6">
            <h4 className="font-semibold text-purple-900 mb-3">PrimeBiome - Skin-Gut Connection</h4>
            <p className="text-sm text-gray-700 mb-4">
              Your gut and skin issues are connected! PrimeBiome combines unique ingredients designed to 
              support cell turnover by maintaining a healthy skin and gut microbiome for a more youthful 
              appearance.
            </p>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => window.open(generateRedirectUrl('primebiome', email), '_blank')}
            >
              🌟 Transform Your Skin & Gut Health Today! 🌟
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center py-8 text-muted-foreground">
          <p>This report was generated based on your longevity assessment responses.</p>
        </div>
      </div>
    </div>
  );
};

export default Report;