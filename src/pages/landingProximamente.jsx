import React, { useState, useEffect } from 'react'
import Menu from '../components/menu'
import Footer from '../components/footer'
import Axios from 'axios'
import modelService from '../models/serviceModel'

function LandingProximamente(props) {
  const [data, setdata] = useState({})
  const [datados, setdatados] = useState({})
  const [email, setemail] = useState('')
  const [subscrito, setsubscrito] = useState(false)
  useEffect(() => {
    Axios.get(`https://cms.gstmtravel.com/api/filterServiceSearch/disneyland-paquete-familiar`)
    .then(response => {
      const data = new modelService(response?.data?.data[0])
      setdata(data)
    })
    .catch(err => {
      console.log(err)
    })
    Axios.get(`https://cms.gstmtravel.com/api/filterServiceSearch/paquete-disneyworld-familiar`)
    .then(response => {
      const data = new modelService(response?.data?.data[0])
      setdatados(data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])
  const handleNewslatter = (e) => {
    e.preventDefault()
    Axios.get(`https://cms.gstmtravel.com/api/pruebaEmail/${email}`)
    .then(response => {
      if (response?.data?.send === true) {
        setsubscrito(true)
      }
    })
  }
  return (
    <div>
        <Menu/>
        <section className='w-full h-screen bg-no-repeat bg-cover relative'>
          <div className="hero w-full">
            <div className="w-full absolute top left z-10 h-full">
              <div className="mx-auto max-w-7xl p-6 lg:px-8 h-full">
                <div className="w-100 md:w-1/2 h-full text-white flex justify-center flex-col">
                  <h1 className="font-extrabold text-3xl md:text-5xl">
                    <span className='text-base block text-[#40caf4]'>Una nueva forma de viajar</span>
                    Este 15 de abril ¡DESPEGAMOS!
                    <strong className="block font-extrabold text-lg py-2"> Nos estamos preparando con grandes sorpresas</strong>
                  </h1>
                  {!subscrito &&<form className='rounded-lg w-full bg-transparent text-white border p-1 flex flex-col md:flex-row' onSubmit={(e) => handleNewslatter(e)}>
                    <input type="email" required placeholder='Registra tu email' className='md:w-2/3 bg-transparent border-0 focus:outline-none focus:ring-0' onChange={(e) => setemail(e.target.value)}/>
                    <button className='md:w-1/3 bg-[#ffd603] rounded-lg p-1 font-bold'>Quiero mas aventuras</button>
                  </form>}
                  {subscrito && <h1 className="font-extrabold text-2xl md:text-2xl">
                    Gracias por subscribirte pronto viajaremos contigo
                  </h1>}
                </div>
              </div>
            </div>
            <img className='w-full h-screen object-cover' src='./assets/traveler-intrepido.jpg' alt="" />
          </div>
          <div className='w-full absolute bottom-0 left -z-0 bg-gradient-to-t from-[#010417] from-10% min-h-full'></div>
        </section>
        <section className='-mt-32'>
          <div className="mx-auto max-w-7xl p-6 lg:px-8 relative">
            <h1 className="font-extrabold text-3xl mb-5 text-white lg:text-4xl md:w-1/2">
              ¡Reserva Ahora, Viaja Después! Oferta Especial de <span className='text-[#ffd603]'>Lanzamiento</span>
            </h1>
            <div className='w-full relative'>
              <div className="absolute left-0 w-full md:w-1/3 z-20 h-full text-white flex flex-col justify-center p-3 gap-2">
                <h1 className='text-2xl font-bold'>{ data?.titulo }</h1>
                <div className='grid grid-cols-2 gap-2'>
                  {data?.incluye?.map(item => <span><i className="fa-light fa-circle-check"></i> {item.titulo}</span>)}
                </div>
                <div className='flex justify-between'>
                  <span className='flex gap-1 items-center'>
                    <i className="fa-sharp fa-light fa-location-dot text-[#ffd603]"></i>
                    { data?.ubicacion?.description }
                  </span>
                  <span className='flex gap-1 text-sm'>
                    desde<p className='font-bold'>${new Intl.NumberFormat('es-MX').format(data?.tarifaBaja?.precio)}<span className='text-xs'>{data?.moneda}</span></p>
                  </span>
                </div>
                <a href={`${window.location.href}${data?.type?.type}/${data?.url}`} className='bg-[#2d8ae8]  rounded p-3 w-full text-white flex justify-center font-bold'>
                    Reservá ahora
                </a> 
              </div>
              <img src={data?.portada} className='w-full object-cover h-96 rounded-lg' alt="" />
              <div className="bottom-0 left-0 absolute w-full h-full bg-gradient-to-r from-[#010417] from-0%"></div>
            </div>
            <div className='w-full relative mt-10'>
              <div className="absolute left-0 w-full md:w-1/3 z-20 h-full text-white flex flex-col justify-center p-3 gap-2">
                <h1 className='text-2xl font-bold'>{ datados?.titulo }</h1>
                <div className='grid grid-cols-2 gap-2'>
                  {datados?.incluye?.map(item => <span><i className="fa-light fa-circle-check"></i> {item.titulo}</span>)}
                </div>
                <div className='flex justify-between'>
                  <span className='flex gap-1 items-center'>
                    <i className="fa-sharp fa-light fa-location-dot text-[#ffd603]"></i>
                    { datados?.ubicacion?.description }
                  </span>
                  <span className='flex gap-1 text-sm'>
                    desde<p className='font-bold'>${new Intl.NumberFormat('es-MX').format(datados?.tarifaBaja?.precio)}<span className='text-xs'>{datados?.moneda}</span></p>
                  </span>
                </div>
                <a href={`${window.location.href}${datados?.type?.type}/${datados?.url}`} className='bg-[#2d8ae8]  rounded p-3 w-full text-white flex justify-center font-bold'>
                    Reservá ahora
                </a> 
              </div>
              <img src={datados?.portada} className='w-full object-cover h-96 rounded-lg' alt="" />
              <div className="bottom-0 left-0 absolute w-full h-full bg-gradient-to-r from-[#010417] from-0%"></div>
            </div>
          </div>
        </section>
        <Footer/>
    </div>
  )
}

export default LandingProximamente
