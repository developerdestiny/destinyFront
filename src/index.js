import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './home';
import Landing from './pages/landing';
import Checkout from './pages/checkout'
import CheckoutSucess from './pages/checkoutSucess'
import Login from './pages/login'
import Register from './pages/register'
import Lomitos from './pages/lomitos'
import { HelmetProvider } from 'react-helmet-async';
import LandingPromociones from './pages/landingPromociones';
import LandingDescuento from './pages/landingDescuento';
import Profile from './pages/profile';
import { Provider } from 'react-redux';
import { store, persistore } from './redux/store'; // Importa el store y el persistor de Redux Persist
import { PersistGate } from 'redux-persist/integration/react';
import Auth from './components/auth';
import LandingBali from './pages/landingBali';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
        <Provider store={store}>
        <PersistGate persistor={persistore}> 
          <BrowserRouter>
            <Routes>
              <Route path={ "/" }  element={ <Home/> }/>
              <Route path={ "/apoyemos-a-lomitos" }  element={ <Lomitos/>}/>
              <Route path={ "/checkout" }  element={ <Checkout/> }/>
              <Route path={ "/checkout/sucess" }  element={ <CheckoutSucess /> }/> 
              <Route path={ "/promocion-de-descuento-2024" }  element={ <LandingPromociones/> }/>
              <Route path={ "/promocion-de-descuento-2024/:slug" }  element={ <LandingPromociones/>}/>
              <Route path={ "/descuento-participante/:slug" }  element={ <LandingDescuento/>}/>
              <Route path={ "/gana-un-viaje-a-bali" }  element={ <LandingBali/> }/>
              <Route path={ "/conciertos" }  element={ <Landing/>}/>
              <Route path={ "/conciertos/:url" }  element={ <Landing/>}/>
              <Route path={ "/hoteles" }  element={ <Landing/>}/>
              <Route path={ "/hoteles/:url" }  element={ <Landing/>}/>
              <Route path={ "/tours" }  element={ <Landing/>}/>
              <Route path={ "/tours/:url" }  element={ <Landing/>}/>
              <Route path={ "/login" }  element={ <Login/>}/>
              <Route path={ "/register" }  element={ <Register/>}/>
              <Route path={ "/mi-perfil" }  element={<Auth> <Profile/> </Auth>}/>
            </Routes>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
