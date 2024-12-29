import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatCard, MatCardFooter, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-ui-widget-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCard, MatCardFooter, MatCardContent]
})
export class SummaryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
