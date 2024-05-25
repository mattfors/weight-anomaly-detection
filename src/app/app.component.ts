import { Component } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatChip } from '@angular/material/chips';
import { MatFormField } from '@angular/material/form-field';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WeightSampleTableComponent } from './weight-sample-table/weight-sample-table.component';
import { WeightSamplingService } from './weight-sampling/weight-sampling.service';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { AppService } from './app.service';
import { KeyboardWedgeService } from './scanner/keyboard-wedge.service';
import { ScaleDisplayComponent } from './scale-display/scale-display.component';
import { NgScalesConnectionButtonDirective } from 'ng-scales';

const DUE_TIME = 300;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AsyncPipe,
    MatButton,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatChip,
    MatFormField,
    MatGridList,
    MatGridTile,
    MatInput,
    MatList,
    MatListItem,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    WeightSampleTableComponent,
    FormsModule,
    MatSlideToggle,
    ScaleDisplayComponent,
    NgScalesConnectionButtonDirective
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  view = this.appService.view;

  constructor(
    private weightSamplingService: WeightSamplingService,
    private keyboardWedgeService: KeyboardWedgeService,
    private appService: AppService
  ) {
    this.appService.startReading().subscribe();
    this.keyboardWedgeService.read().subscribe(() => this.increment());
  }

  clear(): void {
    this.weightSamplingService.clearSamples();
  }

  increment() {
    this.appService.increment()
  }

  protected readonly Object = Object;
  inputValue: any;

  triggerWeight(value: string) {
    //this.appService.addWeightReading(parseFloat(value));
  }

  lockCount(event: MatSlideToggleChange) {

  }

}
