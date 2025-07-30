import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface FaceVerificationResult {
  success: boolean;
  age?: number;
  ageGroup: string; // "Child" or "Adult"
  gender?: string;
  genderConfidence?: number;
  emotion: string;
  emotionConfidence: number;
  allEmotions?: { [key: string]: number };
  confidence: number;
  timestamp: string;
  message?: string;
}

interface FaceVerificationContextType {
  verificationResult: FaceVerificationResult | null;
  setVerificationResult: (result: FaceVerificationResult | null) => void;
  isVerified: boolean;
  getVisitorProfile: () => {
    adults: number;
    children: number;
    totalGuests: number;
    dominantEmotion: string;
    ageGroup: string;
    detectedCount: string;
  };
}

const FaceVerificationContext = createContext<FaceVerificationContextType | undefined>(undefined);

interface FaceVerificationProviderProps {
  children: ReactNode;
}

export const FaceVerificationProvider: React.FC<FaceVerificationProviderProps> = ({ children }) => {
  const [verificationResult, setVerificationResult] = useState<FaceVerificationResult | null>(null);

  const isVerified = verificationResult !== null && verificationResult.success;

  const getVisitorProfile = () => {
    if (!verificationResult || !verificationResult.success) {
      return {
        adults: 1,
        children: 0,
        totalGuests: 1,
        dominantEmotion: 'Neutral',
        ageGroup: 'Adult',
        detectedCount: 'Unknown'
      };
    }

    const isChild = verificationResult.ageGroup === 'Child';
    
    return {
      adults: isChild ? 0 : 1,
      children: isChild ? 1 : 0,
      totalGuests: 1,
      dominantEmotion: verificationResult.emotion,
      ageGroup: verificationResult.ageGroup,
      detectedCount: `1 ${verificationResult.ageGroup}`
    };
  };

  const value = {
    verificationResult,
    setVerificationResult,
    isVerified,
    getVisitorProfile
  };

  return (
    <FaceVerificationContext.Provider value={value}>
      {children}
    </FaceVerificationContext.Provider>
  );
};

export const useFaceVerification = () => {
  const context = useContext(FaceVerificationContext);
  if (context === undefined) {
    throw new Error('useFaceVerification must be used within a FaceVerificationProvider');
  }
  return context;
};

export default FaceVerificationContext; 