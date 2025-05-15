import { User } from '@entities/user.entity';
import { Page } from './page';

export class UserPage {
  page: Page;
  users: User[];

  constructor(page: Page, users: User[]) {
    this.page = page;
    this.users = users;
  }
}
