# Guía de Instalación — Dashboard CRM

> **Autor:** Javier Vrandečić — Consultor en Automatización IA | [Innovarketing.com](https://innovarketing.com)
> **Stack:** React + Vite · Express · NocoDB · Docker · Easypanel

---

## Prerequisitos

- Cuenta en [GitHub](https://github.com)
- Servidor con [Easypanel](https://easypanel.io) instalado
- Instancia de NocoDB con la tabla de leads del cliente configurada
- Node.js 20+ (solo para desarrollo local)

---

## Paso 1 — Crear el repositorio del nuevo cliente

### Opción A: Duplicar desde GitHub (recomendado)
1. Ir a `https://github.com/ubermancl/nutraclinics-dashboard`
2. Hacer clic en el botón **Use this template** → **Create a new repository**
3. Nombrar el repositorio: `cliente-dashboard` (ej: `clinicavital-dashboard`)
4. Visibilidad: **Private**
5. Clic en **Create repository**

### Opción B: Clonar manualmente
```bash
git clone https://github.com/ubermancl/nutraclinics-dashboard.git nuevo-cliente-dashboard
cd nuevo-cliente-dashboard
# Desconectar del repo original y conectar al nuevo
git remote set-url origin https://github.com/TU_USUARIO/nuevo-cliente-dashboard.git
git push -u origin main
```

---

## Paso 2 — Personalizar el branding del cliente

Abrir el archivo `src/config/client.js`:

```js
export const CLIENT_CONFIG = {
  name: 'NombreDelCliente',   // ← Nombre que aparece en el header y en el PDF
  logo: '🥗',                  // ← Emoji del logo (cambiar según rubro)
  logoUrl: null,               // ← URL de imagen si tienen logo propio
                               //   Ej: '/logo.png' (colocar en /public)
                               //   Ej: 'https://cliente.com/logo.png'
};
```

**Emojis sugeridos por rubro:**
| Rubro | Emoji |
|-------|-------|
| Nutrición / Salud | 🥗 🥦 🍎 |
| Clínica / Médico | 🏥 ⚕️ 💊 |
| Fitness / Gym | 💪 🏋️ |
| Dental | 🦷 |
| Psicología | 🧠 |
| Estética / Belleza | 💆 ✨ |
| Legal | ⚖️ |
| Inmobiliaria | 🏠 |

Guardar los cambios y hacer commit:

```bash
git add src/config/client.js
git commit -m "Branding: configurar cliente [nombre]"
git push
```

---

## Paso 3 — Variables de entorno necesarias

Estas variables se configuran en Easypanel (NO en el código).
Referencia: archivo `.env.example` en la raíz del proyecto.

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NOCODB_API_URL` | URL completa de la tabla de leads en NocoDB | `https://crm.cliente.pe/api/v2/tables/TABLA_ID/records` |
| `NOCODB_API_TOKEN` | Token xc-token de NocoDB (Settings → Tokens) | `xGh2k3...` |
| `DASHBOARD_PASSWORD` | Contraseña de acceso al dashboard para el cliente | `cliente2024!` |
| `JWT_SECRET` | Cadena aleatoria de mínimo 32 caracteres para firmar sesiones | Ver generador abajo |
| `NODE_ENV` | Modo de ejecución | `production` |
| `PORT` | Puerto interno del servidor | `3000` |

### Generar JWT_SECRET seguro
```bash
# En cualquier terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copiar el resultado (64 caracteres) como valor de `JWT_SECRET`.

### Obtener NOCODB_API_URL
1. En NocoDB, abrir la tabla de leads del cliente
2. Clic en **Details** (esquina superior derecha) → **REST APIs**
3. Copiar la URL que termina en `/records`

### Obtener NOCODB_API_TOKEN
1. En NocoDB → **Team & Settings** → **API Tokens**
2. Crear nuevo token o copiar uno existente
3. El token comienza con `xc-...`

---

## Paso 4 — Configurar la app en Easypanel

### 4.1 Crear la aplicación
1. En Easypanel → **Projects** → seleccionar o crear proyecto
2. Clic en **+ Create Service** → **App**
3. Nombre del servicio: `cliente-dashboard`
4. Clic en **Create**

### 4.2 Conectar con GitHub
1. En la app creada → pestaña **Source**
2. Clic en **Connect GitHub**
3. Seleccionar el repositorio: `nuevo-cliente-dashboard`
4. Branch: `main`
5. Build method: **Dockerfile** (se detecta automáticamente)
6. Guardar

### 4.3 Configurar variables de entorno
1. Pestaña **Environment**
2. Agregar una por una las variables del Paso 3:
   ```
   NOCODB_API_URL     = https://...
   NOCODB_API_TOKEN   = xc-...
   DASHBOARD_PASSWORD = contraseña_segura
   JWT_SECRET         = cadena_de_64_caracteres
   NODE_ENV           = production
   PORT               = 3000
   ```
3. Clic en **Save**

### 4.4 Primer deploy
1. Pestaña **Deployments**
2. Clic en **Deploy** (o se activa automáticamente al guardar)
3. Ver los logs en tiempo real — el build tarda ~2-3 min
4. Cuando aparezca `🥗 Dashboard Server` en los logs, la app está lista

---

## Paso 5 — Configurar la puerta de entrada (dominio)

### 5.1 Subdominio propio (recomendado)
1. En Easypanel → app → pestaña **Domains**
2. Clic en **Add Domain**
3. Ingresar: `dashboard.cliente.com`
4. Easypanel genera automáticamente el certificado SSL (Let's Encrypt)
5. En el DNS del cliente, crear un registro:
   ```
   Tipo: CNAME
   Nombre: dashboard
   Valor: tu-servidor.easypanel.host
   TTL: 3600
   ```

### 5.2 Subdominio en tu servidor (más rápido)
1. En Easypanel → app → pestaña **Domains**
2. Usar el dominio generado automáticamente: `cliente-dashboard.TU_SERVIDOR.easypanel.host`
3. No requiere configuración DNS adicional

### 5.3 Puerto de acceso
El servidor expone el puerto `3000` internamente.
Easypanel maneja el proxy y el HTTPS — **no necesitas exponer el puerto al exterior**.

---

## Paso 6 — Verificar el funcionamiento

### Health check manual
Abrir en el navegador:
```
https://dashboard.cliente.com/api/health
```
Respuesta esperada:
```json
{ "status": "ok", "timestamp": "2026-02-20T..." }
```

### Login
1. Abrir `https://dashboard.cliente.com`
2. Ingresar la contraseña configurada en `DASHBOARD_PASSWORD`
3. Verificar que los leads cargan correctamente

### Diagnóstico si algo falla
```
❌ "Error al cargar datos" → Revisar NOCODB_API_URL y NOCODB_API_TOKEN
❌ Login no funciona     → Revisar DASHBOARD_PASSWORD y JWT_SECRET
❌ Página en blanco      → Ver logs en Easypanel → Deployments
❌ Build falla           → Ver logs de build, posible error en node_modules
```

---

## Paso 7 — Auto-deploy al hacer cambios

Una vez conectado GitHub, cada `git push` al branch `main` dispara un deploy automático en Easypanel.

**Flujo de trabajo para actualizaciones:**
```bash
# 1. Hacer cambios localmente (branding, features, etc.)
# 2. Subir a GitHub
git add .
git commit -m "Actualización para [cliente]"
git push origin main
# 3. Easypanel detecta el push y redespliega automáticamente (~2-3 min)
```

---

## Resumen rápido (checklist)

```
[ ] Repositorio creado en GitHub (desde template)
[ ] src/config/client.js actualizado con nombre y logo del cliente
[ ] Commit y push del branding al repo
[ ] App creada en Easypanel y conectada al repo
[ ] Variables de entorno configuradas (5 variables)
[ ] Primer deploy exitoso (health check responde OK)
[ ] Dominio configurado (subdominio o custom domain)
[ ] Login probado con la contraseña del cliente
[ ] URL entregada al cliente
```

---

## Archivos clave del proyecto

```
dashboard/
├── src/
│   ├── config/
│   │   └── client.js          ← BRANDING: nombre, logo, logoUrl
│   ├── components/            ← Componentes React del dashboard
│   ├── hooks/                 ← useLeads, useStats, useAuth
│   └── utils/
│       └── calculations.js    ← Toda la lógica de cálculo de métricas
├── server/
│   └── index.js               ← Servidor Express (proxy NocoDB + auth)
├── .env.example               ← Referencia de variables de entorno
├── Dockerfile                 ← Build multistage para producción
└── DEPLOYMENT.md              ← Esta guía
```

---

*Guía mantenida por Javier Vrandečić — [Innovarketing.com](https://innovarketing.com)*
