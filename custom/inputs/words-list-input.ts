import fs from "fs";

import InputInterface, {
  InputInitPropsInterface,
} from "@hashlips-lab/art-engine/dist/common/inputs/input.interface";

interface WordInterface {
  word: string;
  wordLength: number;
}

export class WordsListInput implements InputInterface<WordInterface[]> {
  constructor(private wordListPath: string) {}

  public async init(props: InputInitPropsInterface): Promise<void> {}

  public async load(): Promise<WordInterface[]> {
    let mappedWords: WordInterface[] = [];
    
    const jsonData = fs.readFileSync(this.wordListPath, "utf8");
    const words = JSON.parse(jsonData);

    mappedWords = words.map((word: string) => {
      return {
        word,
        wordLength: word.length,
      };
    });

    return mappedWords;
  }
}
