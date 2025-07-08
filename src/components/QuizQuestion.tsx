
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { QuizQuestion as QuizQuestionType } from '@/data/quizQuestions';

interface QuizQuestionProps {
  question: QuizQuestionType;
  answer: any;
  onAnswer: (answer: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

const QuizQuestion = ({
  question,
  answer,
  onAnswer,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
  isLastQuestion
}: QuizQuestionProps) => {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentAnswers = Array.isArray(answer) ? answer : [];
    if (checked) {
      onAnswer([...currentAnswers, option]);
    } else {
      onAnswer(currentAnswers.filter((a: string) => a !== option));
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case 'radio':
        return (
          <RadioGroup value={answer || ''} onValueChange={onAnswer}>
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={Array.isArray(answer) && answer.includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                />
                <Label htmlFor={option} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'number':
        return (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              min={question.min}
              max={question.max}
              value={answer || ''}
              onChange={(e) => onAnswer(Number(e.target.value))}
              className="w-24"
            />
            {question.unit && <span className="text-gray-600">{question.unit}</span>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
            {question.category}
          </span>
        </div>
        <CardTitle className="text-xl font-bold text-gray-900 mt-4">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {renderInput()}
        </div>
        
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!canGoPrevious}
          >
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!canGoNext}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLastQuestion ? 'Get My Results' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
