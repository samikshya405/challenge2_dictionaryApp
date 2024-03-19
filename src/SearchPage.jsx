import React, { useState } from "react";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";

const SearchPage = () => {
  const URL = "https://api.dictionaryapi.dev/api/v2/entries/en";
  const [searchInput, setSearchInput] = useState("");
  const [brightness, setBrightness] = useState(true);

  const [selectedOption, setSelectedOption] = useState("serif");
  const [result, setResult] = useState({});
  const [noun, setNoun] = useState({});
  const [verb, setVerb] = useState({});
  const [error, setError] = useState("");
  const [audioSelected, setAudioSelected] = useState('')
  const audio = new Audio(audioSelected)

  const handleSelect = (eventKey, event) => {
    setSelectedOption(eventKey);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchInput == "") {
      return;
    }
    try {
      const response = await fetch(`${URL}/${searchInput}`);
      const data = await response.json();
      if ((data.title === "No Definitions Found")) {
        setError(data.title);
        console.log(data)
      } else {
        setError('')
        setResult(data[0]);
        setNoun(data[0].meanings[0]);
        const a =data[0].phonetics.find(item=>item.audio!='')
        setAudioSelected(a.audio)
        if (data[0].meanings.length > 1) {
          setVerb(data[0].meanings[1]);
        } else {
          setVerb({});
        }

        console.log(data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="body"
      style={{
        background: brightness ? "white" : "#303d52",
        color: brightness ? "black" : "white",
      }}
    >
      <div className="container  p-3" style={{ fontFamily: selectedOption }}>
        <div className=" box  mx-auto p-2">
          <div className="d-flex justify-content-end align-items-center gap-3 py-2">
            <Dropdown onSelect={handleSelect}>
              <Dropdown.Toggle
                style={{ color: brightness ? "black" : "white" }}
                variant=""
                className="dropdown"
              >
                {selectedOption ? selectedOption : "Select an Option"}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="serif">serif</Dropdown.Item>
                <Dropdown.Item eventKey="san-serif">san-serif</Dropdown.Item>
                <Dropdown.Item eventKey="monospace">monospace</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <div className="d-flex  align-items-center gap-2">
              {brightness ? (
                <i
                  className="bi bi-toggle-off fs-3"
                  onClick={() => setBrightness(false)}
                ></i>
              ) : (
                <i
                  className="bi bi-toggle-on fs-3"
                  onClick={() => setBrightness(true)}
                ></i>
              )}
              <i className="bi bi-moon-fill fs-5"></i>
            </div>
          </div>

          <Form onSubmit={handleSubmit}>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit">
                <BiSearch size={24} />
              </Button>
            </InputGroup>
          </Form>

          {error === "No Definitions Found" ? (
            <h1>No Result Found</h1>
          ) : (
            result.word && (
              <div>
                <div className="d-flex justify-content-between ">
                  <div>
                    <h1>{result.word}</h1>
                    <p>{result.phonetic}</p>
                  </div>
                  <div>
                    <i className="bi bi-play-circle-fill fs-1" onClick={()=>audio.play()}></i>
                  </div>
                </div>

                {noun && noun.definitions && (
                  <div>
                    <div className="d-flex align-items-center gap-3">
                      <h5 className="m-0 bold">{noun.partOfSpeech}</h5>
                      <div className="hr bg-secondary "></div>
                    </div>

                    <p className="text-secondary py-3">Meaning</p>
                    <ul>
                      {noun.definitions?.map((item, index) => {
                        return <li key={index}>{item.definition}</li>;
                      })}
                    </ul>
                    {result.meanings[0].synonyms && result.meanings[0].synonyms.length>0 && (
                      <p className="py-3">
                        <span className="text-secondary">Synonyms</span>{"    "}
                        <span>{result.meanings[0].synonyms.join(", ")}</span>
                      </p>
                    )}
                  </div>
                )}

                {verb && verb.definitions && (
                  <div>
                    <div className="d-flex align-items-center gap-3">
                      <h5 className="m-0 bold">{verb.partOfSpeech}</h5>
                      <div className="hr bg-secondary "></div>
                    </div>
                    <p className="text-secondary py-3">Meaning</p>
                    <ul>
                      {verb &&
                        verb.definitions &&
                        verb.definitions?.map((item, index) => {
                          return (
                            <li key={index}>
                              {item.definition} <br />{" "}
                              <span className="text-secondary">
                                {item.example}
                              </span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}

                <hr />
                <p>
                  <span className="text-secondary">Source</span>{" "}
                  <span>
                    <a href={result.sourceUrls[0]} target="blank">
                      {result.sourceUrls[0]}{" "}
                      <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </span>
                </p>
              </div>
            )
          )}
          
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
