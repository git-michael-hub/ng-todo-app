import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TTask } from '../../utils/models/task.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private tasksCollection!: CollectionReference<DocumentData>;
  private firestore: Firestore = inject(Firestore);

  constructor() {
    this.tasksCollection = collection(this.firestore, 'tasks');
  }

  // add item
  addTask(data: TTask) {
    console.log(data)
    return addDoc(this.tasksCollection, data);
  }

  // update item by ID
  updateTask(id: string, data: TTask) {
    const itemRef = doc(this.firestore, `tasks/${id}`);
    return updateDoc(itemRef, data);
  }

  // delete item by ID
  deleteTask(id: string) {
    const itemRef = doc(this.firestore, `tasks/${id}`);
    return deleteDoc(itemRef);
  }

  // get items (Observable)
  getTasks(): Observable<TTask[]> {
    return collectionData(this.tasksCollection, { idField: 'id' }) as Observable<any[]>;
  }

}
