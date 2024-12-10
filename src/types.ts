// Export it first to avoid module error
export * from './types';

// Aside buttons
export interface AsideButtons {
    [key: string]: { [value: string]: string; };
}

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

// Currency converter object
export interface Currency {
    [key: string]: string
}

// For NetworkInformation non-standard API
export interface NavigatorExtended extends Navigator {
    online: boolean,

    connection?: {
        effectiveType: string;
        downlink: number;
        rtt: number;
        saveData: boolean;
        type: string;
    };
}