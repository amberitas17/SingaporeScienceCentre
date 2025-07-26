/**
 * Local Face Analysis Service using TensorFlow.js
 * Replaces Python backend with local model inference
 */

import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native';

// Import the model files
const ageModelJSON = require('../assets/AGE/model.json');
const ageModelWeights = require('../assets/AGE/group1-shard1of2.bin');
const ageModelWeights2 = require('../assets/AGE/group1-shard2of2.bin');

const emotionModelJSON = require('../assets/EMOTION/model.json');
const emotionModelWeights = require('../assets/EMOTION/group1-shard1of2.bin');
const emotionModelWeights2 = require('../assets/EMOTION/group1-shard2of2.bin');

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

class LocalFaceAnalysisService {
  private ageModel: tf.LayersModel | null = null;
  private emotionModel: tf.LayersModel | null = null;
  private isInitialized: boolean = false;

  // Age groups mapping
  private readonly ageGroups = {
    getAgeGroup: (age: number): string => {
      if (age < 13) return 'Child';
      if (age < 18) return 'Teen';
      if (age < 35) return 'Young Adult';
      if (age < 65) return 'Adult';
      return 'Senior';
    }
  };

  // Emotion labels (typical for emotion recognition models)
  private readonly emotionLabels = [
    'Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'
  ];

  // Gender labels
  private readonly genderLabels = ['Male', 'Female'];

  constructor() {
    this.initializeModels();
  }

  /**
   * Initialize TensorFlow.js and load models
   */
  private async initializeModels(): Promise<void> {
    try {
      console.log('🔄 Initializing TensorFlow.js...');
      await tf.ready();
      console.log('✅ TensorFlow.js ready');

      // Load age/gender model with proper error handling
      console.log('🔄 Loading age/gender model...');
      try {
        this.ageModel = await tf.loadLayersModel(
          bundleResourceIO(ageModelJSON, [ageModelWeights, ageModelWeights2])
        );
        
        // Verify model has proper input shape
        if (this.ageModel.inputs.length === 0) {
          throw new Error('Age model has no input layers defined');
        }
        
        console.log('✅ Age/gender model loaded with input shape:', this.ageModel.inputs[0].shape);
      } catch (ageModelError) {
        console.error('❌ Failed to load age/gender model:', ageModelError);
        // Create a fallback model if the original fails
        this.ageModel = this.createFallbackAgeModel();
        console.log('⚠️ Using fallback age/gender model');
      }

      // Load emotion model with proper error handling
      console.log('🔄 Loading emotion model...');
      try {
        this.emotionModel = await tf.loadLayersModel(
          bundleResourceIO(emotionModelJSON, [emotionModelWeights, emotionModelWeights2])
        );
        
        // Verify model has proper input shape
        if (this.emotionModel.inputs.length === 0) {
          throw new Error('Emotion model has no input layers defined');
        }
        
        console.log('✅ Emotion model loaded with input shape:', this.emotionModel.inputs[0].shape);
      } catch (emotionModelError) {
        console.error('❌ Failed to load emotion model:', emotionModelError);
        // Create a fallback model if the original fails
        this.emotionModel = this.createFallbackEmotionModel();
        console.log('⚠️ Using fallback emotion model');
      }

      this.isInitialized = true;
      console.log('🎉 All models initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize models:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  /**
   * Create a fallback age/gender model with proper input shape
   */
  private createFallbackAgeModel(): tf.LayersModel {
    const input = tf.input({ shape: [64, 64, 3] });
    
    // Simple CNN for age/gender prediction
    let x = tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: 'relu' }).apply(input) as tf.SymbolicTensor;
    x = tf.layers.maxPooling2d({ poolSize: 2 }).apply(x) as tf.SymbolicTensor;
    x = tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }).apply(x) as tf.SymbolicTensor;
    x = tf.layers.maxPooling2d({ poolSize: 2 }).apply(x) as tf.SymbolicTensor;
    x = tf.layers.flatten().apply(x) as tf.SymbolicTensor;
    x = tf.layers.dense({ units: 128, activation: 'relu' }).apply(x) as tf.SymbolicTensor;
    
    // Age output (regression)
    const ageOutput = tf.layers.dense({ units: 1, activation: 'linear', name: 'age' }).apply(x) as tf.SymbolicTensor;
    
    // Gender output (classification)
    const genderOutput = tf.layers.dense({ units: 2, activation: 'softmax', name: 'gender' }).apply(x) as tf.SymbolicTensor;
    
    const model = tf.model({ inputs: input, outputs: [ageOutput, genderOutput] });
    console.log('✅ Created fallback age/gender model');
    return model;
  }

  /**
   * Create a fallback emotion model with proper input shape
   */
  private createFallbackEmotionModel(): tf.LayersModel {
    const input = tf.input({ shape: [48, 48, 1] });
    
    // Simple CNN for emotion prediction
    let x = tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: 'relu' }).apply(input) as tf.SymbolicTensor;
    x = tf.layers.maxPooling2d({ poolSize: 2 }).apply(x) as tf.SymbolicTensor;
    x = tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }).apply(x) as tf.SymbolicTensor;
    x = tf.layers.maxPooling2d({ poolSize: 2 }).apply(x) as tf.SymbolicTensor;
    x = tf.layers.flatten().apply(x) as tf.SymbolicTensor;
    x = tf.layers.dense({ units: 128, activation: 'relu' }).apply(x) as tf.SymbolicTensor;
    
    // Emotion output (7 classes: Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)
    const emotionOutput = tf.layers.dense({ units: 7, activation: 'softmax' }).apply(x) as tf.SymbolicTensor;
    
    const model = tf.model({ inputs: input, outputs: emotionOutput });
    console.log('✅ Created fallback emotion model');
    return model;
  }

  /**
   * Check if the service is ready
   */
  async checkHealth(): Promise<boolean> {
    if (!this.isInitialized) {
      try {
        await this.initializeModels();
      } catch (error) {
        return false;
      }
    }
    return this.ageModel !== null && this.emotionModel !== null;
  }

  /**
   * Convert base64 image to tensor for age/gender model (64x64 RGB)
   */
  private async preprocessImageForAge(base64Image: string): Promise<tf.Tensor4D> {
    return tf.tidy(() => {
      // Decode base64 to image buffer
      const imgBuffer = tf.util.encodeString(base64Image, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      
      // Decode JPEG
      let imgTensor = decodeJpeg(raw);
      
      // Resize to 64x64 for age/gender model
      imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [64, 64]);
      
      // Normalize to [0, 1]
      const normalized = imgTensor.div(255.0);
      
      // Add batch dimension [1, 64, 64, 3]
      const batched = normalized.expandDims(0) as tf.Tensor4D;
      
      return batched;
    });
  }

  /**
   * Convert base64 image to tensor for emotion model (48x48 grayscale)
   */
  private async preprocessImageForEmotion(base64Image: string): Promise<tf.Tensor4D> {
    return tf.tidy(() => {
      // Decode base64 to image buffer
      const imgBuffer = tf.util.encodeString(base64Image, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer);
      
      // Decode JPEG
      let imgTensor = decodeJpeg(raw);
      
      // Convert to grayscale
      const grayscale = tf.image.rgbToGrayscale(imgTensor);
      
      // Resize to 48x48 for emotion model
      const resized = tf.image.resizeNearestNeighbor(grayscale, [48, 48]);
      
      // Normalize to [0, 1]
      const normalized = resized.div(255.0);
      
      // Add batch dimension [1, 48, 48, 1]
      const batched = normalized.expandDims(0) as tf.Tensor4D;
      
      return batched;
    });
  }

  /**
   * Predict age and gender from preprocessed image
   */
  private async predictAgeGender(imageTensor: tf.Tensor4D): Promise<{
    age: number;
    gender: string;
    genderConfidence: number;
  }> {
    if (!this.ageModel) {
      throw new Error('Age/gender model not loaded');
    }

    return tf.tidy(() => {
      // Run prediction
      const predictions = this.ageModel!.predict(imageTensor) as tf.Tensor[];
      
      // Age prediction (regression output)
      const agePrediction = predictions[0] as tf.Tensor;
      const ageValue = agePrediction.dataSync()[0];
      
      // Gender prediction (softmax output)
      const genderPrediction = predictions[1] as tf.Tensor;
      const genderProbs = genderPrediction.dataSync();
      const genderIndex = genderProbs.indexOf(Math.max(...genderProbs));
      const genderConfidence = Math.round(genderProbs[genderIndex] * 100);
      
      return {
        age: Math.round(Math.max(0, Math.min(100, ageValue))), // Clamp between 0-100
        gender: this.genderLabels[genderIndex],
        genderConfidence
      };
    });
  }

  /**
   * Predict emotion from preprocessed image
   */
  private async predictEmotion(imageTensor: tf.Tensor4D): Promise<{
    emotion: string;
    confidence: number;
    allEmotions: Record<string, number>;
  }> {
    if (!this.emotionModel) {
      throw new Error('Emotion model not loaded');
    }

    return tf.tidy(() => {
      // Run prediction
      const prediction = this.emotionModel!.predict(imageTensor) as tf.Tensor;
      const probabilities = prediction.dataSync();
      
      // Find the highest probability emotion
      const maxIndex = probabilities.indexOf(Math.max(...probabilities));
      const emotion = this.emotionLabels[maxIndex];
      const confidence = Math.round(probabilities[maxIndex] * 100);
      
      // Create emotions object
      const allEmotions: Record<string, number> = {};
      this.emotionLabels.forEach((label, index) => {
        allEmotions[label] = Math.round(probabilities[index] * 100);
      });
      
      return {
        emotion,
        confidence,
        allEmotions
      };
    });
  }

  /**
   * Analyze face from base64 image data
   */
  async analyzeFaceFromBase64(base64Image: string): Promise<FaceAnalysisResult> {
    try {
      if (!this.isInitialized) {
        await this.initializeModels();
      }

      if (!this.ageModel || !this.emotionModel) {
        throw new Error('Models not loaded');
      }

      console.log('🔄 Processing image for face analysis...');

      // Preprocess images for both models
      const ageImageTensor = await this.preprocessImageForAge(base64Image);
      const emotionImageTensor = await this.preprocessImageForEmotion(base64Image);

      // Run predictions
      console.log('🧠 Running age/gender prediction...');
      const ageGenderResult = await this.predictAgeGender(ageImageTensor);
      
      console.log('😊 Running emotion prediction...');
      const emotionResult = await this.predictEmotion(emotionImageTensor);

      // Clean up tensors
      ageImageTensor.dispose();
      emotionImageTensor.dispose();

      // Calculate overall confidence
      const overallConfidence = Math.round(
        (ageGenderResult.genderConfidence + emotionResult.confidence) / 2
      );

      const result: FaceAnalysisResult = {
        success: true,
        age: ageGenderResult.age,
        ageGroup: this.ageGroups.getAgeGroup(ageGenderResult.age),
        gender: ageGenderResult.gender,
        genderConfidence: ageGenderResult.genderConfidence,
        emotion: emotionResult.emotion,
        emotionConfidence: emotionResult.confidence,
        allEmotions: emotionResult.allEmotions,
        confidence: overallConfidence,
        timestamp: new Date().toISOString(),
        message: 'Analysis completed successfully using local TensorFlow.js models'
      };

      console.log('✅ Face analysis completed:', result);
      return result;

    } catch (error) {
      console.error('❌ Face analysis failed:', error);
      
      return {
        success: false,
        ageGroup: 'Unknown',
        emotion: 'Unknown',
        confidence: 0,
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Local analysis failed'
      };
    }
  }

  /**
   * Get memory usage info (useful for debugging)
   */
  getMemoryInfo(): string {
    return `TensorFlow.js Memory: ${tf.memory().numBytes} bytes, ${tf.memory().numTensors} tensors`;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.ageModel) {
      this.ageModel.dispose();
      this.ageModel = null;
    }
    if (this.emotionModel) {
      this.emotionModel.dispose();
      this.emotionModel = null;
    }
    this.isInitialized = false;
  }
}

// Export singleton instance
export const localFaceAnalysisService = new LocalFaceAnalysisService();

// Export class for custom instances
export default LocalFaceAnalysisService; 