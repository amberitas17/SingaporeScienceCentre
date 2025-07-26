/**
 * Face Analysis Service
 * Handles communication with the Python backend API for age/gender and emotion detection
 */

export interface FaceAnalysisResult {
  success: boolean;
  age?: number;
  ageGroup: string;
  gender?: string;
  genderConfidence?: number;
  emotion: string;
  emotionConfidence?: number;
  allEmotions?: Record<string, number>;
  confidence: number;
  timestamp: string;
  message?: string;
}

export interface DetailedFaceAnalysisResult {
  success: boolean;
  message: string;
  timestamp: string;
  results: Array<{
    face_id: number;
    coordinates: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    age: {
      predicted_age: number;
      age_group: string;
    };
    gender: {
      predicted_gender: string;
      confidence: number;
    };
    emotion: {
      predicted_emotion: string;
      confidence: number;
      all_emotions: Record<string, number>;
    };
  }>;
}

export interface ModelStatus {
  age_gender_model: {
    loaded: boolean;
    input_shape: string | null;
  };
  emotion_model: {
    loaded: boolean;
    input_shape: string | null;
  };
  supported_formats: string[];
  age_groups: string[];
  emotions: string[];
}

class FaceAnalysisService {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
  }

  /**
   * Convert image URI to base64 string
   */
  private async imageUriToBase64(imageUri: string): Promise<string> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Remove the data URL prefix to get just the base64 string
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw new Error('Failed to convert image to base64');
    }
  }

  /**
   * Check if the backend API is available and models are loaded
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.models_loaded?.age_gender && data.models_loaded?.emotion;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Get the status of loaded models
   */
  async getModelStatus(): Promise<ModelStatus | null> {
    try {
      const response = await fetch(`${this.baseUrl}/models/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get model status:', error);
      return null;
    }
  }

  /**
   * Analyze face in image (simplified response)
   * @param imageUri - URI of the image to analyze
   * @returns Simple analysis result with age group and emotion
   */
  async analyzeFaceSimple(imageUri: string): Promise<FaceAnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.imageUriToBase64(imageUri);

      const response = await fetch(`${this.baseUrl}/analyze-face-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Ensure we return a consistent format
      return {
        success: result.success || false,
        age: result.age,
        ageGroup: result.ageGroup || 'Unknown',
        gender: result.gender,
        genderConfidence: result.genderConfidence,
        emotion: result.emotion || 'Unknown',
        emotionConfidence: result.emotionConfidence,
        allEmotions: result.allEmotions,
        confidence: result.confidence || 0,
        timestamp: result.timestamp || new Date().toISOString(),
        message: result.message
      };
    } catch (error) {
      console.error('Face analysis failed:', error);
      
      // Return fallback result
      return {
        success: false,
        ageGroup: 'Unknown',
        emotion: 'Unknown',
        confidence: 0,
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Analysis failed'
      };
    }
  }

  /**
   * Analyze face in image (detailed response)
   * @param imageUri - URI of the image to analyze
   * @returns Detailed analysis result with all detected faces and their properties
   */
  async analyzeFaceDetailed(imageUri: string): Promise<DetailedFaceAnalysisResult | null> {
    try {
      // Convert image to base64
      const base64Image = await this.imageUriToBase64(imageUri);

      const response = await fetch(`${this.baseUrl}/analyze-face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Detailed face analysis failed:', error);
      return null;
    }
  }

  /**
   * Analyze face from base64 image data (for when you already have base64)
   * @param base64Image - Base64 encoded image string
   * @returns Simple analysis result
   */
  async analyzeFaceFromBase64(base64Image: string): Promise<FaceAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/analyze-face-simple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: result.success || false,
        age: result.age,
        ageGroup: result.ageGroup || 'Unknown',
        gender: result.gender,
        genderConfidence: result.genderConfidence,
        emotion: result.emotion || 'Unknown',
        emotionConfidence: result.emotionConfidence,
        allEmotions: result.allEmotions,
        confidence: result.confidence || 0,
        timestamp: result.timestamp || new Date().toISOString(),
        message: result.message
      };
    } catch (error) {
      console.error('Face analysis from base64 failed:', error);
      
      return {
        success: false,
        ageGroup: 'Unknown',
        emotion: 'Unknown',
        confidence: 0,
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Analysis failed'
      };
    }
  }

  /**
   * Update the base URL for the API (useful for different environments)
   */
  updateBaseUrl(newBaseUrl: string) {
    this.baseUrl = newBaseUrl;
  }

  /**
   * Get the current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export a singleton instance
export const faceAnalysisService = new FaceAnalysisService();

// Export the class for custom instances
export default FaceAnalysisService; 