# VanishInk 🕶 

_A full-stack service built for sharing code and text snippets that automatically vanish after a set period._  

Built with a **React frontend** and a robust **Spring Boot backend**, VanishInk provides a seamless experience for developers to quickly share and collaborate.  

---

## ✨ Features  

- **Instant Sharing** ⚡: Generate unique, shareable links for your code snippets in one click.  
- **Smart Expiration**: Automatically deletes pastes after configurable durations (`1 hour`, `1 day`, `1 week`) or set them to never expire.  
- **Syntax Highlighting**: Beautifully formatted and highlighted code for improved readability across multiple programming languages.  
-  **Clean Design**: Minimalist, intuitive UI focused entirely on functionality.  
- 🔗 **RESTful API**: Fully functional backend ready for integration and extension.  

---

## 🛠️ Tech Stack  

**Frontend**  
- React.js  
- React Syntax Highlighter  
- CSS3  

**Backend**  
- Spring Boot  
- Spring Data JPA  
- MySQL  
- Java  

---

## 🚀 How It Works  

1. **Create** → Paste your code or text, add an optional title, and select an expiration time.  
2. **Share** → Copy the unique, generated link. Your content is now live at a secure, public URL.  
3. **Vanish** → Content is automatically deleted from the database once the expiration time is reached, leaving no trace behind.  

---

## 🔧 Core Implementation Details  

- **Unique URL Generation**🔑 : Shareable links are secured using 8-character, random alphanumeric identifiers generated via Java’s `UUID` library, offering **218 trillion+ combinations** to prevent guessing.  
- **Data Persistence**: Spring Boot backend leverages MySQL with schema handled by **Hibernate ORM**.  
- **CORS Configuration**🌐: Custom CORS policy implemented to securely handle requests from the decoupled React frontend.  
- **Scheduled Cleanup**: Background scheduler purges expired pastes, ensuring database performance and hygiene.  

---

## 📋 API Endpoints  

- **POST** `/api/vanish` → Creates a new paste.  
  - **Request Body**: `{ title, content, expiryTime }`  
  - **Response**: `{ uniqueURL }`  

- **GET** `/api/vanish/{vanishId}` → Retrieves a paste by its unique ID (if it exists and hasn’t expired).  

---

## 🖥️ Installation & Setup  

### Backend (Spring Boot + MySQL)  
```bash
# Clone repo
git clone https://github.com/aslams2020/vanishink-snippets.git

# Configure database in application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/vanishink
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASS

# Run backend
mvn spring-boot:run
```
### Frontend (React.js)
```bash
# Clone repo
git clone https://github.com/aslams2020/vanishink-snippets.git
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```


<!--H2 DATABASE - jdbc:h2:mem:testdb 

Layer 1: Logical Expiration (Immediate)
✅ Frontend shows "expired" message
✅ API returns 404 for expired content
✅ Users can't access expired vanishes

Layer 2: Physical Cleanup (Scheduled) => 2 am
✅ Actually removes the database records
✅ Frees up storage space
✅ Maintains database performance
-->
