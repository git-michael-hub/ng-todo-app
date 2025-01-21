import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { TMenu } from './sidenav.model';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { SidenavService } from './sidenav.service';
import { RouterModule } from '@angular/router';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddTaskFormComponent } from '../../uis/forms/add-task-form/add-task-form.component';
import { STORE } from '../../data-access/state/state.store';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    TitleCasePipe,
    SummaryComponent
  ],
})
export class SidenavComponent implements OnInit {
  readonly _dialog = inject(MatDialog);
  private readonly _snackBar = inject(MatSnackBar);

  mobileQuery: MediaQueryList;

  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);

  navigations: TMenu[] = inject(SidenavService)?.navigations;

  dialogRef!: MatDialogRef<AddTaskFormComponent, any>;

  private _mobileQueryListener: () => void;

  constructor() {
    const changeDetectorRef = inject(ChangeDetectorRef);
    const media = inject(MediaMatcher);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    // Check compatibility and add listener
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    } else {
      this.mobileQuery.addListener(this._mobileQueryListener); // Fallback for older browsers
    }

    effect(() => {
      if (STORE().task.added()?.id) {
        console.log('Successfully added new task!', STORE().task.added()?.title);
        this.dialogRef?.close();

        this._snackBar.open(
          `Added:
          ${
            STORE().task.added()?.title.slice(0, 20)
          }
          ${
            (() => ((STORE().task.added()?.title.slice(0, 20) as any).length >= 20 ? '...': ''))()
          }`,
          'close',
          {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 5000
          }
        );

        // this.recordData('[STORE: ADDED]');
        STORE().task.added.set(null);
      }

    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    // Check compatibility and add listener
    if (this.mobileQuery.removeEventListener) {
      this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    } else {
      this.mobileQuery.removeListener(this._mobileQueryListener); // Fallback for older browsers
    }
  }

  addTask(): void {
    this.dialogRef = this._dialog.open(
      AddTaskFormComponent,
      {
        maxWidth: '50vw',
        width: '50vw',
        maxHeight: '80vh',
        height: '80vh',
        disableClose: true,
      } as MatDialogConfig
    );

    // dialogRef.close();

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });


  }

}
