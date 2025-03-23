import { Injectable } from "@angular/core";
import { STORE } from "../../data-access/state/state.store";


@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private __DATA__: any[]  = [];

  recordData(action: string): void {
    this.__DATA__ = [
      ...this.__DATA__,
      {
        action,
        state: STORE().task.toString()
      }
    ];

    console.log('[RECORD_DATA]:', this.__DATA__);
  }
}
