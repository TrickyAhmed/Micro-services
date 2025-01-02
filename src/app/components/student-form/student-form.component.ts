import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode = false;
  studentId?: number;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.studentId) {
      this.isEditMode = true;
      this.loadStudent();
    }
  }

  loadStudent(): void {
    this.loading = true;
    this.studentService.getStudent(this.studentId!)
      .subscribe({
        next: (student) => {
          this.studentForm.patchValue(student);
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading student';
          this.loading = false;
        }
      });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      const student: Student = this.studentForm.value;
      
      if (this.isEditMode) {
        this.studentService.updateStudent(this.studentId!, student)
          .subscribe({
            next: () => this.router.navigate(['/students']),
            error: (error) => this.error = 'Error updating student'
          });
      } else {
        this.studentService.createStudent(student)
          .subscribe({
            next: () => this.router.navigate(['/students']),
            error: (error) => this.error = 'Error creating student'
          });
      }
    }
  }
}