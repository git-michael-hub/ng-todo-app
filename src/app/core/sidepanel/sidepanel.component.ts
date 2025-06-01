import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'layout-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SidepanelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
