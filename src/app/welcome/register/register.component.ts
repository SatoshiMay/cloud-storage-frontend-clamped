import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private authService: AuthService, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    const userAttributes = [
      { Name: 'given_name', Value: this.registerForm.get('firstName').value },
      { Name: 'family_name', Value: this.registerForm.get('lastName').value },
    ];

    this.authService.register$(this.registerForm.get('username').value,
      this.registerForm.get('password').value, userAttributes)
      .subscribe(
        res => { console.log('Registration Successful'); },
        err => { console.log('Registration Unsuccessful'); }
      );
  }

}
