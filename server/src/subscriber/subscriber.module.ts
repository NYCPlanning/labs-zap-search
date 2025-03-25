import { Module } from "@nestjs/common";
import { SubscriberController } from "./subscriber.controller";
import { SubscriberService } from "./subscriber.service";
import { ConfigModule } from "../config/config.module";
import { Client } from "@sendgrid/client";
import { MailService } from "@sendgrid/mail";

@Module({
  imports: [ConfigModule],
  providers: [SubscriberService, Client, MailService],
  exports: [SubscriberService],
  controllers: [SubscriberController]
})
export class SubscriberModule {}
