import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, Observable,merge } from 'rxjs';
import { debounceTime,} from 'rxjs/operators';
import { MessageProcessor } from '../message-processor/Message-Processor';
import { AuthenticationService } from '../services/authentication.service';
import { WhitespaceValidator } from '../Validators/whitespace.validator';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

title: string = 'Log in';

authenticationAlert: string;
displayMessage: { [key: string]: string };
passwordToggleMessage: string;
passwordInputType: string;
loginForm: FormGroup;

private validationMessages: { [key: string]: { [key: string]: string } };
private msgProcessor: MessageProcessor;

  constructor(private formBuilder: FormBuilder, 
    private authService: AuthenticationService, 
    private router: Router) { 

      this.displayMessage = {};
      this.authenticationAlert = '';

      this.validationMessages = {
        username: {
          required: 'Please enter your username.',
          minlength: `Your username must contain at least 3 characters.`,
          maxlength: `Your username must contain less than 15 characters.` 
        },
        password: {
          required: 'Please enter your chosen password.',
          maxLength: `Your password must contain less than 15 characters.`,
          pattern: 'Please enter a valid password.'
        }
      }
      this.msgProcessor = new MessageProcessor(this.validationMessages);
    }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group (
      {
        username: ['', [Validators.required, 
                        Validators.minLength(3), 
                        Validators.maxLength(15), 
                        WhitespaceValidator.removeSpaces]],
        password: ['', [Validators.required, 
                        Validators.maxLength(15),
                        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/), 
                        WhitespaceValidator.removeSpaces]]
      }
    );
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.loginForm.valueChanges, ...controlBlurs)
      .pipe(debounceTime(800))
        .subscribe(() => {
          this.displayMessage = this.msgProcessor.processMessages(this.loginForm, null);
        });
  }

  onSubmit(): void {
    let userLoginDetails: Object = {
      username: this.loginForm.get('username').value,
      password: this.loginForm.get('password').value
    }
    this.authService.authenticateUser(userLoginDetails)
      .subscribe({
        next: () => this.onLoginComplete(),
        error: () => this.authenticationAlert = 'Invalid login credentials.'
      })
  }
 
  onLoginComplete(): void {
    this.authenticationAlert = '';
    this.loginForm.reset();
    this.passwordInputType = 'password';
    this.passwordToggleMessage = 'show password';
    this.router.navigate(['/advert-list', 'all-adverts']);
  }

}
