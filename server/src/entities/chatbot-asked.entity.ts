import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import Model from "./model.entity";
import { User } from "./user.entity";
import { Lession } from "./lession.entity";

/* It's a class that extends the Model class from typeorm, and it has a bunch of
properties that are decorated with the @Column decorator */
@Entity("chatbot_asked")
export class ChatbotAsked extends Model {
  @Column({
    nullable: false,
  })
  chatbot_asked!: number;

  @ManyToOne(() => User, (u) => u.chatbotAsked, {
    nullable: false,
  })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @ManyToOne(() => Lession, (l) => l.chatbotAsked, {
    nullable: false,
  })
  @JoinColumn({ name: "lession_id" })
  lession!: Lession;
}
