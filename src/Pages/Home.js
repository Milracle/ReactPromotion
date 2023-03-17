import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import Axios from "axios";
import { API_URLS } from "../API/API";
import { STORAGE, strings } from "../Helper/Utils";
import "./Home.css";

const { Promotions } = API_URLS;

export default function Home() {
  const [promotions, setPromotions] = useState([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Data helper

  useEffect(() => {
    if (promotions.length === 0)
      if (localStorage.getItem(STORAGE.PROMOTIONS))
        // Check and set promotions from local storage if available
        setPromotions(JSON.parse(localStorage.getItem(STORAGE.PROMOTIONS)));
      else fetchpromotions(); // Call api to get promotions
  }, [promotions]);

  const fetchpromotions = async () => {
    const { data } = await Axios.get(Promotions.Select);
    if (data) {
      const dbPromotions = data.sort((a, b) => a.sequence - b.sequence);
      setPromotions(dbPromotions);
      localStorage.setItem(STORAGE.PROMOTIONS, JSON.stringify(dbPromotions));
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
    const copyPromotions = [...promotions];
    const dragItemContent = copyPromotions[dragItem.current];
    copyPromotions.splice(dragItem.current, 1);
    copyPromotions.splice(dragOverItem.current, 0, dragItemContent);

    for (let i = 0; i < copyPromotions.length; i++)
      copyPromotions[i].sequence = i;

    setPromotions(copyPromotions);
    localStorage.setItem(STORAGE.PROMOTIONS, JSON.stringify(copyPromotions));
  };

  // Render Customer Promotions Tab Row

  const renderCustomerPromotionRow = (promotion, index) => {
    return (
      <Row className="m-4 promotionContainer" key={index}>
        <Col md={6}>
          <Image src={promotion.heroImageUrl} height="auto" width="100%" />
        </Col>
        <Col className="info">
          <h2>{promotion.name}</h2>
          <p>{promotion.description}</p>
          <Row className="buttonRow">
            <Button className="col-5 btnTerms">
              {promotion.termsAndConditionsButtonText}
            </Button>
            <Col className="col-2"></Col>
            <Button className="col-5 btnJoin">
              {promotion.joinNowButtonText}
            </Button>
          </Row>
        </Col>
      </Row>
    );
  };

  // Render All Promotions Tab Row

  const renderAllPromotionRow = (promotion, index) => {
    return (
      <Row
        className="m-4"
        draggable
        onDragStart={(e) => dragStart(e, index)}
        onDragEnter={(e) => dragEnter(e, index)}
        onDragEnd={drop}
        key={index}
      >
        <Col className="promotionContainer">
          <div className="promotionTitle">{promotion.name}</div>
          <div className="subDiv">
            <p className="mt-3">{promotion.description}</p>
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <Container>
        <Row className="mt-3">
          {[strings.ALL_PRMOTIONS, strings.NEW_CUSTOMERS].map(
            (title, index) => (
              <Col key={index}>
                <div
                  className={`tabItem ${
                    activeTabIndex === index ? "tabSelect" : ""
                  }`}
                  onClick={() => setActiveTabIndex(index)}
                >
                  {title}
                </div>
              </Col>
            )
          )}
        </Row>
      </Container>
      <Container className="mb-4">
        {activeTabIndex === 0 && (
          <>
            {promotions.map((promotion, index) =>
              renderAllPromotionRow(promotion, index)
            )}
          </>
        )}

        {activeTabIndex === 1 && (
          <>
            {promotions
              .filter((e) => e.onlyNewCustomers)
              .map((promotion, index) =>
                renderCustomerPromotionRow(promotion, index)
              )}
          </>
        )}
      </Container>
    </>
  );
}
