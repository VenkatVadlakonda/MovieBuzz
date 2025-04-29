import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../_models/user.modal';

@Pipe({
  name: 'adminuser'
})
export class AdminuserPipe implements PipeTransform {

  transform(AllUsers: User[], search:string): User[] {
    return AllUsers.filter(data=>data.userName.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  }

}
