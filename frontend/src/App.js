import React from 'react';
// react-router-dom@5
// import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
// react-router-dom@6
import {
  BrowserRouter,
  // createBrowserRouter,
  // RouterProvider,
  Routes,
  Route,
} from 'react-router-dom';

import Users from './users/containers/Users';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';

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
  return (
    <React.StrictMode>
      <BrowserRouter>
        <MainNavigation />
        <main>
          {/* <RouterProvider router={router} /> */}
          <Routes>
            <Route path="/" exact="true" element={<Users />} />
            <Route path="/:userId/places" element={<UserPlaces />} />
            <Route path="/places/new" element={<NewPlace />} />
            <Route path="/places/:placeId" element={<UpdatePlace />} />
          </Routes>
        </main>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
