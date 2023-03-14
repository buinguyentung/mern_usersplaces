import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

// React 16
// ReactDOM.render(<App />, document.getElementById('root'));

// React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
