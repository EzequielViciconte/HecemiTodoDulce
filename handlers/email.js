const {CLIENT_ID,CLIENT_SECRET,REDIRECT_URL, REFRESH_TOKEN} = require('../config/email');
const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const HtmlToText = require('html-to-text');
const { google } = require('googleapis');
const util = require('util');


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URL)

oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});


const accessToken=oAuth2Client.getAccessToken()

let Transport = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:"tododulcehecemi@gmail.com",
        clientId:CLIENT_ID,
        clientSecret:CLIENT_SECRET,
        refreshToken:REFRESH_TOKEN,
        accessToken:accessToken
    }
});


//Generar Html 
const generarHtml = (Archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/Emails/${Archivo}.pug`, opciones)
    return juice(html)
}


exports.Enviar = async (opciones) =>{

    const html = generarHtml(opciones.Archivo, opciones);
    const text = HtmlToText.fromString(html);
    const opcionesEmail = {
        from:'HecemiTodoDulce <noresponder@hecemitododulce.com',
        to:opciones.usuario.Email,
        subject:opciones.subject,
        text,
        html,
        context:{
            ResetUrl:opciones.ResetUrl
        }
    }

    const sendMail = util.promisify(Transport.sendMail, Transport);
    
    return sendMail.call(Transport,opcionesEmail)

}