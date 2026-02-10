import express from 'express'; // Importamos la dependencia de express
import path from 'path'; // Para manejar rutas
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import sequelize from './models/index';
import './models/User';
import './models/Product';

const app = express(); // Inicializamos express

// Middlewares globales
app.use(cors());
app.use(express.json()); // Para trabajar con JSON (APIs)

// Configuramos el motor de plantillas
app.set('view engine', 'ejs'); // Usamos ejs como motor
app.set('views', './views'); // Definimos la carpeta de las vistas

// Configuramos la carpeta 'public' para servir archivos estáticos (imagenes, css, js)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta principal que renderiza index.ejs
app.get('/', (req, res) => { 
  res.render('index'); // Renderizamos la vista 'index'
});

// Vistas para login y registro
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

// Rutas de autenticación (API REST)
app.use('/api/auth', authRoutes);

// Configuramos el puerto
const PORT = process.env.PORT || 3000;

// Sincronizamos la base de datos y luego arrancamos el servidor
sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada correctamente');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos', error);
  });
