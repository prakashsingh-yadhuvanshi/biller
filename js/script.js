// Clinic configuration
const clinics = {
    mindgrace: {
        name: 'MIND GRACE',
        address: 'J123, Gamma II Greater Noida, Uttar Pradesh, 201310',
        logo: 'img/MIND GRACE LOGO.jpg',
        specialist: 'Dr. Anita Sharma'
    },
    aasha: {
        name: 'AASHA EARLY INTERVENTION CENTER',
        address: 'J123, Gamma II Greater Noida, Uttar Pradesh, 201310',
        logo: 'img/AASHA Logo.jpeg',
        specialist: ''
    }
};

let rowCount = 0;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('billDate').value = today;
    
    // Add first row
    addItemRow();
    
    // Load saved clinic if any
    const savedClinic = localStorage.getItem('selectedClinic');
    if (savedClinic) {
        document.getElementById('clinicSelect').value = savedClinic;
        switchClinic();
    }
});

// Switch clinic
function switchClinic() {
    const selectedClinic = document.getElementById('clinicSelect').value;
    const clinic = clinics[selectedClinic];
    
    // Update logo
    document.getElementById('clinicLogo').src = clinic.logo;
    
    // Update clinic name and address
    document.getElementById('clinicName').textContent = clinic.name;
    document.getElementById('clinicAddress').textContent = clinic.address;
    
    // Update specialist name
    document.getElementById('specialistName').value = clinic.specialist;
    
    // Save to localStorage
    localStorage.setItem('selectedClinic', selectedClinic);
}

// Add item row
function addItemRow() {
    rowCount++;
    const tbody = document.getElementById('itemsBody');
    const row = document.createElement('tr');
    row.id = `row${rowCount}`;
    
    row.innerHTML = `
        <td>${rowCount}</td>
        <td><input type="text" placeholder="Medicine/Service name"></td>
        <td><input type="text" placeholder="Batch/Expiry"></td>
        <td><input type="number" class="rate" value="0" min="0" onchange="calculateRow(this)" onkeyup="calculateRow(this)"></td>
        <td><input type="number" class="qty" value="1" min="1" onchange="calculateRow(this)" onkeyup="calculateRow(this)"></td>
        <td><span class="cost">₹0.00</span></td>
        <td><button type="button" class="remove-btn" onclick="removeRow(this)">×</button></td>
    `;
    
    tbody.appendChild(row);
}

// Remove row
function removeRow(btn) {
    const row = btn.closest('tr');
    row.remove();
    renumberRows();
    calculateTotals();
}

// Renumber rows after deletion
function renumberRows() {
    const tbody = document.getElementById('itemsBody');
    const rows = tbody.querySelectorAll('tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
}

// Calculate row total
function calculateRow(input) {
    const row = input.closest('tr');
    const rate = parseFloat(row.querySelector('.rate').value) || 0;
    const qty = parseFloat(row.querySelector('.qty').value) || 0;
    const cost = rate * qty;
    
    row.querySelector('.cost').textContent = `₹${cost.toFixed(2)}`;
    row.querySelector('.cost').dataset.value = cost;
    
    calculateTotals();
}

// Calculate totals
function calculateTotals() {
    const costs = document.querySelectorAll('.cost');
    let subtotal = 0;
    
    costs.forEach(cost => {
        subtotal += parseFloat(cost.dataset.value) || 0;
    });
    
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const grandTotal = subtotal - discountAmount;
    
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    document.getElementById('discountAmount').textContent = `₹${discountAmount.toFixed(2)}`;
    
    // Show/hide discount row based on value
    const discountRow = document.getElementById('discountRow');
    if (discountPercent > 0) {
        discountRow.style.display = 'flex';
    } else {
        discountRow.style.display = 'none';
    }
    
    document.getElementById('grandTotal').textContent = `₹${grandTotal.toFixed(2)}`;
}

// Reset form
function resetForm() {
    if (confirm('Are you sure you want to reset the form?')) {
        // Clear all inputs
        document.querySelectorAll('input[type="text"], input[type="number"], input[type="tel"]').forEach(input => {
            input.value = '';
        });
        
        // Reset date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('billDate').value = today;
        
        // Reset specialist based on clinic
        switchClinic();
        
        // Reset payment method
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Reset discount
        document.getElementById('discountPercent').value = 0;
        
        // Clear table and add one row
        const tbody = document.getElementById('itemsBody');
        tbody.innerHTML = '';
        rowCount = 0;
        addItemRow();
        
        // Reset totals
        calculateTotals();
    }
}
