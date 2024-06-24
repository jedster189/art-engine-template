import { WordPhraseGenerator } from "./custom/generators/word-phrase-generator";
import { WordsListInput } from "./custom/inputs/words-list-input";

const {
  ArtEngine,
  inputs,
  generators,
  renderers,
  exporters,
} = require("@hashlips-lab/art-engine");

const BASE_PATH = __dirname;

const ae = new ArtEngine({
  cachePath: `${BASE_PATH}/../cache`,
  outputPath: `${BASE_PATH}/../output`,
  useCache: false,

  inputs: {
    words: new WordsListInput(`${BASE_PATH}/../data/words.json`),
  },

  generators: [
    new WordPhraseGenerator("words", 2, 4, 12),
  ],

  renderers: [],

  exporters: [],
});

(async () => {
  await ae.run();
  await ae.printPerformance();
})();
