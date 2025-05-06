import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/service/service.service';
import { environment } from 'src/environment/environment';

export interface userdata {
  username: string;
  mobile_number: string;
  email: string;
  id: string;
  role: string;
  backup_contact: string;
  security_contact: string;
  user_id: any;
  password: any;
  image: any;
}
@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css'],
})
export class UserDataComponent implements OnInit {
  userDataArray: userdata[] = [];
  editRegisterForm!: FormGroup;
  searchText: string = '';
  p: number = 1;
  selectedUserId: string | null = null;
  imagePreview: string | null = null;
  toastVisible = false; // Control the visibility of the toast
  toastMessage = ''; //
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ServiceService
  ) {
    this.editRegisterForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      country_code: ['', Validators.required],
      mobile_number: ['', Validators.required],
      backup_contact: ['', Validators.required],
      security_contact: ['', Validators.required],
      role: ['', Validators.required],
      image: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.service.getuserData().subscribe((userData: any) => {
      this.userDataArray = userData;
      console.log('user', this.userDataArray);
    });
  }

  filteredData() {
    if (!this.searchText) {
      return this.userDataArray;
    }
    return this.userDataArray.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(this.searchText.toLowerCase())
      )
    );
  }
  imageName: any;
  editUser(userId: string) {
    this.selectedUserId = userId;
    const user = this.userDataArray.find((u) => u.id === userId);
    if (user) {
      this.editRegisterForm.patchValue({
        username: user.username,
        email: user.email,
        country_code: '',
        password: user.password,
        mobile_number: user.mobile_number,
        backup_contact: user.backup_contact,
        security_contact: user.security_contact,
        role: user.role,
        image: null,
      });
      console.log('user', user);
      this.imagePreview = user.image || null;
      // Handle image preview
      this.imageName = user.image.split('/').pop()
    }
  }
  

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.editRegisterForm.get('image')?.setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  updateregisterUser() {
    if (this.selectedUserId) {
      const formData = new FormData();
      const formValues = this.editRegisterForm.value;

      Object.keys(formValues).forEach((key) => {
        if (key === 'image' && formValues[key]) {
          formData.append(key, formValues[key]);
        } else {
          formData.append(key, formValues[key]);
        }
      });

      this.service.updateUser(this.selectedUserId, formData).subscribe(
        (response) => {
          this.toastMessage = 'User updated successfully.';
          this.showToast();
          this.ngOnInit(); // Refresh data
        },
        (error: HttpErrorResponse) => {
          // Handle error response from server
          if (error.error && error.error.error) {
            this.toastMessage = error.error.error; // Extract error message
          } else {
            this.toastMessage = 'Failed to update user.'; // Fallback error message
          }
          this.showToast();
        }
      );
    }
  }

  deleteUser(userId: any) {
    const isConfirmed = confirm('Are you sure you want to delete this user?');
    if (isConfirmed) {
      this.service.deleteUser(userId).subscribe(
        () => {
          this.toastMessage = 'User deleted successfully.';
          this.showToast();
          this.ngOnInit(); // Refresh data
        },
        (error) => {
          this.toastMessage = 'Failed to delete the user. Please try again.';
          this.showToast();
          console.error('Error deleting user:', error);
        }
      );
    }
  }
  // Show toast
  showToast() {
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 3000); // Hide after 3 seconds
  }
  hideToast(): void {
    this.toastVisible = false;
  }
}
