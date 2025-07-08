import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751950895076 implements MigrationInterface {
  name = "Migration1751950895076";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "_fakeColumnForMigration" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders" DROP COLUMN "_fakeColumnForMigration"`
    );
  }
}
