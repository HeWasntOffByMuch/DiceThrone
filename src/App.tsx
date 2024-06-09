import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Formik, Form, Field } from "formik";

const MAX_NUMBER_OF_PLAYERS = 6;
type CharacterSet = {
  name: string;
  enabled: boolean;
  characters: string[];
};

const seasonOneCharacters = [
  "Barbarian",
  "Moon Elf",
  "Pyromancer",
  "Shadow Thief",
  "Monk",
  "Paladin",
  "Ninja",
  "Treant",
];

const seasonTwoCharacters = [
  "Cursed Pirate",
  "Artificer",
  "Seraph",
  "Vampire Lord",
  "Gunslinger",
  "Samurai",
  "Tactician",
  "Huntress",
];
const marvelCharacters = [
  "Spider-Man",
  "Captain Marvel",
  "Black Widow",
  "Thor",
  "Scarlet Witch",
  "Loki",
  "Doctor Strange",
  "Black Panther",
];
const christmasCharacters = ["Krampus", "Santa"];
const characterSets: CharacterSet[] = [
  {
    name: "Season 1",
    enabled: true,
    characters: seasonOneCharacters,
  },
  {
    name: "Season 2",
    enabled: false,
    characters: seasonTwoCharacters,
  },
  {
    name: "Marvel",
    enabled: false,
    characters: marvelCharacters,
  },
  {
    name: "Santa",
    enabled: false,
    characters: christmasCharacters,
  },
];

function getRandomUniqueCharacters(
  charNumber: number,
  availableSets: CharacterSet[],
) {
  const characterPool = availableSets.reduce<CharacterSet["characters"]>(
    (acc, val) => {
      return [...acc, ...val.characters];
    },
    [],
  );
  console.log("characterPool", characterPool);

  const randomCharacters = [];
  for (let i = 0; i < charNumber; i++) {
    let randomIndex = Math.floor(Math.random() * characterPool.length);
    randomCharacters.push(characterPool[randomIndex]);
    characterPool.splice(randomIndex, 1);
  }
  return randomCharacters;
}

function App() {
  const formikRef = React.useRef();
  const submitHandler = (values: any, formikProps: any) => {
    console.log("input", values);
    const results = getRandomUniqueCharacters(
      values.players.length,
      values.characterSets.filter(
        ({ enabled }: { enabled: CharacterSet["enabled"] }) => enabled,
      ),
    );
    console.log("result", results);

    formikProps.setFieldValue("results", results);
    return Promise.resolve();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Dice Throne Picker</h1>
      </header>
      <Formik
        initialValues={{
          players: [""],
          results: [],
          characterSets,
        }}
        onSubmit={submitHandler}
        innerRef={formikRef.current}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <div className="editions">
              {values.characterSets.map((characterSet, index) => {
                return (
                  <label>
                    <Field
                      type="checkbox"
                      name={`characterSets[${index}].enabled`}
                    />
                    {characterSet.name}
                  </label>
                );
              })}
            </div>
            <div className="form-result">
              <div className="form">
                {values.players.map((_player, index) => {
                  return (
                    <div>
                      <button
                        onClick={() => {
                          const newPlayers = structuredClone(values.players);
                          const newResults = structuredClone(values.results);
                          newPlayers.splice(index, 1);
                          newResults.splice(index, 1);
                          setFieldValue("players", newPlayers);
                          setFieldValue("results", newResults);
                        }}
                        tabIndex={-1}
                        className="deleteButton"
                      >
                        X
                      </button>
                      <Field type="text" name={`players[${index}]`} />
                    </div>
                  );
                })}
                {values.players.length < MAX_NUMBER_OF_PLAYERS && (
                  <Field
                    type="text"
                    name="additionalInput"
                    placeholder="Add another player"
                    onFocus={() => {
                      console.log(values.players);
                      setFieldValue("players", [...values.players, ""]);
                      setTimeout(() => {
                        document
                          .querySelector<HTMLInputElement>(
                            `[name="players[${values.players.length}]"]`,
                          )
                          ?.focus();
                      }, 0);
                    }}
                  />
                )}
              </div>
              <div className="results">
                {values.results.map((pick) => {
                  return <p>{pick}</p>;
                })}
              </div>
            </div>
            <button
              type="submit"
              className="confirmButton"
              disabled={isSubmitting}
            >
              Random picks
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default App;
