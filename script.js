// Flavor combinations database
const flavorDatabase = {
    primary: [
        { name: "Chocolate", description: "Rich and decadent, pairs well with fruits and nuts" },
        { name: "Vanilla", description: "Sweet and creamy, complements almost any flavor" },
        { name: "Strawberry", description: "Sweet and tart, perfect with chocolate and cream" },
        { name: "Lemon", description: "Bright and citrusy, enhances seafood and desserts" },
        { name: "Cinnamon", description: "Warm and spicy, great in baked goods and coffee" },
        { name: "Garlic", description: "Savory and aromatic, essential in many cuisines" },
        { name: "Basil", description: "Fresh and herbaceous, perfect with tomatoes and cheese" },
        { name: "Ginger", description: "Spicy and zesty, excellent in Asian dishes and teas" },
        { name: "Honey", description: "Sweet and floral, pairs well with cheese and fruits" },
        { name: "Coffee", description: "Bold and bitter, complements chocolate and nuts" },
        { name: "Mint", description: "Cool and refreshing, great with chocolate and lamb" },
        { name: "Rosemary", description: "Pine-like and aromatic, perfect with meats and potatoes" },
        { name: "Coconut", description: "Creamy and tropical, pairs well with spicy and sweet flavors" },
        { name: "Peanut Butter", description: "Nutty and rich, excellent with chocolate and fruit" },
        { name: "Lavender", description: "Floral and soothing, unique in desserts and teas" }
    ],
    secondary: [
        { name: "Sea Salt", description: "Enhances sweetness and adds depth to any dish" },
        { name: "Black Pepper", description: "Adds warmth and complexity to savory dishes" },
        { name: "Lime", description: "Tart and citrusy, brightens up Mexican and Asian dishes" },
        { name: "Blue Cheese", description: "Tangy and pungent, pairs well with sweet fruits" },
        { name: "Prosciutto", description: "Salty and cured, perfect with melon and figs" },
        { name: "Balsamic Vinegar", description: "Sweet and acidic, excellent with strawberries and cheese" },
        { name: "Sesame Oil", description: "Nutty and toasted, essential in Asian cooking" },
        { name: "Truffle Oil", description: "Earthy and luxurious, elevates pasta and eggs" },
        { name: "Chili Flakes", description: "Spicy and warm, adds kick to any dish" },
        { name: "Orange Zest", description: "Fragrant and citrusy, brightens desserts and savory dishes" },
        { name: "Walnuts", description: "Earthy and crunchy, great in salads and baked goods" },
        { name: "Goat Cheese", description: "Tangy and creamy, pairs well with beets and honey" },
        { name: "Fig", description: "Sweet and jammy, excellent with cheese and prosciutto" },
        { name: "Bacon", description: "Smoky and salty, makes everything better" },
        { name: "Maple Syrup", description: "Sweet and woody, perfect with pancakes and bacon" }
    ]
};

// Application state
let currentCombination = null;
let savedCombinations = [];
let stats = {
    totalGenerated: 0,
    totalSaved: 0
};

// DOM elements
const primaryFlavorEl = document.getElementById('primaryFlavor');
const secondaryFlavorEl = document.getElementById('secondaryFlavor');
const descriptionEl = document.getElementById('description');
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const savedListEl = document.getElementById('savedList');
const totalGeneratedEl = document.getElementById('totalGenerated');
const totalSavedEl = document.getElementById('totalSaved');

// Initialize the app
function init() {
    loadFromLocalStorage();
    updateStats();
    renderSavedCombinations();
    
    // Event listeners
    generateBtn.addEventListener('click', generateCombination);
    saveBtn.addEventListener('click', saveCurrentCombination);
    
    // Generate initial combination
    generateCombination();
}

// Generate a new flavor combination
function generateCombination() {
    const primary = flavorDatabase.primary[Math.floor(Math.random() * flavorDatabase.primary.length)];
    const secondary = flavorDatabase.secondary[Math.floor(Math.random() * flavorDatabase.secondary.length)];
    
    currentCombination = {
        primary: primary,
        secondary: secondary,
        description: generateDescription(primary, secondary),
        timestamp: Date.now()
    };
    
    updateDisplay();
    stats.totalGenerated++;
    updateStats();
    saveToLocalStorage();
    
    // Add animation effect
    animateNewCombination();
}

// Generate a description for the flavor combination
function generateDescription(primary, secondary) {
    const descriptions = [
        `A perfect balance of ${primary.name.toLowerCase()}'s ${getCharacteristics(primary)} and ${secondary.name.toLowerCase()}'s ${getCharacteristics(secondary)}.`,
        `${primary.name} meets ${secondary.name} in this unexpected but delightful pairing.`,
        `The ${getCharacteristics(primary)} notes of ${primary.name.toLowerCase()} are beautifully complemented by the ${getCharacteristics(secondary)} of ${secondary.name.toLowerCase()}.`,
        `Experience the harmony between ${primary.name.toLowerCase()} and ${secondary.name.toLowerCase()} - a match made in culinary heaven.`,
        `${primary.name} and ${secondary.name} create a symphony of flavors that will tantalize your taste buds.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

// Get flavor characteristics
function getCharacteristics(flavor) {
    if (flavor.description.includes("sweet")) return "sweetness";
    if (flavor.description.includes("savory")) return "savory depth";
    if (flavor.description.includes("spicy")) return "spicy warmth";
    if (flavor.description.includes("tart")) return "tart brightness";
    if (flavor.description.includes("creamy")) return "creamy richness";
    if (flavor.description.includes("fresh")) return "freshness";
    if (flavor.description.includes("nutty")) return "nutty flavor";
    if (flavor.description.includes("citrus")) return "citrus zest";
    if (flavor.description.includes("aromatic")) return "aromatic quality";
    return "unique character";
}

// Update the display with current combination
function updateDisplay() {
    if (!currentCombination) return;
    
    primaryFlavorEl.innerHTML = `<span class="flavor-name">${currentCombination.primary.name}</span>`;
    secondaryFlavorEl.innerHTML = `<span class="flavor-name">${currentCombination.secondary.name}</span>`;
    descriptionEl.textContent = currentCombination.description;
    
    // Update save button state
    saveBtn.disabled = isCombinationAlreadySaved();
}

// Check if combination is already saved
function isCombinationAlreadySaved() {
    return savedCombinations.some(saved => 
        saved.primary.name === currentCombination.primary.name && 
        saved.secondary.name === currentCombination.secondary.name
    );
}

// Save current combination
function saveCurrentCombination() {
    if (!currentCombination || isCombinationAlreadySaved()) return;
    
    savedCombinations.unshift({...currentCombination, id: Date.now()});
    stats.totalSaved++;
    
    updateStats();
    renderSavedCombinations();
    saveToLocalStorage();
    updateDisplay();
    
    // Show success feedback
    showSaveFeedback();
}

// Render saved combinations
function renderSavedCombinations() {
    if (savedCombinations.length === 0) {
        savedListEl.innerHTML = '<p class="empty-state">No saved combinations yet. Generate and save your favorites!</p>';
        return;
    }
    
    savedListEl.innerHTML = savedCombinations.map(combination => `
        <div class="saved-item">
            <div>
                <div class="saved-flavors">${combination.primary.name} + ${combination.secondary.name}</div>
                <div class="saved-description">${combination.description}</div>
            </div>
            <button class="delete-btn" onclick="deleteCombination(${combination.id})">Delete</button>
        </div>
    `).join('');
}

// Delete a saved combination
function deleteCombination(id) {
    savedCombinations = savedCombinations.filter(combination => combination.id !== id);
    stats.totalSaved = Math.max(0, stats.totalSaved - 1);
    
    updateStats();
    renderSavedCombinations();
    saveToLocalStorage();
    updateDisplay();
}

// Update statistics display
function updateStats() {
    totalGeneratedEl.textContent = stats.totalGenerated;
    totalSavedEl.textContent = stats.totalSaved;
}

// Animate new combination
function animateNewCombination() {
    const card = document.querySelector('.combination-card');
    card.style.transform = 'scale(0.95)';
    card.style.opacity = '0.7';
    
    setTimeout(() => {
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
    }, 200);
}

// Show save feedback
function showSaveFeedback() {
    const originalText = saveBtn.querySelector('.btn-text').textContent;
    saveBtn.querySelector('.btn-text').textContent = 'Saved!';
    saveBtn.querySelector('.btn-icon').textContent = '✓';
    
    setTimeout(() => {
        saveBtn.querySelector('.btn-text').textContent = originalText;
        saveBtn.querySelector('.btn-icon').textContent = '💾';
    }, 2000);
}

// Local storage functions
function saveToLocalStorage() {
    localStorage.setItem('endlessFlavorSaved', JSON.stringify(savedCombinations));
    localStorage.setItem('endlessFlavorStats', JSON.stringify(stats));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('endlessFlavorSaved');
    const savedStats = localStorage.getItem('endlessFlavorStats');
    
    if (saved) {
        savedCombinations = JSON.parse(saved);
    }
    
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        generateCombination();
    } else if (e.key === 's' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        saveCurrentCombination();
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);