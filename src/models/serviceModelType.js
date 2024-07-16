function modelServiceType(type) {
  if (type[0]?.__component.includes('concierto')) {
    this.type = 'conciertos'
  } else if (type[0]?.__component.includes('evento')){
    this.type = 'eventos'
  } else if (type[0]?.__component.includes('hotel')){
    this.type = 'hoteles'
  } else if (type[0]?.__component.includes('tour')){
    this.type = 'tours'
  } else if (type[0]?.__component.includes('transporte')){
    this.type = 'transportes'
  } else if (type[0]?.__component.includes('viaje')){
    this.type = 'viajes'
  } else {
    this.type = undefined
  }
}

export default modelServiceType;