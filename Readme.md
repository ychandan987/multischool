📘 ERP Backend – Multi-School Management System

A Node.js + Express + Sequelize backend for managing multiple schools, each with its own:

Users (admins, teachers, staff)

Students

Role-based access control (RBAC)

Authentication system

Email onboarding

Superadmin global management

Built with a clean, secure, scalable architecture.
------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------

🚀 Features
🔐 Authentication

JWT-based login

Password hashing (bcrypt)

Email-based onboarding (Nodemailer)

🏫 Multi-School Architecture

Each school has its own users and students

Superadmin can manage all schools

School admins manage only their school

👥 Role-Based Access Control (RBAC)

superadmin

admin

user (staff)

Permission rules enforce:

who can view school data

who can edit student/user data

cross-school access is blocked

👨‍🎓 Student Management

Create, update, delete students

School-level authentication

Validation with JOI

👤 User Management

Create users within a school

Global /users/:id route

Prevent privilege escalation

Email onboarding with auto-generated password

🛡 Security

Helmet

CORS

x-powered-by disabled

JSON body size limit

Sanitized validation

------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------
📁 Project Structure

src/
 ├── app.js
 ├── config/
 │    ├── db.js
 │    └── mailer.js
 ├── middlewares/
 │    ├── auth.js
 │    ├── rbac.js
 │    └── validate.js
 ├── models/
 │    ├── index.js
 │    ├── role.js
 │    ├── school.js
 │    ├── student.js
 │    └── user.js
 ├── routes/
 │    ├── auth.js
 │    ├── schools.js
 │    ├── students.js
 │    ├── users.js
 │    └── usersRoot.js
 ├── services/
 │    ├── emailService.js
 │    └── userService.js
 ├── validators/
 │    ├── auth.js
 │    ├── school.js
 │    ├── student.js
 │    └── user.js
 └── tests/
      ├── auth.test.js
      └── users.test.js

------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------

⚙️ Installation

1️⃣ Clone the repo
        git clone https://github.com/your/repo.git
        cd repo

2️⃣ Install dependencies
        npm install

3️⃣ Environment Variables
        PORT=3000
        PORT=3000
        DB_HOST=localhost
        DB_USER=root
        DB_PASS=password
        DB_NAME=erp_db
        DB_PORT=3306

        JWT_SECRET=your_jwt_secret
        JWT_EXPIRES=7d

        SMTP_HOST=smtp.gmail.com
        SMTP_PORT=587
        SMTP_USER=your_email@gmail.com
        SMTP_PASS=your_password
        MAIL_FROM="ERP System <no-reply@erp.com>"

        SEND_EMAILS=true
        USE_SECURE_PASSWORDS=true
        NODE_ENV=development
4️⃣ Run the server
        npm run start 
------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------

🧪 Running Tests
        npm test

------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------

📡 API Endpoints
        🔐 Auth
            Method	Endpoint	Description
            POST	/auth/login	Login and get JWT
        🏫 Schools
            Method	Endpoint	Description
            GET	/schools	List all schools (superadmin only)
            POST	/schools	Create a school
            GET	/schools/:id	Get a school
        👥 Users
            School-scoped users
            Method	Endpoint	Description
            POST	/schools/:schoolId/users	Create user in school
            GET	/schools/:schoolId/users	List school users
        Global users
            Method	Endpoint	Description
            GET	/users/:id	Get user profile
            PUT	/users/:id	Update user
        👨‍🎓 Students
            Method	Endpoint	Description
            POST	/schools/:schoolId/students	Create student
            GET	/schools/:schoolId/students	List students
            GET	/schools/:schoolId/students/:id	Get a student
            PUT	/schools/:schoolId/students/:id	Update student
            DELETE	/schools/:schoolId/students/:id	Delete student

------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------        
        🔧 Tech Stack
            Node.js / Express
            MySQL with Sequelize ORM
            Joi for validation
            JWT for authentication
            Nodemailer for emails
            Helmet + CORS for security
            Jest + Supertest for testing

------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------

    🔐 Security Features
            Password hashing with bcrypt

            JWT-based access control

            RBAC: superadmin → admin → user

            Validation for all inputs

            Helmet security headers

            Sensitive fields stripped from responses