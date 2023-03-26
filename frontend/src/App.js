import React, { useCallback, useState } from 'react';
// react-router-dom@5
// import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
// react-router-dom@6
import {
  BrowserRouter,
  // createBrowserRouter,
  // RouterProvider,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Users from './users/containers/Users';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Auth from './users/containers/Auth';
import { AuthContext } from './shared/context/auth-context';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <Users />,
//   },
//   {
//     path: '/places/new',
//     element: <NewPlace />,
//   },
// ]);

const App = () => {
  // Auth context
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
  }, []);

  let routes = {};

  if (isLoggedIn) {
    routes = (
      <Routes>
        <Route path="/" exact="true" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:placeId" element={<UpdatePlace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* To keep the history clean, you should set replace prop. 
        This will avoid extra redirects after the user click back. */}
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" exact="true" element={<Users />} />
        <Route path="/:userId/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          {/* <RouterProvider router={router} /> */}
          {routes}
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
