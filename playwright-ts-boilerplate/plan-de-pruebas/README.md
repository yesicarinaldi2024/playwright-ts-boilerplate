# Repo de Planes y Casos de Prueba 📋

Esta carpeta almacena el análisis analítico y diseño de pruebas. Los archivos aquí son un paso intermedio (y obligatorio para la trazabilidad) entre los Requerimientos Funcionales (`/contexto`) y el desarrollo de la automatización en código (`/tests`).

## Dinámica
* A partir de un Documento de Contexto Funcional, se generan baterías de casos (Test Cases).
* Se organizan en documentos de Plan de Prueba por cada Feature.
* El ingeniero E2E utilizará estos Test Cases para guiar la codificación en Playwright (Ej: `test.describe` y `test()`).

> Ver **[plantilla-de-plan.md](./plantilla-de-plan.md)** para asegurar un estándar consistente que simplifique al bot o a un humano la redacción.
