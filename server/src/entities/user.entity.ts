import { Entity, Column, Index, BeforeInsert, OneToMany } from "typeorm";
import bcrypt from "bcryptjs";
import Model from "./model.entity";
import { PretestResult } from "./pretest-result.entity";
import { PosttestResult } from "./posttest-result.entity";
import { ChatbotAsked } from "./chatbot-asked.entity";
import { UserGroup } from "./user-group.entity";

/* It's a class that extends the Model class from typeorm, and it has a bunch of
properties that are decorated with the @Column decorator */
@Entity("users")
export class User extends Model {
  @Index("email_index")
  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    default: "user",
    type: String,
    nullable: false,
  })
  role!: string;

  @Column({ nullable: true })
  photo_url!: string;

  @Column({ nullable: true })
  photo_url_label!: string;

  @Column({
    default: false,
  })
  verified!: boolean;

  @Column({
    nullable: false,
  })
  firstname!: string;

  @Column({
    nullable: true,
  })
  lastname!: string;

  @Column({
    nullable: true,
  })
  class!: string;

  @Column({
    nullable: true,
  })
  class_number!: string;

  @Column({
    nullable: true,
  })
  group!: string;

  @OneToMany(() => PretestResult, (preResult) => preResult.pretest)
  pretestResults!: PretestResult[];

  @OneToMany(() => PosttestResult, (postResult) => postResult.posttest)
  posttestResults!: PosttestResult[];

  @OneToMany(() => ChatbotAsked, (chatbotAsked) => chatbotAsked.user)
  chatbotAsked!: ChatbotAsked[];

  @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
  groupLession!: UserGroup[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  toJSON() {
    return {
      ...this,
      password: undefined,
      verified: undefined,
    };
  }
}
