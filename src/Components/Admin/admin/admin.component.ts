import { Component, inject } from '@angular/core';
import { AuthService } from '../../../_services/auth.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@Component({
  selector: 'app-admin',
  imports: [NzIconModule, NzMenuModule, NzLayoutModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  private authService=inject(AuthService)

  logout() {
    this.authService.logout(true);
  }
}
