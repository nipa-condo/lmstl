import { Column, Entity } from "typeorm";
import Model from "./model.entity";

/* It's a class that extends the Model class from the typeorm package. It has a
bunch of properties that are decorated with the @Column() decorator */
@Entity("settings")
export class Setting extends Model {
  @Column({ nullable: true })
  home_photo_url!: string;

  @Column({ nullable: true })
  home_photo_url_label!: string;

  @Column({ nullable: true })
  home_title!: string;

  @Column({ nullable: true })
  home_subtitle!: string;

  @Column({ nullable: true })
  sign_in_title!: string;

  @Column({ nullable: true })
  sign_in_subtitle!: string;

  @Column({ nullable: true })
  sign_in_photo_url!: string;

  @Column({ nullable: true })
  sign_in_photo_url_label!: string;

  @Column({ nullable: true })
  register_title!: string;

  @Column({ nullable: true })
  register_subtitle!: string;

  @Column({ nullable: true })
  register_photo_url!: string;

  @Column({ nullable: true })
  register_photo_url_label!: string;

  @Column({ nullable: true })
  place_holder_url!: string;

  @Column({ nullable: true })
  place_holder_url_label!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  location!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  facebook!: string;

  @Column({ nullable: true })
  line!: string;

  @Column({ nullable: true })
  copyright!: string;
}
