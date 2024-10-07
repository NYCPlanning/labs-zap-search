import { Module } from "@nestjs/common";
import { SubscriptionController } from "./subscription.controller";

@Module({
  imports: [],
  providers: [],
  exports: [],
  controllers: [SubscriptionController]
})
export class SubscriptionModule {}
