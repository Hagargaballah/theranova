
document.addEventListener('DOMContentLoaded', async function () {
     const products = []
    console.log("Medicines fetched: ", products);

    let cart = [];
    function submitVisaPayment() {
          const cardName = document.getElementById('cardName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            alert("يرجى ملء جميع بيانات البطاقة.");
            return;
        }
        const modal = document.getElementById('paymentModal');
        modal.style.display = 'none';
        alert("تم تأكيد الدفع بنجاح. شكراً لتعاملك معنا!");
    }

    function submitWalletPayment() {
            const walletPhoneNumber = document.getElementById('walletPhoneNumber').value;

            if (!walletPhoneNumber) {
                alert("يرجى ملء رقم الموبايل الخاص بالمحفظة .");
                return;
            }
            const modal = document.getElementById('paymentModal');
            modal.style.display = 'none';
            alert("تم تأكيد الدفع بنجاح. شكراً لتعاملك معنا!");
        }

        // Function to parse CSV into an array of objects
function parseCSV(csvText) {
  const rows = csvText.trim().split("\n");
  const headers = rows[0].split(",");

  return rows.slice(1).map(row => {
    const values = row.split(",");
    const regex = /"([^"]+)"/;
    const match = row.match(regex);  // Match the first occurrence of content inside double quotes
  // If a match is found, return the captured group (the URL)
    const imageValue = match ? match[1] : null;
    return headers.reduce((obj, header, index) => {
       if ( header.trim() == "image") {
            obj[header.trim()] = imageValue;
       }
       else {
      obj[header.trim()] = values[index].trim();
       }
      return obj;
    }, {});
  });
}
    function displayProducts(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = '';
  
  products.forEach(product => {
    const productItem = document.createElement("div");
    productItem.className = "product-item";
    productItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <h4> Price: ${product.price} EGP</h4>
      <p> <strong>Uses:</strong> ${product.uses}</p>
      <p> Composition: ${product.composition}</p>
      <p> Manufacturer: ${product.manufacturer}</p>
      <button class="add-to-cart">أضف إلى السلة</button>
    `;
        // // Attach an event listener to the button
    const button = productItem.querySelector(".add-to-cart");
    button.addEventListener("click", () => addToCart(product.name, product.price));
    productList.appendChild(productItem);
  });

   const inputSearch = document.getElementById('productSearch');
    inputSearch.oninput = () => { filterProducts(); };
    function filterProducts() {
        const searchValue = document.getElementById("productSearch").value.toLowerCase();
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchValue)); // Filter products
              displayProducts(filteredProducts);
          }
}

    // Fetch and load the CSV file
fetch('/data/medicines.csv')
  .then(response => response.text())
  .then(csvText => {
    const products = parseCSV(csvText);
    displayProducts(products);
  })
  .catch(error => console.error("Error loading the CSV file:", error));

    function addToCart(name, price) {
        cart.push({ name, price });
        updateCart();
    }

    function updateCart() {
        const cartItems = document.getElementById("cartItems");
        const totalPrice = document.getElementById("totalPrice");
        cartItems.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.name} - ${item.price} جنيه`;
            cartItems.appendChild(listItem);
            total += item.price;
        });
        totalPrice.textContent = total;
    }

    // Handle payment modal actions
    const modal = document.getElementById('paymentModal');
    const closeModal = document.querySelector('.close');
    const submitPayment = document.getElementsByClassName('submitPayment');
    const visaForm = document.getElementById('visaPaymentForm');
    const walletForm = document.getElementById('walletPaymentForm');

    function confirmOrder() {
        const paymentMethod = document.querySelector('input[name="payment"]:checked');
        const totalPrice = document.getElementById("totalPrice");

        if (totalPrice.textContent === "0") {
            alert("يرجى اختيار المنتجات أولا");
            return;
        }

        if (!paymentMethod) {
            alert("يرجى اختيار طريقة الدفع");
            return;
        }

        const method = paymentMethod.value;

        let visaPaymentButton = document.getElementById("submit-visa-payment");
        visaPaymentButton.addEventListener("click", () => submitVisaPayment());

        let walletPaymentButton = document.getElementById("submit-wallet-payment");
        walletPaymentButton.addEventListener("click", () => submitWalletPayment());

        switch (method) {
            case 'cash':
                alert("تم تأكيد طلبك. يرجى دفع المبلغ نقدًا عند الاستلام.");
                break;
            case 'visa':
                modal.style.display = 'flex';
                walletForm.style.display = 'none';
                visaForm.style.display = 'block';
                break;

            case 'wallet':
                modal.style.display = 'flex';
                visaForm.style.display = 'none';
                walletForm.style.display = 'block';                
                break;

            default:
                alert("يرجى اختيار طريقة دفع صحيحة.");
                break;
        }
    }

    // Close modal when clicking "x" or outside the modal
    closeModal.onclick = () => { modal.style.display = 'none'; };
    window.onclick = (event) => { if (event.target === modal) modal.style.display = 'none'; };
    // Attach confirmOrder function to your confirm button
    document.getElementById('confirmOrderButton').addEventListener('click', confirmOrder);

    // Display products initially
    displayProducts(products);
});
