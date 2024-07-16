import React, { useState,useEffect } from 'react'
import Header from '../components/header'
import Menu from '../components/menu'
import FormRegister from '../components/formRegister'
import Footer from '../components/footer'
import { useParams } from 'react-router-dom';
import get_data from '../services/get_data'

const LandingPromociones = () => {
    const [data_codigo,setData_codigo] = useState(false);
    const [loading,setLoading] = useState(true);
    const { slug } = useParams();
    useEffect(() => {

      const fetchData = async () => {
        try {
          const data = await get_data(`https://cms.gstmtravel.com/api/discount-codes?filters[codigo][$eq]=${slug}&populate=*`);
          setData_codigo(data?.data[0]);
          setTimeout(() => {
            setLoading(false)
          }, 1000);
        } catch (error) {
          // Manejar errores si es necesario
        }
      };
      fetchData();
    }, [ ]);


  return (
        <>
        {
          loading ? 
          (
            <div className='fixed top-0 left-0 z-[60] w-full h-screen bg-[#010417] flex items-center justify-center'>
            <div className="circles">
              <div id="counter" className="main-circle"></div>
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="circle circle-3"></div>
            </div>
            <div className="absolute w-full h-screen degrad-circle"></div>
          </div>
          ) 
          : 
          (
          <div>
              <Menu/>
              <Header 
              titulo={data_codigo?  `<span class='text-3xl md:text-4xl'>Hola! ${data_codigo?.attributes?.name}.</span><span class="block text-xl">Gracias por participar en #ViveLaExperienciaDestiny</span>` : 'Registrate y obeten'  }
              subtitulo={ data_codigo ? '<span class="text-sm block mt-2 font-medium">Tu esfuerzo no pasa desapercibido para nosotros. Como muestra de agradecimiento, te damos un 15% de descuento en tu primera compra al registrarte. Esperamos que este pequeño gesto te haga sentir lo importante que eres para nosotros.</span>' : `un 15% de descuento en tu primera compra` }
              fechas="VIAJA A BALI 2024" 
              background='https://elviajerofeliz.com/wp-content/uploads/2018/06/Motivos-para-viajar.jpg'
              eventos={false}
              />
              <section className='w-100 flex flex-col justify-center items-center text-white -mt-40 relative z-40'>
              <FormRegister codigo={data_codigo ? data_codigo?.attributes?.codigo : 'promo15' } imgPerfil=''/>
              </section> 
              <Footer/>
          </div>
          )
         }
            
        </>
    
  )
}

export default LandingPromociones