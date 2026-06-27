import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { Product } from "./Product";

vi.mock("axios");

let product;
let loadCart;

beforeEach(() => {
  vi.clearAllMocks();

  axios.post.mockResolvedValue({
    data: {},
  });

  product = {
    id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    image: "images/products/athletic-cotton-socks-6-pairs.jpg",
    name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
    rating: {
      stars: 4.5,
      count: 87,
    },
    priceCents: 1090,
    keywords: ["socks", "sports", "apparel"],
  };

  loadCart = vi.fn();
});

describe("Product Component", () => {
  it("Displays Product Details Correctly", async () => {
    const user = userEvent.setup();

    render(<Product product={product} loadCart={loadCart} />);

    const addToCartButton = screen.getByTestId("add-to-cart-button");

    await user.click(addToCartButton);

    expect(axios.post).toHaveBeenCalledWith("api/cart-items", {
      productId: product.id,
      quantity: 1,
    });

    expect(loadCart).toHaveBeenCalled();
  });
});