// Package imports
import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { PaymentMethod } from "@stripe/stripe-js";

// Style imports
import {
  Button,
  Separator,
  Box,
  UnorderedList,
  ListItem,
  Text,
  Heading,
  Checkbox,
  Alert,
} from "@twilio-paste/core";
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";

// Types
interface CheckoutStripeProps {
  confirmPaymentIntent: Function;
  confirmPaymentIntentWithExistingMethod: Function;
  setPage: Function;
  paymentMethods: PaymentMethod[] | undefined;
  fruitBasket: FruitBasketItem[];
  customerType: CustomerType;
  savePaymentMethod: boolean;
  setSavePaymentMethod: Function;
  detachPaymentMethod: Function;
  customerEmail: string;
  stripeError: string;
  stripeShouldRetry: boolean;
}

// Components
const CheckoutStripe = ({
  confirmPaymentIntent,
  confirmPaymentIntentWithExistingMethod,
  setPage,
  paymentMethods,
  fruitBasket,
  customerType,
  savePaymentMethod,
  setSavePaymentMethod,
  detachPaymentMethod,
  customerEmail,
  stripeError,
  stripeShouldRetry,
}: CheckoutStripeProps) => {
  // Consts
  const elements = useElements();
  const stripe = useStripe();

  // State
  const [paymentInputsComplete, setPaymentInputsComplete] =
    useState<boolean>(false);

  // Effects
  useEffect(() => {
    if (elements && stripeError && !stripeShouldRetry) {
      const paymentElement = elements?.getElement("payment");
      if (paymentElement) {
        paymentElement.clear();
      }
    }
  }, [elements, stripeError, stripeShouldRetry]);

  return (
    <Box>
      {paymentMethods ? (
        <Box className="payment-method-list">
          <Heading as="h2" variant="heading40">
            Payment options
          </Heading>
          <UnorderedList>
            {paymentMethods
              .filter((paymentMethod) => paymentMethod.type === "card")
              .map(({ id, card }) => (
                <ListItem key={id}>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() =>
                      confirmPaymentIntentWithExistingMethod(stripe, id)
                    }
                  >
                    <Box className="payment-method">
                      <Text as="p">{card?.brand.toUpperCase()}</Text>
                      <Text as="p">••••{card?.last4}</Text>
                    </Box>
                  </Button>
                  <Button
                    variant="destructive_icon"
                    onClick={() => detachPaymentMethod(id)}
                  >
                    <DeleteIcon decorative={false} title="delete" />
                  </Button>
                </ListItem>
              ))}
            {/* Type on PM missing bacs_debit? */}
            {(paymentMethods as any)
              .filter(
                (paymentMethod: any) => paymentMethod.type === "bacs_debit"
              )
              .map((bacsPaymentMethod: any) => (
                <ListItem>
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() =>
                      confirmPaymentIntentWithExistingMethod(
                        stripe,
                        bacsPaymentMethod.id
                      )
                    }
                  >
                    <Box className="payment-method">
                      <Text as="p">Bacs Direct Debit</Text>
                      <Text as="p">
                        ••••{bacsPaymentMethod.bacs_debit.last4}
                      </Text>
                    </Box>
                  </Button>
                  <Button
                    variant="destructive_icon"
                    onClick={() => detachPaymentMethod(bacsPaymentMethod.id)}
                  >
                    <DeleteIcon decorative={false} title="delete" />
                  </Button>
                </ListItem>
              ))}
          </UnorderedList>
        </Box>
      ) : (
        <></>
      )}
      {stripeError ? <Alert variant="warning">{stripeError}</Alert> : <></>}
      <PaymentElement
        onChange={(event) => {
          if (event.complete) {
            setPaymentInputsComplete(true);
          } else if (paymentInputsComplete) {
            setPaymentInputsComplete(false);
          }
        }}
        options={{
          layout: {
            type: "accordion",
            defaultCollapsed: false,
          },
        }}
      />
      {customerEmail ? (
        <Box marginTop={"space100"}>
          <Checkbox
            checked={savePaymentMethod}
            name="save-method"
            onChange={(event) => {
              setSavePaymentMethod(event.target.checked);
            }}
            disabled={!paymentInputsComplete}
          >
            Save payment method for next time
          </Checkbox>
        </Box>
      ) : (
        <></>
      )}
      <Separator orientation="horizontal" verticalSpacing="space100" />
      <Button
        variant="primary"
        onClick={() => confirmPaymentIntent(stripe, elements)}
        fullWidth
        disabled={!paymentInputsComplete}
      >
        Pay £
        {(
          fruitBasket.reduce((sum, cur) => sum + cur.cost * cur.quantity, 0) /
          100
        ).toFixed(2)}
      </Button>
    </Box>
  );
};

// Component export
export default CheckoutStripe;
