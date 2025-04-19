import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';



@Component({
  selector: 'app-footer',
  imports: [NzButtonModule, NzModalModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
isTVisible = false;
isCVisible = false;
isPVisible = false;

showModalT() { this.isTVisible = true; }
handleCancelT() { this.isTVisible = false; }
handleOkT() { this.isTVisible = false; }

showModalC() { this.isCVisible = true; }
handleCancelC() { this.isCVisible = false; }
handleOkC() { this.isCVisible = false; }

showModalP() { this.isPVisible = true; }
handleCancelP() { this.isPVisible = false; }
handleOkP() { this.isPVisible = false; }

}
