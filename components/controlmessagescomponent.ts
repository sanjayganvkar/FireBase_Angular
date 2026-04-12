

import { Component, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ValidationserviceProvider } from '../providers/dbservice/validationservice';

@Component({
  selector: 'control-messages',
  template: `<ion-label style="margin-left:16px;color:#ea6153;" *ngIf="errorMessage !== null">{{errorMessage}}</ion-label>`
})
export class ControlMessagesComponent {
  //  errorMessage: string;
  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (let propertyName in this.control.errors) {

      if (this.control.errors.hasOwnProperty(propertyName) && (this.control.dirty || this.control.touched)) {

        return ValidationserviceProvider.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }
}


