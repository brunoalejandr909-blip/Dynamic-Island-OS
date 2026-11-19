# Dynamic Island OS — Liquid Glass Edition

Starter project: HTML, CSS, JavaScript, Vite and Capacitor.

## Incluye
- Interfaz Liquid Glass adaptable a móvil.
- Reloj en vivo.
- Mensajes de demostración en la isla.
- Temporizador de 10 segundos mientras la app está abierta.
- Vibración opcional si el navegador/dispositivo la permite.
- Configuración inicial para Capacitor Android.
- GitHub Actions para generar un APK debug como artefacto.

## Importante
Esto es un prototipo inicial, NO la app final. Todavía no implementa overlay persistente sobre otras apps, acceso a notificaciones Android, controles de MediaSession ni integración de llamadas. Esas funciones necesitan código Android nativo, permisos especiales y pruebas en el Moto G72.

## Requisitos
Node.js 20+, npm y Android Studio.

## Ejecutar prototipo web
```bash
npm install
npm run dev
```

## Preparar Android
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

En Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s).
