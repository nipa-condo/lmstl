import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import Model from "./model.entity";
import { Posttest } from "./posttest.entity";
import { Pretest } from "./pretest.entity";
import { UserGroup } from "./user-group.entity";
import { ChatbotAsked } from "./chatbot-asked.entity";

/* Lession has a title, subtitle, content, have_pretest, have_content,
have_posttest, have_result, photo_url, video_url, pretests, and posttests */
@Entity("lessions")
export class Lession extends Model {
  @Column({ default: true })
  active!: boolean;

  @Column()
  title!: string;

  @Column({ default: "", nullable: true })
  subtitle!: string;

  @Column({ default: "", nullable: true })
  content!: string;

  @Column({
    default: false,
  })
  have_pretest!: boolean;

  @Column({
    default: false,
  })
  have_content!: boolean;

  @Column({
    default: false,
  })
  have_posttest!: boolean;

  @Column({
    default: false,
  })
  have_result!: boolean;

  @Column({
    default: false,
  })
  is_random!: boolean;

  @Column({
    default: false,
  })
  is_video_from!: boolean;

  @Column({ nullable: true })
  photo_url!: string;

  @Column({ nullable: true })
  photo_url_label!: string;

  @Column({ nullable: true })
  thumbnail_url!: string;

  @Column({ nullable: true })
  thumbnail_url_label!: string;

  @Column({ nullable: true })
  video_url!: string;
  
  @Column({ nullable: true })
  video_url_label!: string;

  @Column({ nullable: true })
  files_url_1!: string;
  
  @Column({ nullable: true })
  files_url_1_label!: string;

  @Column({ nullable: true })
  files_url_2!: string;

  @Column({ nullable: true })
  files_url_2_label!: string;

  @Column({ nullable: true })
  files_url_3!: string;

  @Column({ nullable: true })
  files_url_3_label!: string;

  @Column({ nullable: true })
  order!: number;

  @OneToMany(() => Pretest, (pretest) => pretest.id)
  pretests!: Pretest[];

  @OneToMany(() => Posttest, (posttest) => posttest.id)
  posttests!: Posttest[];

  @OneToMany(() => ChatbotAsked, (chatbotAsked) => chatbotAsked.lession)
  chatbotAsked!: ChatbotAsked[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.lession)
  groupLession!: UserGroup[];
}
