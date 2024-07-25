interface CartItem {
  cost: number;
  quantity: number;
  ref: FruitRef;
}

interface FruitItem {
  label: FruitLabel;
  ref: FruitRef;
  cost: number;
}

interface FruitBasketItem extends FruitItem {
  quantity: number;
}

type FruitRef = "strawberries" | "oranges" | "grapes" | "apples";

type FruitLabel = "🍓 Strawberries" | "🍊 Oranges" | "🍇 Grapes" | "🍎 Apples";

type Page = "order" | "checkout";

type CheckoutPage = "user" | "payment";

type CustomerType = "guest" | "registered";
