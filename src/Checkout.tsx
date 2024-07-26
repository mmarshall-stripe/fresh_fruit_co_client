// Package imports
import React, { useState, useEffect } from "react";
import { Elements, AddressElement } from "@stripe/react-stripe-js";
import {
  Stripe,
  StripeElements,
  loadStripe,
  PaymentMethod,
  StripeAddressElementChangeEvent,
} from "@stripe/stripe-js";

// Style imports
import {
  Card,
  Box,
  Heading,
  Label,
  HelpText,
  Text,
  ListItem,
  Separator,
  Button,
  Input,
  SkeletonLoader,
  RadioButton,
  RadioButtonGroup,
  Alert,
} from "@twilio-paste/core";
import { SkipBackIcon } from "@twilio-paste/icons/esm/SkipBackIcon";

// Component Imports
import CheckoutStripe from "./CheckoutStripe";

// Function Imports
import {
  createPaymentIntentRequest,
  confirmPaymentIntentRequest,
  getPaymentMethodCustomerRequest,
  confirmPaymentIntentWithExistingMethodRequest,
  updatePaymentIntentCustomerRequest,
  updatePaymentIntentFutureUsageRequest,
  detachPaymentMethodRequest,
  createCustomerAndAddToPaymentIntent,
} from "./requests";

// Const Imports
import { paymentElementAppearence, genericPaymentError } from "./consts";

// Types
interface CheckoutProps {
  setPage: Function;
  fruitBasket: FruitBasketItem[];
  clientSecret: string | undefined;
  setClientSecret: Function;
  paymentIntentId: string | undefined;
  setPaymentIntentId: Function;
}

const Checkout = ({
  setPage,
  fruitBasket,
  clientSecret,
  setClientSecret,
  paymentIntentId,
  setPaymentIntentId,
}: CheckoutProps) => {
  // Consts
  const stripePromise = loadStripe(
    "pk_test_51PbM05EcWtsOmG7W3xBJtx8L3h4hnmdeB91LISGSB6zaNMbAqfDPFgBBlmnDapRExRRE30lY4Wep9gLlobBhLv4d00GrOpcUN3"
  );

  // State
  const [checkoutPage, setCheckoutPage] = useState<CheckoutPage>("user");
  const [customerType, setCustomerType] = useState<CustomerType>("registered");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [existingCustomerFoundError, setExistingCustomerFoundError] =
    useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<
    PaymentMethod[] | undefined
  >();
  const [savePaymentMethod, setSavePaymentMethod] = useState<boolean>(false);
  const [stripeError, setStripeError] = useState<string>("");
  const [stripeShouldRetry, setStripeShouldRetry] = useState<boolean>(false);
  const [addressInputsComplete, setAddressInputsComplete] =
    useState<boolean>(false);
  const [customerAddress, setCustomerAddress] = useState<
    StripeAddressElementChangeEvent["value"] | undefined
  >();

  // Effects
  useEffect(() => {
    // Want to maintain the same PI for the checkout session, only create PI if one doesn't exist for this session already
    if (!paymentIntentId) {
      createPaymentIntentGuest();
    }
  }, []);

  // Functions
  const createPaymentIntentGuest = async () => {
    // User is always unknown at the point we create payment intent in this flow
    const paymentIntentGuest = await createPaymentIntentRequest(fruitBasket);
    if (paymentIntentGuest.error) {
    } else {
      const { clientSecret, paymentIntentId } = paymentIntentGuest;
      setClientSecret(clientSecret);
      setPaymentIntentId(paymentIntentId);
    }
  };

  const confirmPaymentIntent = async (
    stripe: Stripe,
    elements: StripeElements
  ) => {
    if (stripeError) {
      setStripeError("");
    }
    if (stripeShouldRetry) {
      setStripeShouldRetry(false);
    }
    if (
      customerType === "guest" &&
      customerEmail &&
      customerAddress &&
      paymentIntentId
    ) {
      await createCustomerAndAddToPaymentIntent(
        customerEmail,
        customerAddress,
        paymentIntentId
      );
      if (savePaymentMethod) {
        await updatePaymentIntentFutureUsageRequest(paymentIntentId);
      }
    }
    if (customerType === "registered" && savePaymentMethod && paymentIntentId) {
      await updatePaymentIntentFutureUsageRequest(paymentIntentId);
    }
    const confirmPaymentIntentResponse = await confirmPaymentIntentRequest(
      stripe,
      elements
    );
    const { error } = confirmPaymentIntentResponse;
    if (error) {
      if (typeof error === "string") {
        setStripeError(genericPaymentError);
      } else {
        // Have to set this as any because there is a missing shouldRetry prop on the StripeError Type
        const { message, shouldRetry } = error as any;
        setStripeShouldRetry(shouldRetry);
        setStripeError(message);
      }
    }
  };

  const confirmPaymentIntentWithExistingMethod = (
    stripe: Stripe,
    paymentMethodId: string
  ) => {
    if (clientSecret) {
      confirmPaymentIntentWithExistingMethodRequest(
        stripe,
        paymentMethodId,
        clientSecret
      );
    }
  };

  const moveToPayment = async () => {
    if (customerType === "registered") {
      // Validate customer exists and retrieve any stored payment methods
      const email = customerEmail;
      const paymentMethodCustomerResponse =
        await getPaymentMethodCustomerRequest(email);
      const { customerId, paymentMethods, message } =
        paymentMethodCustomerResponse;
      if (customerId && paymentMethods && paymentIntentId) {
        // Attach the existing customer to the paymentId
        await updatePaymentIntentCustomerRequest(paymentIntentId, customerId);
        setPaymentMethods(paymentMethods);
        setCheckoutPage("payment");
      } else if (message === "No customers found") {
        setExistingCustomerFoundError(true);
      }
    } else {
      setCheckoutPage("payment");
    }
  };

  const detachPaymentMethod = async (paymentMethodId: string) => {
    const detachPaymentMethodResponse = await detachPaymentMethodRequest(
      paymentMethodId
    );
    if (detachPaymentMethodResponse.paymentMethodId) {
      const updatedPaymentMethods = paymentMethods?.filter(
        (paymentMethod) => paymentMethod.id !== paymentMethodId
      );
      setPaymentMethods(updatedPaymentMethods);
    }
  };

  return (
    <>
      {clientSecret ? (
        <Card padding={"space100"}>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: paymentElementAppearence,
            }}
          >
            <Box className="checkout-wrapper">
              <Box className="checkout-details-wrapper">
                <Heading as="h1" variant="heading10">
                  Fresh Fruit Co.
                </Heading>
                <Box className="checkout-items">
                  {fruitBasket
                    .filter((fruitBasketItem) => fruitBasketItem.quantity)
                    .map(({ label, ref, cost, quantity }) => (
                      <ListItem key={ref}>
                        <Box className="checkout-item">
                          <Label>{`${quantity} * ${label}`}</Label>
                          <Text as="p">
                            £{((cost * quantity) / 100).toFixed(2)}
                          </Text>
                        </Box>
                      </ListItem>
                    ))}
                  <Separator
                    orientation="horizontal"
                    verticalSpacing="space100"
                  />
                  <Box className="checkout-item">
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
                </Box>
                <Separator
                  orientation="horizontal"
                  verticalSpacing="space100"
                />
                <Button variant="primary_icon" onClick={() => setPage("order")}>
                  Continue shopping
                  <SkipBackIcon
                    decorative={false}
                    title="Description of icon"
                  />
                </Button>
              </Box>
              <Box className="checkout-inputs-wrapper">
                {checkoutPage === "user" ? (
                  <Box className="checkout-inputs-user-wrapper">
                    <RadioButtonGroup
                      attached
                      name="foo"
                      legend=""
                      onChange={(e) => {
                        setCustomerEmail("");
                        setCustomerType(e as CustomerType);
                      }}
                    >
                      <RadioButton value="registered" defaultChecked>
                        🍍 Member
                      </RadioButton>
                      <RadioButton value="guest">✨ Guest</RadioButton>
                    </RadioButtonGroup>

                    {customerType === "registered" ? (
                      <>
                        <Heading as="h2" variant="heading40">
                          Welcome back!
                        </Heading>
                        <Alert variant="neutral">
                          Collect loyalty points with every purchase as a Fresh
                          Fruit member
                        </Alert>
                        <Input
                          aria-describedby="email_help_text"
                          name="email"
                          type="email"
                          placeholder="fresh@fruit.com"
                          onChange={(e) => {
                            setCustomerEmail(e.target.value);
                          }}
                          value={customerEmail}
                          hasError={existingCustomerFoundError}
                        />
                        {existingCustomerFoundError ? (
                          <HelpText id="email_error_help_text" variant="error">
                            Email not found - please try again.
                          </HelpText>
                        ) : (
                          <HelpText id="email">
                            Enter your registered email address.
                          </HelpText>
                        )}
                      </>
                    ) : (
                      <Box className="checkout-inputs-address-wrapper">
                        <Heading as="h2" variant="heading40">
                          Register below or continue as guest
                        </Heading>
                        <Label id="email">Enter your email address.</Label>
                        <Input
                          aria-describedby="email_help_text"
                          name="email"
                          type="email"
                          placeholder="fresh@fruit.com"
                          onChange={(e) => {
                            setCustomerEmail(e.target.value);
                          }}
                          value={customerEmail}
                          hasError={existingCustomerFoundError}
                        />
                        <AddressElement
                          options={{ mode: "billing" }}
                          onChange={(event) => {
                            if (event.complete) {
                              setAddressInputsComplete(true);
                              setCustomerAddress(event.value);
                            } else if (addressInputsComplete) {
                              setAddressInputsComplete(false);
                              setCustomerAddress(undefined);
                            }
                          }}
                        />
                      </Box>
                    )}

                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={moveToPayment}
                      disabled={
                        customerType === "registered" &&
                        customerEmail.length === 0
                      }
                    >
                      {customerType === "registered"
                        ? "Continue"
                        : customerType === "guest" &&
                          customerEmail &&
                          addressInputsComplete
                        ? "Register & Continue"
                        : "Continue as Guest"}
                    </Button>
                  </Box>
                ) : (
                  <CheckoutStripe
                    confirmPaymentIntent={confirmPaymentIntent}
                    confirmPaymentIntentWithExistingMethod={
                      confirmPaymentIntentWithExistingMethod
                    }
                    setPage={setPage}
                    paymentMethods={paymentMethods}
                    fruitBasket={fruitBasket}
                    customerType={customerType}
                    savePaymentMethod={savePaymentMethod}
                    setSavePaymentMethod={setSavePaymentMethod}
                    detachPaymentMethod={detachPaymentMethod}
                    customerEmail={customerEmail}
                    stripeError={stripeError}
                    stripeShouldRetry={stripeShouldRetry}
                  />
                )}
              </Box>
            </Box>
          </Elements>
        </Card>
      ) : (
        <SkeletonLoader height="722px" width={"374px"} />
      )}
    </>
  );
};

// Component export
export default Checkout;
