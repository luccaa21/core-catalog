import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { ComponentsModule } from './components/components.module';
import { BuildsModule } from './builds/builds.module';

@Module({
  imports: [PrismaModule, UsersModule, ProfilesModule, ManufacturersModule, ComponentsModule, BuildsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}