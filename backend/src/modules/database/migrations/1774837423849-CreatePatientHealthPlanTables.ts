import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePatientHealthPlanTables1774837423849 implements MigrationInterface {
  name = 'CreatePatientHealthPlanTables1774837423849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "health_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "phone" character varying(20) NOT NULL, CONSTRAINT "PK_82cc1203b5ce422d7717e8f0321" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "birthDate" date NOT NULL, "phone" character varying(20) NOT NULL, CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "patient_plan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "contractNumber" character varying(100) NOT NULL, "patientId" uuid NOT NULL, "healthPlanId" uuid NOT NULL, CONSTRAINT "UQ_43bb3c0d6bc845f294bcc790633" UNIQUE ("contractNumber"), CONSTRAINT "PK_4b0f6ea12e522e98b12a2a826da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plan" ADD CONSTRAINT "FK_8df1ca751b9fe444a98947bc30d" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plan" ADD CONSTRAINT "FK_9e96266dabdf5a7144c53a6590d" FOREIGN KEY ("healthPlanId") REFERENCES "health_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_plan" DROP CONSTRAINT "FK_9e96266dabdf5a7144c53a6590d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plan" DROP CONSTRAINT "FK_8df1ca751b9fe444a98947bc30d"`,
    );
    await queryRunner.query(`DROP TABLE "patient_plan"`);
    await queryRunner.query(`DROP TABLE "patients"`);
    await queryRunner.query(`DROP TABLE "health_plans"`);
  }
}
