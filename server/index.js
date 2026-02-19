import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRATION = '24h';
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin';
const NOCODB_API_URL = process.env.NOCODB_API_URL;
const NOCODB_API_TOKEN = process.env.NOCODB_API_TOKEN;

// Middleware
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('auth_token');
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Contraseña requerida' });
  }

  if (password !== DASHBOARD_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  // Generar JWT
  const token = jwt.sign(
    { authenticated: true, timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );

  // Setear cookie httpOnly
  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  });

  res.json({ success: true, message: 'Autenticación exitosa' });
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Sesión cerrada' });
});

// GET /api/auth/verify
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ authenticated: true });
});

// ==========================================
// RUTAS DE DATOS (PROXY A NOCODB)
// ==========================================

// GET /api/leads
app.get('/api/leads', authenticateToken, async (req, res) => {
  if (!NOCODB_API_URL || !NOCODB_API_TOKEN) {
    return res.status(500).json({
      error: 'Configuración de NocoDB no encontrada',
      details: 'Verifica las variables de entorno NOCODB_API_URL y NOCODB_API_TOKEN'
    });
  }

  try {
    // Construir URL con parámetros
    const url = new URL(NOCODB_API_URL);

    // Parámetros por defecto
    url.searchParams.set('limit', req.query.limit || '1000');
    url.searchParams.set('sort', req.query.sort || '-CreatedAt');

    // Pasar filtros opcionales
    if (req.query.where) {
      url.searchParams.set('where', req.query.where);
    }
    if (req.query.offset) {
      url.searchParams.set('offset', req.query.offset);
    }
    if (req.query.fields) {
      url.searchParams.set('fields', req.query.fields);
    }

    // Hacer petición a NocoDB
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'xc-token': NOCODB_API_TOKEN,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de NocoDB:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Error al obtener datos de NocoDB',
        status: response.status,
        details: errorText
      });
    }

    const data = await response.json();

    // Agregar metadata
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: data.list?.length || 0,
      pageInfo: data.pageInfo || null,
      data: data.list || [],
    });

  } catch (error) {
    console.error('Error en proxy de NocoDB:', error);
    res.status(500).json({
      error: 'Error de conexión con NocoDB',
      details: error.message
    });
  }
});

// ==========================================
// SERVIR FRONTEND EN PRODUCCIÓN
// ==========================================

if (process.env.NODE_ENV === 'production') {
  const distPath = join(__dirname, '..', 'dist');

  // Servir archivos estáticos
  app.use(express.static(distPath));

  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}

// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`🥗 NutraClínics Dashboard Server`);
  console.log(`   Puerto: ${PORT}`);
  console.log(`   Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   NocoDB: ${NOCODB_API_URL ? 'Configurado' : '⚠️  No configurado'}`);
});
