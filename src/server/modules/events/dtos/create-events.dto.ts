import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  eventTypeCode!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate!: Date;

  @IsBoolean()
  @IsOptional()
  isAllDay?: boolean;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsString()
  @IsOptional()
  recurrencePattern?: string;

  @IsString()
  @IsOptional()
  visibilityScope?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsNotEmpty()
  createdBy!: number;
}
