import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {lastValueFrom, Subscription} from 'rxjs';
import {UserDateFormatSettings, UserSettingsModel, UserTimeFormatSettings} from '../shared/user.model';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import * as moment from 'moment';
import {uiStore, userStore} from "@open-dcp/services";
import {MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../shared/user.service";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit, OnDestroy {

  form: UntypedFormGroup;

  settings: UserSettingsModel = userStore.getState().settings;

  dateFormatData = [
    {
      value: UserDateFormatSettings['dd MMM yyyy'],
      text: moment().format(UserDateFormatSettings['dd MMM yyyy'].toUpperCase())
    },
    {
      value: UserDateFormatSettings['MMM dd, yyyy'],
      text: moment().format(UserDateFormatSettings['MMM dd, yyyy'].toUpperCase())
    }
  ];

  timeFormatData = [
    {
      value: UserTimeFormatSettings.Twelve,
      text: moment().format(UserTimeFormatSettings.Twelve).toUpperCase()
    },
    {
      value: UserTimeFormatSettings.TwentyFour,
      text: moment().format(UserTimeFormatSettings.TwentyFour)
    }
  ];

  subscription: Subscription = new Subscription();

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly userService: UserService,
    public readonly dialogRef: MatDialogRef<UserSettingsComponent>
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      timeFormat: '',
      dateFormat: ''
    });

    const settings = userStore.getState().settings;
    this.form.patchValue(settings, {emitEvent: false});

    this.subscription.add(
      userStore.subscribe('settings', newSettings => {
        if (newSettings) {
          this.form.patchValue(newSettings, {emitEvent: false});
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveSettings() {
    const value = this.form.value;
    uiStore.setLoading('UpdateUserDateTimeFormat');
    lastValueFrom(this.userService.updateDateTimeFormat(value.dateFormat, value.timeFormat))
      .then(res => {
        userStore.setDateFormat(value.dateFormat);
        userStore.setTimeFormat(value.timeFormat);
        this.closeDialog();
      })
      .finally(() => {
        uiStore.removeLoading('UpdateUserDateTimeFormat');
      });
  }
}
