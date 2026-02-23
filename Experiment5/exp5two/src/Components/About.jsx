import React from 'react';

const About = () => {
  return (
    <div style={{ padding: '20px', lineHeight: '1.6' }}>
      <h1>About This Project</h1>
      <p>
        This application demonstrates <strong>Frontend Performance Optimization</strong> 
        using React's native code-splitting capabilities.
      </p>
      <h3>Key Concepts Used:</h3>
      <ul>
        <li><strong>React.lazy:</strong> To load components only when the route is visited.</li>
        <li><strong>Suspense:</strong> To handle the loading state during the network request.</li>
        <li><strong>React Router:</strong> To manage navigation without a page reload.</li>
      </ul>
    </div>
  );
};

export default About;