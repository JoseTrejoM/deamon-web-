import { Component, OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit /*, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy*/ {
  showLogo: boolean = false;

  constructor() { }

  ngOnInit(): void {
    console.log('init');
    this.showLogo = true;
  }

  /*ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    console.log('OnChanges');
    console.log(changes);
  }

  ngDoCheck(): void {
    console.log('DoCheck');
  }

  ngAfterContentInit(): void {
    console.log('AfterContentInit');
  }

  ngAfterContentChecked(): void {
    console.log('AfterContentChecked');
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit');
  }

  ngAfterViewChecked(): void {
    console.log('AfterViewChecked');
  }

  ngOnDestroy(): void {
    console.log('destroy');
    this.showLogo = false;
  }*/
}
