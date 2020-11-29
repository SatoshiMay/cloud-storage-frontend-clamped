import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() public src: String;
  @Input() public display: String;
  @Output() public close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
