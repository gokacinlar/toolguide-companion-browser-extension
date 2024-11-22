// Export it first to avoid module error
export * from './types';

// Define conversionFactor interface for conversionFactors arg
export interface ConversionFactor {
    [unit1: string]: { [unit2: string]: number };
}

// Define Option interface for generating option values of inputs
export interface Option {
    key: string;
    value: string;
}

// Define an interface for the structure of nested objects within imgSources
export interface ImageSource {
    [key: string]: string;
}

export interface JSONValue {
    version: string;
}
