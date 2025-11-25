import React, { useState } from 'react';
import { Calculator as CalcIcon, Sparkles } from 'lucide-react';
import { explainCalculation } from '@/shared/services';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const CalculatorTool: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = async () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      const calculation = `${previousValue} ${operation} ${inputValue}`;
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      
      // Get AI explanation
      setLoading(true);
      try {
        const exp = await explainCalculation(calculation, String(newValue));
        setExplanation(exp);
      } catch (error) {
        setExplanation('');
      } finally {
        setLoading(false);
      }
    }
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const getButtonStyle = (btn: string) => {
    if (btn === 'C' || btn === '±' || btn === '%') {
      return 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600';
    }
    if (['+', '-', '×', '÷', '='].includes(btn)) {
      return 'bg-orange-500 text-white hover:bg-orange-600';
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700';
  };

  const handleButtonClick = (btn: string) => {
    switch (btn) {
      case 'C':
        clear();
        break;
      case '±':
        setDisplay(String(parseFloat(display) * -1));
        break;
      case '%':
        setDisplay(String(parseFloat(display) / 100));
        break;
      case '=':
        handleEquals();
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        performOperation(btn);
        break;
      case '.':
        inputDecimal();
        break;
      default:
        inputNumber(btn);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalcIcon className="text-green-500" size={24} />
          Calculadora
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display */}
        <div className="bg-black text-white p-4 rounded-lg text-right">
          <div className="text-3xl font-mono font-light overflow-hidden">
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {buttons.flat().map((btn, index) => (
            <Button
              key={index}
              onClick={() => handleButtonClick(btn)}
              className={`h-14 text-lg font-medium ${getButtonStyle(btn)} ${
                btn === '0' ? 'col-span-2' : ''
              }`}
              variant="ghost"
            >
              {btn}
            </Button>
          ))}
        </div>

        {/* Scientific Functions */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDisplay(String(Math.sin(parseFloat(display) * Math.PI / 180)))}
          >
            sin
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDisplay(String(Math.cos(parseFloat(display) * Math.PI / 180)))}
          >
            cos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDisplay(String(Math.tan(parseFloat(display) * Math.PI / 180)))}
          >
            tan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDisplay(String(Math.sqrt(parseFloat(display))))}
          >
            √
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDisplay(String(Math.pow(parseFloat(display), 2)))}
          >
            x²
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDisplay(String(Math.log10(parseFloat(display))))}
          >
            log
          </Button>
        </div>

        {/* AI Explanation */}
        {(explanation || loading) && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-t">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-blue-500" size={16} />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Explicação IA</span>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300" dangerouslySetInnerHTML={{ __html: loading ? 'Analisando cálculo...' : explanation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculatorTool;