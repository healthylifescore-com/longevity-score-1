
import { useState } from 'react';
import QuizQuestion from '@/components/QuizQuestion';
import EmailCollectionForm from '@/components/EmailCollectionForm';
import ResultsReport from '@/components/ResultsReport';
import { quizQuestions } from '@/data/quizQuestions';
import { calculateResults } from '@/utils/quizCalculator';
import { Button } from '@/components/ui/button';

interface QuizContainerProps {
  userName: { firstName: string; lastName: string };
}

const QuizContainer = ({ userName }: QuizContainerProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Show results immediately; email collection optional
      setShowResults(true);
      setShowEmailForm(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleEmailSubmitted = () => {
    setShowEmailForm(false);
    setShowResults(true);
  };

  if (showResults) {
    const results = calculateResults(answers);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-6 flex justify-end">
            <Button variant="secondary" onClick={() => setShowEmailForm((v) => !v)}>
              {showEmailForm ? 'Hide email form' : 'Email me this report'}
            </Button>
          </div>
          {showEmailForm && (
            <div className="mb-8">
              <EmailCollectionForm
                userName={userName}
                answers={answers}
                results={results}
                onEmailSubmitted={handleEmailSubmitted}
              />
            </div>
          )}
          <ResultsReport 
            userName={userName}
            answers={answers}
            results={results}
          />
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <QuizQuestion
          question={question}
          answer={answers[question.id]}
          onAnswer={(answer) => handleAnswer(question.id, answer)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={answers[question.id] !== undefined}
          canGoPrevious={currentQuestion > 0}
          isLastQuestion={currentQuestion === quizQuestions.length - 1}
        />
      </div>
    </div>
  );
};

export default QuizContainer;
