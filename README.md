## Proyecto E-commerce

### Descripción General

Este proyecto es una aplicación web de comercio electrónico construida con Node.js y Express. Incluye características como autenticación de usuarios, gestión de productos y carritos de compra, y vistas dinámicas generadas con Handlebars. La aplicación también soporta sesiones y autenticación mediante JWT y Passport.

### Estructura del Proyecto

#### Archivos Principales

1. **app.js**
    - **Descripción:** Archivo principal de la aplicación donde se configuran los middlewares, rutas y el servidor.
    - **Funciones Clave:** Configuración del servidor Express, inicialización de Passport, configuración de Handlebars, definición de rutas y middleware de autenticación.
    - **Dependencias:** express, express-handlebars, cookie-parser, passport, cors, path, mongoose, etc.

2. **database.js**
    - **Descripción:** Archivo de configuración para la conexión a la base de datos MongoDB.
    - **Funciones Clave:** Conexión a MongoDB utilizando Mongoose.
    - **Dependencias:** mongoose.

3. **package.json**
    - **Descripción:** Archivo de configuración de npm que contiene las dependencias y scripts del proyecto.
    - **Dependencias Clave:** bcrypt, connect-mongo, cookie-parser, cors, express, express-handlebars, express-session, jsonwebtoken, mongoose, mongoose-paginate-v2, multer, nodemailer, passport, passport-github2, passport-jwt, passport-local, socket.io.
    - **Scripts:** "dev" para correr la aplicación en modo desarrollo con nodemon.

4. **passport.config.js**
    - **Descripción:** Configuración de Passport para autenticación JWT.
    - **Funciones Clave:** Definición de la estrategia JWT, extracción de token desde las cookies.
    - **Dependencias:** passport, passport-jwt.

5. **authmiddleware.js**
    - **Descripción:** Middleware de autenticación que utiliza Passport para verificar tokens JWT.
    - **Funciones Clave:** Autenticación de solicitudes usando JWT y Passport.
    - **Dependencias:** passport.

#### Controladores

1. **cart.controller.js**
    - **Descripción:** Controlador para la gestión de carritos de compra.
    - **Funciones Clave:** Crear nuevo carrito, obtener productos de un carrito, agregar producto al carrito, eliminar producto del carrito, actualizar productos en el carrito, vaciar carrito y finalizar compra.
    - **Dependencias:** TicketModel, UserModel, CartRepository, ProductRepository, EmailManager.

2. **product.controller.js**
    - **Descripción:** Controlador para la gestión de productos.
    - **Funciones Clave:** Añadir producto, obtener productos, obtener producto por ID, actualizar producto, eliminar producto.
    - **Dependencias:** ProductRepository.

3. **user.controller.js**
    - **Descripción:** Controlador para la gestión de usuarios.
    - **Funciones Clave:** Registro, inicio de sesión, perfil de usuario, cierre de sesión, solicitud de restablecimiento de contraseña, restablecimiento de contraseña, cambio de rol a premium, carga de documentos, gestión de usuarios inactivos.
    - **Dependencias:** UserModel, CartModel, jwt, UserDTO, UserRepository, EmailManager.

4. **view.controller.js**
    - **Descripción:** Controlador para renderizar las vistas.
    - **Funciones Clave:** Renderizar vistas de productos, carritos, panel premium, inicio de sesión, registro, productos en tiempo real, chat, home, restablecimiento de contraseña, confirmación de envío.
    - **Dependencias:** ProductModel, CartRepository.

#### Modelos

1. **cart.model.js**
    - **Descripción:** Modelo de datos para los carritos de compra.
    - **Funciones Clave:** Definición del esquema de carrito con productos y cantidades, pre-hook para la población de datos de productos.
    - **Dependencias:** mongoose.

2. **message.model.js**
    - **Descripción:** Modelo de datos para los mensajes de chat.
    - **Funciones Clave:** Definición del esquema de mensajes con usuario y mensaje.
    - **Dependencias:** mongoose.

3. **product.model.js**
    - **Descripción:** Modelo de datos para los productos.
    - **Funciones Clave:** Definición del esquema de productos con título, descripción, precio, imagen, código, stock, categoría, estado, miniaturas y propietario.
    - **Dependencias:** mongoose, mongoose-paginate-v2.

4. **ticket.model.js**
    - **Descripción:** Modelo de datos para los tickets de compra.
    - **Funciones Clave:** Definición del esquema de ticket con código, fecha de compra, cantidad y comprador.
    - **Dependencias:** mongoose.

5. **user.model.js**
    - **Descripción:** Modelo de datos para los usuarios.
    - **Funciones Clave:** Definición del esquema de usuario con nombre, apellido, email, contraseña, edad, carrito, rol, token de restablecimiento, documentos y última conexión.
    - **Dependencias:** mongoose.

#### Repositorios

1. **cart.repository.js**
    - **Descripción:** Repositorio para la gestión de carritos de compra.
    - **Funciones Clave:** Crear carrito, obtener productos de un carrito, agregar producto al carrito, eliminar producto del carrito, actualizar productos en el carrito, vaciar carrito, agregar productos a ticket.
    - **Dependencias:** CartModel, TicketModel.

2. **product.repository.js**
    - **Descripción:** Repositorio para la gestión de productos.
    - **Funciones Clave:** Agregar producto, obtener productos con paginación, obtener producto por ID, actualizar producto, eliminar producto.
    - **Dependencias:** ProductModel.

3. **user.repository.js**
    - **Descripción:** Repositorio para la gestión de usuarios.
    - **Funciones Clave:** Encontrar usuario por email o ID, crear y guardar usuario, obtener todos los usuarios, encontrar usuarios inactivos.
    - **Dependencias:** UserModel.

#### Rutas

1. **cart.router.js**
    - **Descripción:** Define las rutas para la gestión de carritos de compra.
    - **Rutas Clave:** Crear carrito, obtener productos de un carrito, agregar producto al carrito, eliminar producto del carrito, actualizar productos en el carrito, vaciar carrito, finalizar compra.
    - **Dependencias:** express, CartController, authMiddleware.

2. **products.router.js**
    - **Descripción:** Define las rutas para la gestión de productos.
    - **Rutas Clave:** Obtener productos, obtener producto por ID, agregar producto, actualizar producto, eliminar producto.
    - **Dependencias:** express, ProductController, passport.

3. **user.router.js**
    - **Descripción:** Define las rutas para la gestión de usuarios.
    - **Rutas Clave:** Registro, inicio de sesión, perfil de usuario, cierre de sesión, solicitud de restablecimiento de contraseña, restablecimiento de contraseña, cambio de rol a premium, carga de documentos, gestión de usuarios (admin), eliminación de usuarios inactivos.
    - **Dependencias:** express, passport, UserController, upload, checkUserRole.

4. **views.router.js**
    - **Descripción:** Define las rutas para renderizar las vistas.
    - **Rutas Clave:** Vistas de productos, carritos, panel premium, inicio de sesión, registro, productos en tiempo real, chat, home, restablecimiento de contraseña, confirmación de envío.
    - **Dependencias:** express, ViewsController, checkUserRole, passport.

#### Vistas

1. **main.handlebars**
    - **Descripción:** Vista principal que actúa como plantilla base.
    - **Funciones Clave:** Definición de la estructura básica de la página con header, footer y contenido dinámico.
    - **Dependencias:** handlebars.

2. **header.handlebars**
    - **Descripción:** Vista del header de la aplicación.
    - **Funciones Clave:** Definición del encabezado de la página con navegación.
    - **Dependencias:** handlebars.

3. **footer.handlebars**
    - **Descripción:** Vista del footer de la aplicación.
    - **Funciones Clave:** Definición del pie de página.
    - **Dependencias:** handlebars.

4. **admin.handlebars**
    - **Descripción:** Vista de administración para gestionar usuarios y productos.
    - **Funciones Clave:** Renderizado de la interfaz de administración.
    - **Dependencias:** handlebars.

5. **cart.handlebars**
    - **Descripción:** Vista del carrito de compras.
    - **Funciones Clave:** Renderizado del contenido del carrito.
    - **Dependencias:** handlebars.

6. **chatcrew.handlebars**
    - **Descripción:** Vista del chat en tiempo real.
    - **Funciones Clave:** Renderizado de la interfaz de chat.
    - **Dependencias:** handlebars.

7. **checkout.handlebars**
    - **Descripción:** Vista de confirmación de la compra.
    - **Funciones Clave:** Renderizado de la información de la compra finalizada.
    - **Dependencias:** handlebars.

8. **confirmacion-envio.handlebars**
    - **Descripción:** Vista de confirmación de envío de restablecimiento de contraseña.
    - **Funciones Clave:** Renderizado de la confirmación de envío de correo para restablecimiento de contraseña.
    - **Dependencias:** handlebars.

9. **home.handlebars**
    - **Descripción:** Vista de la página principal.
    - **Funciones Clave:** Renderizado del contenido de la página de inicio.
    - **Dependencias:** handlebars.

10. **login.handlebars**
    - **Descripción:** Vista de inicio de sesión.
    - **Funciones Clave:** Renderizado del formulario de inicio de sesión.
    - **Dependencias:** handlebars.

11. **panel-premium.handlebars

**
    - **Descripción:** Vista del panel premium para usuarios premium.
    - **Funciones Clave:** Renderizado de la interfaz de administración de productos para usuarios premium.
    - **Dependencias:** handlebars.

12. **passwordchange.handlebars**
    - **Descripción:** Vista de cambio de contraseña.
    - **Funciones Clave:** Renderizado del formulario para cambiar la contraseña.
    - **Dependencias:** handlebars.

13. **passwordreset.handlebars**
    - **Descripción:** Vista de restablecimiento de contraseña.
    - **Funciones Clave:** Renderizado del formulario para restablecer la contraseña.
    - **Dependencias:** handlebars.

14. **products.handlebars**
    - **Descripción:** Vista de la lista de productos.
    - **Funciones Clave:** Renderizado de la lista de productos con paginación.
    - **Dependencias:** handlebars.

15. **profile.handlebars**
    - **Descripción:** Vista del perfil de usuario.
    - **Funciones Clave:** Renderizado de la información del perfil de usuario.
    - **Dependencias:** handlebars.

16. **realtimeproducts.handlebars**
    - **Descripción:** Vista de productos en tiempo real.
    - **Funciones Clave:** Renderizado de la lista de productos en tiempo real.
    - **Dependencias:** handlebars.

17. **register.handlebars**
    - **Descripción:** Vista de registro de usuario.
    - **Funciones Clave:** Renderizado del formulario de registro de usuario.
    - **Dependencias:** handlebars.

18. **resetpass.handlebars**
    - **Descripción:** Vista de restablecimiento de contraseña.
    - **Funciones Clave:** Renderizado del formulario para restablecer la contraseña.
    - **Dependencias:** handlebars.

#### Otros Archivos

1. **user.dto.js**
    - **Descripción:** Data Transfer Object (DTO) para los usuarios.
    - **Funciones Clave:** Definición de la estructura de datos para transferir información de usuario.
    - **Dependencias:** Ninguna.

2. **checkrole.js**
    - **Descripción:** Middleware para verificar el rol del usuario.
    - **Funciones Clave:** Verificación del token JWT y comprobación del rol del usuario.
    - **Dependencias:** jwt.

3. **multer.js**
    - **Descripción:** Configuración de Multer para la carga de archivos.
    - **Funciones Clave:** Definición del almacenamiento y nombres de archivos subidos.
    - **Dependencias:** multer.

4. **cart.js**
    - **Descripción:** Archivo JavaScript para la gestión de acciones del carrito en el frontend.
    - **Funciones Clave:** Funciones para eliminar productos del carrito y vaciar el carrito.
    - **Dependencias:** fetch API.

5. **chat.js**
    - **Descripción:** Archivo JavaScript para la gestión del chat en tiempo real.
    - **Funciones Clave:** Configuración de Socket.io, manejo de eventos de chat y renderización de mensajes.
    - **Dependencias:** socket.io.

6. **premium-panel.js**
    - **Descripción:** Archivo JavaScript para gestionar el panel de usuario premium.
    - **Funciones Clave:** Gestión de productos en tiempo real, manejo de formularios para agregar y eliminar productos.
    - **Dependencias:** socket.io, fetch API.

7. **realtime.js**
    - **Descripción:** Archivo JavaScript para gestionar productos en tiempo real.
    - **Funciones Clave:** Renderización de productos, manejo de roles para agregar/eliminar productos.
    - **Dependencias:** socket.io, fetch API.

8. **email.js**
    - **Descripción:** Archivo para la gestión del envío de correos electrónicos.
    - **Funciones Clave:** Envío de correos de confirmación de compra, restablecimiento de contraseña, notificación de inactividad.
    - **Dependencias:** nodemailer.

9. **style.css**
    - **Descripción:** Archivo CSS para el estilo de la aplicación.
    - **Funciones Clave:** Definición de estilos para la interfaz de usuario, incluyendo el header, carrusel, botones, formularios y contenedores.
    - **Dependencias:** Ninguna.

10. **socketmanager.js**
    - **Descripción:** Archivo para la gestión de eventos de Socket.io.
    - **Funciones Clave:** Configuración de eventos de conexión, agregar producto, eliminar producto y mensajes de chat.
    - **Dependencias:** socket.io, ProductRepository, MessageModel.

11. **cartutilis.js**
    - **Descripción:** Utilidades para la gestión de carritos.
    - **Funciones Clave:** Generar código único, calcular total del carrito.
    - **Dependencias:** Ninguna.

12. **hashbcryp.js**
    - **Descripción:** Utilidades para el manejo de contraseñas.
    - **Funciones Clave:** Crear hash de la contraseña, validar contraseña.
    - **Dependencias:** bcrypt.

13. **tokenrest.js**
    - **Descripción:** Utilidad para generar tokens de restablecimiento de contraseña.
    - **Funciones Clave:** Generar token de restablecimiento.
    - **Dependencias:** Ninguna.

### Tecnologías Utilizadas

1. **Node.js y Express:** Para construir el servidor backend y manejar las solicitudes HTTP.
2. **MongoDB y Mongoose:** Para la base de datos y la modelación de datos.
3. **Passport y JWT:** Para la autenticación y gestión de sesiones.
4. **Handlebars:** Para generar vistas dinámicas en el frontend.
5. **Socket.io:** Para la comunicación en tiempo real (chat).
6. **Multer y Nodemailer:** Para la gestión de archivos y el envío de correos electrónicos respectivamente.

### Instalación y Ejecución

1. Clonar el repositorio.
2. Instalar las dependencias con `npm install`.
3. Configurar las variables de entorno necesarias (por ejemplo, la URL de la base de datos MongoDB, la clave secreta para JWT, etc.).
4. Iniciar el servidor en modo desarrollo con `npm run dev`.

### Ejecución del Proyecto

Para ejecutar el proyecto, siga estos pasos:

```bash
# Clonar el repositorio
git clone https://github.com/jmansur98/Proyecto-Backend-e-commerce.git

# Ir al directorio del proyecto
cd Proyecto Backend e-commerce

# Instalar las dependencias
npm install

# Ejecutar el servidor en modo desarrollo
npm run dev
```

A continuación, acceder a `http://localhost:8080` en su navegador para ver la aplicación en funcionamiento.

### Conclusión

Este proyecto de e-commerce está diseñado para ser una plataforma completa y funcional para la compra y venta de productos. Utiliza una variedad de tecnologías modernas para asegurar un rendimiento óptimo, seguridad y una experiencia de usuario agradable. Las configuraciones y controladores proporcionan una base sólida para extender y personalizar la aplicación según las necesidades específicas del negocio.
