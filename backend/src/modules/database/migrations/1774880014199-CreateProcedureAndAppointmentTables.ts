import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProcedureAndAppointmentTables1774880014199 implements MigrationInterface {
  name = 'CreateProcedureAndAppointmentTables1774880014199';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "patient_plans" DROP CONSTRAINT "FK_8df1ca751b9fe444a98947bc30d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" DROP CONSTRAINT "FK_9e96266dabdf5a7144c53a6590d"`,
    );
    await queryRunner.query(
      `CREATE TABLE "procedures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(150) NOT NULL, "price" numeric(10,2), CONSTRAINT "UQ_81aed255688030b862c218124b4" UNIQUE ("name"), CONSTRAINT "PK_e7775bab78f27b4c47580b6cb4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "appointment_procedures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "appointmentId" uuid NOT NULL, "procedureId" uuid NOT NULL, CONSTRAINT "PK_c11bec849aa455032d4b81a6274" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "scheduledAt" TIMESTAMP NOT NULL, "patientId" uuid NOT NULL, "doctorId" uuid NOT NULL, "patientPlanId" uuid, "isPrivate" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" ADD CONSTRAINT "FK_0c02b19a0c2e61fd92ed209c563" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" ADD CONSTRAINT "FK_850077525cd9c12e88030dbf55e" FOREIGN KEY ("healthPlanId") REFERENCES "health_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment_procedures" ADD CONSTRAINT "FK_d8e77f666cf7d3123949bef38be" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment_procedures" ADD CONSTRAINT "FK_b914a1572b25365e9a09d4ac51d" FOREIGN KEY ("procedureId") REFERENCES "procedures"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_0c1af27b469cb8dca420c160d65" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointments" ADD CONSTRAINT "FK_8ff9dc5323134cc96d6c66f6d01" FOREIGN KEY ("patientPlanId") REFERENCES "patient_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "appointment_procedures" DROP CONSTRAINT "FK_b914a1572b25365e9a09d4ac51d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "appointment_procedures" DROP CONSTRAINT "FK_d8e77f666cf7d3123949bef38be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" DROP CONSTRAINT "FK_850077525cd9c12e88030dbf55e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" DROP CONSTRAINT "FK_0c02b19a0c2e61fd92ed209c563"`,
    );
    await queryRunner.query(`DROP TABLE "appointments"`);
    await queryRunner.query(`DROP TABLE "appointment_procedures"`);
    await queryRunner.query(`DROP TABLE "procedures"`);
    await queryRunner.query(
      `ALTER TABLE "patient_plans" ADD CONSTRAINT "FK_9e96266dabdf5a7144c53a6590d" FOREIGN KEY ("healthPlanId") REFERENCES "health_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "patient_plans" ADD CONSTRAINT "FK_8df1ca751b9fe444a98947bc30d" FOREIGN KEY ("patientId") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
