// =====cart page=====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price, image) {
    // Check item already  in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showAddedToCartMessage(name);
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function showAddedToCartMessage(productName) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <span>${productName} added to cart!</span>
        <a href="cart.html">View Cart</a>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize cart count when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Make product images clickable for view details
    document.querySelectorAll('.product-card img').forEach(img => {
        img.style.cursor = 'pointer';
    });
});

function viewProductDetail(name, price, image, description) {
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('price', price);
    params.append('image', image);
    params.append('description', description);
    
    // Redirect to product page with parameters
    window.location.href = `product.html?${params.toString()}`;
}

function toggleMenu() {
    const nav = document.getElementById('navbar').querySelector('ul');
    nav.classList.toggle('show');
}



// ===products====

document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  const price = urlParams.get('price');
  const image = urlParams.get('image');
  const description = urlParams.get('description');
  
  // Set product details
  document.getElementById('product-title').textContent = name;
  document.getElementById('product-price').textContent = `₹${price}`;
  document.getElementById('main-product-image').src = image;
  document.querySelectorAll('.thumbnail-images img').forEach(img => {
    img.src = image; 
  });
  document.getElementById('product-description').textContent = description;
  document.getElementById('product-sku').textContent = name.replace(/\s+/g, '-').toUpperCase();
  
  // Set category based on product name
  const category = name.includes('Bed') ? 'Beds' : 
                  name.includes('Sofa') ? 'Sofas' : 
                  name.includes('Chair') ? 'Chairs' : 
                  name.includes('Swing') ? 'Outdoor' : 
                  name.includes('Set') ? 'Bedroom Sets' : 'Furniture';
  document.getElementById('product-category').textContent = category;
  
  // Load related products (excluding current product)
  loadRelatedProducts(name);
  
  // Update cart count
  updateCartCount();
});

function loadRelatedProducts(currentProductName) {
  const relatedProducts = [
    { name: 'Luxury Sofa', price: 15000, image: 'img/sofa.jpg' },
    { name: 'Queen Bed', price: 20000, image: 'img/queen bed.jpg' },
    { name: 'King Bed', price: 25000, image: 'img/kingbed.jpg' },
    { name: 'Single Bed', price: 15000, image: 'img/singlebed.jpg' },
    { name: 'Full Bedroom Set', price: 60000, image: 'img/fullset.jpg' },
    { name: 'Premium Chair', price: 20000, image: 'img/kingchair.jpg' },
    { name: 'Premium Sofa', price: 70000, image: 'img/premimsofa.jpg' },
    { name: 'Garden Swing Seat', price: 30000, image: 'img/garden.jpg' }
  ].filter(product => product.name !== currentProductName)
   .slice(0, 4); // Show 4 related products

  const relatedContainer = document.querySelector('.related-products .product-list');
  relatedContainer.innerHTML = '';

  relatedProducts.forEach(product => {
    relatedContainer.innerHTML += `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" 
             onclick="window.location.href='product.html?name=${encodeURIComponent(product.name)}&price=${product.price}&image=${encodeURIComponent(product.image)}&description=${encodeURIComponent('Detailed description here')}'">
        <h3>${product.name}</h3>
        <p>₹${product.price.toLocaleString()}</p>
        <button onclick="addToCart('${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.image.replace(/'/g, "\\'")}')">Add to Cart</button>
      </div>
    `;
  });
}
  // Quantity adjustment function
  function adjustQuantity(change) {
    const quantityElement = document.getElementById('quantity');
    let quantity = parseInt(quantityElement.textContent);
    quantity += change;
    
    // quantity does not go below 1
    if (quantity < 1) quantity = 1;
    
    quantityElement.textContent = quantity;
  }

  function addToCartFromDetail() {
  const productTitle = document.getElementById('product-title').textContent;
  const productPriceText = document.getElementById('product-price').textContent;
  const productPrice = parseFloat(productPriceText.replace(/[^0-9.]/g, ''));
  const quantity = parseInt(document.getElementById('quantity').textContent);
  const productImage = document.getElementById('main-product-image').src;
  
  // Get existing cart or create new one
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if product already in cart
  const existingItemIndex = cart.findIndex(item => item.name === productTitle);
  
  if (existingItemIndex >= 0) {
    // Update quantity if product exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.push({
      name: productTitle,
      price: productPrice,
      quantity: quantity,
      image: productImage
    });
  }
  
  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count
  updateCartCount();
  
  // Show custom notification
  showNotification(`${quantity} ${productTitle}(s) added to cart!`);
}

// New function to show notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.display = 'block';
  
  // Reset animation by removing and re-adding the class
  notification.style.animation = 'none';
  void notification.offsetWidth; // Trigger reflow
  notification.style.animation = 'slideIn 0.5s forwards, fadeOut 0.5s forwards 2.5s';
  
  // Hide after animation completes
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

  // Function to update cart count in header
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = 0;
    
    cart.forEach(item => {
      totalItems += item.quantity;
    });
    
    document.getElementById('cart-count').textContent = totalItems;
  }

  // Function to change main product image when thumbnail is clicked
  function changeMainImage(src) {
    document.getElementById('main-product-image').src = src;
  }

  // When page loads, set the product details
  document.addEventListener('DOMContentLoaded', function() {
    // Get product details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('name');
    const productPrice = urlParams.get('price');
    const productImage = urlParams.get('image');
    
    // Set the product details on the page
    if (productName && productPrice && productImage) {
      document.getElementById('product-title').textContent = productName;
      document.getElementById('product-price').textContent = `₹${parseFloat(productPrice).toLocaleString()}`;
      document.getElementById('main-product-image').src = productImage;
      
      // Set all thumbnails to the same image (in a real app these would be different angles)
      const thumbnails = document.querySelectorAll('.thumbnail-images img');
      thumbnails.forEach(thumb => {
        thumb.src = productImage;
      });
      
      // Generate a random SKU
      document.getElementById('product-sku').textContent = Math.floor(1000 + Math.random() * 9000);
      
      // Set category based on product name (simplified)
      const category = productName.toLowerCase().includes('sofa') ? 'Sofas' : 
                      productName.toLowerCase().includes('table') ? 'Tables' : 'Furniture';
      document.getElementById('product-category').textContent = category;
      
      // Set description from database or generate one
      const productDB = {
        'Luxury Sofa': 'Premium quality sofa with high-density foam and genuine leather upholstery. Perfect for your living room.',
        'Modern Chair': 'Ergonomic design with breathable mesh backrest. Ideal for home or office use.',
        'Dining Table': 'Solid wood construction with expandable leaf. Seats 6-8 people comfortably.'
      };
      
      document.getElementById('product-description').textContent = 
        productDB[productName] || 'High-quality furniture piece designed for comfort and durability.';
    }
    
    updateCartCount();
  });

  // ===cart page====
    
    document.addEventListener('DOMContentLoaded', function() {
      displayCartItems();
      updateCartCount();
    });

    function displayCartItems() {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      const cartItemsContainer = document.getElementById('cart-items');
      
      if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="empty-cart">
            <p>Your cart is empty</p>
            <a href="index.html#products" class="cta-button">Continue Shopping</a>
          </div>
        `;
        return;
      }

      let html = '';
      let subtotal = 0;
      
      cartItems.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        
        html += `
          <div class="cart-item">
            <div class="item-image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
              <h3>${item.name}</h3>
              <p>₹${item.price.toLocaleString()}</p>
              <div class="quantity-controls">
                <button onclick="updateQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${index}, 1)">+</button>
              </div>
            </div>
            <div class="item-total">
              <p>₹${(item.price * item.quantity).toLocaleString()}</p>
              <button class="remove-item" onclick="removeFromCart(${index})"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        `;
      });

      const shipping = subtotal > 50000 ? 0 : 500;
      const tax = subtotal * 0.18; // 18% tax
      const total = subtotal + shipping + tax;
      
      document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
      document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString()}`;
      document.getElementById('tax').textContent = `₹${tax.toLocaleString()}`;
      document.getElementById('total').textContent = `₹${total.toLocaleString()}`;
      
      cartItemsContainer.innerHTML = html;
    }

    function updateQuantity(index, change) {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      cartItems[index].quantity += change;
      
      if (cartItems[index].quantity < 1) {
        cartItems.splice(index, 1);
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      displayCartItems();
      updateCartCount();
    }

    function removeFromCart(index) {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      cartItems.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      displayCartItems();
      updateCartCount();
    }

    function checkout() {
      const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
      if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      alert('Proceeding to checkout! In a real application, this would redirect to a payment gateway.');
    }
  