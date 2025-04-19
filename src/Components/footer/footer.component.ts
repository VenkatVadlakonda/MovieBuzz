import { Component } from '@angular/core';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-footer',
  imports: [NzIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  constructor(private iconService: NzIconService) {
    this.iconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
    });
  }

}
