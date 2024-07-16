import modelServicio from './serviceModel'

function modelServicios(data) {
  this.servicios = data?.data.map(item => new modelServicio(item))
  }
  
  export default modelServicios;