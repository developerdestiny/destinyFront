import React from 'react'
import ProximosEventos from './proximosEventos'

const Header = ({ titulo,subtitulo,fechas,boton=false,background,eventos,url }) => {

  return (
    <section className='w-full h-screen bg-no-repeat bg-cover relative'>
      <div className="hero w-full">
        <div className="w-full absolute top left z-10 h-full">
          <div className="mx-auto max-w-7xl p-6 lg:px-8 h-full">
            <div className="w-100 md:w-1/2 h-full text-white flex justify-center flex-col">
              <h1 className="font-extrabold text-5xl">
                <span className='text-base block text-[#40caf4]'>{ fechas }</span>
                  <span dangerouslySetInnerHTML={{__html:titulo}}></span> 
                  <strong className="lg:block font-extrabold text-4xl" dangerouslySetInnerHTML={{__html:subtitulo}}></strong>
              </h1>
              { boton !== false &&     
              <a href={ url } className='bg-[#2d8ae8] lg:w-1/2 my-3 rounded p-3 text-center font-semibold text-xl'> { boton } </a>
              }
            </div>
          </div>
        </div>
        <img className='w-full h-screen object-cover' src={background} alt="" />
      </div>
      <div className='w-full absolute bottom-0 left z-0 bg-gradient-to-t from-[#010417] from-10% min-h-full'></div>
    </section>
  )
}

export default Header