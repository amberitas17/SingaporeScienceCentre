Before jumping to the application, we need to import all the necessary packages, and more importantly the files we just created with the converter.

import * as tf from '@tensorflow/tfjs'
import {bundleResourceIO, decodeJpeg} from '@tensorflow/tfjs-react-native'
import * as FileSystem from 'expo-file-system';

const modelJSON = require('./path/to/jsonfile/model.json')
const modelWeights = require('./path/to/weightsfile/group1-shard.bin')


Loading the model
The next step is to load the model which, thanks to tensorflow and its simple api, is basically a one liner. Tfjs allows to load graph models and layered models. Since this is a Keras sequential model, we will load a Layered model with loadLayersModel function. We load the weights and the json in one go and to do so we use the helper from the react-native adapter bundleResourceIO

const loadModel = async()=>{
//.ts: const loadModel = async ():Promise<void|tf.LayersModel>=>{
    const model = await tf.loadLayersModel(
        bundleResourceIO(modelJSON, modelWeights)
    ).catch((e)=>{
      console.log("[LOADING ERROR] info:",e)
    })
    return model
}
After this, the model is loaded and ready to use.

Input image transformations
Now that we have our model loaded, we need to feed it data. But before that we need do some transformations so it would be compatible with the input shape. My model is for image classification and require a tensor with a size of an image of 300x300 pixels. The input depends on the model and the training of it, so you need to transform it in the way model learned it before. For this I will transform a local image into base64 encoding and then transform it into a tensor.

const transformImageToTensor = async (uri)=>{
  //.ts: const transformImageToTensor = async (uri:string):Promise<tf.Tensor>=>{
  //read the image as base64
    const img64 = await FileSystem.readAsStringAsync(uri, {encoding:FileSystem.EncodingType.Base64})
    const imgBuffer =  tf.util.encodeString(img64, 'base64').buffer
    const raw = new Uint8Array(imgBuffer)
    let imgTensor = decodeJpeg(raw)
    const scalar = tf.scalar(255)
  //resize the image
    imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [300, 300])
  //normalize; if a normalization layer is in the model, this step can be skipped
    const tensorScaled = imgTensor.div(scalar)
  //final shape of the rensor
    const img = tf.reshape(tensorScaled, [1,300,300,3])
    return img
}
Make predictions
Just as easy it was to load the model, making a prediction is the same. So yeah, a one liner. The predict function can do a prediction on a batch of images, we only need to split the result based on the batch size.
const makePredictions = async ( batch, model, imagesTensor )=>{
    //.ts: const makePredictions = async (batch:number, model:tf.LayersModel,imagesTensor:tf.Tensor<tf.Rank>):Promise<tf.Tensor<tf.Rank>[]>=>{
    //cast output prediction to tensor
    const predictionsdata= model.predict(imagesTensor)
    //.ts: const predictionsdata:tf.Tensor = model.predict(imagesTensor) as tf.Tensor
    let pred = predictionsdata.split(batch) //split by batch size
    //return predictions 
    return pred
}

Wrap everything together
The only thing left to do is to call our functions. However, before using any tfjs methods, we need to load the package with tf.ready(), only after that we can use the tensorflow package. We export this function so we can call it later from wherever we want in the application.

export const getPredictions = async (image)=>{
    await tf.ready()
    const model = await loadModel() as tf.LayersModel
    const tensor_image = await transformImageToTensor(image)
    const predictions = await makePredictions(1, model, tensor_image)
    return predictions    
}