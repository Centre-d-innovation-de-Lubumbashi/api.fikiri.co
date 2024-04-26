import { MigrationInterface, QueryRunner } from 'typeorm';

export class Setup1712646576024 implements MigrationInterface {
  name = 'Setup1712646576024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`call\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` text NOT NULL, \`started_at\` datetime NOT NULL, \`ended_at\` datetime NOT NULL, \`description\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`challenge\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`thematic\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` text NOT NULL, \`odds\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`status\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`feedback\` (\`id\` int NOT NULL AUTO_INCREMENT, \`admin_comment\` varchar(255) NULL, \`user_comment\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`quotations\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`pole\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_bd7ae1c4c03a7b15e369bc4d5a\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image_link\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`solutionId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`solution\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` text NOT NULL, \`image_link\` varchar(255) NULL, \`video_link\` varchar(255) NULL, \`description\` text NOT NULL, \`targeted_problem\` text NOT NULL, \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NULL ON UPDATE CURRENT_TIMESTAMP, \`callId\` int NULL, \`statusId\` int NULL, \`thematicId\` int NULL, \`userId\` int NULL, \`poleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`organisation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_d9428f9c8e3052d6617e3aab0e\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`role\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`phone_number\` varchar(255) NULL, \`address\` varchar(255) NULL, \`token\` varchar(255) NULL, \`google_image\` varchar(255) NULL, \`profile\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`poleId\` int NULL, \`organisationId\` int NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`quotation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`mention\` varchar(255) NOT NULL, \`average\` float NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_cd8c76405ea34f3da19bb9aa5d\` (\`mention\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`call_thematics_thematic\` (\`callId\` int NOT NULL, \`thematicId\` int NOT NULL, INDEX \`IDX_6126deea99c4a6a70ae99f1ef1\` (\`callId\`), INDEX \`IDX_3f13af8a47c8b7daf6b5cd1ee9\` (\`thematicId\`), PRIMARY KEY (\`callId\`, \`thematicId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`thematic_challenges_challenge\` (\`thematicId\` int NOT NULL, \`challengeId\` int NOT NULL, INDEX \`IDX_865e652eaaa5181185bfe9d0d5\` (\`thematicId\`), INDEX \`IDX_1508f649282e3c85f5b26ce805\` (\`challengeId\`), PRIMARY KEY (\`thematicId\`, \`challengeId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`solution_challenges_challenge\` (\`solutionId\` int NOT NULL, \`challengeId\` int NOT NULL, INDEX \`IDX_8fa3feaecd6791dbdd8967a5fa\` (\`solutionId\`), INDEX \`IDX_a8399cb4c251056986aeb3128d\` (\`challengeId\`), PRIMARY KEY (\`solutionId\`, \`challengeId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`solution_feedbacks_feedback\` (\`solutionId\` int NOT NULL, \`feedbackId\` int NOT NULL, INDEX \`IDX_521114a7a31c095f35d3328abc\` (\`solutionId\`), INDEX \`IDX_3ca60cc263b2cf06704ca08480\` (\`feedbackId\`), PRIMARY KEY (\`solutionId\`, \`feedbackId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_roles_role\` (\`userId\` int NOT NULL, \`roleId\` int NOT NULL, INDEX \`IDX_5f9286e6c25594c6b88c108db7\` (\`userId\`), INDEX \`IDX_4be2f7adf862634f5f803d246b\` (\`roleId\`), PRIMARY KEY (\`userId\`, \`roleId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_4a39e6ac0cecdf18307a365cf3c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_e69d86ad179c4a0389ed2860880\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_a6d648bdb9da84b174d72b5d9c1\` FOREIGN KEY (\`callId\`) REFERENCES \`call\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_2ec64e0e6d4845d0ee0f1b9e232\` FOREIGN KEY (\`statusId\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_c60ee1656ee14bd7d6aa75968e3\` FOREIGN KEY (\`thematicId\`) REFERENCES \`thematic\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_577971bf35a3f85b2d6edd8329e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_ed090fd84e131ffea722335fe99\` FOREIGN KEY (\`poleId\`) REFERENCES \`pole\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_659711c5971695cda97f7db52a2\` FOREIGN KEY (\`poleId\`) REFERENCES \`pole\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_642763a1acbc9672d38429ea62a\` FOREIGN KEY (\`organisationId\`) REFERENCES \`organisation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`call_thematics_thematic\` ADD CONSTRAINT \`FK_6126deea99c4a6a70ae99f1ef1d\` FOREIGN KEY (\`callId\`) REFERENCES \`call\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`call_thematics_thematic\` ADD CONSTRAINT \`FK_3f13af8a47c8b7daf6b5cd1ee9b\` FOREIGN KEY (\`thematicId\`) REFERENCES \`thematic\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`thematic_challenges_challenge\` ADD CONSTRAINT \`FK_865e652eaaa5181185bfe9d0d5c\` FOREIGN KEY (\`thematicId\`) REFERENCES \`thematic\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`thematic_challenges_challenge\` ADD CONSTRAINT \`FK_1508f649282e3c85f5b26ce8053\` FOREIGN KEY (\`challengeId\`) REFERENCES \`challenge\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution_challenges_challenge\` ADD CONSTRAINT \`FK_8fa3feaecd6791dbdd8967a5fa9\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solution\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution_challenges_challenge\` ADD CONSTRAINT \`FK_a8399cb4c251056986aeb3128d6\` FOREIGN KEY (\`challengeId\`) REFERENCES \`challenge\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution_feedbacks_feedback\` ADD CONSTRAINT \`FK_521114a7a31c095f35d3328abc3\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solution\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution_feedbacks_feedback\` ADD CONSTRAINT \`FK_3ca60cc263b2cf06704ca08480a\` FOREIGN KEY (\`feedbackId\`) REFERENCES \`feedback\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_5f9286e6c25594c6b88c108db77\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles_role\` ADD CONSTRAINT \`FK_4be2f7adf862634f5f803d246b8\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_4be2f7adf862634f5f803d246b8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles_role\` DROP FOREIGN KEY \`FK_5f9286e6c25594c6b88c108db77\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution_feedbacks_feedback\` DROP FOREIGN KEY \`FK_3ca60cc263b2cf06704ca08480a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution_feedbacks_feedback\` DROP FOREIGN KEY \`FK_521114a7a31c095f35d3328abc3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution_challenges_challenge\` DROP FOREIGN KEY \`FK_a8399cb4c251056986aeb3128d6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution_challenges_challenge\` DROP FOREIGN KEY \`FK_8fa3feaecd6791dbdd8967a5fa9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`thematic_challenges_challenge\` DROP FOREIGN KEY \`FK_1508f649282e3c85f5b26ce8053\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`thematic_challenges_challenge\` DROP FOREIGN KEY \`FK_865e652eaaa5181185bfe9d0d5c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`call_thematics_thematic\` DROP FOREIGN KEY \`FK_3f13af8a47c8b7daf6b5cd1ee9b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`call_thematics_thematic\` DROP FOREIGN KEY \`FK_6126deea99c4a6a70ae99f1ef1d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_642763a1acbc9672d38429ea62a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_659711c5971695cda97f7db52a2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_ed090fd84e131ffea722335fe99\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_577971bf35a3f85b2d6edd8329e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_c60ee1656ee14bd7d6aa75968e3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_2ec64e0e6d4845d0ee0f1b9e232\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_a6d648bdb9da84b174d72b5d9c1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_e69d86ad179c4a0389ed2860880\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_4a39e6ac0cecdf18307a365cf3c\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4be2f7adf862634f5f803d246b\` ON \`user_roles_role\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5f9286e6c25594c6b88c108db7\` ON \`user_roles_role\``,
    );
    await queryRunner.query(`DROP TABLE \`user_roles_role\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_3ca60cc263b2cf06704ca08480\` ON \`solution_feedbacks_feedback\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_521114a7a31c095f35d3328abc\` ON \`solution_feedbacks_feedback\``,
    );
    await queryRunner.query(`DROP TABLE \`solution_feedbacks_feedback\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a8399cb4c251056986aeb3128d\` ON \`solution_challenges_challenge\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8fa3feaecd6791dbdd8967a5fa\` ON \`solution_challenges_challenge\``,
    );
    await queryRunner.query(`DROP TABLE \`solution_challenges_challenge\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_1508f649282e3c85f5b26ce805\` ON \`thematic_challenges_challenge\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_865e652eaaa5181185bfe9d0d5\` ON \`thematic_challenges_challenge\``,
    );
    await queryRunner.query(`DROP TABLE \`thematic_challenges_challenge\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_3f13af8a47c8b7daf6b5cd1ee9\` ON \`call_thematics_thematic\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_6126deea99c4a6a70ae99f1ef1\` ON \`call_thematics_thematic\``,
    );
    await queryRunner.query(`DROP TABLE \`call_thematics_thematic\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_cd8c76405ea34f3da19bb9aa5d\` ON \`quotation\``,
    );
    await queryRunner.query(`DROP TABLE \`quotation\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\``,
    );
    await queryRunner.query(`DROP TABLE \`role\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d9428f9c8e3052d6617e3aab0e\` ON \`organisation\``,
    );
    await queryRunner.query(`DROP TABLE \`organisation\``);
    await queryRunner.query(`DROP TABLE \`solution\``);
    await queryRunner.query(`DROP TABLE \`image\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_bd7ae1c4c03a7b15e369bc4d5a\` ON \`pole\``,
    );
    await queryRunner.query(`DROP TABLE \`pole\``);
    await queryRunner.query(`DROP TABLE \`feedback\``);
    await queryRunner.query(`DROP TABLE \`status\``);
    await queryRunner.query(`DROP TABLE \`thematic\``);
    await queryRunner.query(`DROP TABLE \`challenge\``);
    await queryRunner.query(`DROP TABLE \`call\``);
  }
}
