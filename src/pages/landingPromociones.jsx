import React, { useState,useEffect } from 'react'
import Header from '../components/header'
import Menu from '../components/menu'
import FormRegister from '../components/formRegister'
import Footer from '../components/footer'
import { useParams } from 'react-router-dom';
import get_data from '../services/get_data'

const LandingPromociones = () => {
    const [data_codigo,setData_codigo] = useState();
    const [influencer,setInfluencer] = useState(false);
    const [loading,setLoading] = useState(true);
    const { slug } = useParams();
    useEffect(() => {

      const fetchData = async () => {
        try {
          const data = await get_data('https://cms.gstmtravel.com/api/discount-codes?populate=*');
          setData_codigo(data.data);
        } catch (error) {
          // Manejar errores si es necesario
        }
      };
      fetchData();
    }, [ ]);

    useEffect(() => {
        // Filtrar los datos por la categoría deseada
        if (data_codigo) {
          const datosFiltrados = data_codigo.filter(data => data.attributes.codigo === slug);
          if (datosFiltrados.length > 0) {
            setInfluencer(datosFiltrados);
          }
          setLoading(false);
        }else {
          setLoading(false);
        }

      }, [data_codigo, slug]);
    


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
              titulo={(slug && influencer) ?  `Hola,Soy <span class="text-[#ffd603]">${influencer[0].attributes.name }</span>` : 'Registrate y obeten'  }
              subtitulo={ (slug && influencer) ? 'te quiero regalar un 15% de descuento en tu primera compra' : `un 15% de descuento en tu primera compra` }
              fechas="PROMOCIONES 2024" 
              background='https://elviajerofeliz.com/wp-content/uploads/2018/06/Motivos-para-viajar.jpg'
              eventos={false}
              />
              <section className='w-100 flex flex-col justify-center items-center text-white -mt-40 relative z-40'>
              <FormRegister codigo={(slug && influencer) ? influencer[0].attributes.codigo : 'promo15' } imgPerfil={ (slug && influencer) ? influencer[0].attributes.img.data.attributes.formats.small.url : '' }/>
              </section> 
              <Footer/>
          </div>
          )
         }
            
        </>
    
  )
}

export default LandingPromociones