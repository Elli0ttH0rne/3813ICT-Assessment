import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { UserGroupScreenComponent } from './app/user-group-screen/user-group-screen.component';
import { RegisterComponent } from './app/register/register.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: LoginComponent },
      { path: 'user-group-screen', component: UserGroupScreenComponent },
      { path: 'register', component: RegisterComponent }
    ])
  ]
});