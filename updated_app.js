let products = [];

let productSelect, productInfo, productName, carbonValue, carbonBar, waterValue, waterBar;
let wasteValue, wasteBar, alternativesList, chatMessages, chatInput, articlesGrid;

function initElements() {
  try {
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
    
    console.log('DOM elements initialized:', {
      productSelect, productInfo, productName,
      carbonValue, carbonBar, waterValue,
      waterBar, wasteValue, wasteBar,
      alternativesList, articlesGrid
    });

    if (!productSelect) throw new Error('product-select not found');
    if (!carbonValue) throw new Error('carbon-value not found');
    if (!carbonBar) throw new Error('carbon-bar not found');
    
  } catch (e) {
    console.error('Element initialization failed:', e);
    showError('Failed to initialize page elements');
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
});

function loadProductData() {
  if (typeof Papa === 'undefined') {
    console.error("PapaParse library not loaded");
    showError("CSV parsing library not available");
    // Fallback to test data
    useTestData();
    return;
  }

  console.log('Attempting to load product data...');
  try {
    Papa.parse('products_dataset.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        console.log('CSV parse results:', results);
        if (results.data && results.data.length > 0) {
          products = results.data;
          console.log(`Loaded ${products.length} products`);
          populateProductDropdown();
        } else {
          console.warn("No product data found in CSV, using test data");
          showError("No product data found - using demo data");
          useTestData();
        }
      },
      error: function(error) {
        console.error("CSV loading failed:", error);
        showError("Failed to load product data - using demo data");
        useTestData();
      }
    });
  } catch (e) {
    console.error("Exception in loadProductData:", e);
    showError("Failed to load product data - using demo data");
    useTestData();
  }
}

function useTestData() {
  products = [
    {
      name: "Demo Product 1",
      carbon: "15.2",
      water: "120",
      waste: "45",
      alternatives: "Eco Product 1;Green Alternative 1"
    },
    {
      name: "Demo Product 2", 
      carbon: "8.7",
      water: "85",
      waste: "32",
      alternatives: "Eco Product 2;Sustainable Option 2"
    }
  ];
  console.log("Using test product data:", products);
  populateProductDropdown();
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  document.body.prepend(errorDiv);
}

function populateProductDropdown() {
  productSelect.innerHTML = '<option value="">-- Select a product --</option>';
  products.forEach((product, index) => {
    if (product?.name?.trim()) {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = product.name.trim();
      productSelect.appendChild(option);
    }
  });
}

function setupEventListeners() {
  productSelect.addEventListener('change', handleProductSelect);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
      handleChatMessage(chatInput.value.trim());
      chatInput.value = '';
    }
  });
}

function handleProductSelect(e) {
  const index = e.target.value;
  if (!index) {
    productInfo.classList.add('hidden');
    return;
  }

  const product = products[index];
  if (!product) return;

  productName.textContent = product.name;

  if (product.carbon && !isNaN(parseFloat(product.carbon))) {
    const carbon = parseFloat(product.carbon);
    const carbonPercent = Math.min(carbon, 100);
    carbonValue.innerHTML = `<span class="metric-value">${carbon.toFixed(1)}</span><span class="metric-unit">kg CO₂</span>`;
    carbonBar.style.width = `${carbonPercent}%`;
    if (carbon < 10) carbonBar.style.backgroundColor = '#4CAF50';
    else if (carbon < 30) carbonBar.style.backgroundColor = '#8BC34A';
    else if (carbon < 70) carbonBar.style.backgroundColor = '#FFC107';
    else carbonBar.style.backgroundColor = '#F44336';
  } else {
    carbonValue.textContent = 'Data unavailable';
    carbonBar.style.width = '0%';
  }

  if (product.water && !isNaN(parseFloat(product.water))) {
    const water = parseFloat(product.water);
    const waterPercent = Math.min(water / 1000 * 100, 100);
    waterValue.innerHTML = `<span class="metric-value">${water.toFixed(1)}</span><span class="metric-unit">L</span>`;
    waterBar.style.width = `${waterPercent}%`;
    if (water < 100) waterBar.style.backgroundColor = '#4CAF50';
    else if (water < 300) waterBar.style.backgroundColor = '#8BC34A';
    else if (water < 700) waterBar.style.backgroundColor = '#FFC107';
    else waterBar.style.backgroundColor = '#F44336';
  } else {
    waterValue.textContent = 'Data unavailable';
    waterBar.style.width = '0%';
  }

  if (product.waste && !isNaN(parseFloat(product.waste))) {
    const waste = parseFloat(product.waste);
    const wastePercent = Math.min(waste / 500 * 100, 100);
    wasteValue.innerHTML = `<span class="metric-value">${waste.toFixed(1)}</span><span class="metric-unit">g</span>`;
    wasteBar.style.width = `${wastePercent}%`;
    if (waste < 50) wasteBar.style.backgroundColor = '#4CAF50';
    else if (waste < 150) wasteBar.style.backgroundColor = '#8BC34A';
    else if (waste < 350) wasteBar.style.backgroundColor = '#FFC107';
    else wasteBar.style.backgroundColor = '#F44336';
  } else {
    wasteValue.textContent = 'Data unavailable';
    wasteBar.style.width = '0%';
  }

  productInfo.classList.remove('hidden');

  if (product.alternatives) {
    try {
      let alternatives;
      if (product.alternatives.includes(';')) {
        alternatives = product.alternatives.split(';').map(alt => ({ name: alt.trim() })).filter(alt => alt.name);
      } else {
        alternatives = JSON.parse(product.alternatives);
      }
      renderAlternatives(alternatives);
    } catch (e) {
      console.error("Error parsing alternatives:", e);
      alternativesList.innerHTML = '<li class="error">Could not load alternatives</li>';
    }
  } else {
    alternativesList.innerHTML = '<li>No alternatives data available</li>';
  }
}

function renderAlternatives(alternatives) {
  alternativesList.innerHTML = '';
  if (!alternatives || !Array.isArray(alternatives) || alternatives.length === 0) {
    alternativesList.innerHTML = '<li>No sustainable alternatives found</li>';
    return;
  }

  alternatives.forEach((alt, index) => {
    const li = document.createElement('li');
    li.className = 'alternative-item';
    li.innerHTML = `<span class="alt-number">${index + 1}.</span><span class="alt-name">${alt.name || 'Unnamed alternative'}</span><button class="alt-select-btn" data-id="${index}">Select</button>`;
    alternativesList.appendChild(li);
  });

  document.querySelectorAll('.alt-select-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const altIndex = this.getAttribute('data-id');
      selectAlternative(alternatives[altIndex]);
    });
  });
}

function selectAlternative(alternative) {
  console.log("Selected alternative:", alternative);
}

function initArticles() {
  if (!articlesGrid) {
    console.error('Articles grid element not found');
    return;
  }
}

if (document.readyState !== 'loading') {
  document.dispatchEvent(new Event('DOMContentLoaded'));
}
