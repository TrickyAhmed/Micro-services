import { Component, OnInit } from '@angular/core';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  loading = false;
  error = '';

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getStudents()
      .subscribe({
        next: (data) => {
          this.students = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading students';
          this.loading = false;
        }
      });
  }

  deleteStudent(id: number): void {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id)
        .subscribe({
          next: () => {
            this.students = this.students.filter(student => student.id !== id);
          },
          error: (error) => {
            this.error = 'Error deleting student';
          }
        });
    }
  }
}