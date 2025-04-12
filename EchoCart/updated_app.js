let products = [];

let productSelect, productInfo, productName, carbonValue, carbonBar, waterValue, waterBar;
let wasteValue, wasteBar, alternativesList, chatMessages, chatInput, articlesGrid;

function initElements() {
  productSelect = document.getElementById('product-select');
  productInfo = document.getElementById('product-info');
  productName = document.getElementById('product-name');
  carbonValue = document.getElementById('carbon-value');
  carbonBar = document.getElementById('carbon-bar');
  waterValue = document.getElementById('water-value');
  waterBar = document.getElementById('water-bar');
  wasteValue = document.getElementById('waste-value');
  wasteBar = document.getElementById('waste-bar');
  alternativesList = document.getElementById('alternatives-list');
  articlesGrid = document.querySelector('.articles-grid');
  if (!articlesGrid) {
    console.error('Articles grid element not found!');
  }
}

function initBotpress() {
  window.botpressWebChat.init({
    host: 'https://cdn.botpress.cloud/webchat/v2.3',
    botId: '20250412130516-MUM0XSHW',
    container: document.getElementById('bp-web-widget-container'),
    showConversationsButton: false,
    enablePersistHistory: false
  });
}

const bpInitInterval = setInterval(() => {
  if (window.botpressWebChat) {
    clearInterval(bpInitInterval);
    initBotpress();
  }
}, 100);

document.addEventListener('DOMContentLoaded', function() {
  initElements();
  if (!productSelect || !carbonValue || !carbonBar || !articlesGrid) {
    console.error('Required elements missing');
    return;
  }
  loadProductData();
  setupEventListeners();
  renderArticles();

  // Enhanced smooth scrolling for navigation
  const navLinks = {
    'home': 'carbon-tracker-intro',
    'products': 'product-section',
    'articles': 'articles-section',
    'about': 'footer-about'
  };

  document.querySelectorAll('.main-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const linkType = this.textContent.toLowerCase();
      const targetId = navLinks[linkType];
      
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
          
          // Highlight active section
          document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active-section');
          });
          targetElement.classList.add('active-section');
        }
      }
    });
  });

  // Add intersection observer for section highlighting
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('section').forEach(section => {
          section.classList.remove('active-section');
        });
        entry.target.classList.add('active-section');
      }
    });
  }, { threshold: 0.5 });

  // Observe all sections
  Object.values(navLinks).forEach(id => {
    const section = document.getElementById(id);
    if (section) observer.observe(section);
  });
});

function loadProductData() {
  if (typeof Papa === 'undefined') {
    console.error("PapaParse library not loaded");
    showError("CSV parsing library not available");
    return;
  }

  try {
    // Adjust the path to the CSV file as needed
    Papa.parse('./products_dataset.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        if (results.data && results.data.length > 0) {
          products = results.data;
          populateProductDropdown();
        } else {
          showError("No product data found in CSV");
        }
      },
      error: function(error) {
        console.error("CSV loading failed:", error);
        showError("Failed to load product data");
      }
    });
  } catch (e) {
    console.error("Exception in loadProductData:", e);
    showError("Failed to load product data");
  }
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.class
}