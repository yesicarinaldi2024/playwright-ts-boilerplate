# Política de Reintentos Críticos y Autocorrección

## Entorno Local de De QA
Valor de Reintentos Configurado: **0 o 1**.
La idea subyacente es la experimentación honesta. Si un Test E2E falla localmente al primer intento, revisa las Trazas (`playwright show-report`) e **identifica la verdadera falla**. No delegues al "Reintento a fuerza bruta" creyendo falsamente que el framework es confiable.

## Entorno CI/CD (Pipeline)
Valor de Reintentos Configurado: **2**.
La ejecución en cloud se expone a problemas de la red como micro-cortes, recursos demorados o fallos asíncronos imprevistos. Los reintentos estabilizan interacciones fallidas; no obstante, debe levantarse una bandera de alerta técnica para cualquier test que sobrepase su primer intento "Natural".

## Sistema Iterativo de Corrección
Todo test roto nos obliga a pensar según causa-raíz y repararlo de esta forma:
1. **Verificar Visibilidad**: ¿Falla de red? → Añadir waitForResponse. 
2. **Revisar Capas / Modales**: ¿Un elemento bloqueante como un "loader"? → Agregar waitFor para su desaparición.
3. **Selectores Desafortunados**: Refactorizar con `getByTestId` implementado en la aplicación web para aislar el elemento.
