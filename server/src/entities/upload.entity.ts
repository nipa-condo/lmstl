import { Column, Entity } from "typeorm";
import Model from "./model.entity";

@Entity("our_files")
export class OurFile extends Model {
  @Column({ default: true })
  active!: boolean;

  @Column({ nullable: false })
  url!: string;

  @Column({ nullable: false })
  label!: string;

  @Column({
    nullable: false,
    default: "unknow",
  })
  type!: string;
}
