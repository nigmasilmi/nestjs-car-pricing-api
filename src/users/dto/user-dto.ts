import { Expose } from 'class-transformer';

export class UserDto {
  //list of properties wanted to share in the outgoing response
  @Expose()
  id: number;

  @Expose()
  email: string;
}
