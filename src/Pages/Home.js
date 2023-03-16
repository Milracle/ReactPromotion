import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import Axios from "axios";
import { API_URLS } from "../API/API";
import { strings } from "../Helper/Utils";
import "./Home.css";
const { Promotions } = API_URLS;

export default function Home() {
  const [dataList, setDataList] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const tabs = [strings.ALL_PRMOTIONS, strings.NEW_CUSTOMERS];

  // Data helper

  useEffect(() => {
    if (dataList.length === 0) fatchdataList();
  }, [dataList]);

  const fatchdataList = async () => {
    let obj = {};
    const { data } = await Axios.get(Promotions.Select, obj);
    if (data) {
      const dataList = data.sort((a, b) => a.sequence - b.sequence);
      setDataList(dataList);
    }
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
      </Container>
    </>
  );
}
