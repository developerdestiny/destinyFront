import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import modelServices from '../models/servicesModel'

function SectionType({type, title, clase}) {
  const [tickets, settickets] = useState([])
  useEffect(() => {
    Axios.get(`https://cms.gstmtravel.com/api/filterService/${type}`)
    .then(response => {
      const tickets = new modelServices(response?.data)
      settickets(tickets)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  const handleType = (type) => {
    switch (type) {
      case 'tour':
        return 'tours'
      case 'hotel':
        return 'hoteles'
      case 'concierto':
        return 'conciertos'
      default:
        return '';
    }
  }

  if (tickets?.servicios?.length > 0) {
    return (
      <section className={clase}>
        <div className="mx-auto max-w-7xl p-6 lg:px-8">
          <h1 className="font-extrabold text-5xl mb-5 text-white lg:text-6xl" dangerouslySetInnerHTML={{__html: title}}>
          </h1>
          <div className="gallery-tickets">
            <div className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 w-full">
              {tickets?.servicios?.map((item, index) => {
                if (index < 4) {
                  return(
                    <a className="group relative overflow-hidden rounded-xl h-80" href={`${window.location.href}${item?.type?.type}/${item?.url}`}>
                      <img 
                        src={ item?.portada }
                        alt="" 
                        className='object-cover h-full w-full'
                      />
                      <div className="bottom-0 left-0 absolute w-full h-2/3 bg-gradient-to-t from-[#010417] from-0%"></div>
                      <div className='p-2 text-white flex flex-col justify-end bottom-0 left-0 absolute h-full w-full'>
                        <h1 className='text-2xl font-bold'>{ item?.titulo }</h1>
                        <div className='w-full flex justify-between text-sm'>
                          <span className='flex gap-1 items-center'>
                            <i className="fa-sharp fa-light fa-location-dot text-[#ffd603]"></i>
                            { item?.ubicacion?.locality }
                          </span>
                          <span className='flex gap-1 text-sm'>
                            desde<p className='font-bold'>${new Intl.NumberFormat('es-MX').format(item?.tarifaBaja?.precio)}<span className='text-xs'>{item?.moneda}</span></p>
                          </span>
                        </div>
                      </div>
                    </a>
                  )
                }
              }
              )}
            </div>
            <div className='flex items-end justify-end text-[#ffd603] mt-2'>
              <a href={`/${handleType(type)}`}>Ver más</a>
            </div>
          </div>
        </div>
      </section>
    )
  }
}


export default SectionType
