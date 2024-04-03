import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Lession } from "./lession.entity";
import Model from "./model.entity";
import { PretestResult } from "./pretest-result.entity";
import { PosttestResult } from "./posttest-result.entity";

/* It's a Posttest class that has a one-to-many relationship with the Lession class */
@Entity("posttests")
export class Posttest extends Model {
  @Column({
    nullable: false,
  })
  question!: string;

  @Column()
  answer_1!: string;

  @Column()
  answer_2!: string;

  @Column()
  answer_3!: string;

  @Column()
  answer_4!: string;

  @Column()
  correct_answer!: string;

  @ManyToOne(() => Lession, (lession) => lession.posttests)
  @JoinColumn({ name: "lession_id" })
  lession!: Lession;

  @OneToMany(() => PosttestResult, (postResult) => postResult.posttest)
  posttestResults!: PosttestResult[];
}
