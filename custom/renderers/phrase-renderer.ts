import * as path from "path";
import * as fs from "fs";
import RendererInterface, {
  ItemsRenders,
  RendererInitPropsInterface,
} from "@hashlips-lab/art-engine/dist/common/renderers/renderer.interface";
import ItemsDataManager from "@hashlips-lab/art-engine/dist/utils/managers/items-data/items-data.manager";
import { CACHE } from "@hashlips-lab/art-engine";
import { ItemPropertiesInterface } from "@hashlips-lab/art-engine/dist/utils/managers/items-data/items-data.interface";

interface PathContentInterface {
  path: string;
  content: {
    phrase: string[];
  };
}

export class PhraseRenderer
  implements RendererInterface<PathContentInterface>
{
  attributesGetter!: ItemsDataManager["getAttributes"];
  tempRenderDir!: string;

  constructor() {}

  public async init(props: RendererInitPropsInterface): Promise<void> {
    this.attributesGetter = props.attributesGetter;
    this.tempRenderDir = path.join(
      props.cachePath,
      CACHE.RENDERERS_TEMP_CACHE_DIR
    );
  }

  public async render(): Promise<ItemsRenders<PathContentInterface>> {
    const renders: ItemsRenders<PathContentInterface> = {};

    if (!fs.existsSync(this.tempRenderDir)) {
      fs.mkdirSync(this.tempRenderDir);
    }

    for (const [id, attributes] of Object.entries(this.attributesGetter())) {
      const foundPhrase = (attributes as ItemPropertiesInterface<any>[]).find(
        (attr: ItemPropertiesInterface<any>) =>
          attr.kind === "WordPhraseGenerator@v1"
      );

      if (foundPhrase) {
        let tempFilePath = path.join(this.tempRenderDir, `${id}.json`);

        fs.writeFileSync(
          tempFilePath,
          JSON.stringify(foundPhrase.data, null, 2)
        );

        renders[id] = [
          {
            kind: "PhraseRenderer@v1",
            data: {
              path: tempFilePath,
              content: foundPhrase.data,
            },
          },
        ];
      }
    }

    return renders;
  }
}
