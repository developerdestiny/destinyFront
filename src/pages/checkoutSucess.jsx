import React, {useState, useEffect} from 'react'
import { useLocation, Navigate  } from 'react-router-dom'
import Axios from 'axios'
import Menu from '../components/menu'

function CheckoutSucess(props) {
  const [dataPayment, setdataPayment] = useState(null);
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  console.log(query)
  useEffect(() => {
    Axios.get(`https://cms.gstmtravel.com/api/paymentRetrive/${query.get('payment_intent')}`)
    .then(response => {
      setdataPayment(response.data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  if (query.get('payment_intent')) {
    if (dataPayment?.paymentRetrive?.status === 'succeeded') {
      return (
        <div>
          <Menu />
          <div className='w-full h-screen flex justify-center items-center text-white p-3'>
            <div className='w-full md:w-1/3 text-center p-1 flex flex-col gap-4'>
              <i className="fa-light fa-plane-departure text-[#ffd603] text-5xl"></i>
              <h1 className='text-4xl font-bold uppercase'>Buen Viaje {dataPayment?.paymentRetrive?.metadata?.nombre}</h1>
              <h3 className='text-lg font-semibold'>Tu pago fue exitoso</h3>
              <span className='text-sm'>Pronto recibirás un correo electrónico con tu número de reserva. Además, un miembro experto de nuestro equipo se pondrá en contacto contigo dentro de las proximas 24H para brindarte asistencia personalizada.</span>
            </div>
          </div>
        </div>
      )
    } else {
      return (<div>Tenemos problemas al procesar tu pago</div>)
    }
  } else {
    return <Navigate replace to="/" />
  }
  
}

export default CheckoutSucess
