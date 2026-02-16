import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { SidebarLayout } from './layouts/SidebarLayout';
// import { LoginPage } from './features/auth/LoginPage';
// import { QuizList } from './features/quizzes/QuizList';
// import { SessionList } from './features/sessions/SessionList';

const router = createBrowserRouter([
  {
    path: '/login',
    // element: <LoginPage />,
  },
  {
    path: '/',
    element: <SidebarLayout />, // The "Shell"
    children: [
      {
        index: true,
        element: <Navigate to="/quizzes" replace />, // Default route
      },
      {
        path: 'quizzes',
        // element: <QuizList />,
      },
      {
        path: 'sessions',
        // element: <SessionList />,
      },
      // You will add /gameplay/:id here later
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}