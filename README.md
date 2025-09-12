# Tiendas Patito - Frontend

Sistema de gestión de pedidos de camionetas para Tiendas Patito. Frontend desarrollado con React, Vite, y tecnologías modernas.

## 🚀 Características

- ✅ **React 18** con hooks modernos
- ✅ **Vite** para desarrollo rápido
- ✅ **React Router** para navegación
- ✅ **Redux Toolkit** para estado global
- ✅ **React Query** para manejo de datos del servidor
- ✅ **Formik + Yup** para formularios y validación
- ✅ **Tailwind CSS** para estilos
- ✅ **Lucide React** para iconos
- ✅ **Axios** para peticiones HTTP
- ✅ **Diseño responsivo** y accesible

## 🏗️ Arquitectura

```
src/
├── components/          # Componentes reutilizables
│   ├── common/         # Componentes comunes
│   ├── forms/          # Componentes de formularios
│   ├── Layout/         # Layout principal
│   ├── orders/         # Componentes de pedidos
│   └── products/       # Componentes de productos
├── hooks/              # Hooks personalizados (React Query)
├── pages/              # Páginas principales
├── services/           # Servicios API
├── store/              # Redux store y slices
│   └── slices/         # Redux slices
└── utils/              # Utilidades
```

## 📋 Funcionalidades

### ✨ Gestión de Pedidos
- **Crear pedidos** con validación de inventario
- **Buscar productos** por HAWA o término
- **Validación de stock** en tiempo real
- **Proceso paso a paso** para creación de pedidos
- **Confirmación** con información completa

### 📊 Lista de Pedidos
- **Visualización completa** de todos los pedidos
- **Filtros avanzados** por estado y fechas
- **Búsqueda** por ID, cliente o vendedor
- **Actualización de estados** (pendiente/entregado/cancelado)
- **Restricción de cancelación** (10 minutos máximo)

### 🔍 Detalles de Pedido
- **Vista completa** del pedido
- **Información del cliente** y vendedor
- **Desglose de productos** y costos
- **Auditoría** de fechas e IP
- **Gestión de estados** con validaciones

### 🎨 Interfaz de Usuario
- **Diseño moderno** y responsive
- **Notificaciones** en tiempo real
- **Estados de carga** y manejo de errores
- **Navegación intuitiva**
- **Accesibilidad** optimizada

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd patito-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
crear archivo de .env y agregar esto
# URL base de la API del backend requerido
VITE_API_BASE_URL=http://localhost:8080/api

# Configuración de desarrollo opcional
VITE_APP_NAME="Tiendas Patito"
VITE_APP_VERSION="1.0.0"

# Configuración de React Query opcional
VITE_QUERY_STALE_TIME=300000
VITE_QUERY_CACHE_TIME=600000
# Editar .env con la configuración correcta
```

4. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```



## 🏃‍♂️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
npm run test         # Ejecutar tests
npm run test:ui      # Tests con interfaz
```

## 🗂️ Componentes Principales

### 📄 Páginas
- **HomePage**: Dashboard principal con estadísticas
- **CreateOrderPage**: Proceso de creación de pedidos
- **OrdersListPage**: Lista y gestión de pedidos
- **OrderDetailPage**: Detalle completo del pedido
- **RegisterPage**: Registrar un nuevo usuario
- **LoginPage**: Login para ingresar al sistema

### 🧩 Componentes
- **Layout**: Estructura principal con navegación
- **CustomerForm**: Formulario de información del cliente
- **ProductSearch**: Búsqueda y selección de productos
- **OrderSummary**: Resumen antes de confirmar
- **OrderConfirmation**: Confirmación post-creación
- **StatusBadge**: Badge de estados
- **NotificationContainer**: Sistema de notificaciones

### 🎣 Hooks Personalizados
- **useOrders**: Gestión de pedidos con React Query
- **useProduct**: Búsqueda de productos
- **useProductSearch**: Búsqueda con debounce
- **useCreateOrder**: Creación de pedidos
- **useUpdateOrderStatus**: Actualización de estados

## 🔄 Flujo de Trabajo

### Crear Pedido
1. **Información básica**: Cliente, vendedor, tienda
2. **Selección de productos**: Búsqueda y validación de stock
3. **Resumen**: Verificación de datos y costos
4. **Confirmación**: Creación exitosa y navegación

### Gestión de Estados
```
pendiente → entregado ✅
pendiente → cancelado ✅ (solo primeros 10 min)
entregado → [final] ❌
cancelado → [final] ❌
```

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Navegación adaptiva**: Menú colapsable en móviles
- **Tablas responsivas**: Scroll horizontal cuando necesario

## 🎨 Sistema de Diseño

### Colores
- **Primario**: Blue-600 (#2563eb)
- **Éxito**: Green-600 (#16a34a)
- **Advertencia**: Yellow-600 (#ca8a04)
- **Error**: Red-600 (#dc2626)
- **Grises**: Gray-50 a Gray-900

### Tipografía
- **Fuente**: Inter (fallback: system fonts)
- **Tamaños**: text-xs a text-4xl
- **Pesos**: font-normal, font-medium, font-semibold, font-bold

## 🚀 Optimizaciones

- **Code splitting** automático por rutas
- **Lazy loading** de componentes pesados
- **Caché inteligente** con React Query
- **Bundle optimizado** con Vite
- **Tree shaking** automático

## 🔒 Seguridad

- **Validación client-side** con Yup
- **Sanitización** de inputs
- **Headers de auditoría** en todas las peticiones
- **Manejo seguro** de datos sensibles



## 🚀 Deployment

### Build de Producción
```bash
npm run build
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📝 Notas Técnicas

### Estado Global (Redux)
- **orderSlice**: Estado del pedido actual y lista de pedidos
- **uiSlice**: Estados de UI, notificaciones y filtros

### Gestión de Caché (React Query)
- **Tiempo de vida**: 5 minutos por defecto
- **Reintento**: 1 vez en caso de error
- **Invalidación**: Automática después de mutaciones

### Auditoría
- **Fecha/hora**: ISO string automático
- **IP del usuario**: Header X-User-IP
- **Timestamp**: Header X-Timestamp

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contactar al equipo de desarrollo.

---

**Tiendas Patito** - Sistema de Gestión de Pedidos v1.0.0