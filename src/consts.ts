// Package imports
import { Appearance } from "@stripe/stripe-js";

// Consts
const emptyFruitBasket: FruitBasketItem[] = [
  {
    label: "🍓 Strawberries",
    ref: "strawberries",
    cost: 290,
    quantity: 0,
  },
  {
    label: "🍊 Oranges",
    ref: "oranges",
    cost: 120,
    quantity: 0,
  },
  {
    label: "🍇 Grapes",
    ref: "grapes",
    cost: 140,
    quantity: 0,
  },
  {
    label: "🍎 Apples",
    ref: "apples",
    cost: 100,
    quantity: 0,
  },
];

const paymentElementAppearence: Appearance = {
  theme: "night",
  variables: {
    colorBackground: "#0d131cff",
    colorText: "#fff",
    fontFamily: "Helvetica Neue",
    spacingUnit: "3px",
    borderRadius: "4px",
  },
  rules: {
    ".Tab": {
      marginBottom: "20px",
    },
    ".Label": {
      marginBottom: "10px",
    },
    ".Input": {
      boxShadow: "rgb(57, 71, 98) 0px 0px 0px 1px",
    },
  },
};

// Endpoint routes
const requestError: string = "Request failed";
const serverApi: string = "https://fresh-fruit-co-server.vercel.app";
// const serverApi: string = "http://localhost:8081";
const createPaymentIntentEndpoint: string = "/paymentIntent";
const getPaymentMethodCustomerEndpoint: string = "/paymentMethodCustomer";
const updatePaymentIntentCustomerEndpont: string =
  "/paymentIntentUpdateCustomer";
const updatePaymentIntentFutureUsageEndpoint: string =
  "/paymentIntentUpdateFutureUsage";
const paymentMethodDetachEndpoint: string = "/paymentMethodDetach";
const createCustomerAndAddToPaymentIntentEndpoint: string =
  "/paymentIntentAddCustomer";
const updatePaymentIntentItemsEndpoint: string = "/paymentIntentUpdateItems";

// Payment messages
const genericPaymentError: string =
  "There was an unknown problem with procesing your payment, please try again.";

// Const exports
export {
  emptyFruitBasket,
  requestError,
  serverApi,
  createPaymentIntentEndpoint,
  getPaymentMethodCustomerEndpoint,
  updatePaymentIntentCustomerEndpont,
  paymentElementAppearence,
  updatePaymentIntentFutureUsageEndpoint,
  paymentMethodDetachEndpoint,
  createCustomerAndAddToPaymentIntentEndpoint,
  genericPaymentError,
  updatePaymentIntentItemsEndpoint,
};
