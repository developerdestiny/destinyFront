import React, {useState} from 'react'
import Menu from '../components/menu'
import Input from '../components/input'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import axios from 'axios'


function Register(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(true);
  const [dataUser, setdataUser] = useState({
    username: '',
    email: '',
    password: '',
    nombre: '',
    telefono: '',
    compania: 'destiny',
    info_user: {
      descuentos: [
        {
          codigo: null,
          fecha_activado: null,
          fecha_uso: null
        }
      ],
      newsletter:isChecked,

    }
  });

  const handleInput = (name,value) => {
    setdataUser({...dataUser, [name]: value})
  }

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dataUser.username = dataUser.email;
    try {
      const respuesta = await axios.post('https://cms.gstmtravel.com/api/auth/local/register', dataUser);
      if (respuesta.data.jwt) {
      dispatch(loginSuccess({isLoading:false,usuario:respuesta?.data?.user,activeLogin:true}));  
        navigate('/');
      }       
      // Manejar la respuesta del servidor, redirigir, etc.
    } catch (error) {
      // Manejar el error, mostrar un mensaje al usuario, etc.

    }
  };

  return (
    <div>
      <Menu/>
      <section className='w-full min-h-screen flex justify-center items-center p-6 lg:px-8'>
        <div className="md:w-1/2 border rounded text-white flex lg:flex-row mt-20">
          <div className='w-full p-5 md:w-1/2'>
            <form onSubmit={ handleSubmit } className='flex flex-col gap-5'>
              <span className='flex flex-col'>
                <h1 className='text-3xl font-bold'>Registrate</h1>
                <span className='text-sm font-semibold'>Descubre una nueva manera de viajar</span>
              </span>
              <Input 
              nombre='nombre' 
              funcion={handleInput} 
              valor={dataUser?.nombre} 
              requerido={true} 
              placeHolder='Nombre' 
              type='text'
              />
              <Input 
              nombre='apellido' 
              funcion={handleInput} 
              valor={dataUser?.apellido} 
              requerido={true} 
              placeHolder='Apellido' 
              type='text'
              />
              <Input 
              nombre='telefono' 
              funcion={handleInput} 
              valor={dataUser?.telefono} 
              requerido={true} 
              placeHolder='Telefono' 
              type='text'
              />
              <Input 
              nombre='email' 
              funcion={handleInput} 
              valor={dataUser?.email} 
              requerido={true} 
              placeHolder='Email' 
              type='email'
              />
              <Input 
              nombre='password' 
              funcion={handleInput} 
              valor={dataUser?.password} 
              requerido={true} 
              placeHolder='Password' 
              type='password'
              />
              <div><input type="checkbox" id="subscribeNews" name="subscribe" value="newsletter" checked={isChecked} onChange={handleToggle} /> <span>Quiero recibir noticias y descuentos futuros</span></div>
              <button className='bg-[#2d8ae8] rounded p-3'>Registrarse</button>
            </form>
          </div>
          <img src="../assets/traveler-register.png" className='hidden md:flex md:w-1/2 object-cover' alt="" />
        </div>
      </section>
    </div>
  )
}

export default Register
