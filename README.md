# The King Burger's: web de pedidos

Web de The King Burger's (Ciganda 650, San José): carta con precios, pedidos online con seguimiento en vivo y un panel privado para el local.

- **La web** se publica gratis con GitHub Pages desde este repositorio.
- **Los pedidos** se guardan en Firebase (Firestore), en el plan gratuito "Spark".
- **Los clientes** no se registran: la web les abre una sesión anónima por detrás.
- **El personal** entra al panel con email y contraseña, desde el link "Acceso del personal" al pie de la página o en `/#panel`.

Mientras Firebase no esté configurado, la web funciona igual. En ese caso el botón final manda el pedido por WhatsApp.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Toda la web: tienda, seguimiento del pedido y panel |
| `img/` | Logo y fotos de la carta |
| `firebase-config.js` | Los datos del proyecto de Firebase (se completa en el paso 1) |
| `firestore.rules` | Quién puede leer y escribir cada cosa |
| `firebase.json` | Configuración para subir las reglas con la herramienta de Firebase |

## 1. Crear el proyecto de Firebase (una sola vez, unos 15 minutos)

1. Entrá a <https://console.firebase.google.com> con la cuenta de Google del negocio y tocá **Crear un proyecto**. Nombre sugerido: `kingburgers`. Google Analytics no hace falta.
2. **Authentication** → **Comenzar** → pestaña **Método de acceso**. Activá estos dos:
   - **Anónimo**, para los clientes.
   - **Correo electrónico/contraseña**, para el personal.
3. **Firestore Database** → **Crear base de datos**:
   - Ubicación `southamerica-east1 (São Paulo)`, la más cercana a Uruguay.
   - Modo **producción**.
4. **Configuración del proyecto** (engranaje) → **General** → **Tus apps** → ícono `</>` (app web). Ponele de nombre `web` y no actives Hosting.
5. Firebase muestra un bloque `const firebaseConfig = { ... }`. Copiá esos valores en `firebase-config.js`, reemplazando cada `PEGAR...`.
6. Subí las reglas de seguridad. Elegí una de estas dos opciones:
   - **Desde la consola:** abrí **Firestore Database** → **Reglas**, pegá el contenido de `firestore.rules` y tocá **Publicar**.
   - **Desde la terminal** (requiere Node.js):
     ```bash
     npm install -g firebase-tools
     firebase login
     firebase use kings-burger-725ae
     firebase deploy --only firestore:rules
     ```

## 2. Dar acceso al panel (dueño y empleados)

Hay que repetir esto para cada persona que vaya a usar el panel:

1. **Authentication** → **Usuarios** → **Agregar usuario**. Cargá su email y una contraseña.
2. Copiá el **UID de usuario** que aparece en la lista (una cadena larga de letras y números).
3. **Firestore Database** → **Datos** → **Iniciar colección**. El ID de la colección es `staff`. Si la colección ya existe, entrá a `staff` y tocá **Agregar documento**.
4. En **ID del documento**, pegá el UID. Agregá un campo `nombre` (tipo string) con el nombre de la persona y guardá.

La persona ya puede entrar en `tu-web/#panel` con su email y contraseña.

**Para quitarle el acceso a alguien:** borrá su documento en `staff`. Si además querés que no pueda iniciar sesión, deshabilitá su usuario en Authentication.

## 3. Cambiar el número de WhatsApp

El número de WhatsApp es el respaldo: se usa si Firebase no está configurado o si el cliente no puede guardar el pedido. También se usa para el botón "WhatsApp" de cada pedido en el panel, que escribe al celular que cargó el cliente.

- **Desde el panel (recomendado):** **Ajustes** → **WhatsApp del local**. Escribí el número con el código de país y sin el 0 (`59899123456`) y tocá **Guardar ajustes**. El cambio se aplica al instante.
- **En el código:** en `index.html`, buscá `const WHATSAPP = "59899000000";` y cambiá el número. Este valor se usa solo hasta que se guarde uno desde el panel.

En **Ajustes** también se cambian el horario, el costo de envío y el botón para pausar pedidos. Los precios y los productos agotados se cambian en **Carta y precios**.

## 4. Publicar con GitHub Pages

Este repositorio ya tiene GitHub Pages activado, sobre la rama `main` y la carpeta raíz. Cada `git push` a `main` actualiza la web en uno o dos minutos.

Dirección actual: `https://josebentancor.github.io/kingburgers-web/`

Después de publicar, agregá el dominio en **Firebase → Authentication → Configuración → Dominios autorizados**:
- `josebentancor.github.io`
- más adelante, el dominio propio (por ejemplo `thekingburgers.com.uy`)

Sin ese paso, el inicio de sesión del personal falla.

## 5. Conectar un dominio .com.uy

1. **Registrar el dominio.** Los `.com.uy` se registran en NIC Uruguay (<https://nic.uy>) o en un revendedor autorizado. Hay que tener a mano los datos de la empresa o del titular.
2. **Elegir quién maneja el DNS.** NIC.uy pide servidores de DNS. La opción gratis más simple es Cloudflare:
   - Creá una cuenta en Cloudflare y agregá el dominio. Cloudflare te da dos servidores de nombre.
   - Cargalos en NIC.uy como servidores DNS del dominio.
3. **Apuntar el dominio a GitHub Pages.** En el DNS (por ejemplo, en Cloudflare), creá estos registros:

   | Tipo | Nombre | Valor |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `josebentancor.github.io` |

   En Cloudflare, dejá la nube en gris (**Solo DNS**) en esos registros.
4. **Configurar GitHub.** En el repo: **Settings** → **Pages** → **Custom domain**. Escribí `thekingburgers.com.uy` y guardá. Cuando aparezca disponible, marcá **Enforce HTTPS**. GitHub crea solo el archivo `CNAME` en el repo.
5. **Autorizar el dominio en Firebase.** Agregá el dominio en **Authentication** → **Configuración** → **Dominios autorizados**.

Los cambios de DNS tardan desde minutos hasta 24 horas en propagarse.

## 6. Probar que todo anda

1. Desde un celular, sin iniciar sesión en nada, entrá a la web, hacé un pedido y confirmalo. Se abre la pantalla de seguimiento.
2. En una computadora, entrá a `/#panel` con un usuario del personal. El pedido aparece en **Nuevos** y suena un aviso. Para que el sonido funcione, tocá cualquier parte del panel una vez después de abrirlo.
3. Tocá **Aceptar y cocinar**. En el celular, el seguimiento pasa a **En la cocina** sin recargar la página.
4. Para la presentación: **Ajustes** → **Cargar pedidos de ejemplo** crea 30 pedidos marcados como "Ejemplo" y llena la pestaña **Ventas**. Se borran desde el mismo lugar.

## Costos

En el plan gratuito de Firebase, Firestore incluye 50.000 lecturas y 20.000 escrituras por día. Eso alcanza de sobra para un local con cientos de pedidos diarios. GitHub Pages es gratis para repositorios públicos. El único costo fijo es el dominio `.com.uy`.

## Seguridad

- Los valores de `firebase-config.js` no son secretos. Lo que protege los datos son las reglas de `firestore.rules`:
  - Un cliente solo puede crear pedidos a su nombre y leer los suyos.
  - Solo el personal (los usuarios que están en `staff`) puede ver todos los pedidos, cambiar estados, editar precios y cambiar ajustes.
- El total del pedido lo calcula el navegador del cliente. Antes de cobrar, el panel muestra cada producto con su precio para que se pueda revisar.
