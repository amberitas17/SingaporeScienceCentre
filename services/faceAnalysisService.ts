/**
 * Face Analysis Service
 * Handles communication with the Python Flask backend API for age/gender and emotion detection
 */

import { getApiUrl } from './config';

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
  
  // For mobile development, use your computer's IP address instead of localhost
  // Configuration is now handled in services/config.ts
  constructor(baseUrl: string = getApiUrl()) {
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
      console.log(`🔗 Attempting to connect to Flask backend at: ${this.baseUrl}/health`);
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        console.error(`❌ Flask backend health check failed with status: ${response.status}`);
        return false;
      }

      const result = await response.json();
      const isHealthy = result.status === 'healthy' && 
             result.models_loaded?.age_gender && 
             result.models_loaded?.emotion;
             
      console.log(`✅ Flask backend health check result:`, result);
      return isHealthy;
    } catch (error) {
      console.error('❌ Flask backend health check failed:', error);
      console.error(`🔧 Make sure Flask is running at: ${this.baseUrl}`);
      console.error('🔧 Make sure your IP address is correct in services/config.ts');
      console.error('🔧 Make sure your mobile device and computer are on the same network');
      return false;
    }
  }

  /**
   * Get model status from backend
   */
  async getModelStatus(): Promise<ModelStatus | null> {
    try {
      const healthResponse = await fetch(`${this.baseUrl}/health`);
      
      if (!healthResponse.ok) {
        throw new Error(`HTTP error! status: ${healthResponse.status}`);
      }

      const healthResult = await healthResponse.json();
      
      // Transform health check result to ModelStatus format
      // Based on actual training architecture
      return {
        age_gender_model: {
          loaded: healthResult.models_loaded?.age_gender || false,
          input_shape: healthResult.models_loaded?.age_gender ? '128x128x1' : null  // Training: Input((input_size)) → 128x128x1
        },
        emotion_model: {
          loaded: healthResult.models_loaded?.emotion || false,
          input_shape: healthResult.models_loaded?.emotion ? '48x48x1' : null      // Training: Input(shape=(48, 48, 1))
        },
        supported_formats: ['jpg', 'jpeg', 'png'],
        age_groups: ['Child', 'Adult'],  // ≤17 = Child, ≥18 = Adult
        emotions: ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']  // 7 classes with softmax
      };
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

      const response = await fetch(`${this.baseUrl}/predict/combined`, {
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
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      // Transform Flask response to expected format
      const predictions = result.predictions;
      
      return {
        success: true,
        age: predictions.age.value,        // Actual predicted age number
        ageGroup: predictions.age.group,   // "Child" or "Adult"
        gender: predictions.gender.label,
        genderConfidence: predictions.gender.confidence,
        emotion: predictions.emotion.label,
        emotionConfidence: predictions.emotion.confidence,
        allEmotions: predictions.all_emotions,
        confidence: Math.max(predictions.age.confidence, predictions.gender.confidence, predictions.emotion.confidence),
        timestamp: new Date().toISOString()
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

      const response = await fetch(`${this.baseUrl}/predict/combined`, {
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
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      // Transform Flask response to detailed format
      const predictions = result.predictions;
      
      return {
        success: true,
        message: 'Analysis completed successfully',
        timestamp: new Date().toISOString(),
        results: [{
          face_id: 1,
          coordinates: {
            x: 0,
            y: 0,
            width: 128,
            height: 128
          },
          age: {
            predicted_age: predictions.age.value,
            age_group: predictions.age.group
          },
          gender: {
            predicted_gender: predictions.gender.label,
            confidence: predictions.gender.confidence
          },
          emotion: {
            predicted_emotion: predictions.emotion.label,
            confidence: predictions.emotion.confidence,
            all_emotions: predictions.all_emotions
          }
        }]
      };
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
      // Validate input
      if (!base64Image || base64Image.trim().length === 0) {
        throw new Error('Base64 image string is empty or null');
      }
      
      // Clean the base64 string before sending
      let cleanBase64 = base64Image.trim();
      
      // Remove data URL prefix if present
      if (cleanBase64.includes(',')) {
        cleanBase64 = cleanBase64.split(',')[1];
      }
      
      // Remove any whitespace
      cleanBase64 = cleanBase64.replace(/\s/g, '');
      
      // Validate base64 format
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(cleanBase64)) {
        throw new Error('Invalid base64 format');
      }
      
      console.log(`🧠 Sending image to Flask backend at: ${this.baseUrl}/predict/combined`);
      console.log(`📏 Base64 string length: ${cleanBase64.length}`);
      
      const response = await fetch(`${this.baseUrl}/predict/combined`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: cleanBase64
        })
      });

      if (!response.ok) {
        console.error(`❌ Flask backend returned status: ${response.status}`);
        const errorText = await response.text();
        console.error(`❌ Error response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const result = await response.json();
      console.log('📋 Flask backend response:', result);
      
      if (!result.success) {
        // Handle specific error cases (like no face detected)
        if (result.message || result.error) {
          console.warn('⚠️ Face analysis failed:', result.message || result.error);
          return {
            success: false,
            ageGroup: 'Unknown',
            emotion: 'Unknown',
            confidence: 0,
            timestamp: new Date().toISOString(),
            message: result.message || result.error || 'Analysis failed'
          };
        }
        throw new Error(result.error || 'Analysis failed');
      }

      // Transform Flask response to expected format
      const predictions = result.predictions;
      
      const analysisResult = {
        success: true,
        age: predictions.age.value,        // Actual predicted age number
        ageGroup: predictions.age.group,   // "Child" or "Adult"
        gender: predictions.gender.label,
        genderConfidence: predictions.gender.confidence,
        emotion: predictions.emotion.label,
        emotionConfidence: predictions.emotion.confidence,
        allEmotions: predictions.all_emotions,
        confidence: Math.max(predictions.age.confidence, predictions.gender.confidence, predictions.emotion.confidence),
        timestamp: new Date().toISOString()
      };
      
      console.log('✅ Analysis completed successfully:', analysisResult);
      return analysisResult;
    } catch (error) {
      console.error('❌ Face analysis from base64 failed:', error);
      console.error(`🔧 Flask backend URL: ${this.baseUrl}`);
      console.error('🔧 Check if Flask backend is running with: python app.py');
      console.error('🔧 Check if your IP address is correct in services/config.ts');
      
      return {
        success: false,
        ageGroup: 'Unknown',
        emotion: 'Unknown',
        confidence: 0,
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Network connection failed'
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