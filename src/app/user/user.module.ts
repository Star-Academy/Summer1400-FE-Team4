import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@NgModule({
    declarations: [LoginComponent, UserComponent, SignUpComponent, SignUpComponent],
    imports: [CommonModule, UserRoutingModule, FormsModule],
})
export class UserModule {}
