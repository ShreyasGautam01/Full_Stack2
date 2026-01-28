React Router Link & Navigation Experiment
This project demonstrates how to use the Link component from react-router-dom to enable navigation between routes without triggering a full page reload.

## Project Overview
The application utilizes declarative routing to toggle between a Profile page (featuring a marquee effect) and a Dashboard page. It includes a navigation menu that persists across different views.

### Key Components Used
BrowserRouter: Enables the use of the HTML5 history API to keep the UI in sync with the URL.

Routes & Route: Used to define and render specific components based on the current path.

Link: Provides accessible navigation throughout the application, replacing standard anchor tags to maintain the SPA state.

## Getting Started
1. Prerequisites
Install the router dependency in your React project:

npm install react-router-dom
2. Styling (App.css)
Use this minimalist CSS to center the application content:

CSS
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
}

#root {
  display: grid;
  place-items: center;
  height: 100vh;
  text-align: center;
}
3. Implementation
Replace the contents of your App.js with the provided experimental code. The structure follows this logic:

Path|Component Rendered|Description| 1. /Profile|<Profile />|Displays a marquee welcome and developer bio. 2. /Dashboard|<Dashboard />|Displays the admin panel welcome message.

## How to Run
Start the development server: npm start.

Use the buttons at the bottom of the screen to switch between the Profile and Dashboard views.

Observe that the URL changes and the content updates instantly without the browser refreshing.