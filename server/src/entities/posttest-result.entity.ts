import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Lession } from "./lession.entity";
import Model from "./model.entity";
import { Posttest } from "./posttest.entity";
import { User } from "./user.entity";

@Entity("posttest_results")
export class PosttestResult extends Model {
  @Column()
  answer_choosed!: string;

  @Column()
  label_answer_choosed!: string;

  @Column()
  is_answer_correct!: boolean;

  @ManyToOne(() => User, (u) => u.posttestResults, {
    nullable: false,
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Posttest, (postt) => postt.posttestResults, {
    nullable: false,
  })
  @JoinColumn({ name: "posttest_id" })
  posttest!: Posttest;
}
