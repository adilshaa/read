import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, ClerkLoading } from '@clerk/clerk-react';
import Header from './components/Header'; // Assuming Header.jsx is in components folder
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import './App.css'; // Assuming you might have some global styles here, or remove if not needed.

// Clerk's default sign-in and sign-up pages need specific routes
// These components will render Clerk's hosted pages or modals
import { SignIn, SignUp } from "@clerk/clerk-react";

function App() {
  return (
    <>
      {/* <Header /> */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/sign-in/*"
            element={<SignIn routing="path" path="/sign-in" />}
          />
          <Route
            path="/sign-up/*"
            element={<SignUp routing="path" path="/sign-up" />}
          />
          <Route
            path="/admin"
            element={
              <>
                <SignedIn>
                  <AdminPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
