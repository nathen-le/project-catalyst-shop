let cart = JSON.parse(localStorage.getItem('cart')) || [];

window.removeItem = function(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

window.checkout = async function() {
  try {
    const response = await fetch('/.netlify/functions/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cart)
    });

    if (response.ok) {
      alert("Checkout complete! Email sent.");
      localStorage.removeItem('cart');
      cart = [];
      renderCart();
    } else {
      alert("Checkout failed. Please try again.");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong.");
  }
};

function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  const cartData = JSON.parse(localStorage.getItem('cart')) || [];
  if (countEl) countEl.innerText = cartData.length;
}

function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  if (!cartItemsDiv || !cartTotalSpan) return;

  updateCartCount();

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalSpan.innerText = "0.00";
  } else {
    let total = 0;
    cartItemsDiv.innerHTML = "";
    cart.forEach((item, index) => {
      total += item.price;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.imgSrc}" alt="${item.name}" class="cart-item-img"/>
        <span>${item.name} - $${item.price.toFixed(2)}</span>
        <button onclick="removeItem(${index})">Remove</button>
      `;
      cartItemsDiv.appendChild(div);
    });
    cartTotalSpan.innerText = total.toFixed(2);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;

  document.body.appendChild(toast);

  void toast.offsetWidth; // Trigger reflow for CSS animation
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

window.addToCart = function(name, price, imgSrc) {
  cart.push({name, price, imgSrc});
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast(`${name} added to cart!`);
}


document.addEventListener('DOMContentLoaded', updateCartCount);

const searchInput = document.querySelector('.search-bar input');
const products = document.querySelectorAll('.product-card');

function filterProducts(query) {
  let anyVisible = false;
  products.forEach(product => {
    const title = product.querySelector('h3').textContent.toLowerCase();
    if (title.includes(query.toLowerCase())) {
      product.style.display = 'block';
      anyVisible = true;
    } else {
      product.style.display = 'none';
    }
  });

  let noResultsEl = document.getElementById('no-results');
  if (!noResultsEl) {
    noResultsEl = document.createElement('p');
    noResultsEl.id = 'no-results';
    noResultsEl.style.textAlign = 'center';
    noResultsEl.style.color = '#ff0';
    noResultsEl.style.marginTop = '20px';
    noResultsEl.textContent = 'No results found.';
    document.querySelector('.products-container').appendChild(noResultsEl);
  }
  noResultsEl.style.display = anyVisible ? 'none' : 'block';
}

searchInput.addEventListener('input', () => filterProducts(searchInput.value));

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');
if (searchQuery) {
  searchInput.value = searchQuery;
  filterProducts(searchQuery);
}
