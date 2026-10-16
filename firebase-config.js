// Configuración de Firebase de la web.
// Se copia desde la consola de Firebase: Configuración del proyecto → General → Tus apps → App web → "Configuración del SDK".
// Estos valores NO son secretos: identifican el proyecto. La seguridad la dan las reglas de firestore.rules.
// Mientras apiKey diga "PEGAR...", la web funciona igual pero los pedidos se envían por WhatsApp.
export const firebaseConfig = {
  apiKey: "PEGAR_API_KEY",
  authDomain: "PEGAR.firebaseapp.com",
  projectId: "PEGAR_PROJECT_ID",
  storageBucket: "PEGAR.appspot.com",
  messagingSenderId: "PEGAR",
  appId: "PEGAR",
};
