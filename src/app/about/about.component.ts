import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Course } from '../model/course';
import { of } from 'rxjs';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    private db: AngularFirestore
  ) { }

  ngOnInit() {

    const courseRef = this.db.doc('/courses/7wfon80FMauhh2waNTUk')
      .snapshotChanges()
      .subscribe(snap => {
        const course: any = snap.payload.data();

        console.log('course.relatedCourseRef', course.relatedCourseRef);
      });

      const ref = this.db.doc('courses/IAKUrqd3ICuK0K8Hq1XX')
        .snapshotChanges()
        .subscribe(
          doc => console.log("ref", doc.payload.ref)
        );
    
  }

  save() {
    const firebaseCourseRef = 
      this.db.doc('/courses/4uLXInuKIsPKgUUxVWhc').ref;
    
    const rxjsCourseRef = 
      this.db.doc('/courses/8aSg9J87cdGQlIKDG1jW').ref;
    
    const batch = this.db.firestore.batch();

    batch.update(firebaseCourseRef, {titles: {description: 'Firebase Course'}})
    batch.update(rxjsCourseRef, {titles: {description: 'RxJs Course'}})
    const batch$ = of(batch.commit());

    batch$.subscribe();
  }

  async runTransaction() {

    const newCounter = await this.db.firestore
      .runTransaction(async transaction => {
      console.log('Running transaction...');

      const courseRef = this.db.doc('/courses/7wfon80FMauhh2waNTUk').ref;

      const snap = await transaction.get(courseRef);

      const course = <Course> snap.data();

      const lessonsCount = course.lessonsCount + 1;
      
      transaction.update(courseRef, {lessonsCount});

      return lessonsCount;

    });

    console.log("result lessons count = ", newCounter);

  }

}
