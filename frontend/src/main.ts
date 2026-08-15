import { bootstrapApplication } from '@angular/platform-browser';
import { configuracionAplicacion } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, configuracionAplicacion).catch((error) => console.error(error));
