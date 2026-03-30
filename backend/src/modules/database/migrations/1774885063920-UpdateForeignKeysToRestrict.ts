import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateForeignKeysToRestrict1774885063920 implements MigrationInterface {
  name = 'UpdateForeignKeysToRestrict1774885063920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_plans" DROP CONSTRAINT "FK_0c02b19a0c2e61fd92ed209c563"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" DROP CONSTRAINT "FK_850077525cd9c12e88030dbf55e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_0c1af27b469cb8dca420c160d65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_8ff9dc5323134cc96d6c66f6d01"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctors" DROP CONSTRAINT "FK_5e31a1b2872a68277b66c512d74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" ADD CONSTRAINT "FK_0c02b19a0c2e61fd92ed209c563" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" ADD CONSTRAINT "FK_850077525cd9c12e88030dbf55e" FOREIGN KEY ("healthPlanId") REFERENCES "health_plans"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_0c1af27b469cb8dca420c160d65" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_8ff9dc5323134cc96d6c66f6d01" FOREIGN KEY ("patientPlanId") REFERENCES "patient_plans"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctors" ADD CONSTRAINT "FK_5e31a1b2872a68277b66c512d74" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "doctors" DROP CONSTRAINT "FK_5e31a1b2872a68277b66c512d74"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_8ff9dc5323134cc96d6c66f6d01"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_0c1af27b469cb8dca420c160d65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" DROP CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" DROP CONSTRAINT "FK_850077525cd9c12e88030dbf55e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" DROP CONSTRAINT "FK_0c02b19a0c2e61fd92ed209c563"`,
    );
    await queryRunner.query(
      `ALTER TABLE "doctors" ADD CONSTRAINT "FK_5e31a1b2872a68277b66c512d74" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_8ff9dc5323134cc96d6c66f6d01" FOREIGN KEY ("patientPlanId") REFERENCES "patient_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_0c1af27b469cb8dca420c160d65" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" ADD CONSTRAINT "FK_850077525cd9c12e88030dbf55e" FOREIGN KEY ("healthPlanId") REFERENCES "health_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" ADD CONSTRAINT "FK_0c02b19a0c2e61fd92ed209c563" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
