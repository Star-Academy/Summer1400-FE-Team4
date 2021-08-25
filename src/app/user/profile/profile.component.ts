import { Component, OnInit } from '@angular/core';
import { AuthService, UserInfo } from '../../common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    hasAvatar: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    public removeAvatar(event: any) {
        event.preventDefault();
        if (this.user !== undefined) {
            this.user.avatar = 'null';
            this.hasAvatar = false;
            this.authService.editProfile({ avatar: this.user.avatar }).subscribe(
                () => {
                    this.toastr.success('عکس پروفایل با موفقیت حذف شد', undefined, {
                        positionClass: 'toast-top-left',
                    });
                },
                (response) => {
                    this.toastr.error(response.message, undefined, {
                        positionClass: 'toast-top-left',
                    });
                }
            );
        }
    }

    user?: UserInfo;

    changeProfile() {
        if (this.user !== undefined) {
            this.authService.editProfile(this.user).subscribe(
                () => {
                    this.toastr.success('اطلاعات حساب کاربری با موفقیت تغییر یافت', undefined, {
                        positionClass: 'toast-top-left',
                    });
                },
                (response) => {
                    this.toastr.error(response.message, undefined, {
                        positionClass: 'toast-top-left',
                    });
                }
            );
        }
    }

    changeAvatar(file: any) {
        const input = file.target;

        const reader = new FileReader();
        reader.onload = () => {
            const dataURL = reader.result;
            if (this.user !== undefined) {
                if (dataURL !== null) {
                    this.user.avatar = dataURL as string;
                    this.authService.editProfile({ avatar: this.user.avatar }).subscribe(
                        () => {
                            this.toastr.success('عکس پروفایل با موفقیت تغییر یافت', undefined, {
                                positionClass: 'toast-top-left',
                            });
                        },
                        (response) => {
                            this.toastr.error(response.message, undefined, {
                                positionClass: 'toast-top-left',
                            });
                        }
                    );
                }
            }
        };
        reader.readAsDataURL(input.files[0]);
        this.hasAvatar = true;
        if (this.user !== undefined) {
        }
    }

    ngOnInit(): void {
        this.authService.currentUser.subscribe((user) => {
            if (user !== null) {
                this.user = { ...user };
                this.hasAvatar = this.user?.avatar !== 'null';
            } else this.user = undefined;
        });
    }
}
