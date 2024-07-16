import React, { useState, useRef} from 'react'
import Menu from './components/menu'
import Fondo from './assets/bali.jpg'
import Slider from "react-slick";
import Footer from './components/footer'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import traveler from './assets/traveler.jpg'
import lasvegas from './assets/lasvegas.jpg'
import hawaii from './assets/hawaii.webp'
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import axios from 'axios'
import SectionType from './components/sectionType'
import Header from './components/header';

const Home = () => {  
  const [firstQuestion, setfirstQuestion] = useState(1)
  const [optionCity, setoptionCity] = useState([])
  const [loadingCity, setLoadingCity] = useState(false)
  const [formIA, setFormIA] = useState({})
  let keyUpTimer = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4
  };

  const cordenadas = [
    { lon:-88.35041848015022, lat: 20.019650322154078 },
    { lon:-103.83997413656888, lat: 20.416780187979665 },
    { lon:-96.74165799946856, lat: 17.079535594783813 },
    { lon:-99.14919654495668, lat: 19.39432286933631 },
    { lon:-99.071329702146, lat: 19.43092650300747 },
    { lon:-111.9580443234437, lat: 25.884397818312166 },
    { lon:-115.33872207643668, lat: 31.464038419794303 },
    { lon:-89.03511613003819, lat: 21.082542094907307 },
    { lon:-117.28297097097357, lat: 39.25578946896848 },
    { lon:-81.3243030963075, lat: 28.309701988542866 },
    { lon:-94.92571859994054, lat: 39.80432765403459 },
    { lon:-73.97151421177622, lat: 40.753219651308896 },
    { lon:-99.91142904155241, lat: 31.93152446965594 },
    { lon:-119.94092151807098, lat: 38.10837325843462 },
    { lon:-121.56524334847411, lat: 44.570878358915785 },
    { lon:-121.08431631906585, lat: 47.68192444333631 },
    { lon:-3.70256, lat:40.4165 },
    { lat:41.38879, lon: 2.15899 },
    { lat: 37.38283, lon: -5.97317 },
    { lat: -23.5475, lon: -46.63611 },
    { lat: -22.90642, lon: -43.18223 },
    { lat: 21.31992, lon: 110.5723 },
    { lat: 4.60971, lon: -74.08175 },
    { lat: 6.25184, lon: -75.56359 },
    { lat: 3.43722, lon: -76.5225 },
    { lat: 48.85341, lon: 2.3488 },
    { lat: 43.29695, lon: 5.38107 }
  ]

  const questions = [
    {
      pregunta:'¿Qué tipo de actividades prefieres durante tus vacaciones?',
      respuestas:[
        'Aventuras al aire libre como senderismo, surf o escalada.',
        'Visitar museos, galerías de arte o sitios históricos.',
        'Relajarme en la playa, en un spa o en destinos rurales tranquilos.',
        'Explorar la escena culinaria local, probar platos típicos y restaurantes auténticos.'
      ],
      imagen:'traveler-intrepido.jpg'
    },
    {
      pregunta:'¿Qué te motiva más a la hora de planificar un viaje?',
      respuestas:[
        'Buscar destinos emocionantes y poco convencionales.',
        'Descubrir la historia y la cultura de diferentes lugares.',
        'Buscar lugares tranquilos para desconectar del estrés.',
        'Explorar la gastronomía y los sabores únicos de cada región.'
      ],
      imagen:'traveler-plan.jpg'
    },
    {
      pregunta:'¿Qué tipo de recuerdos disfrutas más de compartir cuando regresas de un viaje?',
      respuestas:[
        'Fotos de paisajes impresionantes y experiencias emocionantes.',
        'Anécdotas sobre lugares históricos o obras de arte que has visto.',
        'Experiencias de relajación y momentos de paz.',
        'Fotos de deliciosas comidas y bebidas que has probado.'
      ],
      imagen:'traveler-happy.jpg'
    },
    {
      pregunta:'¿Cuál es tu idea de unas vacaciones perfectas?',
      respuestas:[
        'Una aventura llena de actividades al aire libre.',
        'Un viaje cultural explorando arte, historia y arquitectura.',
        'Un retiro tranquilo en un entorno natural o junto al mar.',
        'Un recorrido gastronómico probando platos típicos y especialidades locales.'
      ],
      imagen:'traveler-perfect.jpg'
    },
    {
      pregunta:'¿Qué te gusta hacer cuando llegas a un destino nuevo?',
      respuestas:[
        'Explorar la naturaleza y buscar actividades al aire libre.',
        'Visitar museos, monumentos y sitios históricos.',
        'Relajarme y disfrutar del entorno tranquilo.',
        'Investigar los mejores lugares para comer y probar la comida local.'
      ],
      imagen:'traveler-dance.jpg'
    },
    {
      pregunta:'Seleccióna tus ciudades favoritas para viajar',
      respuestas: true,
      imagen:'traveler-city.jpg'
    }
  ]

  const handleOptionCity = (query) => {
    const stringQuery = query.replace(/\s/g, '+')
    if (stringQuery.length > 3) {
      axios.get(`https://api.radar.io/v1/search/autocomplete?query=${stringQuery}&layers=locality`,
      {
        headers:{
          Authorization: `prj_test_sk_52e9d9961f3b02d9d8dd6d361c6676bb0d9cb0d8`
        }
      })
      .then(response => {
        setoptionCity(response.data.addresses)
        setLoadingCity(false)
      }).catch(err => {
        console.log(err)
      })
    }
  }

  const handleKeyUp = (query) => {
    setoptionCity([])
    setLoadingCity(true)
    if (query ==='') {
      return;
    }
    clearTimeout(keyUpTimer.current);
    keyUpTimer.current = setTimeout(() => {
      handleOptionCity(query)
    }, 1000);
  }

  const selectCity = (city) => {
    setFormIA({...formIA, city: formIA?.city?.length ? formIA.city.concat(city) : [city]})
    console.log(formIA)
    setoptionCity([])
  }

  const selectAnswer = (question, answer, index) => {
    setFormIA({...formIA, question: formIA?.question ? formIA.question.concat(formIA.question,`${question} ${answer}`) : `${question} ${answer}`})
    document.querySelector(`#pregunta${index+1}`).checked = true
    setfirstQuestion(index+1)
  }

  return (
    <div>
      <Menu/>
      <Header 
        titulo='¡Gana un Viaje a <span class="text-[#ffd603]">Bali</span>!' 
        subtitulo=''
        fechas="14 Días de Aventura Gratuita con nosotros" 
        background={ Fondo }
        eventos={true}
        boton="Ver Más"
        url="/gana-un-viaje-a-bali"
        />
      {/*<section className='mt-24'>
        <div className="mx-auto max-w-7xl p-6 lg:px-8">
          <h1 className="font-extrabold text-5xl mb-5 text-white lg:text-6xl">
            Encuentra tu 
            <span className='md:block'><span className=' text-[#ffd603]'> Estilo</span> de Viaje</span>
          </h1>
          <article className='text-sm text-white md:w-1/2'>Deja que nuestra IA personalizada te guíe hacia tu próximo destino. Responde las siguientes preguntas seleccionando la opción que mejor te describa, y descubre los mejores viajes adaptados a tu estilo.</article>
          <div className='w-100 flex items-center flex-col-reverse md:flex-row py-10 section-questions'>
            <input type="radio" name="pregunta" id="pregunta1" onClick={()=> setfirstQuestion(1)} checked={firstQuestion === 1 && true  }/>
            <input type="radio" name="pregunta" id="pregunta2" onClick={()=> setfirstQuestion(2)} />
            <input type="radio" name="pregunta" id="pregunta3" onClick={()=> setfirstQuestion(3)}/>
            <input type="radio" name="pregunta" id="pregunta4" onClick={()=> setfirstQuestion(4)}/>
            <input type="radio" name="pregunta" id="pregunta5" onClick={()=> setfirstQuestion(5)}/>
            <input type="radio" name="pregunta" id="pregunta6" onClick={()=> setfirstQuestion(6)}/>
            <div className='w-full md:w-1/12 h-full flex md:flex-col gap-5 justify-center items-centers buttons-questions'>
              <label htmlFor="pregunta1" className='w-2 h-2 bg-white rounded-full'></label>
              <label htmlFor="pregunta2" className='w-2 h-2 bg-white rounded-full'></label>
              <label htmlFor="pregunta3" className='w-2 h-2 bg-white rounded-full'></label>
              <label htmlFor="pregunta4" className='w-2 h-2 bg-white rounded-full'></label>
              <label htmlFor="pregunta5" className='w-2 h-2 bg-white rounded-full'></label>
              <label htmlFor="pregunta6" className='w-2 h-2 bg-white rounded-full'></label>
            </div>
            <div id='container-questions' className='container-questions w-full h-[450px] md:w-11/12 md:h-96 overflow-hidden flex flex-row md:flex-col relative'>
              {questions.map((question, index) => {
                return (
                <div className={`absolute min-w-full left-0 top-0 z-20 h-full slider ${firstQuestion !== index+1 ? 'hidden' : 'mostrar'}`} id='slider1'>
                  <div className="relative w-full flex items-center  h-full">
                    <div className='w-full md:w-1/2 flex flex-col gap-2 absolute px-2 z-10'>
                      <h1 className='text-3xl font-bold text-white '>{question.pregunta}</h1>
                      {formIA?.city?.length > 0  && firstQuestion===6 &&  <div className='flex gap-1'>{formIA?.city?.map(ciudad => <div className='rounded-lg text-xs bg-slate-300 px-1 text-black'>{ciudad}</div>)}</div>}
                      { question.respuestas === true ? <div className='relative'>
                        {loadingCity && <div className='absolute right-5 top-2'><svg aria-hidden="true" className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg></div>  }
                        <div className='rounded-lg w-full bg-transparent text-white border p-1'>
                          <input onKeyUp={(e) => handleKeyUp(e.target.value)} type="text" placeholder='Busca tus ciudades favoritas' className='w-full bg-transparent border-0 focus:outline-none focus:ring-0'/>
                        </div>
                        {optionCity?.length > 0 && <div className='absolute w-full mt-2 rounded-lg p-2 border text-white flex flex-col'>
                          {optionCity.map(city => <button className='text-left py-1' onClick={() => selectCity(city.city)}>{city.city}, {city.country}</button>)}
                        </div>}
                        </div> 
                        : question.respuestas.map(respuesta => <button className="p-2 border rounded-lg text-white w-full text-left text-sm" onClick={()=> selectAnswer(question.pregunta, respuesta, index+1)}>{respuesta}</button>)}
                    </div>
                    <div className='w-full absolute bottom-0 left z-0 bg-gradient-to-t md:bg-gradient-to-r from-[#010417] from-40% md:from-10% min-h-full'></div>
                    <img src={`./assets/${question.imagen}`} alt="" className='w-full h-full md:max-h-96 object-cover rounded-lg'/>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        </div>
        </section> */}
      <SectionType clase='md:mt-24' type='tour' title={'Tu Próximo<span class="block"><span class="text-[#ffd603]">Viaje</span> Inicia Aquí</span> '}/>
      <SectionType type='concierto' title={'Tus artistas <span class="block text-[#ffd603]">Favoritos</span>'}/>
      <SectionType type='hotel' title={'Los lugares <span class="block text-[#ffd603]">Mas maravillosos</span>'}/>
      <section className='mb-10'>
        <div className="mx-auto max-w-7xl p-6 lg:px-8 flex flex-col relative">
          <div className='relative flex items-center justify-center'>
            <div className='w-full h-96 lg:w-64 lg:h-96'>
              <img src={ traveler } alt="" className='object-cover h-full w-full rounded-3xl' />
            </div>
            <h1 className="z-10 text-center font-extrabold text-5xl mb-5 text-white lg:text-6xl md:-ml-10 absolute lg:relative">
              Explora el <span className='text-[#ffd603]'>Mundo</span><span className='block'>A tu propio <span className='text-[#ffd603]'>Ritmo</span></span>
            </h1>
            <div className='hidden lg:flex -ml-10 -z-10'>
              <img src={ lasvegas } className='w-36 h-48 object-cover rounded-xl -rotate-12 z-10' alt="" />
              <img src={ hawaii } className='w-36 h-48 object-cover rounded-xl rotate-12 mt-20' alt="" />
            </div>
            <div className="absolute bg-black w-full h-full opacity-30 lg:hidden"></div>
          </div>
          <div  className='grid grid-cols-1 gap-10 lg:gap-2 lg:grid-cols-3 w-full mt-10 text-white'>
            <div className='flex flex-col gap-5'>
              <div className='flex gap-2 items-center text-4xl font-bold'><i className="fa-light fa-clipboard-list-check text-[#ffd603]"></i><h1>Viajes a tu <span className='block'>Medida</span></h1></div>
              <span className='text-sm'>Desde la selección de destinos hasta los detalles del itinerario, trabajamos contigo para crear el viaje de tus sueños que se adapte perfectamente a tus preferencias y necesidades</span>
            </div>
            <div className='flex flex-col gap-5'>
              <div className='flex gap-2 items-center text-4xl font-bold'>
                <i className="fa-solid fa-headset text-[#ffd603]"></i><h1>Atención de<span className='block'>Primera Clase </span></h1>
                </div>
              <span className='text-sm'>
                Nuestro equipo altamente capacitado está aquí para brindarte un servicio excepcional en cada etapa de tu viaje. Ya sea que necesites asesoramiento para planificar tus vacaciones o asistencia durante tu estancia, estamos disponibles para garantizar que tu experiencia sea perfecta en todo momento.
              </span>
            </div>
            <div className='flex flex-col gap-5 '>
              <div className='flex gap-2 items-center text-4xl font-bold'>
                <i className="fa-light fa-globe-stand text-[#ffd603]"></i>
                <h1>
                  Explora Destinos <span className='block'>Únicos</span>
                </h1>
              </div>
              <span className='text-sm'>
                Nos enorgullece ofrecerte acceso a destinos exclusivos y auténticos que te permitirán descubrir el mundo de una manera completamente nueva.
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className='relative mb-20'>
        <div className="absolute w-full h-full z-10">
          <div className="mx-auto max-w-7xl p-6 lg:px-8 flex items-center h-full">
            <div className="grid grid-cols-1 gap-10 lg:gap-2 lg:grid-cols-3 w-full lg:w-1/2 text-white">
              <div className='flex flex-col text-center gap-3'>
                <h1 className='text-5xl font-bold'>20+</h1>
                <span className='text-sm font-medium'>Años de Experiencia</span>
              </div>
              <div className='flex flex-col text-center gap-3'>
                <h1 className='text-5xl font-bold'>10M+</h1>
                <span className='text-sm font-medium'>Viajeros Felices</span>
              </div>
              <div className='flex flex-col text-center gap-3'>
                <h1 className='text-5xl font-bold'>100+</h1>
                <span className='text-sm font-medium'>Destinos Unicos</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className='section-map w-full lg:w-1/2 relative'>
            <ComposableMap>
              <Geographies geography="/features.json">
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} />
                  ))
                }
              </Geographies>
              {cordenadas.map(item=> {
                return (
                  <Marker coordinates={[item.lon, item.lat]}>
                    <circle r={2} fill="#ffd603" />
                  </Marker>
                )
              })}
            </ComposableMap>
            <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-t from-[#010417] from-10%"></div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}

export default Home