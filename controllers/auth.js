//controlador de auntenticacion
const bcryptjs = require('bcryptjs');
const {response} = require('express');

const Usuario = require('../models/usuario');
const {generarJWT} = require('../helpers/generar-jwt');
const {googleVerify} = require('../helpers/google-verify');
const { json } = require('express/lib/response');

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


const googleSingIn = async(req, res = response) => {

    const {id_token} = req.body;

    try {

        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img, 
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB
        if(!usuario.estado){
            return res.status(401).json({
               msg: 'Hable con el administrador, usuario bloqueado' 
            });
        }

        //generar el JWT
        const token = await generarJWT(usuario.id);


        res.json({
            usuario,
            token
        })        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El  Token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSingIn
}