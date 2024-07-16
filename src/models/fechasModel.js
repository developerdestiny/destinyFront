function modelFechas(fechas) {
  const fechasFilter = fechas?.map(fecha => fecha?.fecha_evento)
  const newFechas = fechasFilter?.map(fecha => {
    const fechasViajes = fechas?.filter(item => item.fecha_evento === fecha)
    return {
      fecha_evento:fecha,
      fechas_viaje: fechasViajes,
    }
  })
  this.fechas = newFechas;
}

export default modelFechas;