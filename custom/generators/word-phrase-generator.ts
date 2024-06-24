import GeneratorInterface, {
  GeneratorInitPropsInterface,
  ItemsAttributes,
} from "@hashlips-lab/art-engine/dist/common/generators/generator.interface";
import InputsManager from "@hashlips-lab/art-engine/dist/utils/managers/inputs/inputs.manager";

interface PhraseInterface {
  phrase: string[];
}

export class WordPhraseGenerator
  implements GeneratorInterface<PhraseInterface>
{
  inputsManager!: InputsManager;

  constructor(
    private dataKey: string, 
    private amountOfPhrases: number, 
    private minWordLength: number, 
    private wordsInPhrase: number
  ) {}

  public async init(props: GeneratorInitPropsInterface): Promise<void> {
    this.inputsManager = props.inputsManager;
  }

  public async generate(): Promise<ItemsAttributes<PhraseInterface>> {
    let items: ItemsAttributes<PhraseInterface> = {};
    const inputData = this.inputsManager.get(this.dataKey);

    for(let i = 0; i < this.amountOfPhrases; i++) {
      const filterWords = inputData.filter(
        (wordObj: any) => wordObj.wordLength >= this.minWordLength
      ); 

      const selectedWords = [];

      for(let j = 0; j < this.wordsInPhrase; j++) {
        const randomIndex = Math.floor(Math.random() * filterWords.length);
        selectedWords.push(filterWords[randomIndex].word);
        filterWords.splice(randomIndex, 1);
      }

      items[i] = [
        {
          kind: "WordPhraseGenerator@v1",
          data: {
            phrase: selectedWords,
          },
        },
      ];
    }

    return items;
  }
}
