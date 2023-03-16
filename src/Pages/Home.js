import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import Axios from "axios";
import { API_URLS } from "../API/API";
import { STORAGE, strings } from "../Helper/Utils";
import "./Home.css";
const { Promotions } = API_URLS;

export default function Home() {
  const [dataList, setDataList] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = [strings.ALL_PRMOTIONS, strings.NEW_CUSTOMERS];
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Data helper

  useEffect(() => {
    if (dataList.length === 0)
      if (localStorage.getItem(STORAGE.PROMOTIONS))
        setDataList(JSON.parse(localStorage.getItem(STORAGE.PROMOTIONS)));
      else fatchdataList();
  }, [dataList]);

  const fatchdataList = async () => {
    let obj = {};
    const { data } = await Axios.get(Promotions.Select, obj);
    if (data) {
      const dataList = data.sort((a, b) => a.sequence - b.sequence);
      localStorage.setItem(STORAGE.PROMOTIONS, JSON.stringify(dataList));
      setDataList(dataList);
    }
  };

  // Drag and Drop Helpers

  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = (e) => {
    const copyListItems = [...dataList];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);

    for (let i = 0; i < copyListItems.length; i++)
      copyListItems[i].sequence = i;

    setDataList(copyListItems);
    localStorage.setItem(STORAGE.PROMOTIONS, JSON.stringify(copyListItems));
  };

  return (
    <>
      <Container>
        <Row className="mt-3">
          {tabs.map((e, index) => (
            <Col key={index}>
              <div
                className={`tabItem ${
                  activeTabIndex === index ? "tabSelect" : ""
                }`}
                onClick={() => setActiveTabIndex(index)}
              >
                {e}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      <Container className="mb-4">
        {activeTabIndex === 0 && (
          <>
            {dataList.map((e, index) => (
              <Row
                className="m-4"
                draggable
                onDragStart={(e) => dragStart(e, index)}
                onDragEnter={(e) => dragEnter(e, index)}
                onDragEnd={drop}
                key={index}
              >
                <Col className="promotionContainer">
                  <div className="promotionTitle">{e.name}</div>
                  <div className="subDiv">
                    <p className="mt-3">{e.description}</p>
                  </div>
                </Col>
              </Row>
            ))}
          </>
        )}

        {activeTabIndex === 1 && (
          <>
            {dataList
              .filter((e) => e.onlyNewCustomers)
              .map((e, index) => (
                <Row className="m-4 promotionContainer" key={index}>
                  <Col md={6}>
                    <Image src={e.heroImageUrl} height="auto" width="100%" />
                  </Col>
                  <Col className="info">
                    <h1>{e.name}</h1>
                    <p>{e.description}</p>
                    <Row className="buttonRow">
                      <Button className="col-5">
                        {e.termsAndConditionsButtonText}
                      </Button>
                      <Col className="col-2"></Col>
                      <Button className="col-5">{e.joinNowButtonText}</Button>
                    </Row>
                  </Col>
                </Row>
              ))}
          </>
        )}
      </Container>
    </>
  );
}
