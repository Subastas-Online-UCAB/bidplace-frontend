import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import NavigationBar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import About from './pages/About';
import Properties from './pages/Properties';
import Contact from './pages/Contact';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CrearSubasta from './pages/CrearSubasta';
import CrearProducto from './pages/CrearProducto';
import Producto from './pages/Producto';
import InterAdmin from './pages/InterAdmin';
import Logout from './pages/Logout';
import Inicio from './pages/inicio';

import keycloak, { initKeycloak } from './auth';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  function Layout() {
    const location = useLocation();
    const hideLayout = ['/', '/login', '/register', '/logout'];
    const shouldHideLayout = hideLayout.includes(location.pathname);

    if (!initialized) return <div>Cargando Keycloak...</div>;

    return (
      <div className="page-container">
        {!shouldHideLayout && <NavigationBar />}
        <div className="content-wrap">
          <main className="my-4">
            <Routes>
              <Route path="/" element={authenticated ? <Navigate to="/home" /> : <Inicio />} />
              <Route path="/home" element={authenticated ? <Home /> : <Navigate to="/" />} />
              <Route path="/about" element={<About />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/crear-subasta" element={authenticated ? <CrearSubasta /> : <Navigate to="/" />} />
              <Route path="/crear-producto" element={authenticated ? <CrearProducto /> : <Navigate to="/" />} />
              <Route path="/producto" element={authenticated ? <Producto /> : <Navigate to="/" />} />
              <Route path="/admin" element={authenticated ? <InterAdmin /> : <Navigate to="/" />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/inicio" element={authenticated ? <Navigate to="/home" /> : <Inicio />} />
            </Routes>
          </main>
        </div>
        {!shouldHideLayout && <Footer />}
      </div>
    );
  }

  useEffect(() => {
    initKeycloak()
      .then(auth => {
        setAuthenticated(auth);
        setInitialized(true);
      })
      .catch(err => {
        console.error('Keycloak init error:', err);
        setInitialized(true);
      });
  }, []);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
