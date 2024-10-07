import { Module } from "@nestjs/common";
import { SubscriptionController } from "./subscription.controller";
import { ConfigModule } from "../config/config.module";

@Module({
  imports: [ConfigModule],
  providers: [],
  exports: [],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}
