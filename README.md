# 🏥 MedSync - AI-Powered Medicine Coordination Platform

<div align="center">

![MedSync](https://img.shields.io/badge/MedSync-AI%20Medicine%20Coordination-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb?logo=react)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0%2B-green?logo=spring)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-336791?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-yellow)

**Solve medicine waste vs. shortage coordination in cities using AI**

[Live Demo](#) • [Documentation](./PROJECT_TECH_STACK_AND_FEATURES.md) • [Quick Start](#-quick-start) • [Contributing](#-contributing)

</div>

---

## 📱 Problem & Solution

**Problem:** Cities struggle with medicine coordination—some hospitals waste expired medicines while others face critical shortages of the same drugs.

**Solution:** MedSync is an AI-powered platform that:
- 🤖 Analyzes expiry risks and suggests optimal actions
- 📝 Fills request forms using natural language processing
- 🏥 Connects hospitals to share medicines efficiently
- 📊 Provides real-time inventory management
- 👨‍💼 Enables admins to track system-wide statistics

---

## ✨ Key Features

### 🔐 Authentication & Security
- User registration and login with JWT tokens
- Role-based access control (Hospital / Admin)
- Secure password hashing with bcrypt
- Session management with localStorage

### 📦 Medicine Inventory Management
- Add, edit, and delete medicines
- Track batch numbers and expiry dates
- Monitor quantities and purchase prices
- Search and filter medicines
- View comprehensive inventory reports

### 🤖 AI-Powered Features
**Expiry Risk Analysis**
- Automatic risk classification (CRITICAL, NEAR_EXPIRY, GOOD)
- Actionable recommendations (TRANSFER, DISCOUNT, DISPOSE)
- Powered by Google Gemini 1.5 Flash API

**Natural Language Form Filling**
- Parse unstructured requests: *"I need 200 paracetamol asap"*
- Auto-extract: medicine name, quantity, date, urgency
- Intelligent date parsing and NLP processing

### 📤 Medicine Request Management
- Create and fulfill medicine requests
- Request lifecycle tracking (PENDING → ACCEPTED → FULFILLED → COMPLETED)
- View incoming/outgoing requests
- Filter by status and hospital
- Request history and cancellation

### 🏥 Hospital Dashboard
- Real-time inventory overview
- Critical expiry alerts
- Pending action summaries
- Recent transaction history
- Performance metrics

### 👨‍💼 Admin Dashboard
- System-wide statistics and analytics
- Hospital management (CRUD)
- Global medicine inventory view
- All requests management
- Comprehensive audit logs

### 📋 Audit Logging
- Track all user actions with timestamps
- Log login/logout events
- Record medicine and request changes
- Filter and search audit trails
- Full change history

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2.0** - Modern UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with JWT interceptors
- **React Hot Toast** - User notifications
- **CSS3** - Responsive design with 5 breakpoints (360px → 1200px+)
- **Firebase SDK** - Real-time database (optional)

### Backend
- **Spring Boot 3.0+** - REST API framework
- **Java 17+** - Type-safe backend
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - ORM layer
- **Hibernate** - Database abstraction

### Database
- **Supabase (PostgreSQL 14+)** - Cloud database
- **JPA/Hibernate** - Object-relational mapping
- **Auto-backup & replication** - Data durability

### AI & External APIs
- **Google Gemini 1.5 Flash API** - NLP & expiry analysis
- **Firebase** - Optional real-time sync
- **Rate limiting** - Free tier: 60 req/min

### DevOps & Deployment
- **Maven** - Build automation
- **Docker** - Containerization ready
- **Multiple hosting options** - AWS, Heroku, DigitalOcean, Render, Google Cloud Run

---

## 📊 Architecture

### Request Flow: Login Example
```
React App → AuthController → Supabase → JWT Token → localStorage
```

### Request Flow: Add Medicine
```
React Form → Axios POST → MedicineController 
  → JWT Validation → MedicineService → JPA Repository 
  → PostgreSQL → Response → Toast Notification
```

### Request Flow: AI Expiry Analysis
```
React Component → aiPrototypeService 
  → Google Gemini API → Parse Response 
  → AIRecommendation Component → Display Results
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Java 17+
- Maven 3.6+
- PostgreSQL 14+ (or Supabase account)
- Google Gemini API key
- Git

### 1. Clone Repository
```bash
git clone https://github.com/tasbihakhan29/MedSync-City.git
cd MedSync-City
```

### 2. Setup Backend
```bash
cd backend

# Copy environment file
cp src/main/resources/application.properties.example src/main/resources/application.properties

# Edit application.properties with your credentials:
# - Supabase database URL
# - JWT secret key
# - Google Gemini API key

# Install dependencies and run
mvn clean install
mvn spring-boot:run
```
Backend runs on: `http://localhost:8080/api`

### 3. Setup Frontend
```bash
cd ../frontend

# Copy environment file
cp .env.example .env

# Edit .env with your credentials:
# - Google Gemini API key
# - Firebase config (optional)
# - Backend API URL

# Install dependencies and start
npm install
npm start
```
Frontend runs on: `http://localhost:3000`

### 4. Database Setup
- Create PostgreSQL database or use Supabase
- Run migrations automatically via `spring.jpa.hibernate.ddl-auto=update`
- Seed data: Check `demo-seed-data.sql` for sample data

### 5. Environment Variables

**Frontend (.env)**
```env
REACT_APP_GEMINI_KEY=your_gemini_api_key
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

**Backend (application.properties)**
```properties
spring.datasource.url=jdbc:postgresql://host:5432/database
spring.datasource.username=your_user
spring.datasource.password=your_password
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000
```

---

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
POST   /api/auth/logout         - Logout user
GET    /api/auth/validate       - Validate JWT token
```

### Medicines
```
GET    /api/medicines           - Get all medicines
GET    /api/medicines/:id       - Get medicine by ID
POST   /api/medicines           - Add new medicine
PUT    /api/medicines/:id       - Update medicine
DELETE /api/medicines/:id       - Delete medicine
```

### Batches
```
GET    /api/batches             - Get all batches
POST   /api/batches             - Add batch
PUT    /api/batches/:id         - Update batch
```

### Requests
```
GET    /api/requests            - Get user's requests
POST   /api/requests            - Create request
PUT    /api/requests/:id        - Update request
GET    /api/requests/incoming   - Get incoming requests
POST   /api/requests/:id/fulfill - Fulfill request
```

### Admin
```
GET    /api/admin/hospitals     - Get all hospitals
GET    /api/admin/statistics    - System statistics
GET    /api/admin/audit-logs    - View audit logs
```

---

## 📁 Project Structure

```
MedSync-City/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API services
│   │   ├── context/             # React Context
│   │   ├── hooks/               # Custom hooks
│   │   └── config/              # Config files
│   ├── public/
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── backend/                     # Spring Boot application
│   ├── src/main/java/com/medsync/
│   │   ├── config/              # Spring configuration
│   │   ├── controller/          # REST endpoints
│   │   ├── service/             # Business logic
│   │   ├── repository/          # Data access
│   │   ├── entity/              # JPA entities
│   │   ├── dto/                 # Data transfer objects
│   │   ├── security/            # JWT & security
│   │   └── exception/           # Custom exceptions
│   ├── src/main/resources/
│   ├── pom.xml
│   ├── Dockerfile
│   └── QUICK_START.MD
│
├── README.md                    # Project documentation
├── PROJECT_TECH_STACK_AND_FEATURES.md  # Detailed tech specs
├── DEMO_GUIDE.md                # Demo instructions
├── demo-seed-data.sql           # Sample database data
└── .gitignore                   # Git ignore rules
```

---

## 🔒 Security Features

- ✅ **JWT Authentication** - Stateless token-based auth
- ✅ **Password Hashing** - bcrypt with salt
- ✅ **Role-Based Access Control** - HOSPITAL & ADMIN roles
- ✅ **CORS Protection** - Whitelist configured origins
- ✅ **CSRF Protection** - Spring Security CSRF tokens
- ✅ **SQL Injection Prevention** - Parameterized JPA queries
- ✅ **HTTPS Ready** - SSL/TLS support
- ✅ **Audit Logging** - Track all user actions

---

## 🚢 Deployment

### Frontend Deployment Options
- **Firebase Hosting** - URL: medsync-ai-66b3d.web.app
- **Vercel** - Optimized for React
- **Netlify** - Git integration & auto-deploy
- **GitHub Pages** - Free static hosting

### Backend Deployment Options
- **AWS EC2** - Elastic IP & PostgreSQL
- **Heroku** - PaaS with auto-scaling
- **DigitalOcean** - VPS hosting
- **Render.com** - Git integration, free tier
- **Google Cloud Run** - Serverless, auto-scaling

---

## 🧪 Testing

```bash
# Backend - Run tests
cd backend
mvn test

# Frontend - Run tests
cd frontend
npm test

# Build for production
npm run build
```

---

## 📖 Documentation

- **[PROJECT_TECH_STACK_AND_FEATURES.md](./PROJECT_TECH_STACK_AND_FEATURES.md)** - Complete tech stack details
- **[DEMO_GUIDE.md](./DEMO_GUIDE.md)** - Step-by-step demo instructions
- **[backend/QUICK_START.MD](./backend/QUICK_START.MD)** - Backend quick start
- **[demo-seed-data.sql](./demo-seed-data.sql)** - Sample database data

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

---

## 🐛 Bug Reports & Features

Found a bug or have a feature request?
- **Issues**: [GitHub Issues](https://github.com/tasbihakhan29/MedSync-City/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tasbihakhan29/MedSync-City/discussions)

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 👥 Authors

- **Tasbih Khan** - [GitHub](https://github.com/tasbihakhan29)

---

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Spring Boot team for excellent framework
- React community for amazing tools
- Supabase for cloud database

---

<div align="center">

**Made with ❤️ to solve medicine coordination challenges**

[⬆ back to top](#-medsync---ai-powered-medicine-coordination-platform)

</div>
   - CORS allowed origins

4. Create MySQL database
   ```bash
   mysql -u root -p -e "CREATE DATABASE medsync_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

5. Run the application
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   Backend will start on `http://localhost:8080`

### Frontend Setup
1. Install dependencies
   ```bash
   cd frontend
   npm install
   ```

2. Copy environment template
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Gemini API key
   ```
   REACT_APP_GEMINI_KEY=your_actual_key_here
   ```

4. Start development server
   ```bash
   npm start
   ```
   Frontend will open at `http://localhost:3000`

### Demo Data
Load sample data for quick testing:
```bash
mysql -u medsync_user -p medsync_db < demo-seed-data.sql
```

## Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| City Admin | admin@medsync.com | Admin@123 |
| Hospital 1 | hospital1@medsync.com | Hospital@123 |
| Hospital 2 | hospital2@medsync.com | Hospital@123 |

## API Documentation

### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - Institution registration

### Admin Endpoints
- **GET** `/api/admin/dashboard` - System overview
- **GET** `/api/admin/registrations` - Pending hospital approvals
- **POST** `/api/admin/approve/{id}` - Approve institution
- **GET** `/api/admin/medicines` - Pending medicine approvals
- **GET** `/api/admin/institutions` - All registered institutions
- **GET** `/api/admin/audit-logs` - System audit logs

### Hospital/Pharmacy Endpoints
- **GET** `/api/hospital/inventory` - Your medicine inventory
- **POST** `/api/hospital/batch` - Add medicine batch
- **GET** `/api/hospital/expiry` - Expiry alerts
- **GET** `/api/hospital/requests` - Transfer requests
- **POST** `/api/hospital/request` - Create transfer request
- **GET** `/api/hospital/search` - Search available medicines

## Project Structure
```
medsync/
├── backend/                    Spring Boot application
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/medsync/
│       │   ├── config/        Configuration & security
│       │   ├── controller/    REST endpoints
│       │   ├── dto/           Data transfer objects
│       │   ├── entity/        JPA entities
│       │   ├── repository/    Data access layer
│       │   ├── security/      JWT & auth
│       │   └── service/       Business logic
│       └── resources/
│           └── application.properties
├── frontend/                   React application
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── components/        Reusable React components
│   │   ├── context/          Auth context
│   │   ├── pages/            Route pages
│   │   ├── services/         API & Gemini
│   │   └── index.css         Global styles
│   └── .env.example
├── demo-seed-data.sql         Demo data
└── README.md                  This file
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_GEMINI_KEY=your_gemini_api_key
REACT_APP_API_URL=http://localhost:8080
```

### Backend (application.properties)
```
spring.datasource.url=jdbc:mysql://localhost:3306/medsync_db
spring.datasource.username=medsync_user
spring.datasource.password=your_password
app.jwt.secret=your_256_bit_secret_key
app.cors.allowed-origins=http://localhost:3000
```

## Security Notes
- ✅ Never commit `.env` or `application.properties` to git
- ✅ Use strong JWT secret (min 256 bits)
- ✅ Passwords hashed with BCrypt (cost 10)
- ✅ CORS configured for frontend origin only
- ✅ JWT tokens expire in 24 hours
- ✅ All transfers are audited in system logs
- ✅ Sensitive data (passwords, keys) never logged

## Future Scope
- **Delivery Agent Module** — last-mile transfer tracking
- **Mobile App** — pharmacy staff management app
- **Predictive Analytics** — shortage forecasting using historical data
- **Government Integration** — health department reporting
- **Real-time Notifications** — SMS/email alerts for transfers
- **Barcode Scanning** — QR code batch tracking

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss.

## License
This project is open source and available under the MIT License.

## Support
For issues and questions:
- GitHub Issues: [Project Issues](https://github.com/yourusername/medsync-city/issues)
- Email: support@medsync.local
│       │   │   ├── JwtUtils.java
│       │   │   └── JwtAuthenticationFilter.java
│       │   └── service/
│       │       ├── AuthService.java
│       │       ├── AdminService.java
│       │       ├── MedicineService.java
│       │       ├── RequestService.java
│       │       ├── AuditService.java
│       │       └── UserDetailsServiceImpl.java
│       └── resources/
│           ├── application.properties
│           └── schema.sql              ← Run this first!
│
└── frontend/                          # React application
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.js
        ├── index.js
        ├── index.css
        ├── context/AuthContext.js
        ├── services/api.js
        ├── components/shared/Layout.js
        └── pages/
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── admin/
            │   ├── AdminDashboard.js
            │   ├── AdminRegistrations.js
            │   ├── AdminMedicines.js
            │   ├── AdminInstitutions.js
            │   └── AdminAuditLogs.js
            └── hospital/
                ├── HospitalDashboard.js
                ├── HospitalInventory.js
                ├── HospitalExpiry.js
                ├── HospitalRequests.js
                └── MedicineSearch.js
```

---

## ⚡ Quick Start

### Step 1 — Database Setup
```sql
-- Open MySQL and run:
mysql -u root -p < backend/src/main/resources/schema.sql
```

### Step 2 — Configure Backend
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/medsync_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 3 — Run Backend
```bash
cd backend
mvn spring-boot:run
# Backend starts at http://localhost:8080
```

### Step 4 — Run Frontend
```bash
cd frontend
npm install
npm start
# Frontend starts at http://localhost:3000
```

---

## 🔑 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| City Admin | `admin` | `Admin@123` |

The admin is auto-created on first startup. Register hospitals/pharmacies via the registration page.

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/register` | Register new hospital/pharmacy |

### City Admin (requires `CITY_ADMIN` role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | System stats |
| GET | `/api/admin/registrations/pending` | Pending approvals |
| POST | `/api/admin/registrations/{id}/approve?approve=true` | Approve/reject registration |
| GET | `/api/admin/medicines/pending` | Medicines awaiting approval |
| POST | `/api/admin/medicines/{id}/approve?approve=true` | Approve/reject medicine |
| GET | `/api/admin/institutions` | All institutions |
| GET | `/api/admin/audit-logs` | Recent audit trail |
| GET | `/api/admin/requests` | All transfer requests |

### Hospital/Pharmacy (requires `HOSPITAL` or `PHARMACY` role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hospital/inventory` | My medicine batches |
| POST | `/api/hospital/inventory/batch` | Add new batch |
| PUT | `/api/hospital/inventory/batch/{id}` | Update batch |
| GET | `/api/hospital/expiry/near` | Near-expiry medicines |
| GET | `/api/hospital/expiry/shared-alerts` | City-wide alerts |
| PATCH | `/api/hospital/settings/share-expiry?share=true` | Toggle expiry sharing |
| GET | `/api/hospital/medicines/search?query=...` | Search medicines |
| GET | `/api/hospital/medicines/barcode/{barcode}` | Barcode lookup |
| GET | `/api/hospital/medicines/all` | All approved medicines |
| POST | `/api/hospital/medicines` | Add medicine (pending approval) |
| GET | `/api/hospital/medicines/{id}/availability` | City-wide availability |
| POST | `/api/hospital/requests` | Create transfer request |
| GET | `/api/hospital/requests` | My requests |
| GET | `/api/hospital/requests/incoming` | Incoming requests |
| POST | `/api/hospital/requests/{id}/respond` | Accept/reject request |
| POST | `/api/hospital/requests/{id}/complete` | Mark transfer complete |

---

## 🔒 Security Features

- **JWT Authentication** — All API routes protected with Bearer tokens
- **BCrypt Password Hashing** — Industry-standard password storage
- **Role-Based Access Control** — `CITY_ADMIN`, `HOSPITAL`, `PHARMACY`
- **Account Status Flow** — PENDING → ACTIVE (requires admin approval)
- **Audit Logging** — Every important action is logged
- **Identity Anonymization** — Hospital identity hidden until request accepted
- **Input Validation** — Jakarta Validation on all DTOs
- **CORS Configuration** — Restricted to frontend origin

---

## 🎯 Key Features

### For City Admin
- ✅ Approve/reject hospital and pharmacy registrations
- ✅ Manage medicine master database
- ✅ Full audit trail visibility
- ✅ System-wide dashboard stats

### For Hospitals & Pharmacies
- ✅ Batch-level inventory tracking with expiry monitoring
- ✅ Near-expiry and critical-expiry dashboards
- ✅ City-wide medicine availability search
- ✅ Barcode lookup support
- ✅ Anonymous medicine transfer requests with tracking codes
- ✅ FIFO-based stock deduction on transfer acceptance
- ✅ Location-based supplier sorting (by distance)
- ✅ Opt-in expiry alert sharing with city network

---

## 🗄 Database Schema

6 core tables:
- `users` — Authentication and roles
- `hospitals` — Hospital/pharmacy profiles
- `medicines` — Master medicine catalog
- `medicine_batches` — Per-institution batch inventory
- `medicine_requests` — Transfer requests with tracking
- `audit_logs` — Complete action audit trail

---

## 🚀 Extending the Project

- **AI Demand Prediction** — Integrate Google Gemini API in a new `PredictionService`
- **Real-time Notifications** — Add WebSocket (Spring WebSocket + SockJS)
- **Barcode Scanning** — Integrate `react-zxing` for camera-based scanning
- **Maps Integration** — Add Leaflet.js for visual hospital location display
- **Mobile App** — The REST API is ready for React Native or Flutter

---

*Built for MedSync City — Improving healthcare supply chain coordination.*
