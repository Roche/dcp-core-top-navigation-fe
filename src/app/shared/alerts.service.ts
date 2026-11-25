import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(
    private readonly toastr: ToastrService
  ) { }

  onSuccess(body = '') {
    this.toastr.success(body);
  }
  onInfo(body = '') {
    this.toastr.info(body);
  }
  onError(body = '') {
    this.toastr.error(body);
  }
  onWarning(body = '') {
    this.toastr.warning(body);
  }

  /**
   * Show Countdown notification
   * @param body - text to show as a message
   * @param timeOut - time in seconds to stay on screen
   */
  onCountdown(body = '', timeOut) {
    this.toastr.info(body, '', {timeOut: timeOut * 1000, progressBar: true})
  }

  clearAll() {
    this.toastr.clear();
  }
}
