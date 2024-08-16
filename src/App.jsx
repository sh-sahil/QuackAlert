import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Root from './pages/Root';
import  Chart  from './pages/Chart';
import ResponsePage from './pages/ResponsePage';
import Evacuation from './pages/Evacuation';
import Sos from './pages/Sos';
import DashBoard from './pages/DashBoard/DashBoard';
import User from './pages/DashBoard/User';
import ResponseTeam from './pages/DashBoard/ResponseTeam';
const router = createBrowserRouter([
  {
    path:'/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/chart',
        element: <Chart/>
      },
      {
        path: '/response',
        element:<ResponsePage/>
      },
      {
        path:'/evacuation',
        element:<Evacuation/>
      },
      {
        path:'/sos',
        element:<Sos/>
      },
      {
        path: '/dashboard',
        element: <DashBoard />,
        children: [ // Nested routes inside Dashboard
          {
            path: 'user',
            element: <User />
          },
          {
            path: 'response-team',
            element: <ResponseTeam />
          }
        ]
      }
      
      
    ]
  }
]);
const App = () => {
  return (
   <>
    <RouterProvider router={router} />
   </>
  )
}

export default App