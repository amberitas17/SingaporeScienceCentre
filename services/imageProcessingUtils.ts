/**
 * Image Processing Utilities for TensorFlow.js in React Native
 */

import * as tf from '@tensorflow/tfjs';

/**
 * Convert base64 image string to tensor (React Native compatible)
 */
export function base64ToTensor(base64: string): Promise<tf.Tensor3D> {
  return new Promise((resolve, reject) => {
    try {
      // For React Native, we need to use a different approach
      // Create a data URI from base64
      const dataUri = `data:image/jpeg;base64,${base64}`;
      
      // Use tf.browser.fromPixels with a proper image element
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const tensor = tf.browser.fromPixels(img);
          resolve(tensor);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image from base64'));
      };

      img.src = dataUri;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Convert camera photo URI to tensor (for React Native)
 */
export function photoUriToTensor(uri: string): Promise<tf.Tensor3D> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        try {
          const tensor = tf.browser.fromPixels(img);
          resolve(tensor);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image from URI'));
      };

      img.src = uri;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Resize tensor to specified dimensions
 */
export function resizeTensor(
  tensor: tf.Tensor3D,
  width: number,
  height: number
): tf.Tensor3D {
  return tf.image.resizeBilinear(tensor, [height, width]);
}

/**
 * Convert RGB tensor to grayscale
 */
export function rgbToGrayscale(tensor: tf.Tensor3D): tf.Tensor3D {
  return tf.image.rgbToGrayscale(tensor);
}

/**
 * Normalize tensor values to [0, 1] range
 */
export function normalizeTensor(tensor: tf.Tensor): tf.Tensor {
  return tensor.div(255.0);
}

/**
 * Add batch dimension to tensor
 */
export function addBatchDimension(tensor: tf.Tensor): tf.Tensor {
  return tensor.expandDims(0);
}

/**
 * Preprocess image for age/gender model (64x64 RGB)
 */
export function preprocessForAge(imageTensor: tf.Tensor3D): tf.Tensor4D {
  return tf.tidy(() => {
    const resized = resizeTensor(imageTensor, 64, 64);
    const normalized = normalizeTensor(resized) as tf.Tensor3D;
    return addBatchDimension(normalized) as tf.Tensor4D;
  });
}

/**
 * Preprocess image for emotion model (48x48 grayscale)
 */
export function preprocessForEmotion(imageTensor: tf.Tensor3D): tf.Tensor4D {
  return tf.tidy(() => {
    const grayscale = rgbToGrayscale(imageTensor);
    const resized = resizeTensor(grayscale, 48, 48);
    const normalized = normalizeTensor(resized) as tf.Tensor3D;
    return addBatchDimension(normalized) as tf.Tensor4D;
  });
}

/**
 * Create a simple face detection using edge detection (fallback method)
 * This is a basic implementation - in production you might want to use
 * a proper face detection model like BlazeFace
 */
export function detectFaceRegion(imageTensor: tf.Tensor3D): tf.Tensor3D {
  return tf.tidy(() => {
    // For now, we'll assume the entire image contains a face
    // In a real implementation, you would use a face detection model
    return imageTensor.clone();
  });
}

/**
 * Dispose of tensor safely
 */
export function disposeTensor(tensor: tf.Tensor | tf.Tensor[]): void {
  if (Array.isArray(tensor)) {
    tensor.forEach(t => t.dispose());
  } else {
    tensor.dispose();
  }
} 