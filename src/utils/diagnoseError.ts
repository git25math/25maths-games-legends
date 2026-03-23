import { parseAnswer } from './parseAnswer';

export type ErrorType = 'sign' | 'rounding' | 'magnitude' | 'method' | 'unknown';

export type ErrorDiagnosis = {
  type: ErrorType;
  message: { zh: string; en: string; zh_TW: string };
};

/**
 * Diagnose the type of error a student made by comparing their input to expected values.
 * Returns an encouraging, specific message that reframes the mistake.
 */
export function diagnoseError(
  userInputs: Record<string, string>,
  expected: Record<string, string>,
  isPartial?: boolean,
): ErrorDiagnosis {
  // Partial credit = method correct, calc wrong
  if (isPartial) {
    return {
      type: 'method',
      message: {
        zh: '你的解题方法完全正确！只是计算过程中出了一点小差错——再算一遍就好。',
        en: 'Your method is spot on! Just a small slip in the calculation — try once more.',
        zh_TW: '你的解題方法完全正確！只是計算過程中出了一點小差錯——再算一遍就好。',
      },
    };
  }

  // Analyze first field with valid numbers
  for (const field of Object.keys(expected)) {
    const userVal = parseAnswer(userInputs[field] || '');
    const expVal = parseAnswer(expected[field] || '');
    if (isNaN(userVal) || isNaN(expVal)) continue;

    // Sign error: got the right number but wrong sign
    if (Math.abs(userVal + expVal) < 0.01 && Math.abs(expVal) > 0.01) {
      return {
        type: 'sign',
        message: {
          zh: '数值算对了！只是正负号反了——检查一下符号方向。这种错很容易改，你离正确答案只差一个符号！',
          en: 'You got the right number! Just the wrong sign — double-check the positive/negative. You\'re one sign flip away!',
          zh_TW: '數值算對了！只是正負號反了——檢查一下符號方向。這種錯很容易改，你離正確答案只差一個符號！',
        },
      };
    }

    // Rounding error: very close
    const diff = Math.abs(userVal - expVal);
    if (diff > 0 && diff < 1 && expVal !== 0) {
      return {
        type: 'rounding',
        message: {
          zh: `差一点点！你的答案和正确答案只差 ${diff < 0.1 ? '不到 0.1' : '不到 1'}——可能是四舍五入或小数点的问题。思路是对的！`,
          en: `So close! Your answer is off by ${diff < 0.1 ? 'less than 0.1' : 'less than 1'} — might be a rounding issue. Your thinking is right!`,
          zh_TW: `差一點點！你的答案和正確答案只差 ${diff < 0.1 ? '不到 0.1' : '不到 1'}——可能是四捨五入或小數點的問題。思路是對的！`,
        },
      };
    }

    // Magnitude error: off by a factor of 2, 10, etc.
    if (expVal !== 0) {
      const ratio = userVal / expVal;
      if (Math.abs(ratio - 10) < 0.01 || Math.abs(ratio - 0.1) < 0.01) {
        return {
          type: 'magnitude',
          message: {
            zh: '方向对了，但量级差了 10 倍——检查一下小数点或单位换算？',
            en: 'Right direction, but off by a factor of 10 — check the decimal point or unit conversion?',
            zh_TW: '方向對了，但量級差了 10 倍——檢查一下小數點或單位換算？',
          },
        };
      }
      if (Math.abs(ratio - 2) < 0.01 || Math.abs(ratio - 0.5) < 0.01) {
        return {
          type: 'magnitude',
          message: {
            zh: '接近了！答案差了一倍——看看是不是漏乘/多乘了一个 2？',
            en: 'Close! Off by a factor of 2 — did you miss or double a multiplication?',
            zh_TW: '接近了！答案差了一倍——看看是不是漏乘/多乘了一個 2？',
          },
        };
      }
    }
  }

  // Generic encouragement
  return {
    type: 'unknown',
    message: {
      zh: '没关系，这道题确实需要多想一步。看看下面的解题过程，你一定能搞懂！',
      en: 'No worries — this one needs an extra step of thinking. Check the solution below, you\'ll get it!',
      zh_TW: '沒關係，這道題確實需要多想一步。看看下面的解題過程，你一定能搞懂！',
    },
  };
}
