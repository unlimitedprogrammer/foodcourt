"use strict";

const addToCart = document.querySelectorAll("#addToCart");
const msg_default = document.querySelector(".msg-default");
const cartDetails_wrap = document.querySelector(".cartDetails-wrap");
const cartDetails_div = document.querySelector(".cartDetails-div");
const yourCartHTML = document.querySelector(".totalProductUnit");
const yourTotalHTML = document.querySelector(".totalOrder");

let totalUnits = 0;
let totalSum = 0;

// Object to track all products in the cart
const cartItems = {};

// Function to log the current state of the cart
const logCartState = () => {
  // console.clear();
  // console.log("Current Cart State:");
  Object.entries(cartItems).forEach(([productName, details]) => {
    console.log(
      `${productName}: Units - ${
        details.units
      }x, Total Price - $${details.totalPrice.toFixed(2)}`
    );
  });
};

// Function to update the row in the cart HTML
const updateCartRow = (productName, productDetails) => {
  const { price, units, totalPrice } = productDetails;
  const row = cartDetails_div.querySelector(
    `[data-product-name="${productName}"]`
  );
  row.querySelector(".product-unit").textContent = `${units}x`;
  row.querySelector(".product-pricexunits").textContent = totalPrice.toFixed(2);
};

// Add to cart logic
addToCart.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    // Hide "Add to Cart" button and show counter
    btn.classList.add("hidden");
    btn.nextElementSibling.style.display = "flex";

    // Identify the selected product
    const productContainer = e.target.closest(".product-container");
    const selectedProduct = productContainer.querySelector("img");

    const productName =
      productContainer.querySelector(".product-name").innerHTML;
    const productPrice = parseFloat(
      productContainer.querySelector(".product-price").innerHTML.slice(1)
    );
    selectedProduct.classList.add("border-2", "border-[#c73a0f]");

    // Check if the product is already in the cart
    if (!cartItems[productName]) {
      cartItems[productName] = {
        price: productPrice,
        units: 1,
        totalPrice: productPrice,
      };

      totalUnits = totalUnits + 1;
      yourCartHTML.textContent = `(${totalUnits})`;

      totalSum = totalSum + productPrice;
      yourTotalHTML.textContent = `($${totalSum.toFixed(2)})`;
      // Add a new row for the product
      cartDetails_div.insertAdjacentHTML(
        "beforeend",
        `<div
        class="cartDetails flex justify-between items-start border-b py-5 product-row"
        data-product-name="${productName}"
       >
        <div class="flex flex-col gap-1">
         <p class="cart-item-name font-bold text-xl text-[#260f08]">${productName}</p>
         <div class="flex items-center gap-5">
          <div>
           <span class="cart-item-unit text-[#c73a0f] font-semibold text-lg product-unit"
            >1x</span
           >
          </div>
          <div>
           <span class="cart-item-price text-[#c5c4c3] mr-2"
            >@$${productPrice.toFixed(2)}</span
           >
           <span class="cart-item-priceXunits text-[#8b8a8a] font-semibold product-pricexunits"
            >$${productPrice.toFixed(2)}</span
           >
          </div>
         </div>
        </div>
        <a
         href="#"
         class="removeItem border border-[#c73a0f] p-1 rounded-full hover:border-[#000] group hover:text-[#000]"
        >
         <img
          src="./assets/images/icon-remove-item.svg"
          class="removeItemImg w-[15px]"
          alt=""
         />
        </a>
       </div>`
      );
    }

    // Add event listeners for increment and decrement buttons
    const increment = productContainer.querySelector(".increment");
    const decrement = productContainer.querySelector(".decrement");
    const counterText = productContainer.querySelector(".counter");

    increment.addEventListener("click", function () {
      cartItems[productName].units++;
      counterText.textContent = cartItems[productName].units;
      cartItems[productName].totalPrice =
        cartItems[productName].units * cartItems[productName].price;

      totalUnits++;
      totalSum += cartItems[productName].price;
      updateCartRow(productName, cartItems[productName]);
      logCartState(); // Log changes
      yourCartHTML.textContent = `(${totalUnits})`;
      yourTotalHTML.textContent = `($${totalSum.toFixed(2)})`;
    });

    decrement.addEventListener("click", function () {
      if (cartItems[productName].units > 0) {
        cartItems[productName].units--;
        counterText.textContent = cartItems[productName].units;
        cartItems[productName].totalPrice =
          cartItems[productName].units * cartItems[productName].price;

        totalUnits--; // Subtract 1 from the total units
        totalSum -= cartItems[productName].price;
        updateCartRow(productName, cartItems[productName]);
        logCartState(); // Log changes
        yourCartHTML.textContent = `(${totalUnits})`;
        yourTotalHTML.textContent = `($${totalSum.toFixed(2)})`;
      }
    });

    // Initial log when product is added
    logCartState();
    // Hide the default message and show the cart
    msg_default.classList.add("hidden");
    cartDetails_wrap.classList.remove("hidden");
  })
);

cartDetails_div.addEventListener("click", function (e) {
  const link = e.target.closest(".removeItem");
  if (!link) return; // Exit if the click is not on a removeItem button

  e.preventDefault();
  console.log(link);

  const row = link.closest(".cartDetails");
  if (row) {
    const productName = row.dataset.productName;

    totalUnits -= cartItems[productName].units;
    totalSum -= cartItems[productName].totalPrice;

    delete cartItems[productName];
    row.remove();

    document.querySelector(".counter").textContent = 0;
    yourCartHTML.textContent = `(${totalUnits})`;
    yourTotalHTML.textContent = `($${totalSum.toFixed(2)})`;

    logCartState(); // Log changes
  }

  console.log(cartDetails_div);
  if (!cartDetails_div.contains(document.querySelector(".cartDetails"))) {
    msg_default.classList.remove("hidden");
    cartDetails_wrap.classList.add("hidden");
    console.log("no cartDetails");
  }
});

document
  .querySelector(".startNewOrder")
  .addEventListener("click", function (e) {
    window.location.reload();
  });

// MODAL MODAL MODAL
const openModal = function () {
  document.querySelector(".modal").classList.remove("hidden");
  document.querySelector(".overlay").classList.remove("hidden");
};

const closeModal = function () {
  document.querySelector(".modal").classList.add("hidden");
  document.querySelector(".overlay").classList.add("hidden");
};

document.querySelector(".confirmOrder").addEventListener("click", openModal);
document.querySelector(".close-modal").addEventListener("click", closeModal);
document.querySelector(".overlay").addEventListener("click", closeModal);
document.addEventListener("keyup", function (e) {
  if (
    e.key === "Escape" &&
    !document.querySelector(".modal").classList.contains("hidden")
  ) {
    closeModal();
  }
});
