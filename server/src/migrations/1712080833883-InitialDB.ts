import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDB1712080833883 implements MigrationInterface {
    name = 'InitialDB1712080833883'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "posttest_results" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "answer_choosed" character varying NOT NULL, "label_answer_choosed" character varying NOT NULL, "is_answer_correct" boolean NOT NULL, "user_id" integer NOT NULL, "posttest_id" integer NOT NULL, CONSTRAINT "PK_51024fedb7536e458ac2c7d1f0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "posttests" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question" character varying NOT NULL, "answer_1" character varying NOT NULL, "answer_2" character varying NOT NULL, "answer_3" character varying NOT NULL, "answer_4" character varying NOT NULL, "correct_answer" character varying NOT NULL, "lession_id" integer, CONSTRAINT "PK_4ef08945d550198e73c6e9a210e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_group" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "group" character varying NOT NULL, "user_id" integer NOT NULL, "lession_id" integer NOT NULL, CONSTRAINT "PK_3c29fba6fe013ec8724378ce7c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chatbot_asked" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "chatbot_asked" integer NOT NULL, "user_id" integer NOT NULL, "lession_id" integer NOT NULL, CONSTRAINT "PK_4e194f926148c97da0890efe499" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lessions" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "title" character varying NOT NULL, "subtitle" character varying DEFAULT '', "content" character varying DEFAULT '', "have_pretest" boolean NOT NULL DEFAULT false, "have_content" boolean NOT NULL DEFAULT false, "have_posttest" boolean NOT NULL DEFAULT false, "have_result" boolean NOT NULL DEFAULT false, "is_random" boolean NOT NULL DEFAULT false, "is_video_from" boolean NOT NULL DEFAULT false, "photo_url" character varying, "photo_url_label" character varying, "thumbnail_url" character varying, "thumbnail_url_label" character varying, "video_url" character varying, "video_url_label" character varying, "files_url_1" character varying, "files_url_1_label" character varying, "files_url_2" character varying, "files_url_2_label" character varying, "files_url_3" character varying, "files_url_3_label" character varying, "order" integer, CONSTRAINT "PK_8cd2a1ee8c1e4d4a6df667bb050" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pretests" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question" character varying NOT NULL, "answer_1" character varying NOT NULL, "answer_2" character varying NOT NULL, "answer_3" character varying NOT NULL, "answer_4" character varying NOT NULL, "correct_answer" character varying NOT NULL, "lession_id" integer, CONSTRAINT "PK_f2b83e650ffd9a247657e7e54aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pretest_results" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "answer_choosed" character varying NOT NULL, "label_answer_choosed" character varying NOT NULL, "is_answer_correct" boolean NOT NULL, "user_id" integer NOT NULL, "pretest_id" integer NOT NULL, CONSTRAINT "PK_4088f65cbb812f7532f2901ef4b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'user', "photo_url" character varying, "photo_url_label" character varying, "verified" boolean NOT NULL DEFAULT false, "firstname" character varying NOT NULL, "lastname" character varying, "class" character varying, "class_number" character varying, "group" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "email_index" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "our_files" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "active" boolean NOT NULL DEFAULT true, "url" character varying NOT NULL, "label" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'unknow', CONSTRAINT "PK_00320e0d5a8f7b9c63cd71d6f5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "settings" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "home_photo_url" character varying, "home_photo_url_label" character varying, "home_title" character varying, "home_subtitle" character varying, "sign_in_title" character varying, "sign_in_subtitle" character varying, "sign_in_photo_url" character varying, "sign_in_photo_url_label" character varying, "register_title" character varying, "register_subtitle" character varying, "register_photo_url" character varying, "register_photo_url_label" character varying, "place_holder_url" character varying, "place_holder_url_label" character varying, "phone" character varying, "location" character varying, "email" character varying, "facebook" character varying, "line" character varying, "copyright" character varying, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posttest_results" ADD CONSTRAINT "FK_8cc1d5f4ccc78a528254193b455" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posttest_results" ADD CONSTRAINT "FK_5c3983da91695546baffad095ea" FOREIGN KEY ("posttest_id") REFERENCES "posttests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posttests" ADD CONSTRAINT "FK_be55753148b05d0c73d6b9a5ac8" FOREIGN KEY ("lession_id") REFERENCES "lessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_7ded8f984bbc2ee6ff0beee491b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_a1eea5cf2247068c4fdeba369ba" FOREIGN KEY ("lession_id") REFERENCES "lessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatbot_asked" ADD CONSTRAINT "FK_bfc1118aa83622a7cc74b32d066" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatbot_asked" ADD CONSTRAINT "FK_f14b111dc46d6d36dc4ddb78a24" FOREIGN KEY ("lession_id") REFERENCES "lessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pretests" ADD CONSTRAINT "FK_015e562ac65e897589afb77b06b" FOREIGN KEY ("lession_id") REFERENCES "lessions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pretest_results" ADD CONSTRAINT "FK_2e6831ed80565f649f688bcfd3e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pretest_results" ADD CONSTRAINT "FK_59a09798b977a38d4127a3de8d6" FOREIGN KEY ("pretest_id") REFERENCES "pretests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pretest_results" DROP CONSTRAINT "FK_59a09798b977a38d4127a3de8d6"`);
        await queryRunner.query(`ALTER TABLE "pretest_results" DROP CONSTRAINT "FK_2e6831ed80565f649f688bcfd3e"`);
        await queryRunner.query(`ALTER TABLE "pretests" DROP CONSTRAINT "FK_015e562ac65e897589afb77b06b"`);
        await queryRunner.query(`ALTER TABLE "chatbot_asked" DROP CONSTRAINT "FK_f14b111dc46d6d36dc4ddb78a24"`);
        await queryRunner.query(`ALTER TABLE "chatbot_asked" DROP CONSTRAINT "FK_bfc1118aa83622a7cc74b32d066"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_a1eea5cf2247068c4fdeba369ba"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_7ded8f984bbc2ee6ff0beee491b"`);
        await queryRunner.query(`ALTER TABLE "posttests" DROP CONSTRAINT "FK_be55753148b05d0c73d6b9a5ac8"`);
        await queryRunner.query(`ALTER TABLE "posttest_results" DROP CONSTRAINT "FK_5c3983da91695546baffad095ea"`);
        await queryRunner.query(`ALTER TABLE "posttest_results" DROP CONSTRAINT "FK_8cc1d5f4ccc78a528254193b455"`);
        await queryRunner.query(`DROP TABLE "settings"`);
        await queryRunner.query(`DROP TABLE "our_files"`);
        await queryRunner.query(`DROP INDEX "public"."email_index"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "pretest_results"`);
        await queryRunner.query(`DROP TABLE "pretests"`);
        await queryRunner.query(`DROP TABLE "lessions"`);
        await queryRunner.query(`DROP TABLE "chatbot_asked"`);
        await queryRunner.query(`DROP TABLE "user_group"`);
        await queryRunner.query(`DROP TABLE "posttests"`);
        await queryRunner.query(`DROP TABLE "posttest_results"`);
    }

}
