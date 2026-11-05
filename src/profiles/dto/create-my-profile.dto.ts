import { OmitType } from '@nestjs/swagger';
import { CreateProfileDto } from './create-profile.dto';

export class CreateMyProfileDto extends OmitType(CreateProfileDto, ['userId'] as const) {}