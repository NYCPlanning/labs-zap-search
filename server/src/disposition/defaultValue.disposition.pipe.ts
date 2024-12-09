import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class defaultValueDispositionPipe implements PipeTransform<any, any> {
  transform(value: any, { type }: ArgumentMetadata) {
    const data = value?.data;

    if (!data) {
      console.debug('Value is empty or does not contain "data". Skipping processing.');
      return value;
    }

    if (type === "body") {
      if (!data.attributes["dcp-nameofpersoncompletingthisform"]) {
        data.attributes["dcp-nameofpersoncompletingthisform"] =
          "ZAP LUP Portal";
      }
    }
    return value;
  }
}
