# Dynamic Island OS — Ultimate Liquid Glass

Aplicación Android basada en HTML5, CSS3, JavaScript y Capacitor 6. Desarrollo incremental: las funciones no implementadas se identifican explícitamente en la interfaz.

## Implementado en esta versión
- Interfaz Liquid Glass adaptable a móvil.
- Isla interactiva compacta/expandida dentro de la app.
- Reloj y fecha locales.
- Temporizador con deadline basado en reloj del sistema, persistencia con Capacitor Preferences y notificación local programada.
- Cronómetro con pausa, reanudación y vueltas.
- Workflow GitHub Actions para compilar un APK debug y publicarlo como artefacto.

## Aún no implementado
- Servicio Android de superposición persistente.
- NotificationListenerService para notificaciones de otras aplicaciones.
- Puente MediaSession para controles multimedia.
- Detección/control de llamadas.
- Eventos de batería, Bluetooth y auriculares dentro de la isla.
- Gestor nativo de actividades simultáneas y recuperación tras reinicios.

No se muestran datos falsos para estas funciones. Requieren módulos Android nativos y pruebas en hardware real.

## Requisitos
- Node.js 20+
- Java 17
- Android SDK / Android Studio para compilación local

## Desarrollo
```bash
npm install
npm run dev
```

## Compilar Android
```bash
npm install
npm run build
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```
APK: `android/app/build/outputs/apk/debug/app-debug.apk`

## GitHub Actions
El workflow `.github/workflows/build-apk.yml` se ejecuta al hacer push a main o manualmente desde Actions. Configura Node, Java y Android SDK, instala dependencias, sincroniza Capacitor, compila Gradle y publica el APK debug como artifact.

## Permisos
La notificación local del temporizador usa Capacitor Local Notifications. Android puede pedir permiso para publicar notificaciones. Esta versión no solicita acceso a notificaciones de otras aplicaciones ni permiso de superposición.
