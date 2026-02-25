Experiment I: Handling Forms Using Controlled Components
1. Aim
To architect and implement a robust form-handling system within a React frontend environment, utilizing the Controlled Components pattern to ensure total synchronization between the User Interface (UI) and the application state.

2. Theoretical Foundation
In standard web environments, form elements typically maintain their own internal state. In a Controlled Component architecture, this internal state is intercepted and redirected to a "Single Source of Truth"—the React State.

The Invariant Principle: State-UI Synchronicity
The core mechanism is a Cyclical Feedback Loop:

View to Model: User input triggers an event.

Model Update: The event handler updates the State.

Model to View: The State dictates the value of the input.

This ensures that the UI is never "out of sync" with the underlying data, allowing for complex validation and programmatic manipulation of user input in real-time.

3. System Design Decisions
This project prioritizes Structural Simplicity and Logical Scalability through the following choices:

Single File Architecture (App.jsx): Chosen for this specific experiment to minimize cognitive overhead and file-switching, allowing the developer to see the direct mapping between State, Logic, and View in one glance.

Unified State Object: Rather than fragmented variables, all form data is encapsulated in a single JavaScript object. This mirrors a Database Schema, making data submission more efficient.

Computed Property Pattern: A generalized handleChange function uses the name attribute of HTML elements as a key to update the state. This decouples the logic from the specific input field, making the system extensible.

4. Software Requirements
Node.js (Runtime Environment)

Vite (Build Tool)

React (Component Library)

VS Code (Integrated Development Environment)

5. Technical Workflow & Implementation
A. Data Collection Points
The application is designed to capture a diverse range of data types, testing the system's ability to handle various inputs:

Textual: First Name, Last Name, Address.

Categorical: Gender (Radio), State (Dropdown).

Temporal: Date of Birth (Datetimepicker).

Collection-based: Skills (Checkboxes).

Numerical(calculated from DOB): Age.

B. Execution Steps
Initialization: Create the React environment via Vite.

State Definition: Initialize a multi-key object using the useState hook.

Event Interception: Implement the onChange handler to synchronize keystrokes with memory.

Data Persistence Simulation: Utilize an alert menu to display the captured JSON object upon submission.

6. Installation & Usage
To run this experiment locally, execute the following commands in your terminal:
Clone/Setup the project:
npm install

Launch the development server:
npm run dev
Access the Application:
Open the URL provided in the terminal (usually http://localhost:5173).

## Screenshots
Experiment6/Screenshots/6.1.1.png Experiment6/Screenshots/6.1.2.png Experiment6/Screenshots/6.1.3.png Experiment6/Screenshots/6.1.4.png