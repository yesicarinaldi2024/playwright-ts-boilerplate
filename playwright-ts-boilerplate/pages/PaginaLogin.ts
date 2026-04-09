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
    this.inputUsuario = page.locator('#username, [name="username"], [data-testid="username"]').first();
    this.inputClave = page.locator('#password, [name="password"], [data-testid="password"]').first();
    this.botonIngresar = page.locator('#kc-login, [type="submit"], button:has-text("Iniciar"), button:has-text("Sign In")').first(); 
    this.mensajeError = page.locator('#input-error, .alert-error, #kc-error-message, [data-testid="error"]').first();
  }

  async visitarLogin() {
    await this.visitar(process.env.URL_BASE || 'https://bo-dexorder-qa.dexmanager.com/login');
  }

  async iniciarSesionUsuario(usuario: string, clave: string) {
    await this.inputUsuario.fill(usuario);
    await this.inputClave.fill(clave);
    await this.botonIngresar.click();
    await WaitHelper.esperarCargaDOMBasica(this.page);
  }

  async ingresarComoAdministrador() {
    await this.iniciarSesionUsuario(process.env.USUARIO_TEST || 'test@test.com', process.env.PASSWORD_TEST || 'testpass123!');
  }

  // Alias legacy para compatibilidad con autogenerador
  async autenticar() {
      await this.ingresarComoAdministrador();
  }

  async comprobarAlertaCredencialesInvalidas() {
    await expect(this.mensajeError).toBeVisible({ timeout: 5000 });
  }
}
