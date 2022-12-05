import { TenantBaseAppEntity, UtilService } from '@khanh.tran/nestjs-crud-base';
import { Column, Entity } from 'typeorm';
@UtilService.getEntity
@Entity()
export class Posts extends TenantBaseAppEntity {
  @Column()
  @UtilService.getProperty
  column_name: string;
}
