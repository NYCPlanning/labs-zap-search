import { Module } from "@nestjs/common";
import { SubscriberController } from "./subscriber.controller";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [ConfigModule],
  providers: [],
  exports: [],
  controllers: [SubscriberController]
})
export class SubscriberModule {}
