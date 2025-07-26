/**
 * Model Test Utilities
 * Helper functions to test and verify TensorFlow.js models
 */

import * as tf from '@tensorflow/tfjs';
import { localFaceAnalysisService } from './localFaceAnalysisService';

/**
 * Test if TensorFlow.js is working correctly
 */
export const testTensorFlowJS = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    console.log('🧪 Testing TensorFlow.js basic functionality...');
    
    // Test basic tensor operations
    const a = tf.tensor2d([[1, 2], [3, 4]]);
    const b = tf.tensor2d([[5, 6], [7, 8]]);
    const result = tf.matMul(a, b);
    
    const resultArray = await result.data();
    console.log('Basic tensor operation result:', resultArray);
    
    // Clean up
    a.dispose();
    b.dispose();
    result.dispose();
    
    console.log('✅ TensorFlow.js basic test passed');
    return {
      success: true,
      message: 'TensorFlow.js is working correctly',
      details: { tensorResult: Array.from(resultArray) }
    };
  } catch (error) {
    console.error('❌ TensorFlow.js basic test failed:', error);
    return {
      success: false,
      message: `TensorFlow.js test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Test if the local face analysis models are loaded correctly
 */
export const testModelLoading = async (): Promise<{
  success: boolean;
  message: string;
  modelHealth?: boolean;
}> => {
  try {
    console.log('🧪 Testing model loading...');
    
    const isHealthy = await localFaceAnalysisService.checkHealth();
    
    if (isHealthy) {
      console.log('✅ Models loaded successfully');
      return {
        success: true,
        message: 'All models loaded and ready',
        modelHealth: true
      };
    } else {
      console.warn('⚠️ Models not ready');
      return {
        success: false,
        message: 'Models failed to load',
        modelHealth: false
      };
    }
  } catch (error) {
    console.error('❌ Model loading test failed:', error);
    return {
      success: false,
      message: `Model loading failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      modelHealth: false
    };
  }
};

/**
 * Test face analysis with a sample base64 image (1x1 black pixel)
 */
export const testFaceAnalysis = async (): Promise<{
  success: boolean;
  message: string;
  result?: any;
}> => {
  try {
    console.log('🧪 Testing face analysis with sample data...');
    
    // Create a minimal test image (1x1 black pixel in base64)
    // This is just to test the pipeline, not expecting accurate results
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const result = await localFaceAnalysisService.analyzeFaceFromBase64(testImageBase64);
    
    console.log('Face analysis test result:', result);
    
    return {
      success: result.success,
      message: result.success ? 'Face analysis pipeline working' : 'Face analysis failed',
      result: {
        ageGroup: result.ageGroup,
        emotion: result.emotion,
        confidence: result.confidence,
        message: result.message
      }
    };
  } catch (error) {
    console.error('❌ Face analysis test failed:', error);
    return {
      success: false,
      message: `Face analysis test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Run all tests
 */
export const runAllTests = async (): Promise<{
  overall: boolean;
  tests: {
    tensorFlow: any;
    modelLoading: any;
    faceAnalysis: any;
  };
  memoryInfo?: string;
}> => {
  console.log('🧪 Running comprehensive TensorFlow.js tests...');
  
  const tensorFlowTest = await testTensorFlowJS();
  const modelLoadingTest = await testModelLoading();
  const faceAnalysisTest = await testFaceAnalysis();
  
  const allPassed = tensorFlowTest.success && modelLoadingTest.success && faceAnalysisTest.success;
  
  const memoryInfo = localFaceAnalysisService.getMemoryInfo();
  console.log('Memory usage:', memoryInfo);
  
  const result = {
    overall: allPassed,
    tests: {
      tensorFlow: tensorFlowTest,
      modelLoading: modelLoadingTest,
      faceAnalysis: faceAnalysisTest
    },
    memoryInfo
  };
  
  if (allPassed) {
    console.log('🎉 All tests passed! Local TensorFlow.js implementation is working correctly.');
  } else {
    console.warn('⚠️ Some tests failed. Check the individual test results.');
  }
  
  return result;
};

/**
 * Get system information for debugging
 */
export const getSystemInfo = (): {
  platform: string;
  tensorFlowVersion: string;
  memoryInfo: string;
} => {
  return {
    platform: typeof navigator !== 'undefined' ? navigator.platform : 'Unknown',
    tensorFlowVersion: tf.version.tfjs,
    memoryInfo: localFaceAnalysisService.getMemoryInfo()
  };
}; 