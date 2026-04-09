# Directivas para Pruebas Estables (Anti-Flaky)

1. **Aislamiento de pruebas (Test Isolation)**: Las pruebas no deben depender del estado dejado por otras pruebas. Usa fixtures o configuraciones `beforeEach`/`afterEach` limpias para inicializar el estado del test.
2. **Determinismo**: La misma prueba ejecutada con el mismo código de test y en la misma versión del entorno de la aplicación **debe** entregar siempre el mismo resultado.
3. **No uses `waitForTimeout` (o Sleeps estáticos)**: Nunca agregues pausas duras (ej: esperar 3 segundos). En su lugar, usa esperas inteligentes sobre condiciones del DOM (como que un botón específico se ha vuelto interactivo o visible).
4. **Datos de Prueba Dinámicos**: En lugar de depender de registros duros ("hardcodeados") en BD que un compañero podría modificar, genera datos únicos antes de la prueba, mockea lo necesario, y límpialos iterativamente.
5. **Independencia en Selectores Visuales**: Separa a los desarrolladores UI de los de automatización usando atributos fijos dedicados como el `data-testid` que se mantiene inmune a los rediseños CSS.
