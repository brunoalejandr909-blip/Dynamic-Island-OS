# Dynamic Island OS — v2.0

Aplicación Android/Web con interfaz Liquid Glass y herramientas locales.

## Incluye
- Reloj y fecha en vivo.
- Temporizador con pausa, reinicio y recuperación del estado guardado.
- Cronómetro con vueltas.
- Panel de actividad dentro de la aplicación.
- Tema claro/oscuro.
- Proyecto preparado con Capacitor 6 y Vite.

## Estado real de las integraciones Android
La interfaz y las herramientas locales están implementadas. **Todavía no** están implementados el servicio Android de escucha de notificaciones, la ventana flotante sobre otras aplicaciones, la integración con MediaSession, la detección de llamadas ni los eventos nativos de batería/conectividad. La app los identifica como pendientes y no finge que funcionen.

## Desarrollo
- Node.js 20+
- npm install
- npm run dev

## Compilar APK
- npm install
- npm run build
- npx cap add android
- npx cap sync android
- cd android && ./gradlew assembleDebug

El workflow de GitHub Actions compila un APK debug y lo publica como artifact cuando se ejecuta correctamente.
