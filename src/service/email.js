const nodemailer = require('nodemailer');

class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: "ecommerceproyectbackend@gmail.com",
                pass: "o t p c y x w r k v x y m p i q"
            }
        });
    }

    async enviarCorreoCompra(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: "Mixer SuperMarket <ecommerceproyectbackend@gmail.com>",
                to: email,
                subject: 'Confirmación de compra',
                html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu gran compra, ${first_name}! ESPEREMOS QUE SIGA ASÍ.</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    }

    async enviarCorreoRestablecimiento(email, first_name, token) {
        try {
            const mailOptions = {
                from: 'ecommerceproyectbackend@gmail.com',
                to: email,
                subject: 'Restablecer Contraseña',
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},¿Comó estas? TANTO TIEMPOOOO!!!!!!!</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="http://localhost:8080/password">Restablecer Contraseña</a>
                    <p>En el caso de que no solicitaste este restablecimiento, ignora este correo.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error al enviar correo electrónico:", error);
            throw new Error("Error al enviar correo electrónico");
        }
    }

    async sendInactivityEmail(email, firstName) {
        try {       
            const mailOptions = {
                from: "ecommerceproyectbackend@gmail.com",
                to: email,
                subject: "NO DEJES QUE TE SUCEDA LA PEOR POR TUS ACCIONES IRRESPONSABLES. Tu cuenta ha sido eliminada por inactividad lastimosamente!!!!!!!!",
                text: `Hola querid@ ${firstName},\n\nTu cuenta ha sido eliminada debido a la inactividad. No te precupes, puedes regitrarte nuevamente en nuestro sitio web oficial, cuando quieras, desde donde quieras.\n\nSaludos,\nEquipo de E-commerce Mixer`
            };

            await this.transporter.sendMail(mailOptions);
            console.log(`Correo de inactividad enviado a ${email}`);
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    }
}

module.exports = EmailManager;
