import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProcedureService } from './procedure.service';
import { CreateProcedureDto } from './dto/create-procedure.dto';
import { UpdateProcedureDto } from './dto/update-procedure.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Procedures')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@UseGuards(JwtAuthGuard)
@Controller('procedures')
export class ProcedureController {
  constructor(private readonly procedureService: ProcedureService) {}

  @Post()
  @ApiOperation({ summary: 'Create procedure' })
  @ApiOkResponse({ description: 'Procedure created successfully' })
  @ApiConflictResponse({
    description: 'Procedure with this name already exists',
  })
  create(@Body() createProcedureDto: CreateProcedureDto) {
    return this.procedureService.create(createProcedureDto);
  }

  @Get()
  @ApiOperation({ summary: 'List procedures' })
  @ApiOkResponse({ description: 'List returned successfully' })
  findAll() {
    return this.procedureService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get procedure by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Procedure returned successfully' })
  @ApiNotFoundResponse({ description: 'Procedure not found' })
  findOne(@Param('id') id: string) {
    return this.procedureService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update procedure' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Procedure updated successfully' })
  @ApiNotFoundResponse({ description: 'Procedure not found' })
  @ApiConflictResponse({
    description: 'Procedure with this name already exists',
  })
  update(
    @Param('id') id: string,
    @Body() updateProcedureDto: UpdateProcedureDto,
  ) {
    return this.procedureService.update(id, updateProcedureDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete procedure' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ description: 'Procedure removed successfully' })
  @ApiNotFoundResponse({ description: 'Procedure not found' })
  @ApiConflictResponse({
    description: 'Cannot delete procedure linked to appointments',
  })
  remove(@Param('id') id: string) {
    return this.procedureService.remove(id);
  }
}
