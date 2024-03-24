import { Component ,OnInit } from '@angular/core';
import { ServiceService } from '../service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;

  showLoginForm: boolean = true;

  constructor(private formBuilder: FormBuilder , private authService : ServiceService ,private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signupForm = this.formBuilder.group({
      name :  ['', Validators.required],
      signupEmail: ['', [Validators.required, Validators.email]],
      signupPassword: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.authService.login(email, password).subscribe(
        (response) => {
          console.log('Login successful:', response);

          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('id' , response.author_Id)
          this.router.navigate(['/home']); 

        },
        (error) => {
          console.error('Login failed:', error);
        }
      );
    }
  }
  

  signup(): void {
    if (this.signupForm.valid) {
      const signupEmail = this.signupForm.get('signupEmail')?.value;
      const signupPassword = this.signupForm.get('signupPassword')?.value;
      const name = this.signupForm.get('name')?.value;

      this.authService.signup(name , signupEmail, signupPassword).subscribe(
        (response) => {
          console.log('Login successful:', response);

        },
        (error) => {
          console.error('Login failed:', error);
        }
      );
    }
  }

  toggleForms(): void {
    this.showLoginForm = !this.showLoginForm;
  }
}
