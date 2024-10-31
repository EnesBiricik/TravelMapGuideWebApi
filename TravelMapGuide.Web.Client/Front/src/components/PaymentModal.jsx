/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { Modal, Button, Input, Space, Select } from "antd";
import { makePayment } from "../service/paymentService";

const monthOptions = [
  {
    value: "01",
    label: "01",
  },
  {
    value: "02",
    label: "02",
  },
  {
    value: "03",
    label: "03",
  },
  {
    value: "04",
    label: "04",
  },
  {
    value: "05",
    label: "05",
  },
  {
    value: "06",
    label: "06",
  },
  {
    value: "07",
    label: "07",
  },
  {
    value: "08",
    label: "08",
  },
  {
    value: "09",
    label: "09",
  },
  {
    value: "10",
    label: "10",
  },
  {
    value: "11",
    label: "11",
  },
  {
    value: "12",
    label: "12",
  },
];
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 12 }, (_, i) => {
    const year = currentYear + i;
    return {
      value: year.toString(),
      label: year.toString(),
    };
  });
  return yearOptions;
};

// Kullanım
const yearOptions = getYearOptions();
console.log(yearOptions);

export default function PaymentModal({
  isFeatureModalVisible,
  setFeatureModalVisible,
  travelId,
}) {
  const [cardIssuer, setCardIssuer] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expireMonth, setExpireMonth] = useState(12);
  const [expireYear, setExpireYear] = useState(2024);
  const [cvc, setCvc] = useState("");
  const price = 10; // this is for test price - TL

  useEffect(() => {
    console.log("cardNumber", cardNumber);
    if (cardNumber.substring(0, 1) == "4") {
      setCardIssuer("visa");
    } else if (cardNumber.substring(0, 1) == "5") {
      setCardIssuer("master");
    } else {
      setCardIssuer("");
    }
  }, [cardNumber]);

  const handleModalClose = () => {
    setFeatureModalVisible(false);
    setCardHolderName("");
    setCardNumber("");
    setExpireMonth(12);
    setExpireYear(2024);
    setCvc("");
  };

  const handlePayment = async () => {
    const paymentData = {
      cardNumber,
      cardHolderName,
      expireMonth: expireMonth.toString(),
      expireYear: expireYear.toString(),
      cvc: cvc.toString(),
      price,
      travelId,
    };

    console.log(paymentData);

    try {
      const token = localStorage.getItem("jwtToken");

      const result = await makePayment(paymentData, token);
      if (result.success) {
        console.log(result.message);
        handleModalClose();
        alert("Payment successfully.");
      } else {
        console.error(result.errorMessage);
        alert("Payment error." + result.errorMessage);
      }
    } catch (error) {
      console.error(error.message);
      alert("Payment error." + error.message);
    }
  };

  return (
    <Modal
      className="PaymentModal"
      title={`Feature your post by only ${price}$`}
      open={isFeatureModalVisible}
      onCancel={handleModalClose}
      footer={null}
    >
      <div className="col-12 row py-3">
        <div className="col-7 col-xs-12">
          {/* Card Number Input */}
          <div className="px-1 py-1 my-2 bg-gray-100">
            <label>Card Number</label>
            <Input
              maxLength={16}
              className="mt-1"
              value={cardNumber}
              placeholder="Enter your card number"
              onChange={(e) =>
                setCardNumber(e.target.value.replaceAll(" ", ""))
              }
            />
          </div>

          {/* Card Holder Name Input */}
          <div className="px-1 py-1 my-2 bg-gray-100">
            <label>Card Holder Name</label>
            <Input
              className="mt-1"
              value={cardHolderName}
              placeholder="Enter the card holder's name"
              onChange={(e) => setCardHolderName(e.target.value)}
            />
          </div>
          <div className="px-1 py-1 my-2 bg-gray-100">
            <label>Month / Year</label>
            <br />
            <Space.Compact style={{ marginTop: "5px" }}>
              <Select
                defaultValue={12}
                onSelect={(e) => {
                  setExpireMonth(Number(e));
                }}
                options={monthOptions}
              />
              <Select
                defaultValue={Number(new Date().getFullYear())}
                onSelect={(e) => setExpireYear(Number(e))}
                options={getYearOptions()}
              />
            </Space.Compact>
          </div>

          {/* CVC Input */}
          <div className="px-1 py-1 my-2 bg-gray-100">
            <label>CVV</label>
            <br />
            <Input.OTP
              style={{ marginTop: "5px" }}
              length={3}
              formatter={(str) => str.toUpperCase()}
              onChange={(e) => setCvc(Number(e))}
            />
            <br />
          </div>
        </div>
        <div className="col-5 col-xs-12" id="creditCartParent">
          <div className="creditCart">
            <div className="">
              <div className="creditHeader">
                <div className="col-9 creditTitleDiv">
                  {cardIssuer && (
                    <img
                      style={{ paddingRight: "5px" }}
                      width={26}
                      src={`/src/assets/images/${cardIssuer}.png`}
                    ></img>
                  )}

                  <h1>{cardIssuer.toLocaleUpperCase()} CARD</h1>
                </div>
                <div className="col-3">
                  <img id="cip" src="/src/assets/images/cip.png"></img>
                </div>
              </div>

              <div className="creditContent mt-3">
                <label>Card No</label>
                <p>{cardNumber ? cardNumber : "#### #### #### ####"}</p>
                <label>Card Owner</label>
                <p>
                  {cardHolderName ? cardHolderName.toLocaleUpperCase() : "-"}
                </p>
              </div>
            </div>

            <div className="creditBottom">
              <div className="col-8">
                <label>CVV</label>

                <p>{cvc ? cvc : "###"}</p>
              </div>
              <div className="col-4 cartDate">
                <label>Valid Thru</label>
                <p>
                  {expireMonth ? expireMonth : "12"}/
                  {expireYear ? expireYear : getYearOptions()[0].label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="col-12 row px-1 py-1 my-2">
        <div className="mr-2 col-3">
          <Button type="primary" onClick={handlePayment}>
            Pay {price}$
          </Button>
        </div>
        <div className=" col-2">
          <Button className="ml-5" onClick={handleModalClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
