import { IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateTrackDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateIf((obj) => obj.artistId !== null)
  @IsString()
  artistId?: string | null;

  @IsOptional()
  @ValidateIf((obj) => obj.artistId !== null)
  @IsString()
  albumId?: string | null;

  @IsOptional()
  @IsNumber()
  duration?: number;
}
