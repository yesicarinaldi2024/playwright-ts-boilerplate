# Estrategia de Selectores (Locators)

Nuestra prioridad para ubicar elementos minimizando fallos a largo plazo se rige por:

1. **`getByRole`** *(PRIORIDAD LA MÁS ALTA)*
Refleja explícitamente cómo logran interactuar los usuarios (y herramientas de asistencia visual) con tu app.
Ejemplo: `await page.getByRole('button', { name: 'Guardar cambios' })`

2. **`getByTestId`** *(PRIORIDAD EXCELENTE)*
Para situaciones en dominios técnicos complejos en donde "Role" o texto visible no alcancen. Actúa como contrato fuerte entre front-end builder y QA automatizador.
Agrega al HTML de tu app: `<div data-testid="mensaje-error">...</div>`
Selecciona así: `await page.getByTestId('mensaje-error')`

3. **`getByText`** o **`getByPlaceholder`** *(BUENA)*
Tienen buena usabilidad y representan directamente lo que ve la persona en pantalla. Vulnerable en aplicaciones donde hay cambio frecuente en los copys (texto) o traducciones.

4. **Selectores CSS anidados** o **XPath Absoluto** *(ESTRICTAMENTE PROHIBIDOS)*
Formas complejas como `div > ul > li:nth-child(2) > a` colapsarán en cuanto un diseñador o desarrollador añada un div extra al árbol de documentos. Evítalos o fallarán las revisiones de tu PR (Pull Request).
