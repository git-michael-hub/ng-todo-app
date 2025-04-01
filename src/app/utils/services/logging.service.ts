import { inject, Injectable } from "@angular/core";
import { STORE_TOKEN } from "../../data-access/state/state.store";


@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private readonly _STORE = inject(STORE_TOKEN);

  private __DATA__: any[]  = [];

  recordData(action: string): void {
    this.__DATA__ = [
      ...this.__DATA__,
      {
        action,
        state: this._STORE().task.toString()
      }
    ];

    console.log('[RECORD_DATA]:', this.__DATA__);
  }
}
