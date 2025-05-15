import { IsString, IsOptional, MaxLength, IsNotEmpty } from "class-validator";

export class UpdateAreaDto {
  @IsString()
  @IsOptional() // Make fields optional for partial updates
  @IsNotEmpty()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
