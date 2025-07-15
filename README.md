# On-Premise AI Assistant with Calendar Features

A fully on-premise Generative AI Assistant that provides calendar management, document analysis, and intelligent conversation capabilities using open-source models. Built with Python Flask and powered by Ollama for local AI processing.

## 🚀 Features

### 🤖 AI Assistant
- **Local AI Processing**: Uses Ollama with Qwen2.5-large:7b model
- **No External APIs**: Complete privacy and security
- **Intelligent Conversations**: Context-aware responses with contamination protection
- **Natural Language Processing**: Understands complex queries and requests

### 📅 Calendar Management
- **Smart Scheduling**: Create events using natural language
- **Visual Calendar**: Modern calendar interface with monthly view
- **Event Management**: Full CRUD operations (Create, Read, Update, Delete)
- **AI Integration**: Ask the assistant about your schedule
- **Dummy Data**: Pre-populated with sample class schedule

### 📄 Document Analysis (RAG System)
- **Multiple Formats**: PDF, DOCX, PPTX, PNG, JPG support
- **OCR Capabilities**: Extract text from images using Tesseract
- **Semantic Search**: Find relevant information across documents
- **Knowledge Base**: Query uploaded documents through AI chat
- **Sample Documents**: Includes NDA and other sample files

### 🔧 System Features
- **SQLite Database**: Local data storage
- **Production Ready**: Logging, error handling, data persistence
- **Modern UI**: Professional interface with responsive design
- **Data Export**: Export conversations, documents, and calendar data
- **Debug Tools**: Built-in debugging and maintenance endpoints

## 🛠️ Technology Stack

- **Backend**: Python 3.8+, Flask 3.1.1
- **AI Model**: Ollama + Qwen2.5-large:7b
- **Database**: SQLite 3
- **Document Processing**: PyPDF2, python-docx, python-pptx, Pillow, pytesseract
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Production Server**: Waitress WSGI server

## 📋 Prerequisites

### System Requirements
- **Python**: 3.8 or higher
- **Memory**: 8GB RAM minimum (16GB recommended for Qwen2.5-large)
- **Storage**: 10GB free space minimum
- **OS**: Windows 10/11, macOS, or Linux

### Required Software
1. **Ollama**: Download from [ollama.ai](https://ollama.ai)
2. **Tesseract OCR**: For image text extraction
   - Windows: Download from [GitHub releases](https://github.com/UB-Mannheim/tesseract/wiki)
   - macOS: `brew install tesseract`
   - Linux: `sudo apt-get install tesseract-ocr`

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "GEN AI ASSISTANT"
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Install and Setup Ollama
```bash
# Download and install Ollama from https://ollama.ai

# Pull the required model (7GB download)
ollama pull qwen2.5-large:7b

# Verify Ollama is running
ollama list
```

### 5. Initialize Database
```bash
python app.py
# The database will be automatically initialized on first run
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
python app.py
```

### Production Mode
```bash
# The app uses Waitress WSGI server for production
python -c "from app import app; app.run(host='0.0.0.0', port=5000)"
```

The application will be available at:
- **Local**: http://localhost:5000
- **Network**: http://your-ip-address:5000

## 🎯 Usage Guide

### Chat Interface
1. Navigate to the main page (/)
2. Use natural language to:
   - Ask about your calendar: "What's my schedule tomorrow?"
   - Create events: "Schedule a meeting with John next Tuesday at 2 PM"
   - Query documents: "What's in the NDA document?"
   - General assistance: "Help me plan my week"

### Calendar Management
1. Go to `/calendar`
2. View events in monthly calendar
3. Click "Add Event" to create new events
4. Click on existing events to view/edit/delete

### Document Upload
1. Go to `/documents`
2. Upload PDF, DOCX, PPTX, or image files
3. Documents become searchable through the AI chat
4. View, download, or delete uploaded documents

### Settings & Monitoring
1. Go to `/settings`
2. View system status and model information
3. Clear data (conversations, documents, calendar)
4. Export data for backup

## 📁 Project Structure

```
GEN AI ASSISTANT/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── ai_assistant.db       # SQLite database
├── logs/                 # Application logs
├── static/              # CSS, JavaScript, assets
├── templates/           # HTML templates
├── uploads/             # Uploaded documents
├── utils/               # Core modules
│   ├── calendar_manager.py  # Calendar operations
│   ├── database.py          # Database management
│   ├── ollama_client.py     # AI model integration
│   └── rag_system.py        # Document processing & search
└── venv/               # Virtual environment
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file for custom configuration:
```env
SECRET_KEY=your-secret-key-here
OLLAMA_BASE_URL=http://localhost:11434
MAX_CONTENT_LENGTH=16777216  # 16MB
```

### Ollama Model Configuration
The app is configured for `qwen2.5-large:7b`. To use a different model:

1. Edit `utils/ollama_client.py`:
```python
self.model = "your-preferred-model"
```

2. Pull the new model:
```bash
ollama pull your-preferred-model
```

## 📊 API Endpoints

### Chat & AI
- `POST /api/chat` - Send message to AI assistant
- `GET /api/system/status` - Check system and model status

### Calendar
- `GET /api/calendar/events` - Get all events
- `POST /api/calendar/events` - Create new event
- `PUT /api/calendar/events/<id>` - Update event
- `DELETE /api/calendar/events/<id>` - Delete event

### Documents
- `GET /api/documents` - List uploaded documents
- `POST /api/upload` - Upload new document
- `DELETE /api/documents/<id>` - Delete document

### System Management
- `GET /api/data/export` - Export all data
- `POST /api/system/clear/<type>` - Clear data (conversations/documents/calendar)

## 🐛 Troubleshooting

### Common Issues

**1. Ollama Not Running**
```bash
# Check if Ollama is running
ollama list

# Start Ollama service (if needed)
ollama serve
```

**2. Model Not Found**
```bash
# Pull the required model
ollama pull qwen2.5-large:7b
```

**3. OCR Not Working**
- Install Tesseract OCR
- Ensure tesseract is in your system PATH

**4. Database Issues**
```bash
# Delete database to reset
rm ai_assistant.db
python app.py  # Will recreate database
```

**5. Port Already in Use**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process and restart
```

## 🔒 Security & Privacy

- **Local Processing**: All AI processing happens on your machine
- **No External APIs**: No data sent to external services
- **File Security**: Uploaded files stored locally
- **Database Encryption**: Consider encrypting sensitive documents

## 🚀 Performance Tips

1. **Memory**: Qwen2.5-large requires ~8GB RAM
2. **Storage**: Use SSD for better performance
3. **CPU**: More cores = faster document processing
4. **Network**: Run on same machine for best latency

## 📈 Monitoring & Maintenance

### Logs
Check application logs in `logs/ai_assistant.log` for debugging.

### Database Maintenance
```bash
# Sync documents and clean up orphaned data
curl -X POST http://localhost:5000/api/documents/sync
```

### Data Backup
```bash
# Export all data
curl http://localhost:5000/api/data/export > backup.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open-source. Please check the license file for details.

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review application logs
3. Create an issue in the repository

## 🎉 Acknowledgments

- **Ollama**: Local AI model serving
- **Qwen2.5**: Open-source language model
- **Flask**: Web framework
- **SQLite**: Database engine
- **Various Python libraries**: See requirements.txt for full list

---

**Built with ❤️ for on-premise AI assistance** 