import type { Mission } from '../types';

export function checkCorrectness(mission: Mission, inputs: { [key: string]: string }): boolean {
  const { type, data, topic } = mission;

  if (type === 'SIMPLE_EQ') {
    return parseFloat(inputs.x || '') === data.x;
  }
  if (type === 'ESTIMATION') {
    const correctVal = Math.round(Math.sqrt(data.value));
    return parseInt(inputs.ans || '') === correctVal;
  }
  if (type === 'PERCENTAGE') {
    const { initial, rate, years } = data;
    const correctVal = initial * Math.pow(1 + rate, years);
    return Math.abs(parseFloat(inputs.ans || '') - correctVal) < 0.01;
  }
  if (type === 'QUADRATIC' && topic === 'Calculus') {
    return parseFloat(inputs.x || '') === data.p2[0];
  }
  if (type === 'LINEAR') {
    if (!data.points) return false;
    const [[x1, y1], [x2, y2]] = data.points;
    const correctM = (y2 - y1) / (x2 - x1);
    const correctB = y1 - correctM * x1;
    const m = parseFloat(inputs.m || '');
    const b = parseFloat(inputs.b || '');
    return Math.abs(m - correctM) < 0.01 && Math.abs(b - correctB) < 0.01;
  }
  if (type === 'FUNC_VAL') {
    const { m, b, x, a } = data;
    if (m !== undefined) {
      const correctY = m * x + b;
      return Math.abs(parseFloat(inputs.y || '') - correctY) < 0.01;
    } else {
      const correctT = -data.b / (2 * a);
      return Math.abs(parseFloat(inputs.t || '') - correctT) < 0.01;
    }
  }
  if (type === 'DERIVATIVE') {
    if (data.func === '3x^2-3') {
      const x = parseFloat(inputs.x || '');
      return Math.abs(x - data.x) < 0.01;
    }
    const correctK = 2 * data.x;
    return Math.abs(parseFloat(inputs.k || '') - correctK) < 0.01;
  }
  if (type === 'AREA') {
    const { length, width, r, pi, mode } = data;
    if (mode === 'sphere_area') {
      const correctArea = 4 * pi * r * r;
      return Math.abs(parseFloat(inputs.area || '') - correctArea) < 0.01;
    }
    if (data.a !== undefined && data.b !== undefined && data.h !== undefined) {
      const correctArea = (data.a + data.b) * data.h / 2;
      return Math.abs(parseFloat(inputs.area || '') - correctArea) < 0.01;
    }
    const correctArea = length * width;
    return Math.abs(parseFloat(inputs.area || '') - correctArea) < 0.01;
  }
  if (type === 'QUADRATIC') {
    if (!data.p1 || !data.p2) return false;
    const [x1, y1] = data.p1;
    const [x2, y2] = data.p2;
    const correctC = y1;
    const correctA = (y2 - y1) / (x2 * x2);
    const a = parseFloat(inputs.a || '');
    const c = parseFloat(inputs.c || '');
    return Math.abs(a - correctA) < 0.01 && Math.abs(c - correctC) < 0.01;
  }
  if (type === 'INDICES') {
    const { e1, e2, op } = data;
    const correctX = op === 'div' ? e1 - e2 : e1 + e2;
    return parseFloat(inputs.x || '') === correctX;
  }
  if (type === 'PYTHAGORAS') {
    const { a, b, c } = data;
    if (c !== undefined) {
      const correctB = Math.sqrt(c * c - a * a);
      return Math.abs(parseFloat(inputs.c || '') - correctB) < 0.01;
    }
    const correctC = Math.sqrt(a * a + b * b);
    return Math.abs(parseFloat(inputs.c || '') - correctC) < 0.01;
  }
  if (type === 'SIMULTANEOUS') {
    if (data.eq1) {
      const [a1, b1, c1] = data.eq1;
      const [a2, b2, c2] = data.eq2;
      const det = a1 * b2 - a2 * b1;
      const correctX = (c1 * b2 - c2 * b1) / det;
      const correctY = (a1 * c2 - a2 * c1) / det;
      const x = parseFloat(inputs.x || '');
      const y = parseFloat(inputs.y || '');
      return Math.abs(x - correctX) < 0.01 && Math.abs(y - correctY) < 0.01;
    }
    return parseFloat(inputs.x || '') === data.x && parseFloat(inputs.y || '') === data.y;
  }
  if (type === 'ANGLES') {
    const total = data.total || 180;
    return parseFloat(inputs.x || '') === (total - data.angle);
  }
  if (type === 'VOLUME') {
    const { radius, height, pi, mode } = data;
    let correctV = pi * radius * radius * height;
    if (mode === 'cone') {
      correctV = (1 / 3) * pi * radius * radius * height;
    }
    return Math.abs(parseFloat(inputs.v || '') - correctV) < 0.01;
  }
  if (type === 'TRIGONOMETRY') {
    if (data.func === 'sin') {
      const { opposite, angle } = data;
      const sinVal = angle === 30 ? 0.5 : Math.sin(angle * Math.PI / 180);
      const correctHyp = opposite / sinVal;
      return Math.abs(parseFloat(inputs.c || '') - correctHyp) < 0.01;
    }
    if (data.func === 'tan_inv') {
      const { opposite, adjacent } = data;
      const correctAngle = Math.atan2(opposite, adjacent) * 180 / Math.PI;
      return Math.abs(parseFloat(inputs.angle || '') - correctAngle) < 0.01;
    }
    const { opposite, adjacent } = data;
    const correctTan = opposite / adjacent;
    return Math.abs(parseFloat(inputs.tan || '') - correctTan) < 0.01;
  }
  if (type === 'PROBABILITY') {
    if (data.p1 !== undefined) {
      const correctP = data.p1 * data.p2;
      return Math.abs(parseFloat(inputs.p || '') - correctP) < 0.01;
    }
    const { total, target } = data;
    const correctP = target / total;
    return Math.abs(parseFloat(inputs.p || '') - correctP) < 0.01;
  }
  if (type === 'INTEGRATION') {
    const { lower, upper, func, a, b } = data;
    const l = lower !== undefined ? lower : a;
    const u = upper !== undefined ? upper : b;
    let correctArea = 0;
    if (func === 'x') {
      correctArea = 0.5 * (u * u - l * l);
    } else if (func === '3x^2') {
      correctArea = (u * u * u - l * l * l);
    } else {
      correctArea = u * u - l * l;
    }
    return Math.abs(parseFloat(inputs.area || '') - correctArea) < 0.01;
  }
  if (type === 'ARITHMETIC') {
    const { a1, d, n } = data;
    const correctAn = a1 + (n - 1) * d;
    return parseFloat(inputs.ans || '') === correctAn;
  }
  if (type === 'ROOTS') {
    const { a, b, c } = data;
    const discriminant = b * b - 4 * a * c;
    const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    const inputX = parseFloat(inputs.x || '');
    return Math.abs(inputX - x1) < 0.01 || Math.abs(inputX - x2) < 0.01;
  }
  if (type === 'CIRCLE') {
    const { r, pi, mode } = data;
    if (mode === 'area') {
      const correctA = pi * r * r;
      return Math.abs(parseFloat(inputs.area || '') - correctA) < 0.01;
    } else {
      const correctC = 2 * pi * r;
      return Math.abs(parseFloat(inputs.c || '') - correctC) < 0.01;
    }
  }
  if (type === 'STATISTICS') {
    const { values, mode } = data;
    if (mode === 'mean') {
      const correctMean = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      return Math.abs(parseFloat(inputs.ans || '') - correctMean) < 0.01;
    }
    if (mode === 'median') {
      const sorted = [...values].sort((a: number, b: number) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const correctMedian = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      return Math.abs(parseFloat(inputs.ans || '') - correctMedian) < 0.01;
    }
  }
  if (type === 'RATIO') {
    const { a, b } = data;
    const x = parseFloat(inputs.x || '');
    const y = parseFloat(inputs.y || '');
    return Math.abs(x / y - a / b) < 0.01;
  }
  if (type === 'SIMILARITY') {
    const { a, b, c } = data;
    const correctX = (a / b) * c;
    return Math.abs(parseFloat(inputs.x || '') - correctX) < 0.01;
  }
  return false;
}
