// Package Imports
import React from "react";

// Style imports
import {
  Card,
  Label,
  Input,
  UnorderedList,
  ListItem,
  Heading,
  Separator,
  Button,
  HelpText,
  Box,
  Text,
} from "@twilio-paste/core";

// Function imports
import { updatePaymentIntentItemsRequest } from "./requests";

// Types
interface OrderProps {
  setPage: Function;
  updateFruitBasket: Function;
  fruitBasket: FruitBasketItem[];
  paymentIntentId: string | undefined;
}

const Order = ({
  setPage,
  updateFruitBasket,
  fruitBasket,
  paymentIntentId,
}: OrderProps) => {
  // Functions
  const moveToCheckout = async () => {
    if (paymentIntentId) {
      await updatePaymentIntentItemsRequest(paymentIntentId, fruitBasket);
    }
    setPage("checkout");
  };

  // Render
  return (
    <Box className="order-wrapper">
      <Card padding={"space100"}>
        <Heading as="h1" variant="heading10">
          Fresh Fruit Co.
        </Heading>
        <Box className="order-list">
          <UnorderedList>
            {fruitBasket.map(({ label, ref, cost, quantity }) => (
              <ListItem key={ref}>
                <Box>
                  <Label>{label}</Label>
                  <HelpText id="price">£{(cost / 100).toFixed(2)}</HelpText>
                </Box>
                <Input
                  aria-describedby={`${ref}_amount_help`}
                  name={ref}
                  type="number"
                  min={0}
                  max={5}
                  value={`${quantity}`}
                  onChange={(e) =>
                    updateFruitBasket(
                      ref,
                      e.target.value ? parseInt(e.target.value) : 0
                    )
                  }
                />
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
        <Separator orientation="horizontal" verticalSpacing="space30" />
        <Box className="order-total">
          <Label>🧺 Total</Label>
          <Text as="p">
            £
            {(
              fruitBasket.reduce(
                (sum, cur) => sum + cur.cost * cur.quantity,
                0
              ) / 100
            ).toFixed(2)}
          </Text>
        </Box>
        <Separator orientation="horizontal" verticalSpacing="space100" />
        <Button
          variant="primary"
          fullWidth
          onClick={moveToCheckout}
          disabled={
            fruitBasket.reduce((sum, cur) => sum + cur.quantity, 0) === 0
          }
        >
          Checkout
        </Button>
      </Card>
    </Box>
  );
};

// Component export
export default Order;
