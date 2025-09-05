# VanishInk 

_A full-stack service for sharing code snippets, text, and files that automatically vanish after a set period._

Built with a **React frontend** and **Spring Boot backend**, VanishInk provides a seamless experience for secure, temporary content sharing.

```bash
Frontend (React) → Backend (Spring Boot) → Database (MySQL)
       ↑                    ↓
       └────→ Cloudinary (File Storage)
``` 
## ✨ Features  

### Core Functionality ⚡
- **Instant Sharing**: Generate unique, shareable links with one click
- **Multiple Content Types**: Support for text, code, images, and files
- **Smart Expiration**: Automatically deletes content after configurable durations
- **One-Time Links**: "Burn after reading" option for sensitive information

### User Experience
- **QR Code Generation**: Quick mobile sharing with generated QR codes
- **Responsive Design**
- **Copy Functionality**: One-click copy for both links and content
- **Syntax Highlighting**: Beautifully formatted code with language detection

### ⚡ Advanced Features
- **Multiple File Upload**: Upload and share multiple files simultaneously
- **Custom Expiration Times**: Flexible duration settings (minutes, hours, days, weeks)
- **Real-time Validation**: Client and server-side input validation
- **Automatic Cleanup**: Scheduled database maintenance

---

## 🛠️ Tech Stack  

**Frontend**  
- React.js 
- QR Code generation
- CSS3 

**Backend**  
- Spring Boot
- Spring Data JPA with Hibernate
- MySQL Database
- Cloudinary API Integration for file storage
- Scheduled tasks with Spring Scheduler

**Deployment**
- **Vercel.com** for Frontend
- **Render.com** for Backend
- **MySQL** managed database (h2 database temporarily)
- **Cloudinary** CDN for file storage

---

## 🚀 How It Works  

1. **Create** → Paste text/code or upload files, add title, set expiration time
2. **Share** → Copy the unique link or scan QR code
3. **Access** → Recipients view content before expiration
4. **Vanish** → Content automatically deleted after expiration or first view

---
<!--
## 📋 API Endpoints  

### **POST** `/api/vanish`
Creates a new vanish with optional files
- **Parameters**: `title`, `content`, `expiryTime`, `isOneTime`, `file[]` (multipart)
- **Response**: `{ "url": "unique-id" }`

### **GET** `/api/vanish/{vanishId}`
Retrieves a vanish by its unique ID
- **Response**: Vanish object with content or file metadata

### **Scheduled** `cleanupExpiredVanishes()`
Runs daily at 2 AM to remove expired content
-->


## 🗂️ Database Schema

### Vanish Table
- `id`, `vanish_id` (unique 8-char identifier)
- `title`, `content` (text), `content_type` (TEXT/FILE/IMAGE)
- `created_at`, `expires_at`, `is_one_time`
- `file_url` (for backward compatibility)

### FileMetadata Table  
- `id`, `original_file_name`, `file_url` (Cloudinary)
- `file_size`, `file_type`, `vanish_id` (foreign key)

---

## 🔧 Installation & Setup  

### Backend (Spring Boot + MySQL)
```bash
# Clone repository
git clone https://github.com/aslams2020/vanishink-snippets.git

# Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/vanishink_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# Cloudinary configuration
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret

# Run application
mvn spring-boot:run
