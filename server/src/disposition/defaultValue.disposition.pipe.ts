import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class defaultValueDispositionPipe implements PipeTransform<any, any> {
  transform(value: any, { type }: ArgumentMetadata) {
    const { data } = value;
    if (type === "body") {
      if (!data.attributes["dcp-nameofpersoncompletingthisform"]) {
        data.attributes["dcp-nameofpersoncompletingthisform"] =
          "ZAP LUP Portal";
      }
    }
    return value;
  }
}
