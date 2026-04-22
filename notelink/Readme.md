NoteLink

Full-Stack Knowledge Management System (v1.0)

NoteLink is a full-stack web application designed to move beyond the limitations of traditional, isolated document storage. By treating notes as nodes in a structured graph, NoteLink allows users to capture the relationships between ideas—transforming a flat collection of notes into a machine-readable, interactive knowledge base.

1. Core Conceptual Framework

Traditional tools often fail to capture the "implicit mental map" created during learning. NoteLink makes these connections explicit through:

Atomic Note-Taking: Focuses on plain-text content to emphasize structural relationships over complex internal formatting.

Directional Relationships: Users draw labeled edges between notes (e.g., "depends on", "contradicts") to define the nature of connections.

Visual Discovery: An interactive force-directed graph reveals clusters of related ideas and identifies isolated concepts requiring integration.

2. Technical Architecture

NoteLink follows a decoupled frontend/backend architecture with a stateless REST API communication layer.

2.1 Backend Layered Responsibility

The Spring Boot 3.2 backend is organized into six logical layers to ensure a clean separation of concerns:

Controller: Receives HTTP requests, validates the authentication principal, and delegates to the service layer.

Service: Contains all business logic, orchestrates repositories, and enforces ownership rules.

Repository: Leverages Spring Data JPA and JPQL to manage optimized database queries, specifically using LEFT JOIN FETCH to solve the N+1 problem.

Entity: JPA-managed domain objects that define the MySQL relational schema.

DTO (Data Transfer Objects): Decouples the API surface from the internal entity structure for security and flexibility.

Security & Configuration: Manages the JWT filter chain, CORS settings, and application-wide beans.

2.2 Global Exception Handling

The system implements a @RestControllerAdvice (GlobalExceptionHandler). It intercepts exceptions (e.g., ResourceNotFoundException, AccessDeniedException) across all controllers and translates them into a consistent JSON response:

timestamp: Precision timing of the error.

status: HTTP status code (404, 401, 403, etc.).

error: Short error type identifier.

message: User-friendly descriptive string.

3. Key Features

A. Optimized Writing & Navigation

Keyboard Bindings: Navigate the writing environment efficiently with dedicated hotkeys, allowing for a fluid experience without constant mouse interaction.

Categorization: Assign custom categories to notes to organize information across disparate domains.

Image Attachments: Drag-and-drop binary uploads via multipart/form-data, stored securely on the server.

B. Discovery & Search

Dual-Tab Search: A unified search bar is integrated into both the Notes and Graph tabs. Users can search by title, content, or category instantly.

Ownership Scoping: All operations are strictly bound to the authenticated userId. No user can access or modify another user's knowledge base.

C. Visual Semantics (The Graph)

Node Customization: Assign custom colors to nodes to represent different knowledge types, priority levels, or status.

Fixed Edge Schema: Labeled edges follow a fixed color schema. This consistent visual language allows users to instantly distinguish between relationship types (e.g., "is an example of" vs. "relates to") across the entire graph.

Force Simulation: Powered by react-force-graph-2d, utilizing D3-based physics to organize the layout based on relationship density.

4. Technical Stack

Component

Technology

Backend

Java 21, Spring Boot 3.2.5, Spring Security 6

Frontend

React 18, Vite 5, Axios (with interceptors)

Database

MySQL 8, Spring Data JPA / Hibernate

Auth

JWT (JSON Web Tokens) with stateless refresh

Graph

react-force-graph-2d (Canvas-based D3 simulation)

5. Project Structure

Backend Package Map

com.fullstacktest.notelink/
├── config/             # CorsConfig, SecurityConfig
├── controller/         # Auth, Note, Relationship, Image controllers
├── dto/                # Request/Response POJOs
├── entity/             # JPA Entities (User, Role, Note, NoteImage, Relationship)
├── exception/          # Custom exceptions & GlobalExceptionHandler
├── repository/         # JpaRepository interfaces (Spring Data JPA)
├── security/           # JWT Utils, Filter Chain, UserDetails
└── service/            # Core business logic & filesystem management


Frontend Source Map

src/
├── api/                # axiosConfig, Service modules
├── components/         # Auth, Layout, and Note components (Editor, Graph, Uploader)
├── context/            # AuthContext, NoteContext (State Management)
├── hooks/              # useAuth, useNotes custom hooks
└── utils/              # Token and localStorage helpers


6. Setup & Running

Prerequisites

Java JDK: 21 (LTS)

MySQL: 8.0+

Node.js: 18+ or 20+

Steps

Database: Create a schema named notelink_db.

CREATE DATABASE notelink_db;


Backend Configuration: Update application.properties with your MySQL credentials and a custom jwtSecret.

Run Backend:

cd backend
mvn clean install
mvn spring-boot:run


Run Frontend:

cd frontend
npm install
npm run dev


7. Design Decisions & Trade-offs

JWT in LocalStorage: Chosen for implementation simplicity and to avoid CSRF boilerplate. Note: In high-security production, HttpOnly cookies are recommended.

Plain-text Notes: Prioritizes the "Knowledge Graph" structure over rich-text complexity, ensuring the system remains focused on relationships.

Filesystem Storage: Images are stored on the local disk for zero-cost development. Note: For horizontal scaling, an object store like AWS S3 should be utilized.

NoteLink v1.0 • Capture the connections between your thoughts.