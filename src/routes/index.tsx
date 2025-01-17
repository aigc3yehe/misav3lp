import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import LandingPage from '../pages/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]); 