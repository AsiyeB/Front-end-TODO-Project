import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';
import './../../assets/scss/style_dialog.scss';

@inject(DialogController)

export class Prompt {
  constructor(controller) {
    this.controller = controller;
    this.answer = null;

    // controller.settings.centerHorizontalOnly = true;
    controller.settings.centerVerticalOnly = true;
  }
  activate(message) {
    this.message = message;
  }
}
