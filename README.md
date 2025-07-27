# Singapore Science Centre - AI Vision Syste

**Frontend:**
- React Native (Expo)
- TypeScript
- Expo Camera
- React Navigation

**Backend:**
- Python Flask
- TensorFlow/Keras
- OpenCV
- PIL (Pillow)
- NumPy

## 🧪 Testing

### Backend API Test
```bash
curl http://localhost:5000/health
```

### Face Analysis Test
```bash
curl -X POST http://localhost:5000/analyze-face-simple \
  -H "Content-Type: application/json" \
  -d '{"image": "base64_encoded_image_string"}'
```

## 📊 Performance

- **Model Loading**: 10-30 seconds on startup
- **Inference Time**: 1-3 seconds per image
- **Memory Usage**: ~2-4GB for TensorFlow models
- **Supported Formats**: JPEG, PNG
- **Max Image Size**: Recommended 1080p or lower

## 🔧 Configuration

### For Physical Devices
Update the backend URL in `services/faceAnalysisService.ts`:
```typescript
constructor(baseUrl: string = 'http://YOUR_COMPUTER_IP:5000') {
```

### Environment Variables
```bash
FLASK_ENV=production     # For production
MODEL_PATH=/path/models  # Custom model path
PORT=5000               # Backend port
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

## 🆘 Support

For issues or questions:
1. Check the [SETUP.md](SETUP.md) troubleshooting section
2. Review console logs for errors
3. Ensure all dependencies are installed
4. Verify model files are present

---

🧠 **Powered by AI** | 🇸🇬 **Singapore Science Centre** 
