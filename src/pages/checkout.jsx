import React, { useState, useEffect } from 'react'
import { Navigate , useLocation, useParams  } from "react-router-dom";
import Menu from '../components/menu'
import Input from '../components/input'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from '../components/checkoutform'
import Axios from 'axios'
import modelService from '../models/serviceModel'
import Footer from '../components/footer'

const stripePromise = loadStripe("pk_test_51P2mMG057pUUcrQS23N5C5SUH4kOkFfdPoBrLwI3e2CsXZYNo00ynTi8f9TY34La94p4CQpkScoAPvxOr0xuEzr500vajxX1KE", {
  locale: 'es'
})

const Checkout = (props) => {
  const [showInfoUser, setshowInfoUser] = useState(true)
  const [FormasPago, setFormasPago] = useState(false)
  const [typePayment, settypePayment] = useState(1)
  const [dataUser, setdataUser] = useState({})
  const [params, setparams] = useState({})
  const [clientSecret, setClientSecret] = useState(undefined);
  const [data, setdata] = useState({})
  const [tarifaSelect, setTarifaSelect] = useState(undefined)
  const [currencyTotal, setcurrencyTotal] = useState(undefined)
  const [idPaymentIntent, setidPaymentIntent] = useState(undefined)
  const [financiamiento, setfinanciamiento] = useState(undefined)
  const [selectFinaciamiento, setselectFinaciamiento] = useState(undefined)
  const [desplieguePagos, setdesplieguePagos] = useState(undefined)
  const [avaliblePlants, setavaliblePlants] = useState([])
  let {search} = useLocation()
  let query = new URLSearchParams(search)

  useEffect(() => {
    setparams({
      url: query.get('url'),
      fecha_salida: query.get('fecha_salida'),
      fecha_llegada: query.get('fecha_llegada'),
      fecha_evento: query.get('fecha_evento'),
      tarifa: query.get('tarifa'),
    })
    Axios.get(`https://cms.gstmtravel.com/api/filterServiceSearch/${query.get('url')}`)
    .then(response => {
      const dataModel = new modelService(response?.data?.data[0])
      setTarifaSelect(dataModel?.tarifas?.find(tarifaItem => tarifaItem.id === parseInt(query.get('tarifa'))))
      setdata(dataModel)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])


  const handleSave = (e) => { 
    e.preventDefault()
    /*
    let tarifaSend = tarifaSelect?.titulo
    if (clientSecret === undefined) {
      fetch("https://cms.gstmtravel.com/api/paymentIntent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataUser, 
          paquete: {
            ...data, 
            total: tarifaSelect.precio,
            tarifaId: tarifaSelect.id,
            tarifa: tarifaSend.concat(' $', tarifaSelect.precio, data?.moneda), 
            estatus_pago: 'completo', 
            plataforma_pago: 'strapi',
            concepto: 'pago total',
            usuario:null,
            descuento: null,
            fecha_salida:params?.fecha_salida,
            fecha_llegada:params?.fecha_llegada,
            fecha_evento:params.fecha_evento,
            concepto_pago: 'pago total',
          }}),
      })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
        setavaliblePlants(data.available_plans)
        setcurrencyTotal(data.tarifa)
        setfinanciamiento(data?.tarifa?.financiamiento)
        setidPaymentIntent(data?.idPaymentIntent)
        setdesplieguePagos(data?.tarifa?.despliegue_cargos)
        setFormasPago(true)
        setshowInfoUser(false)
      });
    } else {
      setFormasPago(true)
      setshowInfoUser(false)
    }*/
  }
  
  const handleInput = (name,value) => {
    setdataUser({...dataUser, [name]: value})
  }

  const appearance = {
    theme: 'stripe',
    variables: {
      colorBackground: '#010417',
      colorText: '#ffff',
    }
  };
  const options = {
    clientSecret,
    avaliblePlants,
    appearance,
  };
  
  const handleInfo = () => {
    setshowInfoUser(true)
    setFormasPago(false)
  }

  const handleTypePayment = (type) => {
    settypePayment(type)
    if (type === 1) {
      setselectFinaciamiento(undefined)
      fetch("https://cms.gstmtravel.com/api/paymentIntentUpdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            idPaymentIntent: idPaymentIntent, 
            paquete: {
              ...data, 
              estatus_pago: type!==2 ? 'completo' : 'financiamiento', 
              total: tarifaSelect.precio, 
              tarifaId: tarifaSelect.id,
              concepto_pago: type!==2 ? 'pago total' : 'apartado',

            }
          }),
      })
      .then((res) => res.json())
      .then((data) => {
        setcurrencyTotal(data.tarifa)
      });
    }
  }

  const handleSelectFinanciamiento = (value) => {
    fetch("https://cms.gstmtravel.com/api/paymentIntentUpdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            idPaymentIntent: idPaymentIntent, 
            paquete: {
              ...data, 
              estatus_pago: 'financiamiento', 
              total: tarifaSelect.precio, 
              tarifaId: tarifaSelect.id,
              concepto_pago: 'apartado',
              cantidadPagos:value?.npagos,
              pagosRestantes: value?.npagos,
              valorDePago: value?.cantidadPago,
              restanteTotal: desplieguePagos?.restantePaqueteFinanciado,
            }
          }),
      })
      .then((res) => res.json())
      .then((data) => {
        setcurrencyTotal(data.tarifa)
        setselectFinaciamiento(value)
      });
  }
  
  const handleWhatsApp = (e) => {
    if (e) {
      e.preventDefault()
    }
    const text = `Hola quiero reservar mi paquete ${data.titulo} para el ${params?.fecha_salida} pero tengo algunas dudas, ¿Me podrían ayudar?`
    window.open(`https://wa.me/17022852381?text=${text.replace(/ /g, "%20")}`)
  }
  
  if (query.get('url') && query.get('tarifa') && query.get('fecha_salida') && query.get('fecha_llegada')) {
    return (
      <div>
        <Menu/>
        <section className='pt-20'>
          <div className='mx-auto max-w-7xl p-6 lg:px-8 flex flex-col relative'>
            <div className="header flex w-full justify-center">
              <h1 className='text-white text-center text-2xl'>Reserva</h1>
            </div>
            <button onClick={() => handleWhatsApp()} className="w-[90%] md:w-[15%] bg-[#ffd603] text-[#010417] fixed z-10 p-2 rounded-lg font-bold flex gap-2 items-center justify-center left-0 bottom-0 right-0 m-auto md:ml-16 mb-2">
              <i className="fa-brands fa-whatsapp text-xl"></i><span>¿Quiero reservar?</span>
            </button>
            <div className="flex flex-col md:flex-row-reverse gap-5 mt-10">
              <div className="md:w-2/3">
                <div className='w-full h-full relative md:min-h-screen'>
                  <div className="w-full absolute bottom-0 left-0 z-10 flex flex-col md:flex-row gap-1 text-white p-2">
                    <div className='md:w-1/2'>
                      <span className='font-bold text-[#ffd603]'>Tu proximo viaje:</span>
                      <h1 className='text-lg font-semibold'>{data?.titulo}</h1>
                      <div className='flex flex-col'><span>{tarifaSelect && tarifaSelect.titulo}</span> 
                      <div><i className="fa-sharp fa-light fa-plane-departure text-sm text-[#ffd603]"></i> {params?.fecha_salida} | <i className="fa-light fa-plane-arrival text-sm text-[#ffd603]"></i> {params?.fecha_llegada} | {params?.fecha_evento !== 'undefined' && <span><i className="fa-sharp fa-light fa-plane-departure text-2xl text-[#ffd603]"></i> {params?.fecha_evento}</span>}</div>
                      </div>
                    </div>
                    <div className="md:w-1/2 flex md:justify-end text-sm font-bold flex-col gap-3">
                      {
                        (typePayment !== 1 && desplieguePagos) && <div className='flex flex-col gap-2'>
                          <div>Valor total del paquete: ${new Intl.NumberFormat('es-MX').format(tarifaSelect?.precio)}</div>
                          <div>+ Comision de financiamiento: ${new Intl.NumberFormat('es-MX').format(desplieguePagos?.porcentajeFinanciamiento)}</div>
                          <div>+ Comision de pago plataforma: ${new Intl.NumberFormat('es-MX').format(desplieguePagos?.comicionTarjeta)}</div>
                          <div>- Pago inicial: ${new Intl.NumberFormat('es-MX').format(currencyTotal?.total)}</div>
                          <div className='border-t'>Valor a financiar:  ${new Intl.NumberFormat('es-MX').format(desplieguePagos?.restantePaqueteFinanciado)}</div>
                        </div>
                      }
                      {
                        typePayment === 1 ? <div className='flex justify-end flex-col '>
                            <span>Subtotal: ${currencyTotal ? currencyTotal && `${new Intl.NumberFormat('es-MX').format(currencyTotal?.total)} ${currencyTotal?.moneda}` : tarifaSelect &&`${new Intl.NumberFormat('es-MX').format(tarifaSelect.precio)} ${data?.moneda}`}</span>
                            <span className='pt-2 border-t-2'>Total a pagar:  ${ currencyTotal ? new Intl.NumberFormat('es-MX').format(currencyTotal?.total) : new Intl.NumberFormat('es-MX').format(tarifaSelect?.precio)} {data?.moneda} </span>
                          </div>
                        : <div className='border rounded-lg p-2'>
                            <span>Aparta con tan solo: ${new Intl.NumberFormat('es-MX').format(currencyTotal.total)} {currencyTotal?.moneda}</span>
                          </div>
                      }
                    </div>
                  </div>
                  <img src={data?.portada} alt={data?.url} className='w-full h-full object-cover rounded-lg' />
                  <div className='w-full absolute bottom-0 left z-0 bg-gradient-to-t from-[#010417] from-10% min-h-full'></div>
                </div>
              </div>
              <div className="md:w-1/3 flex flex-col">
                <div className="flex flex-col border-b py-4">
                  <div className='flex justify-between'><h1 className='text-white text-xl'>Información del viajero</h1> {!showInfoUser && <button className='rounded-lg border p-2 text-white' onClick={() => handleInfo(true)}>Editar</button>}</div>
                  {showInfoUser &&<form onSubmit={(e)=>handleWhatsApp(e)}>
                    <div className='grid grid-cols-1 mt-5 gap-5'>
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
                        placeHolder='Apellidos' 
                        type='text'
                      />
                      <Input 
                        nombre='correo' 
                        funcion={handleInput} 
                        valor={dataUser?.correo} 
                        requerido={true} 
                        placeHolder='Email' 
                        type='email'
                      />
                      <Input 
                        nombre='telefono' 
                        funcion={handleInput} 
                        valor={dataUser?.telefono} 
                        requerido={true} 
                        placeHolder='Telefono' 
                        type='phone'
                      />
                    </div>
                    <div className="w-full flex justify-end mt-5 text-white">
                      <button type='submit' className='rounded-lg border p-2 w-full lg:w-2/3'>Guardar y Continuar</button>
                    </div>
                  </form>}
                  {!showInfoUser && <div className='flex flex-col gap-1 text-white'>
                    <span><strong>Nombre:</strong> {dataUser?.nombre} {dataUser?.apellido}</span>
                    <span><strong>Email:</strong> {dataUser?.correo}</span>
                    <span><strong>Telefono:</strong> {dataUser?.telefono}</span>
                  </div>}
                </div>
                {<div className="flex flex-col border-b py-4">
                  <h1 className='text-white text-xl'>Formas de pago</h1>
                  {FormasPago && <div>
                    <div className='grid grid-cols-1 mt-5 gap-5'>
                      <div  className={`${typePayment === 1 ? 'border-[3px]' : 'border'} ease-out duration-400 rounded-lg text-white text-left flex flex-col`} >
                        <button className='w-full p-4 text-left' onClick={() => handleTypePayment(1)}><i className="fa-light fa-credit-card"></i> Una sola Exhibición</button>
                        {typePayment === 1 && <div className='w-full flex items-center justify-center pb-4 px-2'>
                          {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                              <CheckoutForm terminos={data?.politicas}/>
                            </Elements>
                          )}
                        </div>}
                      </div>
                      {financiamiento && <div  className={`${typePayment === 2 ? 'border-[3px]' : 'border'} ease-out duration-400 rounded-lg text-white text-left flex flex-col`} >
                        <button className='w-full px-4 py-2 text-left' onClick={() => handleTypePayment(2)}><i className="fa-light fa-credit-card"></i> Plan de Pagos - <span className='font-bold text-[#ffd603]'>Pago inicial de ${data.minimo_apartado} MXN</span></button>
                        {(financiamiento && typePayment ===2) && <div className='w-full flex flex-col px-4 pb-2'>
                          <span>Planes de financiamento</span>
                          <div className='flex gap-3'>{financiamiento?.map(promotion => <label className='font-semibold w-1/3'><input type="radio" name='promotion' value={promotion} onChange={() => handleSelectFinanciamiento(promotion)}/> {promotion.titulo}</label>)}</div>
                        </div>}
                        { (selectFinaciamiento && typePayment === 2) && 
                          <div className='flex flex-col gap-2 w-full px-4 pb-2'>
                            <span className='rounded-lg p-2 bg-[#2d8ae8] font-semibold text-center'>
                              {selectFinaciamiento?.npagos} de pagos mensuales de ${new Intl.NumberFormat('es-MX').format(selectFinaciamiento?.cantidadPago)} {currencyTotal?.moneda}
                            </span>
                            <span className='text-sm text-center text-[#5f91c4] font-semibold'>*Los pagos se realizan cada primero de mes*</span>
                          </div>
                        }
                        
                        {(typePayment === 2 && selectFinaciamiento)&&<div className='w-full flex items-center justify-center pb-4 px-2'>
                          {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                              <CheckoutForm terminos={data?.politicas} />
                            </Elements>
                          )}
                        </div>}
                      </div>}
                    </div>
                  </div>}
                </div>}
              </div>
            </div>
          </div>
        </section>
        <Footer/> 
      </div>
    )
  } else {
    return <Navigate replace to="/" />
  }

}

export default Checkout
