import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { RegistrationTypeEnum } from '@enums/registration-type.enum';
import { Ilanguage } from '@interfaces/language';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public registration: FormGroup = new FormGroup({});
  public registrationTypeEnum = RegistrationTypeEnum;
  public languages: Ilanguage[] = [
    { id: 1, name: 'javascript', symbol: 'JS' },
    { id: 2, name: 'Golang', symbol: 'GO' },
    { id: 3, name: 'Rust' },
    { id: 4, name: 'Flutter' }
  ];

  public submited: boolean = false;
  public JSON = JSON;

  constructor(
    private _formBuilder: FormBuilder,
  ) {}

  get controls () {
    return this.registration.controls;
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm(): void {
    this.registration = this._formBuilder.group({
      type: [RegistrationTypeEnum.INDIVIDUAL],
      name: ['', Validators.required],
      lastName: [''],
      groupSize: [null],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [
          Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/),
          this.forbiddenPhoneValidator('034')
        ]
      ],
      language: [this.languages[0].id]
    });
    this.listeningChanges();
  }

  private forbiddenPhoneValidator(forbidden: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.startsWith(forbidden) ? { forbiddenPhone: { value: control.value } } : null;
    };
  }

  private listeningChanges(): void {
    this.registration.controls['type'].valueChanges.subscribe(value => {
      if (value === RegistrationTypeEnum.INDIVIDUAL) {
        this.registration.patchValue({
          groupSize: null,
          lastName: ''
        });
        return
      }

      this.registration.patchValue({
        groupSize: 2,
        lastName: null
      });

      this.controls['groupSize'].setValidators([Validators.min(2), Validators.max(4)]);
      this.controls['groupSize'].updateValueAndValidity();
      return;
    });

    this.registration.valueChanges.subscribe(() => {
      this.submited = false;
    })
  }

  public send() {
    this.submited = true;
    console.log(this.registration.value)
  }

  public isInValid(control: AbstractControl): boolean {
    return control.touched && control.invalid;
  }
}