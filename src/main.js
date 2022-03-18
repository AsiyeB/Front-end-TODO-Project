// regenerator-runtime is to support async/await syntax in ESNext.
// If you don't use async/await, you can remove regenerator-runtime.
import 'regenerator-runtime/runtime';
import 'bootstrap';
import environment from './environment';
import { PLATFORM } from 'aurelia-pal';
import AuthService from 'AuthService';
import 'toastr/build/toastr.css';
export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .aurelia.use.plugin(PLATFORM.moduleName('aurelia-validation'))
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  //Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  //if the css animator is enabled, add swap-order="after" to all router-view elements

  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin(PLATFORM.moduleName('aurelia-dialog'), config => {
      config.useDefaults();
      config.settings.lock = true;
      config.settings.centerHorizontalOnly = false;
      config.settings.startingZIndex = 5;
      config.settings.keyboard = true;
    });
  aurelia.start().then(() => {
    let auth = aurelia.container.get(AuthService);
    console.log('add ' + auth.isAuthenticated());
    let root = auth.isAuthenticated() ? PLATFORM.moduleName('app') : PLATFORM.moduleName('component/login/login');
    // let root = 'app';
    aurelia.setRoot(root);
    // aurelia.setRoot(PLATFORM.moduleName('component/login/login'));
  });
}
