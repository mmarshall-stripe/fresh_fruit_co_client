// Package Imports
import React, { useState, useEffect } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";

// Component Imports
import Order from "./Order";
import Checkout from "./Checkout";

// Const imports
import { emptyFruitBasket } from "./consts";

// Component
const App = () => {
  // State
  const [page, setPage] = useState<Page>("order");
  const [fruitBasket, setFruitBasket] =
    useState<FruitBasketItem[]>(emptyFruitBasket);
  // TODO: leverage session ID for idempotence
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [paymentIntentId, setPaymentIntentId] = useState<string | undefined>();
  const [clientSecret, setClientSecret] = useState<string | undefined>();

  // Effects
  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
  }, []);

  // Functions
  const updateFruitBasket = (
    fruitToUpdate: FruitRef,
    updatedQuantity: number
  ) => {
    const updatedFruitBasket = fruitBasket.map((fruitBasketItem) => {
      const { ref } = fruitBasketItem;
      if (ref === fruitToUpdate) {
        const updatedFruitBasketItem = {
          ...fruitBasketItem,
          quantity: updatedQuantity,
        };
        return updatedFruitBasketItem;
      } else {
        return fruitBasketItem;
      }
    });
    setFruitBasket(updatedFruitBasket);
  };

  // Render
  return (
    <div className="App">
      {page === "order" ? (
        <Order
          setPage={setPage}
          updateFruitBasket={updateFruitBasket}
          fruitBasket={fruitBasket}
          paymentIntentId={paymentIntentId}
        />
      ) : (
        <Checkout
          setPage={setPage}
          fruitBasket={fruitBasket}
          clientSecret={clientSecret}
          setClientSecret={setClientSecret}
          paymentIntentId={paymentIntentId}
          setPaymentIntentId={setPaymentIntentId}
        />
      )}
    </div>
  );
};

// Component export
export default App;
