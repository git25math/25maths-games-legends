import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator as CalcIcon, X, ArrowRight } from 'lucide-react';

type Props = {
  onUseResult?: (value: string) => void;
  lang: 'zh' | 'en';
};

const BUTTONS = [
  ['C', 'DEL', '√', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', 'π', '='],
];

export const CalculatorWidget = memo(function CalculatorWidget({ onUseResult, lang }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState('0');
  const [prevResult, setPrevResult] = useState<string | null>(null);

  const handleButton = (btn: string) => {
    switch (btn) {
      case 'C':
        setDisplay('0');
        setPrevResult(null);
        break;
      case 'DEL':
        setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
        break;
      case '=': {
        try {
          // Replace display symbols with JS math
          let expr = display
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, String(Math.PI))
            .replace(/√(\d+\.?\d*)/g, 'Math.sqrt($1)')
            .replace(/√/g, 'Math.sqrt(');

          // Close unclosed sqrt parentheses
          const openParens = (expr.match(/\(/g) || []).length;
          const closeParens = (expr.match(/\)/g) || []).length;
          for (let i = 0; i < openParens - closeParens; i++) expr += ')';

          // Safe eval using Function constructor (no access to global scope)
          const result = new Function('Math', `return ${expr}`)(Math);
          const formatted = Number.isFinite(result)
            ? parseFloat(result.toFixed(8)).toString()
            : 'Error';
          setDisplay(formatted);
          setPrevResult(formatted);
        } catch {
          setDisplay('Error');
          setPrevResult(null);
        }
        break;
      }
      case '√':
        setDisplay(prev => prev === '0' ? '√' : prev + '√');
        break;
      case 'π':
        setDisplay(prev => prev === '0' ? 'π' : prev + 'π');
        break;
      default:
        setDisplay(prev => prev === '0' || prev === 'Error' ? btn : prev + btn);
    }
  };

  const handleUseResult = () => {
    if (prevResult && onUseResult) {
      onUseResult(prevResult);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-16 right-4 z-40 w-12 h-12 bg-[#3d2b1f] text-[#f4e4bc] rounded-full shadow-lg hover:bg-[#5c4033] transition-all flex items-center justify-center border-2 border-[#f4e4bc]/20"
      >
        <CalcIcon size={20} />
      </button>

      {/* Calculator popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-30 right-4 z-50 w-64 bg-[#1a1a2e] rounded-2xl shadow-2xl border-2 border-[#b8860b]/30 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#b8860b]/20">
              <span className="text-[#b8860b] text-xs font-bold">
                {lang === 'zh' ? '计算器' : 'Calculator'}
              </span>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white">
                <X size={14} />
              </button>
            </div>

            {/* Display */}
            <div className="px-3 py-3 bg-[#0f0f1e]">
              <div className="text-right text-white text-2xl font-mono font-bold truncate min-h-8">
                {display}
              </div>
            </div>

            {/* Buttons */}
            <div className="p-2 grid grid-cols-4 gap-1.5">
              {BUTTONS.flat().map((btn) => {
                const isOp = ['÷', '×', '-', '+', '='].includes(btn);
                const isFunc = ['C', 'DEL', '√', 'π'].includes(btn);
                return (
                  <button
                    key={btn}
                    onClick={() => handleButton(btn)}
                    className={`py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95 ${
                      btn === '='
                        ? 'bg-[#b8860b] text-[#1a1a2e]'
                        : isOp
                        ? 'bg-indigo-600/30 text-indigo-300'
                        : isFunc
                        ? 'bg-white/10 text-amber-300'
                        : 'bg-white/5 text-white'
                    }`}
                  >
                    {btn}
                  </button>
                );
              })}
            </div>

            {/* Use result button */}
            {prevResult && onUseResult && (
              <div className="px-2 pb-2">
                <button
                  onClick={handleUseResult}
                  className="w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-emerald-500 transition-all"
                >
                  <ArrowRight size={12} />
                  {lang === 'zh' ? `使用结果 ${prevResult}` : `Use result ${prevResult}`}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
