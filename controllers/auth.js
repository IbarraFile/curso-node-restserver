//controlador de auntenticacion
const bcryptjs = require('bcryptjs');
const {response} = require('express');
const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generar-jwt');

const login = async(req, res= response) => {

    const {correo, password} = req.body;

    try {

        //verifivar si el email existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'Usuario o contraseña no son correctos - correo'
            });
        }

        //verificar si el usuario está activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'Usuario o contraseña no son correctos - estado: false'
            });
        }

        //verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario o contraseña no son correctos - contraseña'
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
           msg: 'Hable con el administrador'
        }) 
    }

}//login

module.exports = {
    login
}