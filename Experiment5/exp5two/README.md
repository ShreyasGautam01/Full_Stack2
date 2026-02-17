React Route-Based Code Splitting
This project demonstrates a highly efficient way to build React applications by combining Client-Side Routing with Dynamic Imports. Instead of loading the entire app at once, it only loads the code needed for the current page.

## What This Application Does
This application uses three core React patterns to optimize performance:

Declarative Routing: Uses react-router-dom to switch between a "Dashboard" and a "Profile" view without refreshing the browser.

Lazy Loading: The Dashboard and Profile components are not included in the initial page load. They are separate "chunks" that the browser downloads only when you click their respective links.

Loading States (Suspense): While the browser is fetching the code for a new route, React automatically displays a "Loading Component..." message, ensuring the user isn't left staring at a blank screen.

##Prerequisities
clone the repository
npm intall
npm install react-router-dom

3. Project Structure
Ensure your folder structure matches the imports:

src/App.js
src/Components/Dashboard.js
src/Components/Profile.js