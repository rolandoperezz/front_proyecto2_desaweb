# 🏀 Frontend - Sistema de Gestión de Basquetbol

Aplicación web desarrollada en Angular 18 para la gestión integral de equipos de basquetbol. Interfaz moderna y responsive construida con PrimeNG y Bulma.

## 📋 Descripción

Frontend del sistema de gestión de equipos de basquetbol que permite administrar equipos, jugadores y partidos. La aplicación cuenta con autenticación JWT, diferentes niveles de permisos y una interfaz intuitiva para la gestión deportiva.

### Funcionalidades Principales

- **Autenticación**: Sistema de login con JWT y gestión de sesiones
- **Gestión de Equipos**: CRUD completo con búsqueda y filtros
- **Gestión de Jugadores**: Administración por equipo con filtros por posición
- **Gestión de Partidos**: Creación y seguimiento de partidos
- **Roles y Permisos**: Diferentes vistas según rol de usuario
- **Interfaz Responsive**: Diseño adaptable a diferentes dispositivos

## 🚀 Tecnologías

- **Angular 18.2.0**
- **TypeScript 5.5.2**
- **PrimeNG 17.18.15** - Componentes UI
- **Bulma 0.9.4** - Framework CSS
- **PrimeFlex 4.0.0** - Utilidades CSS
- **RxJS 7.8.0** - Programación reactiva
- **Moment.js 2.30.1** - Manipulación de fechas
- **Notiflix 3.2.8** - Notificaciones

## 📦 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- [Angular CLI](https://angular.io/cli) (v18)

```bash
# Instalar Angular CLI globalmente
npm install -g @angular/cli@18
```

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/rolandoperezz/front_proyecto2_desaweb.git
cd front_proyecto2_desaweb
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la URL del Backend

Edita el archivo `src/app/services/consultas.service.ts` y actualiza la URL base:

```typescript
private baseUrl = 'http://localhost:5062'; // Cambia esto según tu configuración
```

## 🏃‍♂️ Ejecución

### Modo Desarrollo

```bash
npm start
# o
ng serve
```

La aplicación estará disponible en: `http://localhost:4200`

### Compilación para Producción

```bash
npm run build
# o
ng build
```

Los archivos compilados se generarán en el directorio `dist/`.

### Modo Watch (desarrollo con recarga automática)

```bash
npm run watch
```

## 📁 Estructura del Proyecto

```
front_proyecto2_desaweb/
├── .angular/                   # Caché de Angular
├── .vscode/                    # Configuración de VS Code
├── dist/                       # Archivos compilados
├── node_modules/               # Dependencias
├── public/                     # Recursos públicos estáticos
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── auth/              # Módulo de autenticación
│   │   │   ├── auth-home/     # Componente contenedor auth
│   │   │   ├── login/         # Componente de login
│   │   │   ├── auth-routing.module.ts
│   │   │   └── auth.module.ts
│   │   ├── error/             # Módulo de manejo de errores
│   │   ├── pages/             # Módulo principal de páginas
│   │   │   ├── equipos/       # Gestión de equipos
│   │   │   ├── inicio/        # Página de inicio
│   │   │   ├── jugadores/     # Gestión de jugadores
│   │   │   ├── pages-home/    # Layout principal
│   │   │   ├── partidos/      # Gestión de partidos
│   │   │   ├── verpartidos/   # Vista de partidos
│   │   │   ├── pages-routing.module.ts
│   │   │   └── pages.module.ts
│   │   ├── services/          # Servicios de la aplicación
│   │   │   └── consultas.service.ts
│   │   ├── app-routing.module.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── index.html             # HTML principal
│   ├── main.ts                # Punto de entrada
│   └── styles.scss            # Estilos globales
├── .editorconfig              # Configuración del editor
├── .gitignore                 # Archivos ignorados por Git
├── angular.json               # Configuración de Angular
├── package.json               # Dependencias del proyecto
├── package-lock.json          # Lock de dependencias
├── README.md                  # Este archivo
├── tsconfig.app.json          # Config TypeScript (app)
├── tsconfig.json              # Config TypeScript (base)
└── tsconfig.spec.json         # Config TypeScript (tests)
```

## 🔐 Autenticación y Seguridad

### Sistema de Token JWT

La aplicación utiliza un interceptor HTTP para:
- Agregar automáticamente el token JWT en todas las peticiones
- Manejar errores 401 (No autorizado)
- Redireccionar al login cuando el token expira

**Token Interceptor** (`src/app/services/token.interceptor.ts`):
```typescript
// El interceptor se encarga de:
// 1. Añadir el header Authorization: Bearer {token}
// 2. Capturar errores 401 y limpiar sesión
// 3. Redirigir automáticamente al login
```

### Almacenamiento Local

La aplicación guarda en `localStorage`:
- `token`: Token JWT de autenticación
- `username`: Nombre de usuario
- `role`: Rol del usuario (Administrador/Usuario)

## 🛣️ Rutas de la Aplicación

### Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/auth/login` | Página de inicio de sesión |
| `/pages/inicio` | Dashboard principal |
| `/pages/equipos` | Gestión de equipos |
| `/pages/jugadores` | Gestión de jugadores |
| `/pages/partidos` | Gestión de partidos |

### Estructura de Navegación

```
/ (Raíz)
├── /auth
│   └── /login
├── /pages
│   ├── /inicio
│   ├── /equipos
│   ├── /jugadores
│   └── /partidos
└── /error
```

## 🎨 Componentes UI

### Bibliotecas de Componentes

**PrimeNG**: Módulos utilizados en la aplicación

| Módulo | Uso |
|--------|-----|
| `PanelMenuModule` | Menú lateral de navegación |
| `ButtonModule` | Botones interactivos con estilos |
| `AvatarModule` | Avatares de usuario |
| `RippleModule` | Efectos ripple en elementos |
| `CardModule` | Tarjetas de contenido |
| `TableModule` | Tablas de datos con filtros y ordenamiento |
| `DialogModule` | Modales y diálogos |
| `ToolbarModule` | Barras de herramientas |
| `InputTextModule` | Campos de texto |
| `ToastModule` | Notificaciones tipo toast |
| `ConfirmDialogModule` | Diálogos de confirmación |
| `ProgressSpinnerModule` | Indicadores de carga |
| `DropdownModule` | Selectores dropdown |

**Servicios PrimeNG**:
- `MessageService` - Gestión de mensajes y notificaciones

**Bulma**: Framework CSS para
- Grid system
- Componentes básicos
- Estilos responsive

## 📡 Servicios

### ConsultasService

Servicio principal que maneja todas las peticiones HTTP al backend:

#### Autenticación
```typescript
login(payload: LoginRequest): Observable<LoginResponse>
logout(): void
```

#### Equipos
```typescript
list(searchTerm?, cityFilter?): Observable<EquipoDto[]>
get(id: number): Observable<EquipoDto>
create(payload): Observable<EquipoDto>
update(id, payload): Observable<void>
delete(id): Observable<void>
```

#### Jugadores
```typescript
getById(id: number): Observable<JugadorDto>
listByEquipo(equipoId, searchTerm?, positionFilter?): Observable<JugadorDto[]>
createJ(payload): Observable<string>
updateJ(id, payload): Observable<string>
deleteJ(id): Observable<string>
```

## 🔧 Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Compilar para producción
npm run build

# Modo watch (compilación continua)
npm run watch

# Ejecutar pruebas unitarias
npm test

# Ejecutar Angular CLI
npm run ng [comando]
```

## 🌐 Configuración para Producción

### 1. Actualizar URL del Backend

Edita `src/app/services/consultas.service.ts`:

```typescript
private baseUrl = 'https://tu-api.com'; // URL de producción
```

### 2. Compilar

```bash
npm run build
```

### 3. Configurar CORS en el Backend

Asegúrate de que tu backend permita el origen de producción en `appsettings.json`:

```json
{
  "AllowedOrigins": [
    "https://tu-dominio.com"
  ]
}
```

### 4. Desplegar

Los archivos compilados en `dist/` pueden ser desplegados en:
- **Vercel**
- **Netlify**
- **Firebase Hosting**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**

## 🔄 Conexión con el Backend

### Requisitos

1. El backend debe estar corriendo en `http://localhost:5062` (desarrollo)
2. El backend debe tener configurado CORS para permitir `http://localhost:4200`
3. Los endpoints de la API deben estar disponibles en `/api/Auth` y `/api/Admin`

### Verificar Conexión

```bash
# Backend debe estar corriendo
curl http://localhost:5062/api/Auth/roles

# Si funciona, el frontend podrá conectarse
```

## 🐛 Troubleshooting

### Error de CORS

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solución**: Verifica que el backend tenga configurado CORS correctamente en `Program.cs`.

### Token Expirado

El token JWT expira después de 60 minutos. La aplicación redirigirá automáticamente al login.

### Error al instalar dependencias

```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Puerto 4200 ocupado

```bash
# Usar un puerto diferente
ng serve --port 4201
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests con coverage
ng test --code-coverage
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Convenciones de Código

- Usar TypeScript strict mode
- Seguir la guía de estilos de Angular
- Componentes con prefijo `app-`
- Servicios en singular (`consultas.service.ts`)
- Interfaces exportadas desde los servicios

## 🔗 Enlaces Relacionados

- [Documentación de Angular](https://angular.io/docs)
- [Documentación de PrimeNG](https://primeng.org/)
- [Documentación de Bulma](https://bulma.io/documentation/)
- [Repositorio del Backend](enlace-al-backend)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autor

Tu Nombre - [@rolandoperezz](https://github.com/rolandoperezz)

## 📧 Contacto

Para preguntas o sugerencias: perezqrolando@gmail.com

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
