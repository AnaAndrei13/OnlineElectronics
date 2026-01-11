// Cheia ta publică Stripe
const stripe = Stripe("pk_test_51SLr2r4ZLt4q71mJFzoe9R2qnIiZrlBmbhDY09E1vLc0GmWqJjzS8CPcDMJpSGEo3vp4L3Te0sdv9FDOJG4cHbiC00bGW9Qx4l");

const API_URL = "http://localhost:8080/api";

let elements;
let paymentElement;

// Așteaptă ca DOM-ul să fie gata
document.addEventListener('DOMContentLoaded', function() {
  initialize();
  
  // Event listener pentru submit
  const form = document.querySelector("#payment-form");
  if (form) {
    form.addEventListener("submit", handleSubmit);
  }
});

async function initialize() {
  try {
    console.log('🔵 Initializing Payment Element...');
    setLoading(true);

    const token = localStorage.getItem('token');
    
    if (!token) {
      showMessage("Trebuie să fii autentificat!");
      setTimeout(() => window.location.href = '/login', 1500);
      return;
    }

    // Creează Payment Intent
    const response = await fetch(`${API_URL}/orders/checkout/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    const { clientSecret, amount } = await response.json();
    console.log('✅ Payment Intent created, amount:', amount / 100, 'RON');

    // Configurare appearance - PERSONALIZEAZĂ AICI
    const appearance = {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Ideal Sans, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px'
      },
      rules: {
        '.Input': {
          border: '1px solid #e0e0e0'
        },
        '.Input:focus': {
          border: '1px solid #0570de'
        }
      }
    };

    // Inițializează Elements
  elements = stripe.elements({ clientSecret });

    // Creează Payment Element - PERSONALIZEAZĂ LAYOUT-UL
    const paymentElementOptions = {
      layout: {
        type: 'tabs',
        defaultCollapsed: false,
        radios: false,
        spacedAccordionItems: true
      },
      fields: {
        billingDetails: {
          name: 'auto',
          email: 'auto',
          address: {
            country: 'never',
            postalCode: 'auto'
          }
        }
      }
    };

    paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');

    console.log('✅ Payment Element mounted');
    setLoading(false);

  } catch (error) {
    console.error('❌ Error:', error);
    showMessage(error.message || 'A apărut o eroare');
    setLoading(false);
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  
  if (!elements) {
    showMessage('Payment Element nu este inițializat');
    return;
  }

  setLoading(true);

  // Confirmă plata
  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: `${window.location.origin}/complete.html`
    }
  });

  if (error) {
    // Eroare imediată (card invalid, etc.)
    if (error.type === "card_error" || error.type === "validation_error") {
      showMessage(error.message);
    } else {
      showMessage("A apărut o eroare neașteptată");
    }
    setLoading(false);
  }
  // Altfel, user-ul este redirecționat automat la return_url
}

// UI Helpers
function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");
  if (messageContainer) {
    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;
    setTimeout(() => {
      messageContainer.classList.add("hidden");
      messageContainer.textContent = "";
    }, 5000);
  }
}

function setLoading(isLoading) {
  const submitBtn = document.querySelector("#submit");
  const spinner = document.querySelector("#spinner");
  const buttonText = document.querySelector("#button-text");

  if (isLoading) {
    if (submitBtn) submitBtn.disabled = true;
    if (spinner) spinner.classList.remove("hidden");
    if (buttonText) buttonText.classList.add("hidden");
  } else {
    if (submitBtn) submitBtn.disabled = false;
    if (spinner) spinner.classList.add("hidden");
    if (buttonText) buttonText.classList.remove("hidden");
  }
}