import { AbstractControl } from "@angular/forms";

export class WhitespaceValidator {
  static removeSpaces(control: AbstractControl): {[key: string]: boolean} {
    if (control && control.value) {
      let removedSpaces = control.value.split(' ').join('');
      control.value !== removedSpaces && control.setValue(removedSpaces);
    }
    return null;
  }  
}