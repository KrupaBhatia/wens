
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent implements OnInit {
  blogForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private blogService: ServiceService,private router: Router) { }


  
  home() {
    this.router.navigate(['/home']);
  } 

  ngOnInit(): void {

    const authorId = localStorage.getItem('id') || '';
    this.blogForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      author_Id: [authorId, Validators.required], 

      tags: ['', Validators.required],
      category: ['', Validators.required],
      isPublished: [true]
    });
  }

  submitForm(): void {
    if (this.blogForm.valid) {
      this.blogService.createBlog(this.blogForm.value).subscribe(
        (response) => {
          console.log('Blog created successfully:', response);
          this.blogForm.reset();
          this.router.navigate(['/create']); 
        },
        (error) => {
          console.error('Error creating blog:', error);
        }
      );
    } else {
      console.error('Form is invalid. Cannot submit.');
    }
  }

}  
