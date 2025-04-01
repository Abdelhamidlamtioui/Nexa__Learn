# NexaLearn - Technical Documentation Platform

NexaLearn is a comprehensive platform for creating, managing, and sharing technical documentation. Built with a modern tech stack, it offers a seamless experience for authors, reviewers, and readers of technical content.

## Presentation
View our project presentation here: [Canva Presentation](https://www.canva.com/design/DAGjay0GXhY/0nC6P_60djQDZNcdxMEEsw/edit?utm_content=DAGjay0GXhY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## Features

- **Rich Documentation Management**
  - Create, edit, and organize technical documentation
  - Section-based content organization
  - Markdown and HTML support
  - Reading time estimation
  - Documentation version control

- **Review Workflow**
  - DRAFT → REVIEW → PUBLISHED → ARCHIVED workflow
  - Moderator review queue
  - Collaborative feedback system

- **User Management**
  - Role-based access control (ADMIN, INSTRUCTOR, STUDENT, MODERATOR)
  - User profile management
  - Avatar uploads via Cloudinary integration

- **API & Integration**
  - RESTful API with JWT authentication
  - Comprehensive error handling
  - Cloudinary integration for image uploads

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.3
- **Language**: Java 17
- **Security**: Spring Security, JWT
- **Database**: PostgreSQL with Liquibase migrations
- **ORM**: Spring Data JPA
- **Build Tool**: Maven
- **Containerization**: Docker

### Frontend
- **Framework**: React.js
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Shadcn UI
- **HTTP Client**: Axios

## Installation

### Prerequisites
- Java 17 or higher
- React.js 18 or higher
- PostgreSQL 13 or higher
- Docker (optional)

### Backend Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Configure the database
   Create a PostgreSQL database and update the connection details in `src/main/resources/application.yml`
   
   Example configuration:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/ecampus
       username: postgres
       password: your_password
   ```

3. Run the application
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Alternatively, you can use Docker:
   ```bash
   docker-compose up
   ```

### Frontend Setup

1. Navigate to the frontend directory
   ```bash
   cd frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   Create a `.env` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

## Usage

### Authentication

1. Register a new account at `/register`
2. Login with your credentials at `/login`

### Creating Documentation

1. Navigate to the Documentation section
2. Click "Create New Documentation"
3. Fill in the title, content, and select a technology type
4. Add sections as needed
5. Submit for review when ready

### Review Process

For users with MODERATOR role:
1. Navigate to the Moderator Dashboard
2. Review submitted documentation in the queue
3. Approve or reject with feedback
4. Published documentation becomes available to all users

## Contributing

We welcome contributions to the NexaLearn project! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request