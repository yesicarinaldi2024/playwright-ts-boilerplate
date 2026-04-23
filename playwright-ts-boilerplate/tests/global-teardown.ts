import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';

/**
 * Script de limpieza global que convierte automáticamente los videos .webm de Playwright
 * al formato .mp4 solicitado por el usuario.
 */
async function globalTeardown(config: FullConfig) {
  const resultsDir = path.resolve(config.rootDir, 'reports/test-results');

  if (!fs.existsSync(resultsDir)) {
    console.log('No se encontró el directorio de resultados para conversión.');
    return;
  }

  // Configurar la ruta de ffmpeg estática una sola vez
  if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
  }

  const convertFiles = async (dir: string) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        await convertFiles(filePath);
      } else if (file.endsWith('.webm')) {
        const outputFilePath = filePath.replace('.webm', '.mp4');

        console.log(`Convirtiendo evidencia: ${file} -> .mp4`);

        await new Promise((resolve) => {
          ffmpeg(filePath)
            .output(outputFilePath)
            .videoCodec('libx264')
            .on('end', () => {
              // Eliminar el archivo original .webm para dejar solo la evidencia solicitada
              // try {
              //   fs.unlinkSync(filePath);
              // } catch (e) {}
              resolve(true);
            })
            .on('error', (err) => {
              console.error(`Error convirtiendo ${file}:`, err);
              resolve(true);
            })
            .run();
        });
      }
    }
  };

  try {
    await convertFiles(resultsDir);
    console.log('Conversión de evidencias a MP4 finalizada con éxito.');
  } catch (error) {
    console.error('Error durante la fase de post-procesamiento de videos:', error);
  }
}

export default globalTeardown;
