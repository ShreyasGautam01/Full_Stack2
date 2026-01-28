# React Router Navigation Experiment

This project demonstrates the implementation of basic routing in a React application. It uses the `react-router-dom` library to map specific URL paths to functional components, enabling a **Single Page Application (SPA)** experience.

---

## ## Project Overview

The application defines three distinct views—**Home**, **About**, and **Contact**—and manages the navigation between them using a declarative routing approach.



### ### Key Components Used
* **`BrowserRouter`**: The parent component that stores the current location in the browser's address bar using clean URLs.
* **`Routes`**: A container that looks through all its child routes to find a match and renders the first one that fits the current URL.
* **`Route`**: Defines the mapping between a specific `path` (like `/about`) and the React `element` that should be displayed.

---

## ## Getting Started

### 1. Prerequisites
Ensure you have **Node.js** installed. You will also need an existing React project. If you don't have one, create it via:

npx create-react-app my-routing-app
cd my-routing-app

2. Install Dependencies
The routing functionality requires the react-router-dom package. Install it using npm:
npm install react-router-dom

3. ImplementationReplace the contents of your App.js with the provided experimental code. The structure follows this logic:Path|Component Rendered|Description| 
/|<Home />|The default landing page.
/about|<About />|Information about the application.
/contact|<Contact />|Contact details page.

## How to Run
Start the development server: npm start.

Open your browser to http://localhost:3000.

Manually change the URL in the address bar (e.g., append /about) to see the components switch dynamically.