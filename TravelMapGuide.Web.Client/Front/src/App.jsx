import { Router, RouterProvider, createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import RootLayout from './components/layout/RootLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './assets/styles/App.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/ErrorPage", element: <ErrorPage /> },
      { path: '/Login', element: <Login /> },
      { path: '/Signup', element: <Signup /> }
    ]
  }
])

function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
