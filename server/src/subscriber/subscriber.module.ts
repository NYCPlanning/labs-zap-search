import { Module } from "@nestjs/common";
import { SubscriberController } from "./subscriber.controller";
import { SubscriberService } from "./subscriber.service";
import { ConfigModule } from "../config/config.module";
import { Client } from "@sendgrid/client";

@Module({
  imports: [ConfigModule],
  providers: [SubscriberService, Client],
  exports: [SubscriberService],
  controllers: [SubscriberController]
})
export class SubscriberModule {}
