/**
 * Generator module entry point.
 * Assembles all generators from chapter-based modules into a single dispatch map.
 */
import type { Mission } from '../../types';
import { type DifficultyTier, type GeneratorFn } from './shared';

// Re-export types for external consumers
export { type DifficultyTier } from './shared';

// Import all generators from chapter modules
import { generateIntegerAddMission, generateIntegerMulMission, generateFracAddSameDenMission, generateFracAddMission, generateFracMulMission, generateMixedImproperMission, generatePrimeMission, generateFactorTreeMission, generateFactorsListMission, generateHcfMission, generateLcmMission, generateSquareCubeMission, generateSquareRootMission, generateIndicesMission, generateFdpConvertMission, generateBodmasMission, generatePercentageOfMission, generatePercentageMission, generatePercentageInterestMission, generateEstimationRoundMission, generateStdFormMission, generateSpeedMission, generateVennMission } from './number';

import { generateSimpleEqMission, generateAddEqMission, generateTwoStepEqMission, generateExpandMission, generateExpandNegMission, generateFactoriseMission, generateSimplifyMission, generateInequalityMission, generateSubstitutionMission, generateLinearMission, generateQuadraticMission, generateRootsMission, generateSimultaneousMission, generateSimultaneousY8Mission, generateFuncValMission, generateArithmeticMission, generateSequenceY7Mission, generateCoordinatesMission, generateSequenceFormulaMission, generateSequenceNthMission, generateCoord3DMission } from './algebra';

import { generateAnglesMission, generateAnglesTriangleMission, generateAnglesPointMission, generateParallelAnglesMission, generateAreaRectMission, generateAreaTrapMission, generateAreaTriangleMission, generatePerimeterRectMission, generatePythagorasMission, generateTrigonometryMission, generateSimilarityMission, generateCircleY8Mission, generateVolumeMission, generateVolumeY8Mission, generateSectorMission, generateCircleTheoremMission, generateSimilarTrianglesMission } from './geometry';

import { generateProbSimpleMission, generateProbIndMission, generateStatsMeanMission, generateStatsMedianMission, generateStatsRangeMission, generateStatsModeMission, generateCumFreqMission, generateProbTreeMission, generateTreeDiagramMission } from './statistics';

import { generateSymmetryMission, generateRotationMission, generateEnlargementMission, generateVectorAddMission, generateDerivativeMission, generateIntegrationMission, generateRatioMission, generateRatioY7Mission, generateRatioY8Mission } from './advanced';

/* ── Generator type registry ── */

export type GeneratorType =
  | 'SIMPLE_EQ_RANDOM' | 'SIMPLE_EQ_ADD_RANDOM' | 'INDICES_RANDOM' | 'ANGLES_RANDOM'
  | 'ARITHMETIC_RANDOM' | 'AREA_RECT_RANDOM' | 'AREA_TRAP_RANDOM'
  | 'PROBABILITY_SIMPLE_RANDOM' | 'PROBABILITY_IND_RANDOM'
  | 'PYTHAGORAS_RANDOM' | 'PERCENTAGE_RANDOM' | 'LINEAR_RANDOM'
  | 'SIMULTANEOUS_RANDOM' | 'RATIO_RANDOM' | 'SIMILARITY_RANDOM'
  | 'STATISTICS_MEAN_RANDOM' | 'TRIGONOMETRY_RANDOM' | 'QUADRATIC_RANDOM'
  | 'ROOTS_RANDOM' | 'DERIVATIVE_RANDOM' | 'INTEGRATION_RANDOM'
  | 'VOLUME_RANDOM' | 'FUNC_VAL_RANDOM' | 'STATISTICS_MEDIAN_RANDOM'
  | 'HCF_RANDOM' | 'LCM_RANDOM' | 'INTEGER_ADD_RANDOM'
  | 'FRAC_ADD_SAME_DEN_RANDOM' | 'FRAC_ADD_RANDOM' | 'FRAC_MUL_RANDOM' | 'FACTOR_TREE_RANDOM'
  | 'PRIME_RANDOM' | 'SQUARE_CUBE_RANDOM' | 'SQUARE_ROOT_RANDOM'
  | 'SUBSTITUTION_RANDOM' | 'PERIMETER_RECT_RANDOM' | 'PERCENTAGE_OF_RANDOM'
  | 'ESTIMATION_ROUND_RANDOM' | 'ANGLES_TRIANGLE_RANDOM' | 'ANGLES_POINT_RANDOM'
  | 'SEQUENCE_Y7_RANDOM' | 'STATISTICS_RANGE_RANDOM' | 'AREA_TRIANGLE_RANDOM'
  | 'FACTORS_LIST_RANDOM' | 'INTEGER_MUL_RANDOM' | 'FDP_CONVERT_RANDOM'
  | 'BODMAS_RANDOM' | 'SIMPLIFY_RANDOM' | 'STATISTICS_MODE_RANDOM'
  | 'SIMPLE_EQ_TWOSTEP_RANDOM' | 'COORDINATES_RANDOM' | 'RATIO_Y7_RANDOM'
  | 'MIXED_IMPROPER_RANDOM' | 'EXPAND_RANDOM' | 'EXPAND_NEG_RANDOM' | 'FACTORISE_RANDOM'
  | 'INEQUALITY_RANDOM' | 'STD_FORM_RANDOM' | 'SPEED_RANDOM'
  | 'CIRCLE_Y8_RANDOM' | 'VOLUME_Y8_RANDOM' | 'PERCENTAGE_INTEREST_RANDOM'
  | 'PARALLEL_ANGLES_RANDOM' | 'SYMMETRY_RANDOM' | 'SIMULTANEOUS_Y8_RANDOM'
  | 'RATIO_Y8_RANDOM' | 'VENN_RANDOM' | 'ROTATION_RANDOM'
  | 'ENLARGEMENT_RANDOM' | 'VECTOR_ADD_RANDOM' | 'CUMFREQ_RANDOM' | 'SECTOR_RANDOM'
  | 'CIRCLE_THEOREM_RANDOM'
  | 'PROB_TREE_RANDOM'
  | 'SEQUENCE_FORMULA_RANDOM'
  | 'SIMILAR_TRIANGLES_RANDOM'
  | 'TREE_DIAGRAM_RANDOM'
  | 'SEQUENCE_NTH_RANDOM'
  | 'COORD_3D_RANDOM';

/* ── Generator dispatch map ── */

const GENERATOR_MAP: Record<GeneratorType, GeneratorFn> = {
  // Number (CH1)
  INTEGER_ADD_RANDOM: generateIntegerAddMission,
  INTEGER_MUL_RANDOM: generateIntegerMulMission,
  FRAC_ADD_SAME_DEN_RANDOM: generateFracAddSameDenMission,
  FRAC_ADD_RANDOM: generateFracAddMission,
  FRAC_MUL_RANDOM: generateFracMulMission,
  MIXED_IMPROPER_RANDOM: generateMixedImproperMission,
  PRIME_RANDOM: generatePrimeMission,
  FACTOR_TREE_RANDOM: generateFactorTreeMission,
  FACTORS_LIST_RANDOM: generateFactorsListMission,
  HCF_RANDOM: generateHcfMission,
  LCM_RANDOM: generateLcmMission,
  SQUARE_CUBE_RANDOM: generateSquareCubeMission,
  SQUARE_ROOT_RANDOM: generateSquareRootMission,
  INDICES_RANDOM: generateIndicesMission,
  FDP_CONVERT_RANDOM: generateFdpConvertMission,
  BODMAS_RANDOM: generateBodmasMission,
  PERCENTAGE_OF_RANDOM: generatePercentageOfMission,
  PERCENTAGE_RANDOM: generatePercentageMission,
  PERCENTAGE_INTEREST_RANDOM: generatePercentageInterestMission,
  ESTIMATION_ROUND_RANDOM: generateEstimationRoundMission,
  STD_FORM_RANDOM: generateStdFormMission,
  SPEED_RANDOM: generateSpeedMission,
  VENN_RANDOM: generateVennMission,

  // Algebra (CH2)
  SIMPLE_EQ_RANDOM: generateSimpleEqMission,
  SIMPLE_EQ_ADD_RANDOM: generateAddEqMission,
  SIMPLE_EQ_TWOSTEP_RANDOM: generateTwoStepEqMission,
  EXPAND_RANDOM: generateExpandMission,
  EXPAND_NEG_RANDOM: generateExpandNegMission,
  FACTORISE_RANDOM: generateFactoriseMission,
  SIMPLIFY_RANDOM: generateSimplifyMission,
  INEQUALITY_RANDOM: generateInequalityMission,
  SUBSTITUTION_RANDOM: generateSubstitutionMission,
  LINEAR_RANDOM: generateLinearMission,
  QUADRATIC_RANDOM: generateQuadraticMission,
  ROOTS_RANDOM: generateRootsMission,
  SIMULTANEOUS_RANDOM: generateSimultaneousMission,
  SIMULTANEOUS_Y8_RANDOM: generateSimultaneousY8Mission,
  FUNC_VAL_RANDOM: generateFuncValMission,
  ARITHMETIC_RANDOM: generateArithmeticMission,
  SEQUENCE_Y7_RANDOM: generateSequenceY7Mission,
  SEQUENCE_FORMULA_RANDOM: generateSequenceFormulaMission,
  SEQUENCE_NTH_RANDOM: generateSequenceNthMission,
  COORD_3D_RANDOM: generateCoord3DMission,
  COORDINATES_RANDOM: generateCoordinatesMission,

  // Geometry (CH4+CH5+CH6)
  ANGLES_RANDOM: generateAnglesMission,
  ANGLES_TRIANGLE_RANDOM: generateAnglesTriangleMission,
  ANGLES_POINT_RANDOM: generateAnglesPointMission,
  PARALLEL_ANGLES_RANDOM: generateParallelAnglesMission,
  AREA_RECT_RANDOM: generateAreaRectMission,
  AREA_TRAP_RANDOM: generateAreaTrapMission,
  AREA_TRIANGLE_RANDOM: generateAreaTriangleMission,
  PERIMETER_RECT_RANDOM: generatePerimeterRectMission,
  PYTHAGORAS_RANDOM: generatePythagorasMission,
  TRIGONOMETRY_RANDOM: generateTrigonometryMission,
  SIMILARITY_RANDOM: generateSimilarityMission,
  SIMILAR_TRIANGLES_RANDOM: generateSimilarTrianglesMission,
  CIRCLE_Y8_RANDOM: generateCircleY8Mission,
  VOLUME_RANDOM: generateVolumeMission,
  VOLUME_Y8_RANDOM: generateVolumeY8Mission,
  SECTOR_RANDOM: generateSectorMission,
  CIRCLE_THEOREM_RANDOM: generateCircleTheoremMission,

  // Statistics (CH8+CH9)
  PROBABILITY_SIMPLE_RANDOM: generateProbSimpleMission,
  PROBABILITY_IND_RANDOM: generateProbIndMission,
  PROB_TREE_RANDOM: generateProbTreeMission,
  TREE_DIAGRAM_RANDOM: generateTreeDiagramMission,
  STATISTICS_MEAN_RANDOM: generateStatsMeanMission,
  STATISTICS_MEDIAN_RANDOM: generateStatsMedianMission,
  STATISTICS_RANGE_RANDOM: generateStatsRangeMission,
  STATISTICS_MODE_RANDOM: generateStatsModeMission,
  CUMFREQ_RANDOM: generateCumFreqMission,

  // Advanced (CH7 + calculus + ratio)
  SYMMETRY_RANDOM: generateSymmetryMission,
  ROTATION_RANDOM: generateRotationMission,
  ENLARGEMENT_RANDOM: generateEnlargementMission,
  VECTOR_ADD_RANDOM: generateVectorAddMission,
  DERIVATIVE_RANDOM: generateDerivativeMission,
  INTEGRATION_RANDOM: generateIntegrationMission,
  RATIO_RANDOM: generateRatioMission,
  RATIO_Y7_RANDOM: generateRatioY7Mission,
  RATIO_Y8_RANDOM: generateRatioY8Mission,
};

export const REGISTERED_GENERATOR_TYPES = Object.keys(GENERATOR_MAP) as GeneratorType[];

/** Dispatch to the right generator. Optional tier controls number difficulty. */
export function generateMission(template: Mission, tier: DifficultyTier = 2): Mission {
  const genType = template.data?.generatorType as GeneratorType | undefined;
  if (!genType || !GENERATOR_MAP[genType]) return template;
  return GENERATOR_MAP[genType](template, tier);
}
