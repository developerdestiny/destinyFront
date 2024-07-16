import React,{useState} from 'react'
import Input from './input'
import moment from 'moment';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';

const FormRegister = ({ img,imgPerfil,codigo }) => {
    const dispatch = useDispatch();
    const [isChecked, setIsChecked] = useState(true);
    const navigate = useNavigate();
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
              codigo: codigo,
              fecha_activado: moment().format('YYYY-MM-DD'),
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
    <div className={ `${ img ? 'md:w-1/2': ' md:w-1/4 '}border rounded text-white flex lg:flex-row` }>
    <div className={`w-full p-5 relative ${ img && 'md:w-1/2'}`}>
     <span className='flex flex-col mb-5'>
        <h1 className='text-3xl font-bold'>Registrate</h1>
        <span className='text-sm font-semibold'>Descubre una nueva manera de viajar</span>
    </span>
    { imgPerfil ? <div className=' absolute bg-red-500 rounded-full top-1 right-1 overflow-hidden lg:-top-6 -right-6'><img className=' h-20 w-20 object-cover rounded-full' src={ imgPerfil } alt="" /></div> : '' }
      <form onSubmit={ handleSubmit } className='flex flex-col gap-5'>

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
        { 
        codigo  && 
            <Input 
            nombre='codigo_descuento' 
            funcion={handleInput} 
            valor={ codigo ? codigo : dataUser?.info_user.descuentos[0].codigo} 
            requerido={true} 
            placeHolder='Codigo de descuento' 
            type='text'
            /> 
         }
        <div><input type="checkbox" id="subscribeNews" name="subscribe" value="newsletter" checked={isChecked} onChange={handleToggle} /> <span>Quiero recibir noticias y descuentos futuros</span> </div>
        <button type="submit" className='bg-[#2d8ae8] rounded p-3' >Registrarse</button>
      </form>
    </div>
   {img ? <img src={ img } className='hidden md:flex md:w-1/2 object-cover' alt="" /> : '' } 
  </div>
  )
}

export default FormRegister