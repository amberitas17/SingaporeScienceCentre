# Singapore Science Centre - AI Vision System

An interactive AI vision system for age detection and emotion recognition using React Native (Expo) and Python Flask backend with Roboflow API integration.

## 🏗️ Architecture

This application uses a **hybrid AI approach** combining cloud and local inference:

```
┌─────────────────────┐    HTTP API    ┌─────────────────────┐
│   Expo React App   │ ──────────────► │   Python Backend   │
│   (Port 8081)      │                 │   (Port 5000)       │
│                     │                 │                     │
│ • Camera Interface  │                 │ • Flask API         │
│ • Face Verification │                 │ • Roboflow (Age)    │
│ • Results Display   │                 │ • Local Model (Emotion)│
│ • Audio Processing  │                 │ • AssemblyAI (Audio)│
└─────────────────────┘                 └─────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- Model files in `backend/asset/`
- Roboflow API access
- AssemblyAI API access

### Start the Application

IMPORTANT:
Install python 3.10 to PATH (python version higher than 3.10 does not support some libraries such as mediapipe)

#### Terminal 1 - Python Backend:
```bash
cd backend
python3.10 -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

#### Terminal 2 - Python Backend for Computer Vision:
```bash
cd backend

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

python yolov8_flask_api.py
```

#### Terminal 3 - React Native App:
```bash
npm install
npm run dev
```

> **Note**: Backend runs on port 5000, frontend on port 8081

## 🧠 AI Models

### Age Prediction (Roboflow Cloud)
- **Service**: Roboflow API
- **Workspace**: Custom age detection workflow
- **Outputs**: Age estimation with confidence scores
- **API**: Real-time cloud-based inference

### Emotion Recognition (Local Model)
- **Dataset**: FER2013
- **Model**: `backend/asset/emotion_model.h5`
- **Engine**: TensorFlow/Keras
- **Outputs**: 7 emotions (Angry, Disgust, Fear, Happy, Sad, Surprise, Neutral)

### Audio Transcription (AssemblyAI)
- **Service**: AssemblyAI API
- **Model**: Universal speech model
- **Outputs**: Text transcription with keyword detection

## 📱 Features

- **Real-time Face Detection**: Using OpenCV Haar cascades
- **Age Prediction**: Cloud-based age estimation via Roboflow API
- **Emotion Recognition**: Local model inference for 7 emotion categories
- **Audio Transcription**: Voice-to-text processing with keyword detection
- **Multi-face Support**: Analyzes all detected faces in an image
- **Live Camera Feed**: Real-time camera interface with instant results
- **Cross-platform**: Works on iOS, Android, and web
- **Hybrid AI**: Combines cloud and local inference for optimal performance

## 🛠️ Development

### Project Structure
```
SingaporeScienceCentre/
├── app/                    # Expo React Native app
│   ├── (tabs)/            # Tab navigation screens
│   ├── contexts/          # React contexts (FaceVerificationContext)
│   ├── face-verification.tsx
│   └── ai-vision.tsx
├── backend/               # Python Flask API
│   ├── app.py            # Main Flask application
│   ├── asset/            # AI model files
│   │   ├── emotion_model.h5
│   │   ├── age_gender_model.h5
│   │   └── haarcascade_frontalface_default.xml
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend documentation
├── services/             # Frontend API services
│   ├── faceAnalysisService.ts
│   └── config.ts
├── assets/               # Static assets (images, icons)
│   ├── images/
│   └── exhibits_images/
├── package.json          # Frontend dependencies
└── README.md            # This file
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check and model status |
| `/predict/combined` | POST | Age and emotion analysis |
| `/transcribe` | POST | Audio transcription with keyword detection |

#### Request/Response Examples

**Face Analysis:**
```bash
curl -X POST http://localhost:5000/predict/combined \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_string"}'
```

**Audio Transcription:**
```bash
curl -X POST http://localhost:5000/transcribe \
  -F "audio=@audio_file.wav"
```

### Tech Stack

**Frontend:**
- React Native (Expo)
- TypeScript
- Expo Camera
- React Navigation

**Backend:**
- Python Flask
- TensorFlow/Keras (local emotion model)
- Roboflow API (age detection)
- AssemblyAI API (audio transcription)
- OpenCV (face detection)
- PIL (Pillow) & NumPy

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "models_loaded": {
    "roboflow": true,
    "assemblyai": true,
    "emotion_model": true,
    "face_cascade": true
  }
}
```

### Face Analysis Test
```bash
curl -X POST http://localhost:5000/predict/combined \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_string"}'
```

### Test Connection Script
```bash
node test-flask-connection.js
```

## 📊 Performance

- **Model Loading**: 10-30 seconds on startup
- **Inference Time**: 1-3 seconds per image
- **Memory Usage**: ~2-4GB for TensorFlow models
- **Supported Formats**: JPEG, PNG
- **Max Image Size**: Recommended 1080p or lower

## 🔧 Configuration

### API Keys Setup
Update the following in `backend/app.py`:
```python
# AssemblyAI configuration
ASSEMBLYAI_API_KEY = "your_assemblyai_api_key"

# Roboflow configuration  
ROBOFLOW_API_KEY = "your_roboflow_api_key"
ROBOFLOW_WORKSPACE = "your_workspace"
ROBOFLOW_AGE_WORKFLOW_ID = "your_workflow_id"
```

### For Physical Devices
Update the backend URL in `services/config.ts`:
```typescript
export const API_BASE_URL = 'http://YOUR_COMPUTER_IP:5000'
```

### Environment Variables
```bash
FLASK_ENV=production     # For production
PORT=5000               # Backend port (default: 5000)
```

## 🚀 Deployment

### Production Backend
```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Expo Build
```bash
npx expo build:android  # Android APK
npx expo build:ios      # iOS IPA
```

## 🆕 Recent Changes

### Migration from TensorFlow.js ✅
- ❌ Removed TensorFlow.js client-side processing
- ✅ Added Python Flask backend API
- ✅ Better model performance and accuracy
- ✅ Reduced mobile app complexity
- ✅ Easier model maintenance and updates

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Comprehensive setup guide
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the Singapore Science Centre internship program.

## 🛠️ Troubleshooting

### Common Issues

#### Backend Not Starting
1. **Virtual Environment**: Ensure you're in the activated virtual environment
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```

2. **Dependencies**: Install all required packages
   ```bash
   pip install -r requirements.txt
   ```

3. **Model Files**: Verify model files exist in `backend/asset/`
   - `emotion_model.h5`
   - `age_gender_model.h5` 
   - `haarcascade_frontalface_default.xml`

#### Frontend Connection Issues
1. **Backend URL**: Update IP address in `services/config.ts` for physical devices
2. **CORS**: Backend includes CORS headers for cross-origin requests
3. **Port Conflicts**: Ensure ports 5000 (backend) and 8081 (frontend) are available

#### Model Loading Errors
1. **TensorFlow Version**: Ensure TensorFlow compatibility with model files
2. **Memory**: Models require 2-4GB RAM for loading
3. **File Permissions**: Check read permissions on model files

#### API Key Issues
1. **Roboflow**: Verify API key and workspace access
2. **AssemblyAI**: Check API key validity and quota limits
3. **Network**: Ensure internet connectivity for API calls

### Performance Tips
- **Memory**: Close other applications when running models
- **Network**: Stable internet required for Roboflow/AssemblyAI APIs
- **Image Size**: Resize large images before processing
- **Batch Processing**: Process one image at a time for stability

### Debugging
1. **Backend Logs**: Check `backend/app.log` for detailed errors
2. **Console Output**: Monitor terminal output for real-time logs
3. **Health Check**: Use `/health` endpoint to verify model status
4. **Test Script**: Run `test-flask-connection.js` to verify connectivity

---

🧠 **Powered by AI** | 🇸🇬 **Singapore Science Centre** 
