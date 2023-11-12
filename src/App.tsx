import { ThemeProvider } from '@mui/material/styles';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

/* Firebase */
import { initializeApp } from 'firebase/app';
import { getFirestore,collection } from "firebase/firestore";
//import { getAnalytics } from 'firebase/analytics';

/* Components */
import THEME from "./styles/Theme";
import Navbar from "../components/Navbar";
import LandingPage from "./routes/LandingPage";
import AboutPage from "./routes/AboutPage";
import LoginPage from './routes/LoginPage';
import SignupPage from './routes/SignUpPage';
import NavigationPage from "./routes/NavigationPage";
import AdminPage from "./routes/AdminPage";
import UploadPage from './routes/UploadPage';
import GoogleMapPage from "./routes/GoogleMapPage";
import Bin from "./routes/Bin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />
  },
  {
    path: "/about",
    element: <AboutPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/signup",
    element: <SignupPage />
  },
  {
    path: "/navigation",
    element: <NavigationPage />
  },
  {
    path: "/admin",
    element: <AdminPage />
  },
  {
    path: "/upload",
    element: <UploadPage />
  },
  {
    path: "/googlemap",
    element: <GoogleMapPage />
  },
  {
    path: "bin",
    element: <Bin />
  }
])

const firebaseConfig = {
  apiKey: "AIzaSyBjfk1paSIh6_hFoFvfAneRzThyrS6c8qY",
  authDomain: "group-poj.firebaseapp.com",
  projectId: "group-poj",
  storageBucket: "group-poj.appspot.com",
  messagingSenderId: "406227319415",
  appId: "1:406227319415:web:0248ebadab59ad2ebd6472",
  measurementId: "G-G3WM54BR6K"
}

const app = initializeApp(firebaseConfig);
export const userDbRef  = collection(getFirestore(app), 'users');
export const binDbRef = collection(getFirestore(app), 'bins');

//getAnalytics(app);

function App() {
  return ( 
    <ThemeProvider theme={THEME}>
      <Navbar />
      <div style={{ paddingLeft: '50px', paddingRight: '50px' }}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  )
}

export default App
