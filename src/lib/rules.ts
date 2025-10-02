// Business rules for health status and yield prediction

export type HealthStatus = 'Vert' | 'Orange' | 'Rouge';
export type Culture = 'cacao' | 'hevea' | 'palmier';

// Base yield per culture (kg/ha)
const BASE_YIELD: Record<Culture, number> = {
  cacao: 800,
  hevea: 1200,
  palmier: 2000
};

// Calculate age factor
export const calculateAgeFactor = (age: number): number => {
  if (age < 3) return 0.3;
  if (age <= 7) return 0.7;
  return 1.0;
};

// Calculate health factor
export const calculateHealthFactor = (status: HealthStatus): number => {
  const factors: Record<HealthStatus, number> = {
    'Vert': 1.0,
    'Orange': 0.8,
    'Rouge': 0.6
  };
  return factors[status];
};

// Calculate health status based on rules
export const calculateHealthStatus = (
  lastRainDays: number,
  harvestVariation3m: number
): HealthStatus => {
  // Green conditions
  if (lastRainDays <= 7 || harvestVariation3m >= -10) {
    return 'Vert';
  }
  
  // Orange conditions
  if ((lastRainDays >= 8 && lastRainDays <= 14) || 
      (harvestVariation3m < -10 && harvestVariation3m >= -25)) {
    return 'Orange';
  }
  
  // Red conditions
  return 'Rouge';
};

// Calculate harvest variation over 3 months
export const calculateHarvestVariation = (
  recentHarvests: number[],
  previousHarvests: number[]
): number => {
  if (recentHarvests.length === 0 || previousHarvests.length === 0) {
    return 0;
  }
  
  const recentAvg = recentHarvests.reduce((sum, val) => sum + val, 0) / recentHarvests.length;
  const previousAvg = previousHarvests.reduce((sum, val) => sum + val, 0) / previousHarvests.length;
  
  if (previousAvg === 0) return 0;
  
  return ((recentAvg - previousAvg) / previousAvg) * 100;
};

// Calculate history factor from past harvests
export const calculateHistoryFactor = (
  harvests: number[],
  surfaceHa: number,
  culture: Culture
): number => {
  if (harvests.length === 0 || surfaceHa === 0) return 1.0;
  
  const avgYieldPerHa = harvests.reduce((sum, val) => sum + val, 0) / (harvests.length * surfaceHa);
  const baseYield = BASE_YIELD[culture];
  
  const factor = avgYieldPerHa / baseYield;
  
  // Clamp between 0.5 and 1.2
  return Math.max(0.5, Math.min(1.2, factor));
};

// Main yield prediction function
export const predictYield = (
  culture: Culture,
  age: number,
  healthStatus: HealthStatus,
  recentHarvests: number[],
  surfaceHa: number
): number => {
  const baseYield = BASE_YIELD[culture];
  const ageFactor = calculateAgeFactor(age);
  const healthFactor = calculateHealthFactor(healthStatus);
  const historyFactor = calculateHistoryFactor(recentHarvests, surfaceHa, culture);
  
  return baseYield * ageFactor * healthFactor * historyFactor;
};