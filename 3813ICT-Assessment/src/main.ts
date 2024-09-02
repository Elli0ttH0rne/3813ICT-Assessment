import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { UserGroupComponent } from './app/user-group/user-group.component';
import { RegisterComponent } from './app/register/register.component';
import { AccountComponent } from './app/account/account.component'; 
import { ChannelComponent } from './app/channel/channel.component';
import { InboxComponent } from './app/inbox/inbox.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: LoginComponent },
      { path: 'user-group', component: UserGroupComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'account', component: AccountComponent },
      { path: 'channel/:groupName/:channelName', component: ChannelComponent },
      { path: 'inbox', component: InboxComponent },
    ])
  ]
});