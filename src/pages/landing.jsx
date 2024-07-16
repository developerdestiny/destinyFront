import React, {useEffect,useState} from 'react'
import Menu from '../components/menu';
import Footer from '../components/footer'
import moment from 'moment'
import Axios from 'axios'
import modelService from '../models/serviceModel'
import { useParams, useLocation } from 'react-router-dom'
import { Link } from "react-router-dom";
import Seo from '../components/seo'
import modelServices from '../models/servicesModel'

const Landing = () => {
  const [loading, setloading] = useState(true)
  const [ShowMore, setShowMore] = useState(false)
  const [ShowMorePoliticas, setShowMorePoliticas] = useState(false)
  const [data, setdata] = useState({})
  const { url } = useParams();
  let location  = useLocation()
  const [dataOtherLanding, setdataOtherLanding] = useState([])

  moment.locale ('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
  })
  useEffect(() => {
    if (url) {
      Axios.get(`https://cms.gstmtravel.com/api/filterServiceSearch/${url}`)
    .then(response => {
      const data = new modelService(response?.data?.data[0])
      setdata(data)
      setloading(false)
    })
    .catch(err => {
      console.log(err)
    })
    } else {
      const type = handleType(location.pathname)
      Axios.get(`https://cms.gstmtravel.com/api/filterService/${type}`)
      .then(response => {
        const data = new modelServices(response?.data)
        console.log(data)
        setdataOtherLanding(data)
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [])

  const renderizarConSaltosDeLinea = (texto) => {
    return texto?.split('\n')?.map((linea, index) => {
      return <React.Fragment key={index}>{linea}<br /></React.Fragment>;
    });
  };

  const validationUnidad = (type) => {
    return type === 'dias' ? 'days' : 'hours'
  }

  const handleOptionSelectDate = (index, option) => {
    let newArray = data?.tarifas;
    newArray[index].optionSelect = (data?.tarifas[index]?.fechas || data?.tarifas[index]?.Fechas) ? data?.tarifas[index]?.fechas?.find(item => item.fecha_evento === option) : {fecha_inicio: option, fecha_fin:moment(option).add(data?.duracion?.cantidad - 1,validationUnidad(data?.duracion?.unidad)).format('YYYY-MM-DD')}
    setdata({...data, tarifas: newArray})
  }

  const handleTypePlural = (type) => {
    switch (type) {
      case '/tours':
        return 'tours'
      case '/hoteles':
        return 'hoteles'
      case '/conciertos':
        return 'conciertos'
      default:
        return '';
    }
  }
  
  const allpaquetesView = () => {
    if (dataOtherLanding?.servicios?.length > 0) {
      return <div>
       <Menu/>
        <section className='w-full h-screen bg-no-repeat bg-cover relative'>
          <div className="hero w-full">
            <div className="w-full absolute top left z-10 h-full">
              <div className="mx-auto max-w-7xl p-6 lg:px-8 h-full">
                <div className="w-full h-full text-white flex items-center justify-center">
                  <h1 className="font-extrabold text-5xl flex gap-2 text-center">
                    <span>Todos Nuestros <span className='text-[#ffd603]'>{handleTypePlural(location.pathname)}</span></span>
                  </h1>
                </div>
              </div>
            </div>
            <img className='w-full h-screen object-cover' src={dataOtherLanding?.servicios[0]?.portada} alt="" />
          </div>
          <div className='w-full absolute bottom-0 left z-0 bg-gradient-to-t from-[#010417] from-10% min-h-full'></div>
          <div className="mx-auto max-w-7xl p-6 lg:px-8 -mt-60 relative z-30">
            <div className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 w-full h-full">
              {dataOtherLanding?.servicios?.map((item, index) => {
                return (
                  <a className="group relative overflow-hidden rounded-xl h-80" href={`/${item?.type?.type}/${item?.url}`}>
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
              )}
            </div>
          </div>
        </section>
      </div>
    } 
  }

  const handleType = (type) => {
    switch (type) {
      case '/tours':
        return 'tour'
      case '/hoteles':
        return 'hotel'
      case '/conciertos':
        return 'concierto'
      default:
        return '';
    }
  }

  if (url) {
    return (
      <div>
          <Seo
          title={`Destiny Travel | ${data?.titulo}`}
          description={data?.descripcion}
          name={data?.titulo}
          type='website'
        />
        { loading && <div className='fixed top-0 left-0 z-[60] w-full h-screen bg-[#010417] flex items-center justify-center'>
          <div className="circles">
            <div id="counter" className="main-circle"></div>
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
          <div className="absolute w-full h-screen degrad-circle"></div>
        </div>}
        <Menu/>
        <section className='w-full h-screen bg-no-repeat bg-cover relative'>
          <div className="hero w-full">
            <div className="w-full absolute top left z-10 h-full">
              <div className="mx-auto max-w-7xl p-6 lg:px-8 h-full">
                <div className="w-100 md:w-1/2 h-full text-white flex justify-center flex-col">
                  <h1 className="font-extrabold text-5xl">
                    <span className='text-base block text-[#40caf4]'>{data?.ubicacion?.description}</span>
                    {data?.titulo}
                  </h1>
                </div>
              </div>
            </div>
            <img className='w-full h-screen object-cover' src={data?.portada} alt="" />
          </div>
          <div className='w-full absolute bottom-0 left z-0 bg-gradient-to-t from-[#010417] from-10% min-h-full'></div>
        </section>
        <section className='text-white -mt-10 pb-10 w-full'>
          <div className='mx-auto max-w-7xl p-6 lg:px-8 flex flex-col relative'>
            <div className='w-full lg:w-3/4'>
              <div className='w-full relative'>
                <h3 className='mb-3'><strong>Descripcion Paquete:</strong></h3>
                <article className={`${!ShowMore && 'h-44'} flex overflow-hidden`}>
                  {renderizarConSaltosDeLinea(data?.descripcion)}
                </article>
                { !ShowMore && <div className='w-full px-6 lg:px-8 absolute bottom-0 left z-0 bg-gradient-to-t from-[#010417] from-20% h-44 flex items-end justify-end'> <button className='text-[#ffd603]' onClick={() => setShowMore(true)}>Ver mas</button></div>}
              </div>
              {
                data?.incluye?.length > 0 && <div className='w-full relative mt-10'>
                  <h3 className='mb-3'><strong>Que incluye:</strong></h3>
                  <div className='flex flex-col gap-4'>
                    {data?.incluye.map(item => {
                      return (
                        <div className='flex md:items-center flex-col md:flex-row'>
                          <div className='flex gap-2 items-center md:w-1/2'>
                            <i className="fa-sharp fa-light fa-circle-check"></i>
                            <h3 className='font-bold'>{item.titulo}</h3>
                          </div>
                          <div className='md:w-1/2'>
                            {item.descripcion}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              }
              <div className='w-full mt-10'>
                <div className=' rounded border p-3'>
                  {
                    data?.tarifas?.map((tarifa,index) => {
                      return(
                        <div className='flex items-center gap-2 p-1 border-b flex-col'>
                          <div className='flex items-center gap-2 w-full flex-col md:flex-row'>
                            <div className='w-full text-center md:w-1/6 flex gap-1 items-center justify-between'>
                              <img src={tarifa.imagen.url} className='max-w-full object-cover' alt="" />
                            </div>
                            <div className='w-full md:w-4/6 flex flex-col'>
                              <p className='font-bold'>{tarifa.titulo}</p>
                              <span className='text-sm w-full md:w-2/3'>{tarifa.descripcion}</span>
                            </div>
                            <div className='w-full md:w-1/6 flex flex-col'>
                              <span className='font-bold text-xl'>${new Intl.NumberFormat('es-MX').format(tarifa.precio)}</span> <span className='text-sm'>{data?.moneda}/{data?.unidad}</span>
                            </div>
                          </div>
                          {
                            tarifa?.fechas ? <div className='flex items-end gap-2 w-full flex-col md:flex-row py-3'>
                            <div className='flex flex-col w-full'>
                              <span className='font-semibold text-white'>Fechas disponibles:</span>
                              <select name="" className='w-full bg-transparent rounded-lg' id='tarifasSelect' onChange={(e) => handleOptionSelectDate(index, e.target.value)}>
                              <option value="" selected disabled hidden>Selecciona una fecha</option>
                                {
                                  tarifa?.fechas?.map(fecha => <option className='flex flex-col' value={fecha.fecha_evento}>                              
                                    <h6 className='uppercase'>{moment(fecha.fecha_evento).format('dddd, MMMM Do, YYYY')}</h6>
                                  </option>)
                                }
                              </select>
                            </div>
                            { tarifa?.optionSelect && <div className='w-full flex'>
                              <Link to={`/checkout?url=${url}&fecha_salida=${tarifa?.optionSelect?.fecha_inicio}&fecha_llegada=${tarifa?.optionSelect?.fecha_fin}&fecha_evento=${tarifa?.optionSelect?.fecha_evento}&tarifa=${tarifa.id}`} className='bg-[#2d8ae8]  rounded p-3 w-full text-white flex justify-center font-bold'>
                                Reservá ahora
                              </Link> 
                            </div>
                            }
                          </div> : <div className='w-full flex flex-col md:flex-row gap-3 md:gap-5'>
                            <div className='flex flex-col  md:w-1/2'>
                              <h1 className='text-sm font-bold'>Selecciona una fecha:</h1>
                              <input type="date" className='rounded-lg bg-transparent relative' onChange={(e) => handleOptionSelectDate(index,e.target.value)} />
                            </div>
                            { tarifa?.optionSelect && <div className='md:w-1/2 flex items-end justify-end'>
                              <Link to={`/checkout?url=${url}&fecha_salida=${tarifa?.optionSelect?.fecha_inicio}&fecha_llegada=${tarifa?.optionSelect?.fecha_fin}&fecha_evento=${tarifa?.optionSelect?.fecha_evento}&tarifa=${tarifa.id}`} 
                              className='bg-[#2d8ae8]  rounded p-3 w-full text-white font-bold text-center'>
                                Reservá ahora
                              </Link> 
                            </div>
                            }
                          </div>
                          }
                          { (tarifa?.optionSelect && !tarifa.fechas) && <div className='w-full flex gap-3 pb-3 flex-col md:flex-row'>
                            <div className='md:w-1/3 flex gap-3 items-center text-center border rounded-lg p-3'>
                              <i className="fa-sharp fa-light fa-plane-departure text-2xl text-[#ffd603]"></i>
                              <span className='text-xl font-bold'>{moment(tarifa?.optionSelect.fecha_inicio).format('dddd DD MMMM YYYY')}</span>
                            </div>
                            <div className='md:w-1/3 flex gap-3 items-center text-center border rounded-lg p-3'>
                              <i className="fa-light fa-plane-arrival text-2xl text-[#ffd603]"></i>
                              <span className='text-xl font-bold'>{moment(tarifa?.optionSelect.fecha_fin).format('dddd DD MMMM YYYY')}</span>
                            </div>
                          </div> }
                          { (tarifa?.optionSelect && tarifa.fechas) && <div className='w-full flex gap-3 pb-3 flex-col md:flex-row'>
                            <div className='md:w-1/3 flex gap-3 items-center text-center border rounded-lg p-3'>
                              <i className="fa-sharp fa-light fa-plane-departure text-2xl text-[#ffd603]"></i>
                              <span className='text-xl font-bold'>{moment(tarifa?.optionSelect.fecha_inicio).format('dddd DD MMMM YYYY')}</span>
                            </div>
                            <div className='md:w-1/3 flex gap-3 items-center text-center border rounded-lg p-3'>
                              <i className="fa-light fa-plane-arrival text-2xl text-[#ffd603]"></i>
                              <span className='text-xl font-bold'>{moment(tarifa?.optionSelect.fecha_fin).format('dddd DD MMMM YYYY')}</span>
                            </div>
                            <div className='md:w-1/3 flex gap-3 items-center text-center border rounded-lg p-3'>
                              <i className="fa-light fa-party-horn text-2xl text-[#ffd603]"></i>
                              <span className='text-xl font-bold'>{moment(tarifa?.optionSelect.fecha_evento).format('dddd DD MMMM YYYY')}</span>
                            </div>
                          </div> }
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              {data.politicas && <div className="mt-10 flex flex-col border-b">
                <div className="flex justify-between">
                  <h3 className='mb-3'><strong>Terminos y Condiciones</strong></h3>
                  <button onClick={() => setShowMorePoliticas(true)}><i className="fa-light fa-circle-arrow-down"></i></button>
                </div>
                { ShowMorePoliticas && <article className='block w-full'>{renderizarConSaltosDeLinea(data?.politicas)}</article> }
              </div>}
            </div>
          </div>
        </section>
        <Footer/>
      </div>
    )
  } else {
    return allpaquetesView()
  }
}

export default Landing