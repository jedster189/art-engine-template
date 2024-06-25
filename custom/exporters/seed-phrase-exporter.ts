import * as path from "path";
import * as fs from "fs";
import { createHash } from "crypto";
import ExporterInterface, {
  ExporterInitPropsInterface,
} from "@hashlips-lab/art-engine/dist/common/exporters/exporter.interface";
import ItemsDataManager from "@hashlips-lab/art-engine/dist/utils/managers/items-data/items-data.manager";
import { ItemPropertiesInterface } from "@hashlips-lab/art-engine/dist/utils/managers/items-data/items-data.interface";

export class SeedPhraseExporter implements ExporterInterface {
  private rendersGetter!: ItemsDataManager["getRenders"];
  private outputPath!: string;

  public async init(props: ExporterInitPropsInterface) {
    this.rendersGetter = props.rendersGetter;
    this.outputPath = props.outputPath;
  }

  public async export(): Promise<void> {
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath);
    }

    for (const [_, renders] of Object.entries(this.rendersGetter())) {
      let phraseDataANdPath = (renders as ItemPropertiesInterface<any>[]).find(
        (render: ItemPropertiesInterface<any>) => 
          "PhraseRenderer@v1" === render.kind
      );

      if (phraseDataANdPath) {
        const fileContent = fs.readFileSync(
          phraseDataANdPath.data.path, "utf8"
        );
        
        const data = JSON.parse(fileContent);

        const hash = createHash("md5").update(fileContent).digest("hex");

        fs.writeFileSync(
          path.join(this.outputPath, `${hash}.json`),
          JSON.stringify(data.phrase, null, 2)
        );
      }
    }
  }
}