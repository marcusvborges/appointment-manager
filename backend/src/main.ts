import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Appointment Manager API')
    .setDescription(
      'REST API for managing medical appointments, including authentication (JWT), patients, doctors, specialties, health plans, procedures and scheduling with business rules enforcement.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'access-token',
    )
    .addTag('Auth')
    .addTag('Specialties')
    .addTag('Doctors')
    .addTag('Patients')
    .addTag('Health Plans')
    .addTag('Patient Plans')
    .addTag('Procedures')
    .addTag('Appointments')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Appointment Manager Docs',
  });

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`🚀 Application running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/docs`);
}
void bootstrap();
