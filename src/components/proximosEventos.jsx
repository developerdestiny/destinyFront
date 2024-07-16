import React, {useEffect, useState} from 'react'
import Slider from "react-slick";
import axios from 'axios'

const ProximosEventos = () => {
  const [dataPaquetes, setdataPaquetes] = useState([])
  useEffect(() => {
    axios.get('https://cms.gstmtravel.com/api/servicios-destinies?populate=*')
    .then(response => {
      setdataPaquetes(response?.data?.data)
    })
  }, [])
  
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4
  };

  const handleEvent = (type) => {
    if (type === 'tipos-servicios.concierto') {
      return 'conciertos'
    }
    else if (type === 'tipos-servicios.tour') {
      return 'tours'
    }else if (type === 'tipos-servicios.hotel') {
      return 'hoteles'
    }
  }

  return (
    <div className="w-full static md:absolute md:z-10 md:-bottom-28 text-white">
    <div className="mx-auto max-w-7xl p-6">
      <h1 className="font-extrabold text-5xl mb-5 text-white lg:text-6xl">
        Lo mas <span className='text-[#ffd603]'>nuevo</span>
      </h1>
      <div className="events w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        {(dataPaquetes && dataPaquetes.length > 0) && dataPaquetes?.map((paquete,index) => {
          if (index < 4) {
            return (
              <a className="group relative overflow-hidden rounded-xl h-80" href={`${window.location.href}${handleEvent(paquete?.attributes.tipos_servicio[0]?.__component)}/${paquete?.attributes?.url}`}>
              <img 
                src={ paquete?.attributes?.portada?.data?.attributes?.url }
                alt="" 
                className='object-cover h-full w-full'
              />
              <div className="bottom-0 left-0 absolute w-full h-2/3 bg-gradient-to-t from-[#010417] from-0%"></div>
              <div className='p-2 text-white flex flex-col justify-end bottom-0 left-0 absolute h-full w-full'>
                <h1 className='text-2xl font-bold'>{ paquete?.attributes?.titulo }</h1>
                <div className='w-full flex justify-between text-sm'>
                </div>
              </div>
            </a>
            )
          }
        })}
      </div>
    </div>
  </div>
  )
}

export default ProximosEventos