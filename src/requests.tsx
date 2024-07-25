// Package imports
import axios from "axios";
import { Stripe, StripeElements } from "@stripe/stripe-js";

// Const Imports
import {
  requestError,
  serverApi,
  createPaymentIntentEndpoint,
  getPaymentMethodCustomerEndpoint,
  updatePaymentIntentCustomerEndpont,
  updatePaymentIntentFutureUsageEndpoint,
  paymentMethodDetachEndpoint,
  createCustomerAndAddToPaymentIntentEndpoint,
} from "./consts";

// Requests
const createPaymentIntentRequest = async (fruitBasket: FruitBasketItem[]) => {
  try {
    const data = { fruitBasket };
    const res = await axios.post(
      `${serverApi}${createPaymentIntentEndpoint}`,
      data
    );
    return res.data;
  } catch {
    return { error: requestError };
  }
};

const confirmPaymentIntentRequest = async (
  stripe: Stripe,
  elements: StripeElements
) => {
  try {
    const res = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com",
      },
    });
    return res;
  } catch {
    return { error: requestError };
  }
};

const confirmPaymentIntentWithExistingMethodRequest = async (
  stripe: Stripe,
  paymentMethodId: string,
  clientSecret: string
) => {
  try {
    const res = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: "https://example.com",
        payment_method: paymentMethodId,
      },
    });
    return res;
  } catch {
    return { error: requestError };
  }
};

const getPaymentMethodCustomerRequest = async (email: string) => {
  try {
    const data = { email };
    const res = await axios.post(
      `${serverApi}${getPaymentMethodCustomerEndpoint}`,
      data
    );
    return res.data;
  } catch {
    return { error: requestError };
  }
};

const updatePaymentIntentCustomerRequest = async (
  paymentIntentId: string,
  customerId: string
) => {
  try {
    const data = { paymentIntentId, customerId };
    const res = await axios.post(
      `${serverApi}${updatePaymentIntentCustomerEndpont}`,
      data
    );
    return res.data;
  } catch {
    return { error: requestError };
  }
};

const updatePaymentIntentFutureUsageRequest = async (
  paymentIntentId: string
) => {
  try {
    const data = { paymentIntentId };
    const res = await axios.post(
      `${serverApi}${updatePaymentIntentFutureUsageEndpoint}`,
      data
    );
    return res.data;
  } catch {
    return { error: requestError };
  }
};

const detachPaymentMethodRequest = async (paymentMethodId: string) => {
  try {
    const data = { paymentMethodId };
    const res = await axios.post(
      `${serverApi}${paymentMethodDetachEndpoint}`,
      data
    );
    return res.data;
  } catch {
    return { error: requestError };
  }
};

const createCustomerAndAddToPaymentIntent = async (
  email: string,
  paymentIntentId: string
) => {
  try {
    const data = { email, paymentIntentId };
    const res = await axios.post(
      `${serverApi}${createCustomerAndAddToPaymentIntentEndpoint}`,
      data
    );
    return res.data;
  } catch {
    return { error: requestError };
  }
};

// Request exports
export {
  createPaymentIntentRequest,
  confirmPaymentIntentRequest,
  getPaymentMethodCustomerRequest,
  confirmPaymentIntentWithExistingMethodRequest,
  updatePaymentIntentCustomerRequest,
  updatePaymentIntentFutureUsageRequest,
  detachPaymentMethodRequest,
  createCustomerAndAddToPaymentIntent,
};
