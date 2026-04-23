import { Page, Locator, expect } from '@playwright/test';
import { PaginaBase } from './PaginaBase';
import { WaitHelper } from '../utils/esperas';

export class PaginaLogin extends PaginaBase {
  readonly inputUsuario: Locator;
  readonly inputClave: Locator;
  readonly botonIngresar: Locator;
  readonly mensajeError: Locator;

  constructor(page: Page) {
    super(page);
    this.inputUsuario = page.locator('#username');
    this.inputClave = page.locator('#password');
    this.botonIngresar = page.locator('#kc-login');
    this.mensajeError = page.locator('#input-error, .so-input-error');
  }

  async visitarLogin() {
    // Si baseURL ya está en el config, usar ruta relativa.
    const url = process.env.URL_BASE ? `${process.env.URL_BASE}/login` : '/login';
    await this.visitar(url);
    // Esperar a que los campos de login estén visibles
    await expect(this.inputUsuario).toBeVisible({ timeout: 15000 });
  }

  async iniciarSesionUsuario(usuario: string, clave: string) {
    // Esperar a que los campos estén visibles y habilitados
    await expect(this.inputUsuario).toBeVisible({ timeout: 15000 });
    await expect(this.inputUsuario).toBeEnabled({ timeout: 15000 });
    await expect(this.inputClave).toBeVisible({ timeout: 15000 });
    await expect(this.inputClave).toBeEnabled({ timeout: 15000 });

    // Llenar los campos
    await this.inputUsuario.fill(usuario);
    await this.page.waitForTimeout(400);
    await this.inputClave.fill(clave);
    await this.page.waitForTimeout(400);

    // Hacer click en el botón
    await expect(this.botonIngresar).toBeVisible({ timeout: 15000 });
    await expect(this.botonIngresar).toBeEnabled({ timeout: 15000 });
    await this.botonIngresar.click();

    // Esperar a que se complete la autenticación
    await WaitHelper.esperarCargaDOMBasica(this.page);
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(600);
  }

  async ingresarComoAdministrador() {
    const user = process.env.USUARIO_TEST;
    const pass = process.env.PASSWORD_TEST;
    if (!user || !pass) {
      throw new Error('Faltan credenciales seguras. Inyecta USUARIO_TEST y PASSWORD_TEST en tu archivo .env');
    }
    await this.iniciarSesionUsuario(user, pass);
  }

  // Alias legacy para compatibilidad con autogenerador
  async autenticar() {
    await this.ingresarComoAdministrador();
  }

  async comprobarAlertaCredencialesInvalidas() {
    await expect(this.mensajeError.first()).toBeVisible({ timeout: 5000 });
  }
}
