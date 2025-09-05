# VanishInk 

_A full-stack service for sharing code snippets, text, and files that automatically vanish after a set period._

Built with a **React frontend** and **Spring Boot backend**, VanishInk provides a seamless experience for secure, temporary content sharing.

```bash
Frontend (React) → Backend (Spring Boot) → Database (MySQL)
       ↑                    ↓
       └────→ Cloudinary (File Storage)
``` 
## ✨ Features  

### Core Functionality🔥
- **Instant Sharing**: Generate unique, shareable links with one click
- **Multiple Content Types**: Support for text, code, images, and files
- **Smart Expiration**: Automatically deletes content after configurable durations
- **One-Time Links**: "Burn after reading" option for sensitive information

### User Experience🍀
- **QR Code Generation**: Quick mobile sharing with generated QR codes
- **Responsive Design**
- **Copy Functionality**: One-click copy for both links and content
- **Syntax Highlighting**: Beautifully formatted code with language detection

### Advanced Features⚡ 
- **Multiple File Upload**: Upload and share multiple files simultaneously
- **File Management:** Intuitive interface for adding/removing files before submission
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

<!-- 
MY SECURITY NOTES: 

- Database credentials should never be committed to version control - Cloudinary API secrets must be kept confidential - Always use HTTPS in production environments - Consider implementing rate limiting for production use DEPLOYMENT SECRETS: - SPRING_DATASOURCE_USERNAME=vanisink_user - SPRING_DATASOURCE_PASSWORD=complex_password_123 - CLOUDINARY_CLOUD_NAME=your_cloud_name - CLOUDINARY_API_KEY=123456789012345 - CLOUDINARY_API_SECRET=secret_key_abcdefg 

SCHEDULED TASK: - cleanupExpiredVanishes() runs daily at 2 AM ITC 
                - Removes both database records and Cloudinary files 
                - Maintains database performance and reduces storage costs 
                
-->
