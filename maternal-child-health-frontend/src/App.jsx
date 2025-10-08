import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import Layout from "./layouts/Layout";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
        <AppRoutes />
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;