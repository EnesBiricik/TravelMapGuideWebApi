import { Router, RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';


const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        {path:"/", element:<Home/>},
        {path:"/ErrorPage", element:<ErrorPage />},
      ]
    }
  ])

function App() {

    return (
        <>
        <RouterProvider router={router}/>
      </>
    );
}

export default App;