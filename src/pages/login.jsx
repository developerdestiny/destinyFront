import React, {useState} from 'react'
import Menu from '../components/menu'
import Input from '../components/input'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

function Login(props) {

  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.auth.isLoading);
  const [error,setError] = useState(null);
  const user = useSelector(state => state.auth.usuario);
  const navigate = useNavigate();

  const [dataUser, setdataUser] = useState({
    identifier: '',
    password: ''
  });

  const handleInput = (name,value) => {
    setdataUser({...dataUser, [name]: value})
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    dataUser.username = dataUser?.email;
    await axios.post('https://cms.gstmtravel.com/api/auth/local/', dataUser)
    .then(response => {
      dispatch(loginSuccess({isLoading:false,usuario:response?.data?.user,activeLogin:true}));   
      navigate('/');
    }).catch(error => {
      setError('Usuario ó contraseña inválida');
    })
    
  };

  return (
    <div>
      <Menu/>
      <section className='w-full h-screen flex justify-center items-center p-6 lg:px-8'>
        <div className="md:w-1/2 border rounded text-white flex lg:flex-row mt-10">
          <div className='w-full p-5 md:w-1/2'>
            <form onSubmit={ handleSubmit } className='flex flex-col gap-5'>
              <span className='flex flex-col'>
                <h1 className='text-3xl font-bold'>Iniciar sesion</h1>
                <span className='text-sm font-semibold'>Accede a un sinfín de opciones de viaje con una sola cuenta</span>
              </span>
              <Input 
              nombre='identifier' 
              funcion={handleInput} 
              valor={dataUser?.identifier} 
              requerido={true} 
              placeHolder='Email' 
              type='email'
              />
              <Input 
              nombre='password' 
              funcion={handleInput} 
              valor={dataUser?.email} 
              requerido={true} 
              placeHolder='Password' 
              type='password'
              />
              {error && <p className=' text-red-600'>¡{error}!</p>}
            
              <div>
                <a href="" className='text-blue-500'>Olvidaste tu contraseña?</a>
              </div>
              <input type="submit" className='bg-[#2d8ae8] rounded p-3' value='Iniciar sesion'/>
            </form>
            <div className='flex mt-5 items-center gap-2'>
              <span className='text-blue-900 text-sm'>¿Aun no tienes cuenta?</span>
              <a href="/register" className='font-bold'>Registrate</a>
            </div>
          </div>
          <img src="../assets/traveler-login.png" className='hidden md:flex md:w-1/2 object-cover' alt="" />
        </div>
      </section>
    </div>
  )
}

export default Login
