import { TenantBaseAppEntity, UtilService } from '@khanh.tran/nestjs-crud-base';
import { Column, Entity } from 'typeorm';
@UtilService.getEntity
@Entity()
export class User extends TenantBaseAppEntity {
  @Column({ unique: true })
  @UtilService.getProperty
  email: string;

  @Column()
  @UtilService.getProperty
  name: string;

  @Column()
  @UtilService.getProperty
  dob: string;
}
