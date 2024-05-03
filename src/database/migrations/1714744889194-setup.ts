import { MigrationInterface, QueryRunner } from 'typeorm';

export class Setup1714744889194 implements MigrationInterface {
  name = 'Setup1714744889194';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_4a39e6ac0cecdf18307a365cf3c\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_a6d648bdb9da84b174d72b5d9c1\``);
    await queryRunner.query(
      `ALTER TABLE \`event_thematics_thematic\` DROP FOREIGN KEY \`FK_3f13af8a47c8b7daf6b5cd1ee9b\``
    );
    await queryRunner.query(
      `ALTER TABLE \`event_thematics_thematic\` DROP FOREIGN KEY \`FK_6126deea99c4a6a70ae99f1ef1d\``
    );
    await queryRunner.query(`DROP INDEX \`IDX_6126deea99c4a6a70ae99f1ef1\` ON \`event_thematics_thematic\``);
    await queryRunner.query(`DROP INDEX \`IDX_3f13af8a47c8b7daf6b5cd1ee9\` ON \`event_thematics_thematic\``);
    await queryRunner.query(
      `ALTER TABLE \`feedback\` CHANGE \`user_comment\` \`statusId\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_At\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`score\` (\`id\` int NOT NULL AUTO_INCREMENT, \`question\` varchar(255) NOT NULL, \`score\` float NOT NULL, \`feedbackId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`event_categories_category\` (\`eventId\` int NOT NULL, \`categoryId\` int NOT NULL, INDEX \`IDX_9fc5e5dab789917cc33940c08a\` (\`eventId\`), INDEX \`IDX_0c38526fad528c70c7c5baaa08\` (\`categoryId\`), PRIMARY KEY (\`eventId\`, \`categoryId\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`solution\` DROP COLUMN \`image_link\``);
    await queryRunner.query(`ALTER TABLE \`feedback\` CHANGE \`comment\` \`comment\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`feedback\` CHANGE \`userId\` \`userId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`feedback\` DROP COLUMN \`statusId\``);
    await queryRunner.query(`ALTER TABLE \`feedback\` ADD \`statusId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_e69d86ad179c4a0389ed2860880\``);
    await queryRunner.query(`ALTER TABLE \`image\` CHANGE \`solutionId\` \`solutionId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_2ec64e0e6d4845d0ee0f1b9e232\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_c60ee1656ee14bd7d6aa75968e3\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_577971bf35a3f85b2d6edd8329e\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_ed090fd84e131ffea722335fe99\``);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`video_link\` \`video_link\` varchar(255) NULL`);
    await queryRunner.query(
      `ALTER TABLE \`solution\` CHANGE \`created_at\` \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` CHANGE \`updated_at\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`
    );
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`eventId\` \`eventId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`statusId\` \`statusId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`thematicId\` \`thematicId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`userId\` \`userId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`poleId\` \`poleId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_659711c5971695cda97f7db52a2\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_642763a1acbc9672d38429ea62a\``);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`phone_number\` \`phone_number\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`token\` \`token\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`google_image\` \`google_image\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`profile\` \`profile\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`poleId\` \`poleId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`organisationId\` \`organisationId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`quotation\` CHANGE \`average\` \`average\` float NULL`);
    await queryRunner.query(
      `CREATE INDEX \`IDX_7dea622c5fb87059c2ced2c1fd\` ON \`event_thematics_thematic\` (\`eventId\`)`
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_f190b63fe1a8ee99eca04bf320\` ON \`event_thematics_thematic\` (\`thematicId\`)`
    );
    await queryRunner.query(
      `ALTER TABLE \`score\` ADD CONSTRAINT \`FK_8c32053083d0d526ff860b92669\` FOREIGN KEY (\`feedbackId\`) REFERENCES \`feedback\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_4a39e6ac0cecdf18307a365cf3c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_a284c7d0e548d1de6aa41914057\` FOREIGN KEY (\`statusId\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_e69d86ad179c4a0389ed2860880\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_862e489eed12657e44366d463d9\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_2ec64e0e6d4845d0ee0f1b9e232\` FOREIGN KEY (\`statusId\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_c60ee1656ee14bd7d6aa75968e3\` FOREIGN KEY (\`thematicId\`) REFERENCES \`thematic\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_577971bf35a3f85b2d6edd8329e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_ed090fd84e131ffea722335fe99\` FOREIGN KEY (\`poleId\`) REFERENCES \`pole\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_659711c5971695cda97f7db52a2\` FOREIGN KEY (\`poleId\`) REFERENCES \`pole\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_642763a1acbc9672d38429ea62a\` FOREIGN KEY (\`organisationId\`) REFERENCES \`organisation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`event_thematics_thematic\` ADD CONSTRAINT \`FK_7dea622c5fb87059c2ced2c1fd0\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`event_thematics_thematic\` ADD CONSTRAINT \`FK_f190b63fe1a8ee99eca04bf3203\` FOREIGN KEY (\`thematicId\`) REFERENCES \`thematic\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`event_categories_category\` ADD CONSTRAINT \`FK_9fc5e5dab789917cc33940c08a9\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`event_categories_category\` ADD CONSTRAINT \`FK_0c38526fad528c70c7c5baaa081\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event_categories_category\` DROP FOREIGN KEY \`FK_0c38526fad528c70c7c5baaa081\``
    );
    await queryRunner.query(
      `ALTER TABLE \`event_categories_category\` DROP FOREIGN KEY \`FK_9fc5e5dab789917cc33940c08a9\``
    );
    await queryRunner.query(
      `ALTER TABLE \`event_thematics_thematic\` DROP FOREIGN KEY \`FK_f190b63fe1a8ee99eca04bf3203\``
    );
    await queryRunner.query(
      `ALTER TABLE \`event_thematics_thematic\` DROP FOREIGN KEY \`FK_7dea622c5fb87059c2ced2c1fd0\``
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_642763a1acbc9672d38429ea62a\``);
    await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_659711c5971695cda97f7db52a2\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_ed090fd84e131ffea722335fe99\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_577971bf35a3f85b2d6edd8329e\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_c60ee1656ee14bd7d6aa75968e3\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_2ec64e0e6d4845d0ee0f1b9e232\``);
    await queryRunner.query(`ALTER TABLE \`solution\` DROP FOREIGN KEY \`FK_862e489eed12657e44366d463d9\``);
    await queryRunner.query(`ALTER TABLE \`image\` DROP FOREIGN KEY \`FK_e69d86ad179c4a0389ed2860880\``);
    await queryRunner.query(`ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_a284c7d0e548d1de6aa41914057\``);
    await queryRunner.query(`ALTER TABLE \`feedback\` DROP FOREIGN KEY \`FK_4a39e6ac0cecdf18307a365cf3c\``);
    await queryRunner.query(`ALTER TABLE \`score\` DROP FOREIGN KEY \`FK_8c32053083d0d526ff860b92669\``);
    await queryRunner.query(`DROP INDEX \`IDX_f190b63fe1a8ee99eca04bf320\` ON \`event_thematics_thematic\``);
    await queryRunner.query(`DROP INDEX \`IDX_7dea622c5fb87059c2ced2c1fd\` ON \`event_thematics_thematic\``);
    await queryRunner.query(`ALTER TABLE \`quotation\` CHANGE \`average\` \`average\` float(12) NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`organisationId\` \`organisationId\` int NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`poleId\` \`poleId\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`profile\` \`profile\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`google_image\` \`google_image\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`token\` \`token\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`address\` \`address\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`phone_number\` \`phone_number\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_642763a1acbc9672d38429ea62a\` FOREIGN KEY (\`organisationId\`) REFERENCES \`organisation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_659711c5971695cda97f7db52a2\` FOREIGN KEY (\`poleId\`) REFERENCES \`pole\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`poleId\` \`poleId\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`thematicId\` \`thematicId\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`statusId\` \`statusId\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`solution\` CHANGE \`eventId\` \`eventId\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`solution\` CHANGE \`updated_at\` \`updated_at\` datetime(0) NULL DEFAULT 'NULL' ON UPDATE CURRENT_TIMESTAMP()`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` CHANGE \`created_at\` \`created_at\` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP()`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` CHANGE \`video_link\` \`video_link\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_ed090fd84e131ffea722335fe99\` FOREIGN KEY (\`poleId\`) REFERENCES \`pole\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_577971bf35a3f85b2d6edd8329e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_c60ee1656ee14bd7d6aa75968e3\` FOREIGN KEY (\`thematicId\`) REFERENCES \`thematic\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_2ec64e0e6d4845d0ee0f1b9e232\` FOREIGN KEY (\`statusId\`) REFERENCES \`status\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE \`image\` CHANGE \`solutionId\` \`solutionId\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(
      `ALTER TABLE \`image\` ADD CONSTRAINT \`FK_e69d86ad179c4a0389ed2860880\` FOREIGN KEY (\`solutionId\`) REFERENCES \`solution\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(`ALTER TABLE \`feedback\` DROP COLUMN \`statusId\``);
    await queryRunner.query(`ALTER TABLE \`feedback\` ADD \`statusId\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`feedback\` CHANGE \`userId\` \`userId\` int NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`feedback\` CHANGE \`comment\` \`comment\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`ALTER TABLE \`solution\` ADD \`image_link\` varchar(255) NULL DEFAULT 'NULL'`);
    await queryRunner.query(`DROP INDEX \`IDX_0c38526fad528c70c7c5baaa08\` ON \`event_categories_category\``);
    await queryRunner.query(`DROP INDEX \`IDX_9fc5e5dab789917cc33940c08a\` ON \`event_categories_category\``);
    await queryRunner.query(`DROP TABLE \`event_categories_category\``);
    await queryRunner.query(`DROP TABLE \`score\``);
    await queryRunner.query(`DROP TABLE \`category\``);
    await queryRunner.query(
      `ALTER TABLE \`feedback\` CHANGE \`statusId\` \`user_comment\` varchar(255) NULL DEFAULT 'NULL'`
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_3f13af8a47c8b7daf6b5cd1ee9\` ON \`event_thematics_thematic\` (\`thematicId\`)`
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_6126deea99c4a6a70ae99f1ef1\` ON \`event_thematics_thematic\` (\`eventId\`)`
    );
    await queryRunner.query(
      `ALTER TABLE \`event_thematics_thematic\` ADD CONSTRAINT \`FK_6126deea99c4a6a70ae99f1ef1d\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE \`event_thematics_thematic\` ADD CONSTRAINT \`FK_3f13af8a47c8b7daf6b5cd1ee9b\` FOREIGN KEY (\`thematicId\`) REFERENCES \`thematic\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`solution\` ADD CONSTRAINT \`FK_a6d648bdb9da84b174d72b5d9c1\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`feedback\` ADD CONSTRAINT \`FK_4a39e6ac0cecdf18307a365cf3c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }
}
