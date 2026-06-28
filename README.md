# AURA 🔮

Red social modular, real desde el primer momento — sin datos demo. Conectada a Supabase real (auth, posts, Ecos, red de interacción).

## Estado actual (real y funcional)
- ✅ Registro / login real (Supabase Auth)
- ✅ Publicaciones reales (crear y ver feed)
- ✅ **Ecos** (hilos) reales
- ✅ Perfil + **Red de interacción** (seguir / dejar de seguir) real
- ✅ UI morada, glassmorphism, estilo iPhone (blur)

## Lo que falta (roadmap, se agrega real por etapas — no de un golpe)
Reels con autoplay, reconocimiento facial, mensajes, IA (NexusAI), personalización avanzada de interfaz, gamificación, integraciones externas. Ver lista completa de 100 ideas en el chat — se irán implementando una por una, todas reales.

## Estructura de archivos
```
/
├── index.html          # Solo estructura + enlaces a módulos
├── css/
│   └── style.css
├── js/
│   ├── supabase-client.js  # Conexión real a Supabase
│   ├── auth.js             # Login/registro real
│   ├── feed.js              # Posts reales
│   ├── ecos.js              # Hilos (Ecos) reales
│   ├── network.js          # Seguir/red de interacción real
│   └── app.js                # Conecta todo a la UI
└── schema.sql            # Ejecutar en Supabase SQL Editor
```

## Cómo ponerlo en marcha
1. Crea un repo nuevo en GitHub y sube todos estos archivos manteniendo la estructura de carpetas.
2. Ve a tu proyecto en Supabase → **SQL Editor** → pega y ejecuta todo el contenido de `schema.sql`.
3. Activa GitHub Pages: Settings → Pages → Branch `main` → carpeta raíz.
4. Abre la URL que te da GitHub Pages. Ya puedes registrarte y usar la app de verdad.

No necesitas instalar nada ni usar terminal: todo corre desde el navegador (Android incluido).

## Próximos pasos sugeridos
Dime cuál de las 100 funciones quieres que construya primero (sugerencia: Reels con autoplay, o Mensajes), y la implemento completa y real, módulo por módulo, igual que esta base.
