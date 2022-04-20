const Role = require('../models/role');
const usuario = require('../models/usuario');
const {correo} = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const existeEmail = async(correo = '') => {
   //verificar si el correo existe
   const existeEmail = await usuario.findOne({correo});
   if(existeEmail){
       throw new Error(`El correo: ${correo} ya está registrado`);
   }
}

const existeUsuarioPorId = async(id) => {
    //verificar si el correo existe
    const existeUsuario = await usuario.findById(id);
    if(!existeUsuario){
        throw new Error(`El id: ${id} no existe`);
    }
 }


module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId
}