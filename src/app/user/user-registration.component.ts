import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControlName } from '@angular/forms';
import { MatchValidator } from '../Validators/match.validator';
import { WhitespaceValidator } from '../Validators/whitespace.validator';
import { User } from '../models/User';
import { UserService } from "../services/userService";
import { Router } from '@angular/router';
import { MessageProcessor } from '../message-processor/Message-Processor';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
//view properties
title: string = 'Sign Up';
errorMessage: string;
duplicateUserAlert: string;
displayMessage: { [key: string]: string };
RegistrationForm: FormGroup;
passwordToggleMessage: string;
passwordInputType: string;

//Validation properties
private validationMessages: { [key: string]: { [key: string]: string } };
private msgProcessor: MessageProcessor;

  constructor(private formBuilder: FormBuilder, 
                private userService: UserService, 
                private router: Router) { 

                  this.displayMessage = {};
                  this.errorMessage = '';
                  this.duplicateUserAlert = '';
                  
                  this.validationMessages = {
                    username: {
                      required: 'Please enter your username.',
                      minlength: `Your username must contain at least 3 characters.`,
                      maxlength: `Your username must contain less than 15 characters.` 
                    },
                    firstName: {
                      required: 'Please enter your first name.',
                      minlength: `Your first name must contain at least 3 characters.`,
                      maxlength: `Your first name must contain less than 15 characters.`
                    },
                    lastName: {
                      required: 'Please enter your last name.',
                      minlength: `Your last name must contain at least 3 characters.`,
                      maxlength: `Your last name must contain less than 15 characters.`
                    },
                    emailGroup: {
                      match: 'Please make sure the confirmation matches your email.',
                    },
                    email: {
                      required: 'Please enter your email address.',
                      email: 'Please enter a valid email address.',
                      maxLength: `Your email address must contain less than 50 characters.`
                    },
                    emailConfirm: {
                      required: 'Please confirm your email address.'
                    },
                    passwordGroup: {
                      match: 'Please make sure the confirmation matches your password.',
                    },
                    password: {
                      required: 'Please enter your chosen password.',
                      maxLength: `Your password must contain less than 15 characters.`,
                      pattern: 'Please enter a valid password.'
                    },
                    passwordConfirm: {
                      reequired: 'Please confirm your password.'
                    }
                  };

                  this.msgProcessor = new MessageProcessor(this.validationMessages);

                }

  ngOnInit(): void {

    this.RegistrationForm = this.formBuilder.group({
      username:['',[Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(15),
                    WhitespaceValidator.removeSpaces]],
      firstName:['',[Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(15),
                    WhitespaceValidator.removeSpaces]],
      lastName:['',[Validators.required,
                    Validators.minLength(3),
                    Validators.maxLength(15),
                    WhitespaceValidator.removeSpaces]],
      emailGroup: this.formBuilder.group({
        email:['',[Validators.required,
                    Validators.email,
                    Validators.maxLength(50),
                    WhitespaceValidator.removeSpaces]],
        emailConfirm: ['', [Validators.required, 
                           WhitespaceValidator.removeSpaces]]
      }),

      passwordGroup: this.formBuilder.group(
        {
          password: ['', [Validators.required, 
                          Validators.maxLength(15),
                          WhitespaceValidator.removeSpaces]],
          passwordConfirm: ['', [ Validators.required, 
                                  WhitespaceValidator.removeSpaces]]
        }
      )
    })

    const emailFormGroup = this.RegistrationForm.get('emailGroup');
    emailFormGroup.setValidators(MatchValidator.match(emailFormGroup.get('email'),emailFormGroup.get('emailConfirm')));

    const passwordFormGroup = this.RegistrationForm.get('passwordGroup');
    passwordFormGroup.setValidators(MatchValidator.match(passwordFormGroup.get('password'),passwordFormGroup.get('passwordConfirm')));

  }
  
  onSubmit(): void {
    const newUser: User = this.initUser();
    this.userService.checkDuplicateUser(newUser)
      .subscribe({
        next: () => {
          this.userService.createUser(newUser)
            .subscribe({
              next: () => this.onSaveComplete(),
              error: (err: any) => this.errorMessage = err
            })
        },
        error: () => this.duplicateUserAlert = 'This username is already taken. Please use a different one.'
      });
  }

 
   private initUser(): User {
    return {
      id: null,
      username: this.RegistrationForm.get('username').value,
      firstName: this.RegistrationForm.get('firstName').value,
      lastName: this.RegistrationForm.get('lastName').value,
      email: this.RegistrationForm.get('emailGroup.email').value,
      password: this.RegistrationForm.get('passwordGroup.password').value,
    };
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.RegistrationForm.valueChanges, ...controlBlurs)
      .pipe(
        debounceTime(800))
          .subscribe(() => {
            this.displayMessage = this.msgProcessor.processMessages(this.RegistrationForm, null);
          });
  }

 
  onSaveComplete(): void {
    this.RegistrationForm.reset();
    this.router.navigate(['/user-login']);
  }

}
