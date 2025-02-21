import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Router } from '@angular/router';
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";

import { UserDTO } from '../models/user-dto';
import { LoginService } from '../sevices/login.service';
import { AuthService } from '../Auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [MatTabsModule, ReactiveFormsModule, FormsModule, CommonModule],
  standalone: true
})
export class LoginComponent {
  form: FormGroup;
  form2: FormGroup;
  user: UserDTO | null = null;

  constructor(
    formBuilder: FormBuilder,
    private service: LoginService,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    this.form = formBuilder.group({
      username: [''],
      password: [''],
    });

    this.form2 = formBuilder.group({
      username: [''],
      password: [''],
      confirmpass: [''],
      email: ['']
    });
  }

  submitSignup() {
    if (this.form2.value.password !== this.form2.value.confirmpass) {
      console.error('Passwords do not match');
      return;
    }

    this.service.signup(this.form2.value).subscribe(
      response => {
        console.log('Signup successful', response);
        this.router.navigate(['']); // Redirect after successful signup
      },
      error => {
        console.error('Signup failed', error);
      }
    );
  }

  submitLogin() {
    const credentials = {
      username: this.form.value.username,
      password: this.form.value.password
    };

    this.authService.login(credentials).subscribe(
      response => {
        console.log('Login response:', response); // Debugging
        this.authService.saveToken(response.token); // Save the JWT token
        this.user = this.authService.getUserFromToken(response.token);
        console.log('User after login:', this.user); // Debugging
        this.router.navigate(['/home']); // Redirect to the home page after successful login
      },
      error => {
        console.error('Login failed', error);
      }
    );
  }

  addFriend(friendId: number) {
    if (this.user) {
      this.service.addFriend(this.user.id, friendId).subscribe(
        response => {
          console.log('Friend added successfully', response);
          this.user = response;
        },
        error => {
          console.error('Error adding friend', error);
        }
      );
    }
  }

  removeFriend(friendId: number) {
    if (this.user) {
      this.service.removeFriend(this.user.id, friendId).subscribe(
        response => {
          console.log('Friend removed successfully', response);
          this.user = response;
        },
        error => {
          console.error('Error removing friend', error);
        }
      );
    }
  }

  protected readonly Number = Number;
}
