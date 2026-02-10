import express from 'express'; // Importamos la dependencia de express
import path from 'path'; // Para manejar rutas
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import sequelize from './models/index';
import Product from './models/Product';
import './models/User';
import './models/Cart';

const app = express(); // Inicializamos express

// Middlewares globales
app.use(cors());
app.use(express.json()); // Para trabajar con JSON (APIs)
app.use(express.urlencoded({ extended: true })); // Para formularios HTML
app.use(cookieParser());

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

// Rutas de productos (protegidas por middleware dentro del router)
app.use('/', productRoutes);

// Rutas de carrito
app.use('/', cartRoutes);

// Configuramos el puerto
const PORT = process.env.PORT || 3000;

// Pequeño seeder de productos iniciales
async function seedProductosIniciales() {
  const productosBase = [
    {
      nombre: 'Máquina Wahl Senior',
      codigo: 'WAHL-SENIOR',
      precio: 120.0,
      descripcion: 'Máquina profesional Wahl Senior para degradados y cortes de precisión.',
    },
    {
      nombre: 'Cera Mate Pomade',
      codigo: 'POMADE-MATTE',
      precio: 18.5,
      descripcion: 'Cera pomada mate para peinados con textura y fijación media.',
    },
    {
      nombre: 'Aceite Premium para Barba',
      codigo: 'ACEITE-BARBA',
      precio: 15.0,
      descripcion: 'Aceite nutritivo para barba con aroma amaderado y acabado suave.',
    },
  ];

  for (const prod of productosBase) {
    await Product.findOrCreate({
      where: { codigo: prod.codigo },
      defaults: prod,
    });
  }
}

// Sincronizamos la base de datos (alter true para adaptar cambios de columnas) y luego arrancamos el servidor
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Base de datos sincronizada correctamente');
    await seedProductosIniciales();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos', error);
  });
