import React, {useState} from 'react'
import Menu from '../components/menu'
import Input from '../components/input'
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from '../components/checkoutform'
import text from '../components/politicasLomitos'

const stripePromise = loadStripe("pk_test_51P2mMG057pUUcrQS23N5C5SUH4kOkFfdPoBrLwI3e2CsXZYNo00ynTi8f9TY34La94p4CQpkScoAPvxOr0xuEzr500vajxX1KE", {
  locale: 'es'
})
function Lomitos(props) {
  const [boletos, setBoletos] = useState([])
  const [boletosView, setBoletosView] = useState([])
  const [dataUser, setdataUser] = useState({})
  const [activeMetho, setactiveMetho] = useState(false)
  const [total, settotal] = useState(0)
  const [clientSecret, setclientSecret] = useState(undefined)
  const [idPaymentIntent, setidPaymentIntent] = useState(undefined)

  const premios = [
    {
      id:1,
      titulo: 'VIAJE A CANCUN',
      incluido: [
        'Vuelo Redondo para 2 personas',
        'Hospedaje Hotel Xcaret Mexico',
        '4 noches, 5 dias',
        'All-fun-inclusive'
      ],
      precio:300,
      ubicacion:'Cancun, Q.R.',
      imagen:'./assets/xcaret.webp'
    },
    {
      id:2,
      titulo: 'VIAJE A NUEVA YORK',
      incluido: [
        'Vuelo Redondo para 2 personas',
        'Hospedaje 4 noches',
        '4 Atracciones a visitar',
        'Transportación redonda aeropuerto/hotel/aeropuerto'
      ],
      precio:400,
      ubicacion:'New York, N.Y.',
      imagen:'./assets/newyork.jpg'
    },
    {
      id:3,
      titulo: 'VIAJE A PARIS',
      incluido: [
        'Vuelo Redondo para 2 personas ',
        'Hospedaje 4 noches',
        '4 Atracciones a visitar',
        'Transportación redonda aeropuerto/hotel/aeropuerto'
      ],
      precio:500,
      ubicacion:'Paris, FRA',
      imagen:'./assets/paris.webp'
    }
  ]

  const addTravel = (item) => {
    if (!boletos.find((boleto) => boleto.id === item.id)) {
      settotal(total + item.precio)
      setBoletosView(oldArray => [...oldArray, {...item, cantidad:1}])
      setBoletos(oldArray => [...oldArray, {...item, cantidad:1}])
    }
  }

  const handleCantidad = (viaje, type, index) => {
    const selectElement = boletos.find(boleto => boleto.id === viaje.id)
    let newArray = boletos.filter(boleto => boleto.id !== viaje.id)
    let newTotal = total
    if (type === 'mas') {
      newTotal = total + viaje.precio
      newArray.push({...viaje, cantidad: selectElement.cantidad + 1})
      setBoletos(newArray)
    } else {
      newTotal = total - viaje.precio
      if (selectElement.cantidad - 1 === 0) {
        setactiveMetho(false)
        setBoletos(newArray)
        setBoletosView(newArray)
      } else {
        newArray.push({...viaje, cantidad: selectElement.cantidad - 1})
        setBoletos(newArray)
      }
    }
    settotal(newTotal)
  }

  const handleInput = (name,value) => {
    setdataUser({...dataUser, [name]: value})
  }

  const formatPrice = (price) => {
    return `$${new Intl.NumberFormat('es-MX').format(price)}`
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (clientSecret === undefined) {
      fetch("https://cms.gstmtravel.com/api/lomito/paymentIntent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...dataUser, 
          total,
          boletos
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        setclientSecret(data?.clientSecret)
        setidPaymentIntent(data?.idPaymentIntent)
        setactiveMetho(!activeMetho)
      });
    } else {
      setactiveMetho(!activeMetho)
    }
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
    appearance,
  };
  

  return (
    <div>
      <Menu backgroundcolor={true}/>
        <section className='w-full h-screen bg-no-repeat bg-cover relative'>
        <div className="hero w-full">
          <div className="w-full absolute top left z-10 h-full">
            <div className="mx-auto max-w-7xl p-6 lg:px-8 h-full">
              <div className="w-100 md:w-1/2 h-full text-white flex justify-center flex-col">
                <h1 className="font-extrabold text-5xl">
                  <span className='text-base block text-[#ffd603]'>Rifa solidaria</span>
                    <span className=' text-white'>¡Gana un viaje a 3 destinos de <span className='text-[#ffd603]'>ensueño</span>!</span> 
                  <strong className="block font-extrabold text-3xl text-white"><span>Participa y apoya a la Fundación </span><img src="./assets/logo_lomitos.avif" alt=""  className='w-24'/></strong>
                </h1>
              </div>
            </div>
          </div>
          <img className='w-full h-screen object-cover hidden md:flex' src='./assets/dogs.jpg' alt="" />
          <img src="./assets/dogs-mobile.jpg" className='w-full h-screen object-cover md:hidden' alt="" />
        </div>
        <div className='w-full absolute bottom-0 left z-0 bg-gradient-to-t from-[#010417] from-0% min-h-full'></div>
      </section>
      <section>
        <div className="mx-auto max-w-7xl p-6 lg:px-8">
          <h3 className="font-extrabold text-3xl mb-5 text-white lg:text-5xl">¿Quién es <span className='text-[#b5115b]'>Lomito</span>?</h3>
          <div className='flex relative flex-col gap-10 md:flex-row items-center'>
            <div className='text-sm text-white md:w-2/3 flex flex-col gap-4'>
              <span><a className='text-[#b5115b] font-bold' href='https://lomito.mx/' target='_blank'>Lomito AC</a> es una asociación civil de rescate y rehabilitación animal. Su misión es rescatar, rehabilitar y fomentar la adopción de perros y gatos de forma responsable, tanto en México como en el extranjero</span>
              <span>
                Como una asociación sin fines de lucro, dependen totalmente de las donaciones. Por esta razón, en <strong>Destiny Travel</strong> queremos respaldar esta noble causa y, en colaboración, estaremos sorteando 3 viajes. Todo lo recaudado de la venta de boletos para esta rifa será destinado directamente a <a className='text-[#b5115b] font-bold' href='https://lomito.mx/' target='_blank'>Lomito AC</a>, cubriendo así los gastos de vacunación, esterilización, atención veterinaria y alimentación de los animales que reciben.
              </span>
            </div>
            <img src="./assets/asocicion.jpg" className='md:absolute md:right-20 md:-top-20 w-[80%] md:w-60 md:h-80 border-spacing-96 border p-2 border-white object-cover rounded-xl rotate-12 z-10' alt="" />
          </div>
        </div>
      </section>
      <section className='flex flex-col'>
        <div className="mx-auto max-w-7xl p-6 lg:px-8 flex flex-col w-full gap-3">
          <h3 className="font-extrabold text-3xl text-white lg:text-3xl md:w-1/2 w-full">¡Participa y gana un viaje con tu donación!</h3>
          <span className='text-sm text-white md:w-1/2 w-full'>
            Aprovecha la emoción al máximo! ¡Compra varios boletos por persona y aumenta tus posibilidades de ganar! No hay límites ni restricciones de compra, así que ¿por qué conformarse con una sola oportunidad cuando puedes tener varias? ¡Haz realidad tus sueños de viaje con cada boleto que adquieras! Además, por cada boleto comprado, estarás apoyando a un gatito y un perrito en su camino hacia un hogar amoroso. ¡Tu contribución hace la diferencia en sus vidas!
          </span>
        </div>
        <div className="mx-auto max-w-7xl p-6 lg:px-8 grid md:grid-cols-3 gap-3 w-full">
          {premios.map(item => {
            return (
            <div className="group relative overflow-hidden rounded-xl h-80 cursor-pointer" onClick={() => addTravel(item)}>
              <div className='h-full'>
                <img 
                  src={item.imagen}
                  alt="" 
                  className='object-cover h-full w-full'
                />
                <div className="bottom-0 left-0 absolute w-full h-full bg-gradient-to-t from-[#010417] from-0%"></div>
                <div className='p-2 text-white flex flex-col justify-end bottom-0 left-0 absolute h-full w-full'>
                  <h1 className='text-2xl font-bold'>{item.titulo}</h1>
                  <div className='text-xs flex flex-col gap-2'>
                    {item.incluido.map(iteminclu => <span><i className="fa-sharp fa-light fa-circle-check"></i> {iteminclu}</span>)}
                  </div>
                  <div className='w-full flex justify-between text-sm items-end'>
                    <span className='flex gap-1 items-center'>
                      <i className="fa-sharp fa-light fa-location-dot text-[#ffd603]"></i>
                      {item.ubicacion}
                    </span>
                    <div className='flex flex-col items-center'><p className='font-bold text-3xl text-[#ffd603]'>{formatPrice(item.precio)}</p><span className='text-xs'>MXN/Boleto</span></div>
                  </div>
                </div>
              </div>
            </div>
            )
          })}
        </div>
      </section>
      <section>
        <div className="mx-auto max-w-7xl p-6 lg:px-8 ">
          {
            boletosView.length > 0 ? 
            <div className='w-full flex flex-col md:flex-row gap-5'>
              <div className='md:w-1/2 w-full flex flex-col gap-3'>
                {boletosView?.map((viaje, index) => <div className='flex gap-5 text-white border-2 border-white p-2 rounded-lg'>
                  <img src={viaje.imagen} className='aspect-square object-cover w-36 rounded-lg' alt="" />
                  <div className='flex flex-col lg:grid lg:grid-cols-3 lg:items-center gap-5 justify-between py-3'>
                    <span className='text-xl font-bold '>{viaje.titulo}</span>
                    <div className='flex flex-col md:flex-row md:items-center items-start gap-1'>
                      <p className='font-bold text-3xl text-[#ffd603]'>{formatPrice(viaje.precio)}</p><span className='text-xs'>MXN/Boleto</span>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <h1 className='lg:text-center font-bold text-sm'>Cantidad:</h1>
                      <div className='text-white flex items-center gap-2 lg:items-center lg:justify-center'>
                        <div onClick={() => handleCantidad(viaje, 'menos')}><i className="fa-solid fa-horizontal-rule cursor-pointer"></i></div>
                        <div>{boletos.find(boleto => boleto.id === viaje.id)?.cantidad}</div>
                        <div onClick={() => handleCantidad(viaje, 'mas', index)}><i className="fa-solid fa-plus-large cursor-pointer"></i></div>
                      </div>
                    </div>
                  </div>
                </div>)}
              </div>
              <div className='w-full md:w-1/2 flex flex-col'>
                <div className='flex flex-col'>
                  <div className='flex flex-col text-white'>
                    {
                      boletos.length > 0 && boletos?.map(boleto => <div className='flex justify-between'><span>{boleto.cantidad}x {boleto.titulo}</span> <span>{formatPrice(boleto.precio * boleto.cantidad)}</span></div>)
                    }
                  </div>
                  <div className='flex justify-end text-white gap-1'><span className='font-bold text-[#ffd603]'>Total: </span> <span className='font-bold'>{formatPrice(total)}</span></div>
                </div>
                <div className={`flex flex-col gap-2 border-t-2 py-2 ${activeMetho && 'sectionInformacion'}`}>
                  <div className='flex justify-between'>
                    <h1 className='text-white text-lg font-bold'>Información del participante</h1>
                    <button onClick={() => setactiveMetho(false)} className={`text-white border-b-2 border-white ${!activeMetho && 'hidden'}`}>Editar</button>
                  </div>
                  <form onSubmit={(e) => handleSave(e)} className='seccionAnimation'>
                    <div className="flex flex-col">
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 p-2'>
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
                        <button type='submit' className='rounded-lg border p-2 w-full'>Guardar y Continuar</button>
                      </div>
                    </div>
                  </form>
                </div>
                <div  className={`flex flex-col gap-2 border-y-2 ${!activeMetho && 'sectionInformacion'}`} id='paymentMetho'>
                  <div className=' border-white py-2'>
                    <h1 className='text-white text-lg font-bold'>Formas de pago</h1>
                  </div>
                  <div className='seccionAnimation'>
                    <div className='text-white '>
                        {clientSecret && (
                          <Elements options={options} stripe={stripePromise}>
                            <CheckoutForm terminos={text} dataUpdate={{...dataUser,boletos,total,idPaymentIntent}}/>
                          </Elements>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            : <div className="w-full flex items-center justify-center border-dashed border-2 border-white p-2 rounded-lg min-h-32">
            <h1 className='font-extrabold text-2xl text-white'>
              <span>¡Elige un viaje y ayuda a un lomito!</span> <i className="fa-light fa-paw-simple text-[#ffd603] rotate-45"></i>
            </h1>
          </div>
          }

        </div>
      </section>
    </div>
  )
}

export default Lomitos
