
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QuizResults } from '@/utils/quizCalculator';
import { Heart, TrendingUp, Award, AlertCircle } from 'lucide-react';

interface ResultsReportProps {
  userName: { firstName: string; lastName: string };
  answers: Record<string, any>;
  results: QuizResults;
}

const ResultsReport = ({ userName, answers, results }: ResultsReportProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 55) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-blue-100';
    if (score >= 55) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const ProductLink = ({ href, title, description }: { href: string; title: string; description: string }) => (
    <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
      <CardContent className="p-4">
        <h4 className="font-bold text-lg text-blue-900 mb-2">{title}</h4>
        <p className="text-gray-700 mb-4 text-sm">{description}</p>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <a href={href} target="_blank" rel="noopener noreferrer">
            Learn More & Get Started
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Longevity Report, {userName.firstName}!
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive analysis of your biological vitality and personalized recommendations
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold mb-2">
              Your Longevity Score
            </CardTitle>
            <div className="text-6xl font-bold mb-4">
              {results.overallScore}
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Heart className="h-6 w-6" />
              <span className="text-xl">Biological Vitality: {results.vitality}</span>
            </div>
          </CardHeader>
        </Card>

        {/* Category Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <span>Category Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(results.categoryScores).map(([category, score]) => (
                <div key={category} className={`text-center p-4 rounded-lg ${getScoreBackground(score)}`}>
                  <h3 className="font-semibold text-gray-900 capitalize mb-2">{category}</h3>
                  <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                    {score}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">out of 100</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Priority Recommendations */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 rounded-lg mb-6 text-center">
            <h2 className="text-3xl font-bold mb-3">🚨 URGENT: Top Priority Recommendations</h2>
            <p className="text-lg">
              Based on your health profile, these are the most critical areas to address immediately for maximum longevity impact!
            </p>
          </div>
          
          <div className="grid gap-6 mb-8">
            {results.recommendations.specificSupplements.includes('HepatoBurn') && (
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-4 border-orange-300 rounded-lg overflow-hidden">
                <div className="bg-orange-500 text-white p-3 text-center font-bold">
                  ⭐ TOP PRIORITY FOR YOUR ENERGY & BELLY FAT CONCERNS ⭐
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-orange-900 mb-3">HepatoBurn - Breakthrough Discovery</h3>
                  <p className="text-gray-800 mb-4 text-lg">
                    Scientists have discovered a hidden root cause of stubborn belly fat that's been keeping you stuck. 
                    This breakthrough solution targets the real problem - not just the symptoms. Users report:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-green-600 font-bold">✅ More Energy</div>
                      <div className="text-green-600 font-bold">✅ Healthier Skin</div>
                      <div className="text-green-600 font-bold">✅ Better Sleep</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-green-600 font-bold">✅ Reduced Hunger</div>
                      <div className="text-green-600 font-bold">✅ Clearer Thinking</div>
                      <div className="text-green-600 font-bold">✅ Improved Health</div>
                    </div>
                  </div>
                  <Button asChild size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-xl py-4">
                    <a href="https://1ae599voosvr3u55ljqrsz1d2y.hop.clickbank.net" target="_blank" rel="noopener noreferrer">
                      🔥 DISCOVER THE ROOT CAUSE - Limited Time Offer! 🔥
                    </a>
                  </Button>
                </div>
              </div>
            )}
            
            {results.recommendations.specificSupplements.includes('PrimeBiome') && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-300 rounded-lg overflow-hidden">
                <div className="bg-purple-500 text-white p-3 text-center font-bold">
                  🌟 DOCTOR-ENDORSED FOR YOUR GUT & SKIN ISSUES 🌟
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-purple-900 mb-3">PrimeBiome - Skin-Gut Connection</h3>
                  <p className="text-gray-800 mb-4 text-lg">
                    Your gut and skin issues are connected! PrimeBiome combines unique ingredients designed to support 
                    cell turnover by maintaining a healthy skin and gut microbiome for a more youthful appearance.
                  </p>
                  <Button asChild size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-xl py-4">
                    <a href="https://51a483kplq0keu0m6g-cc5xkrr.hop.clickbank.net" target="_blank" rel="noopener noreferrer">
                      🌟 Transform Your Skin & Gut Health Today! 🌟
                    </a>
                  </Button>
                </div>
              </div>
            )}
            
            {results.recommendations.specificSupplements.includes('Quietum Plus') && (
              <div className="bg-gradient-to-r from-blue-100 to-teal-100 border-4 border-blue-300 rounded-lg overflow-hidden">
                <div className="bg-blue-500 text-white p-3 text-center font-bold">
                  🔊 BREAKTHROUGH FOR YOUR EAR RINGING CONCERNS 🔊
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-blue-900 mb-3">Quietum Plus - Revolutionary Ear Solution</h3>
                  <p className="text-gray-800 mb-4 text-lg">
                    Ear ringing happens when neural wires get damaged. Quietum Plus feeds, regenerates and rebuilds 
                    these pathways for perfect harmony with your brain. Backed by hundreds of clinical studies.
                  </p>
                  <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-xl py-4">
                    <a href="https://2bf565sfkoxrcy2pxejdw72i6n.hop.clickbank.net" target="_blank" rel="noopener noreferrer">
                      🔊 Stop Ear Ringing Naturally - Get Quietum Plus! 🔊
                    </a>
                  </Button>
                </div>
              </div>
            )}
            
            {results.recommendations.specificSupplements.includes('ProstaVive') && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-4 border-green-300 rounded-lg overflow-hidden">
                <div className="bg-green-500 text-white p-3 text-center font-bold">
                  💪 PROSTATE HEALTH BREAKTHROUGH FORMULA 💪
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-green-900 mb-3">ProstaVive - Powerful Prostate Formula</h3>
                  <p className="text-gray-800 mb-4 text-lg">
                    These specific, unique nutrients support prostate activity, metabolize cells, maintain healthy 
                    blood flow, and help support a healthy prostate size for optimal men's health.
                  </p>
                  <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-xl py-4">
                    <a href="https://hop.clickbank.net/?affiliate=fitatn&vendor=provive&tid=track" target="_blank" rel="noopener noreferrer">
                      💪 Boost Your Prostate Health Today! 💪
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-6 w-6 text-green-600" />
              <span>Detailed Health Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {results.recommendations.supplements && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-yellow-800 mb-3">
                  🌿 Targeted Supplement Support Recommended
                </h3>
                <p className="text-yellow-700 mb-4">
                  Based on your responses about joint pain, fatigue, or other health concerns, 
                  targeted nutritional support could help address these specific issues and 
                  improve your overall vitality.
                </p>
                <div className="space-y-4">
                  {results.recommendations.specificSupplements.map((supplement) => (
                    <div key={supplement} className="bg-white p-4 rounded border">
                      <h4 className="font-semibold text-gray-900">{supplement}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Specifically recommended based on your health profile
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(results.recommendations.ketogenic || results.recommendations.paleo) && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-green-800 mb-3">
                  🥗 Nutrition Optimization
                </h3>
                <p className="text-green-700 mb-4">
                  Your health profile suggests you could benefit from dietary optimization. 
                  Consider exploring these evidence-based nutrition approaches:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-900">Ketogenic Diet</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      High-fat, low-carb approach that may improve energy, mental clarity, and metabolic health
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-gray-900">Mediterranean Diet</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Anti-inflammatory, heart-healthy approach rich in whole foods and healthy fats
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sleep Recommendations */}
            {results.categoryScores.sleep < 70 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-blue-800 mb-3">
                  😴 Sleep Optimization
                </h3>
                <p className="text-blue-700 mb-4">
                  Your sleep score suggests room for improvement. Quality sleep is crucial for longevity:
                </p>
                <ul className="list-disc list-inside text-blue-700 space-y-2">
                  <li>Aim for 7-9 hours of sleep nightly</li>
                  <li>Maintain a consistent sleep schedule</li>
                  <li>Create a relaxing bedtime routine</li>
                  <li>Keep your bedroom cool, dark, and quiet</li>
                </ul>
              </div>
            )}

            {/* Exercise Recommendations */}
            {results.categoryScores.exercise < 70 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-red-800 mb-3">
                  💪 Physical Activity Enhancement
                </h3>
                <p className="text-red-700 mb-4">
                  Increasing your physical activity could significantly boost your longevity score:
                </p>
                <ul className="list-disc list-inside text-red-700 space-y-2">
                  <li>Aim for at least 150 minutes of moderate exercise weekly</li>
                  <li>Include both cardio and strength training</li>
                  <li>Add flexibility work like yoga or stretching</li>
                  <li>Start gradually and build consistency</li>
                </ul>
              </div>
            )}

            {/* Stress Management */}
            {results.categoryScores.stress < 70 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-bold text-lg text-purple-800 mb-3">
                  🧘 Stress Management
                </h3>
                <p className="text-purple-700 mb-4">
                  Managing stress is crucial for longevity and overall health:
                </p>
                <ul className="list-disc list-inside text-purple-700 space-y-2">
                  <li>Practice daily meditation or deep breathing</li>
                  <li>Regular physical activity helps reduce stress</li>
                  <li>Maintain strong social connections</li>
                  <li>Consider professional support if needed</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Diet Resource */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🌊 Mediterranean Diet Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              The Mediterranean diet is one of the most studied and effective approaches for longevity. 
              This comprehensive guide includes shopping lists for all ingredients (they're actually 
              all available at your local grocery store!).
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <a href="https://05a9d6qkbr1l5q48m6jmndvr9e.hop.clickbank.net" target="_blank" rel="noopener noreferrer">
                Get the Mediterranean Diet Guide
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Urgent Call to Action Footer */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-8 text-white text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">🚨 DON'T WAIT - Your Health Can't Afford to Wait! 🚨</h2>
          <p className="text-xl mb-6">
            Every day you delay is another day your body isn't getting the support it needs. 
            The science is clear - these solutions work when you take action NOW!
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg py-4">
              <a href="https://1ae599voosvr3u55ljqrsz1d2y.hop.clickbank.net" target="_blank" rel="noopener noreferrer">
                🔥 Fix Belly Fat NOW!
              </a>
            </Button>
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg py-4">
              <a href="https://51a483kplq0keu0m6g-cc5xkrr.hop.clickbank.net" target="_blank" rel="noopener noreferrer">
                🌟 Heal Gut & Skin!
              </a>
            </Button>
            <Button asChild size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg py-4">
              <a href="https://05a9d6qkbr1l5q48m6jmndvr9e.hop.clickbank.net" target="_blank" rel="noopener noreferrer">
                🥗 Get Diet Guide!
              </a>
            </Button>
          </div>
          <p className="text-lg mt-4 font-bold">
            ⏰ Limited Time: Special Offers Available - Click Above Before They Expire! ⏰
          </p>
        </div>

        {/* Secondary CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-3">Start Your Transformation Journey</h3>
          <p className="mb-4">
            Choose the solution that matches your biggest health concern and start seeing results within days!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <a href="https://1ae599voosvr3u55ljqrsz1d2y.hop.clickbank.net" target="_blank" rel="noopener noreferrer">
                Energy & Belly Fat Solution
              </a>
            </Button>
            <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <a href="https://51a483kplq0keu0m6g-cc5xkrr.hop.clickbank.net" target="_blank" rel="noopener noreferrer">
                Gut & Skin Health
              </a>
            </Button>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>Thank you for taking the Longevity Lab assessment, {userName.firstName}!</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsReport;
