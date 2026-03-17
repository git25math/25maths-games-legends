import type { QuestionType } from '../../types';

export type InputField = { id: string; label: string; placeholder: string };

export const INPUT_FIELDS: Record<QuestionType, InputField[]> = {
  LINEAR: [
    { id: 'm', label: '斜率 m (Slope)', placeholder: 'm = ?' },
    { id: 'b', label: '截距 b (Intercept)', placeholder: 'b = ?' }
  ],
  AREA: [{ id: 'area', label: '面积 (Area)', placeholder: 'Area = ?' }],
  QUADRATIC: [
    { id: 'a', label: '系数 a', placeholder: 'a = ?' },
    { id: 'c', label: '系数 c', placeholder: 'c = ?' }
  ],
  ESTIMATION: [{ id: 'ans', label: '估算结果', placeholder: 'Result = ?' }],
  PERCENTAGE: [{ id: 'ans', label: '最终金额', placeholder: 'Total = ?' }],
  INDICES: [{ id: 'x', label: '指数 x', placeholder: 'x = ?' }],
  PYTHAGORAS: [{ id: 'c', label: '斜边 c', placeholder: 'c = ?' }],
  SIMULTANEOUS: [
    { id: 'x', label: '坐标 x', placeholder: 'x = ?' },
    { id: 'y', label: '坐标 y', placeholder: 'y = ?' }
  ],
  SIMPLE_EQ: [{ id: 'x', label: '未知数 x', placeholder: 'x = ?' }],
  ANGLES: [{ id: 'x', label: '角度 x', placeholder: 'x = ?' }],
  VOLUME: [{ id: 'v', label: '体积 V', placeholder: 'V = ?' }],
  TRIGONOMETRY: [
    { id: 'tan', label: 'tan(θ)', placeholder: 'tan = ?' },
    { id: 'angle', label: '角度 θ', placeholder: 'θ = ?' },
    { id: 'c', label: '距离 c', placeholder: 'c = ?' }
  ],
  PROBABILITY: [{ id: 'p', label: '概率 P', placeholder: 'P = ?' }],
  INTEGRATION: [{ id: 'area', label: '面积 Area', placeholder: 'Area = ?' }],
  ROOTS: [{ id: 'x', label: '根 x', placeholder: 'x = ?' }],
  ARITHMETIC: [{ id: 'ans', label: '第 n 项', placeholder: 'a_n = ?' }],
  CIRCLE: [
    { id: 'c', label: '周长 C', placeholder: 'C = ?' },
    { id: 'area', label: '面积 A', placeholder: 'A = ?' }
  ],
  FUNC_VAL: [
    { id: 'y', label: '结果 y', placeholder: 'y = ?' },
    { id: 't', label: '时间 t', placeholder: 't = ?' }
  ],
  DERIVATIVE: [
    { id: 'k', label: '斜率 k', placeholder: 'k = ?' },
    { id: 'x', label: '极值点 x', placeholder: 'x = ?' }
  ],
  STATISTICS: [{ id: 'ans', label: '计算结果', placeholder: 'Result = ?' }],
  RATIO: [
    { id: 'x', label: '前项 x', placeholder: 'x = ?' },
    { id: 'y', label: '后项 y', placeholder: 'y = ?' }
  ],
  SIMILARITY: [{ id: 'x', label: '未知边 x', placeholder: 'x = ?' }],
  FRACTION: [{ id: 'ans', label: '结果', placeholder: 'Result = ?' }],
  VENN: [{ id: 'ans', label: '结果', placeholder: 'Result = ?' }],
};
