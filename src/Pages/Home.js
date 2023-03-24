import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { STORAGE, strings } from "../Helper/Utils";
import { getPromotions } from "../Services/DataService";
import { localStorageHelper } from "../Helper/LocalStorage";
import "./Home.css";

export default function Home() {
  const Tabs = {
    All: strings.Home.All_Promotions,
    Customer: strings.Home.New_Customers,
  };
  const [promotions, setPromotions] = useState([]);
  const [activeTab, setActiveTab] = useState(Tabs.All);
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    getPromotions().then(
      function (retrivedPromotions) {
        setPromotions(retrivedPromotions);
      },
      function (error) {
        alert(error.message);
      }
    );
  }, []);

  const getPomotionsForActiveTab = () => {
    return activeTab === Tabs.All
      ? promotions
      : promotions.filter((e) => e.onlyNewCustomers);
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
    localStorageHelper.store(STORAGE.PROMOTIONS, copyPromotions);
  };

  // Render Customer Promotions Tab Row

  const renderCustomerPromotionRow = (promotion, index) => {
    return (
      <Row className="m-4 promotionContainer" key={promotion.id}>
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
          {[Tabs.All, Tabs.Customer].map((title, index) => (
            <Col key={index}>
              <div
                className={`tabItem ${activeTab === title ? "tabSelect" : ""}`}
                onClick={() => {
                  setActiveTab(title);
                }}
              >
                {title}
              </div>
            </Col>
          ))}
        </Row>
      </Container>
      <Container className="mb-4">
        {getPomotionsForActiveTab().map((promotion, index) => {
          if (activeTab === Tabs.All)
            return renderAllPromotionRow(promotion, index);
          else return renderCustomerPromotionRow(promotion, index);
        })}
      </Container>
    </>
  );
}
