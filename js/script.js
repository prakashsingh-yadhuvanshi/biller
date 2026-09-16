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
    
    // Initialize discount toggle state
    const discountToggle = document.getElementById('discountToggle');
    const discountPercentInput = document.getElementById('discountPercent');
    const discountRow = document.getElementById('discountRow');
    if (discountToggle && discountPercentInput) {
        discountPercentInput.disabled = true;
        discountRow.classList.remove('show-in-print');
    }
    
    // Add auto-capitalize functionality to specific fields
    setupAutoCapitalization();
    
    // Add phone number validation
    setupPhoneValidation();
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
    const tbody = document.getElementById('itemsBody');
    const rows = tbody.querySelectorAll('tr');
    const newRowNum = rows.length + 1;
    const row = document.createElement('tr');
    row.id = `row${Date.now()}`; // Use timestamp for unique ID instead of rowCount
    
    row.innerHTML = `
        <td>${newRowNum}</td>
        <td><input type="text" placeholder="Medicine/Service name" class="medicine-name"></td>
        <td><input type="text" placeholder="Batch/Expiry"></td>
        <td>
            <select class="item-type" onchange="calculateRow(this)">
                <option value="medicine">Medicine</option>
                <option value="consultation">Consultation</option>
            </select>
        </td>
        <td><input type="number" class="rate" value="0" min="0" onchange="calculateRow(this)" onkeyup="calculateRow(this)"></td>
        <td><input type="number" class="qty" value="1" min="1" onchange="calculateRow(this)" onkeyup="calculateRow(this)"></td>
        <td><span class="cost">₹0.00</span></td>
        <td class="screen-only"><button type="button" class="remove-btn" onclick="removeRow(this)">×</button></td>
    `;
    
    // Add auto-capitalization to the medicine name input
    const medicineInput = row.querySelector('.medicine-name');
    medicineInput.addEventListener('blur', function() {
        this.value = capitalizeWords(this.value);
    });
    
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

// Calculate totals with separate logic for medicines and consultation
function calculateTotals() {
    const rows = document.querySelectorAll('#itemsBody tr');
    let medicinesSubtotal = 0;
    let consultationSubtotal = 0;
    
    rows.forEach(row => {
        const itemType = row.querySelector('.item-type').value;
        const cost = parseFloat(row.querySelector('.cost').dataset.value) || 0;
        
        if (itemType === 'medicine') {
            medicinesSubtotal += cost;
        } else if (itemType === 'consultation') {
            consultationSubtotal += cost;
        }
    });
    
    const subtotal = medicinesSubtotal + consultationSubtotal;
    
    // Update individual totals display
    document.getElementById('medicinesTotal').textContent = `₹${medicinesSubtotal.toFixed(2)}`;
    document.getElementById('consultationTotal').textContent = `₹${consultationSubtotal.toFixed(2)}`;
    document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
    
    const discountToggle = document.getElementById('discountToggle');
    const discountPercentInput = document.getElementById('discountPercent');
    
    // Only calculate discount if toggle is checked
    let discountPercent = 0;
    let discountAmount = 0;
    
    if (discountToggle && discountToggle.checked) {
        discountPercent = parseFloat(discountPercentInput.value) || 0;
        // Discount applies only to medicines, not consultation
        discountAmount = medicinesSubtotal * (discountPercent / 100);
    }
    
    const grandTotal = subtotal - discountAmount;
    
    if (discountToggle && discountToggle.checked) {
        document.getElementById('discountAmount').textContent = `- ₹${discountAmount.toFixed(2)}`;
    } else {
        document.getElementById('discountAmount').textContent = '';
    }
    
    document.getElementById('grandTotal').textContent = `₹${grandTotal.toFixed(2)}`;
}

// Toggle discount visibility
function toggleDiscountVisibility() {
    const discountToggle = document.getElementById('discountToggle');
    const discountPercentInput = document.getElementById('discountPercent');
    const discountRow = document.getElementById('discountRow');
    
    if (discountToggle.checked) {
        discountPercentInput.disabled = false;
        discountPercentInput.focus();
        discountRow.classList.add('show-in-print');
    } else {
        discountPercentInput.disabled = true;
        discountPercentInput.value = 0;
        discountRow.classList.remove('show-in-print');
    }
    
    calculateTotals();
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
        const discountToggle = document.getElementById('discountToggle');
        const discountPercentInput = document.getElementById('discountPercent');
        const discountRow = document.getElementById('discountRow');
        if (discountToggle) discountToggle.checked = false;
        if (discountPercentInput) {
            discountPercentInput.value = 0;
            discountPercentInput.disabled = true;
        }
        if (discountRow) discountRow.classList.remove('show-in-print');
        
        // Clear table and add one row
        const tbody = document.getElementById('itemsBody');
        tbody.innerHTML = '';
        addItemRow();
        
        // Reset totals
        calculateTotals();
    }
}

// Auto-capitalize first letter of each word in specific fields
function setupAutoCapitalization() {
    const fieldsToCapitalize = [
        'specialistName',
        'patientName',
        'patientAddress'
    ];
    
    fieldsToCapitalize.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                this.value = capitalizeWords(this.value);
            });
        }
    });
}

function capitalizeWords(str) {
    if (!str) return str;
    return str.toLowerCase().replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}

// Phone number validation
function setupPhoneValidation() {
    const contactField = document.getElementById('patientContact');
    if (contactField) {
        contactField.addEventListener('blur', function() {
            const phoneValue = this.value.replace(/\D/g, ''); // Remove non-digits
            if (phoneValue.length !== 10) {
                alert('Phone number must be of 10 digits, please recheck');
                this.value = '';
                this.focus();
            } else {
                this.value = phoneValue;
            }
        });
    }
}
