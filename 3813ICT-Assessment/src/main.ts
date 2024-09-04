import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/Components/login/login.component';
import { UserGroupComponent } from './app/Components/user-group/user-group.component';
import { RegisterComponent } from './app/Components/register/register.component';
import { AccountComponent } from './app/Components/account/account.component'; 
import { ChannelComponent } from './app/Components/channel/channel.component';
import { InboxComponent } from './app/Components/inbox/inbox.component';
import { AllGroupListComponent } from './app/Components/all-group-list/all-group-list.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: LoginComponent },
      { path: 'user-group', component: UserGroupComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'account', component: AccountComponent },
      { path: 'channel/:groupName/:channelName', component: ChannelComponent },
      { path: 'inbox', component: InboxComponent },
      { path: 'all-group-list', component: AllGroupListComponent }
    ])
  ]
});