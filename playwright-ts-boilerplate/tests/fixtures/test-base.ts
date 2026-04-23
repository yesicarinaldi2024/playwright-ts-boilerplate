import { test as baseTest, expect } from '@playwright/test';
import { PaginaLogin } from '../../pages/PaginaLogin';
import { Encabezado } from '../../components/Encabezado';
import { PaginaAcceso } from '../../pages/PaginaAcceso';
import { PaginaDashboard } from '../../pages/PaginaDashboard';
import { PaginaOrganizacion } from '../../pages/PaginaOrganizacion';
import { PaginaCatalogo } from '../../pages/PaginaCatalogo';
import { PaginaPrecios } from '../../pages/PaginaPrecios';
import { PaginaOperaciones } from '../../pages/PaginaOperaciones';
import { PaginaMedia } from '../../pages/PaginaMedia';
import { PaginaTemas } from '../../pages/PaginaTemas';
import { PaginaUsuarios } from '../../pages/PaginaUsuarios';
import { PaginaAuditoria } from '../../pages/PaginaAuditoria';
import { PaginaTenants } from '../../pages/PaginaTenants';
import { PaginaSucursales } from '../../pages/PaginaSucursales';
import { PaginaKioscos } from '../../pages/PaginaKioscos';
import { PaginaGruposKioscos } from '../../pages/PaginaGruposKioscos';

type FixturesArquitecturaTest = {
  paginaLogin: PaginaLogin;
  encabezado: Encabezado;
  paginaAcceso: PaginaAcceso;
  paginaDashboard: PaginaDashboard;
  paginaOrganizacion: PaginaOrganizacion;
  paginaCatalogo: PaginaCatalogo;
  paginaPrecios: PaginaPrecios;
  paginaOperaciones: PaginaOperaciones;
  paginaMedia: PaginaMedia;
  paginaTemas: PaginaTemas;
  paginaUsuarios: PaginaUsuarios;
  paginaAuditoria: PaginaAuditoria;
  paginaTenants: PaginaTenants;
  paginaSucursales: PaginaSucursales;
  paginaKioscos: PaginaKioscos;
  paginaGruposKioscos: PaginaGruposKioscos;
};

export const test = baseTest.extend<FixturesArquitecturaTest>({
  paginaLogin: async ({ page }, use) => { await use(new PaginaLogin(page)); },
  encabezado: async ({ page }, use) => { await use(new Encabezado(page)); },
  paginaAcceso: async ({ page }, use) => { await use(new PaginaAcceso(page)); },
  paginaDashboard: async ({ page }, use) => { await use(new PaginaDashboard(page)); },
  paginaOrganizacion: async ({ page }, use) => { await use(new PaginaOrganizacion(page)); },
  paginaCatalogo: async ({ page }, use) => { await use(new PaginaCatalogo(page)); },
  paginaPrecios: async ({ page }, use) => { await use(new PaginaPrecios(page)); },
  paginaOperaciones: async ({ page }, use) => { await use(new PaginaOperaciones(page)); },
  paginaMedia: async ({ page }, use) => { await use(new PaginaMedia(page)); },
  paginaTemas: async ({ page }, use) => { await use(new PaginaTemas(page)); },
  paginaUsuarios: async ({ page }, use) => { await use(new PaginaUsuarios(page)); },
  paginaAuditoria: async ({ page }, use) => { await use(new PaginaAuditoria(page)); },
  paginaTenants: async ({ page }, use) => { await use(new PaginaTenants(page)); },
  paginaSucursales: async ({ page }, use) => { await use(new PaginaSucursales(page)); },
  paginaKioscos: async ({ page }, use) => { await use(new PaginaKioscos(page)); },
  paginaGruposKioscos: async ({ page }, use) => { await use(new PaginaGruposKioscos(page)); },
});

export { expect };
