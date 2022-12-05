import { TenantBaseAppEntity, UtilService } from '@khanh.tran/nestjs-crud-base';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@UtilService.getEntity
@Entity()
export class Posts extends TenantBaseAppEntity {
  @Column()
  @UtilService.getProperty
  title: string;

  @Column({
    nullable: true,
  })
  @UtilService.getProperty
  content: string;
}
