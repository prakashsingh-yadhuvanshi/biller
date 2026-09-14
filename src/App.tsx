import { useState, useRef } from 'react';
import { Printer, Plus, Trash2, Building2, User, Phone, Calendar, Hash, FileText } from 'lucide-react';

type ClinicType = 'mindgrace' | 'aasha' | '';

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface BillData {
  clinic: ClinicType;
  invoiceNo: string;
  date: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  contactNumber: string;
  address: string;
  doctorName: string;
  referralBy: string;
  lineItems: LineItem[];
  discount: number;
  discountType: 'percent' | 'fixed';
  paymentMethod: string;
  notes: string;
}

const MIND_GRACE_LOGO = 'https://image.qwenlm.ai/generated-images/0952a916-ca96-4c4f-be82-8bf62d30ca2a/_result.png';
const AASHA_LOGO = 'https://image.qwenlm.ai/generated-images/f8b468b5-b449-409e-8486-88852a0b5e1a/_result.png';

const CLINIC_INFO = {
  mindgrace: {
    name: 'MIND GRACE NEUROPSYCHIATRIC CLINIC',
    tagline: 'Comprehensive Neuropsychiatric Care',
    address: 'J123, Gamma 2, Greater Noida, Uttar Pradesh, India',
    phone: '+91 XXXXX XXXXX',
    color: 'from-blue-600 to-purple-700',
    accent: 'blue',
  },
  aasha: {
    name: 'AASHA EARLY INTERVENTION CENTER',
    tagline: 'Nurturing Early Development & Intervention',
    address: 'J123, Gamma 2, Greater Noida, Uttar Pradesh, India',
    phone: '+91 XXXXX XXXXX',
    color: 'from-green-500 to-orange-500',
    accent: 'green',
  },
};

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function App() {
  const [billData, setBillData] = useState<BillData>({
    clinic: '',
    invoiceNo: `INV-${Date.now().toString().slice(-6)}`,
    date: getTodayDate(),
    patientName: '',
    patientAge: '',
    patientGender: '',
    contactNumber: '',
    address: '',
    doctorName: '',
    referralBy: '',
    lineItems: [{ id: generateId(), description: '', quantity: 1, rate: 0 }],
    discount: 0,
    discountType: 'percent',
    paymentMethod: 'cash',
    notes: '',
  });

  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const updateField = (field: keyof BillData, value: any) => {
    setBillData(prev => ({ ...prev, [field]: value }));
  };

  const addLineItem = () => {
    setBillData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { id: generateId(), description: '', quantity: 1, rate: 0 }],
    }));
  };

  const removeLineItem = (id: string) => {
    setBillData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id),
    }));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setBillData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const subtotal = billData.lineItems.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = billData.discountType === 'percent'
    ? (subtotal * billData.discount) / 100
    : billData.discount;
  const taxableAmount = subtotal - discountAmount;
  const gst = taxableAmount * 0.18;
  const totalAmount = taxableAmount + gst;

  const handlePrint = () => {
    setShowPreview(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const clinicInfo = billData.clinic ? CLINIC_INFO[billData.clinic] : null;

  if (showPreview && clinicInfo) {
    return (
      <div className="min-h-screen bg-gray-100 print:bg-white">
        <div className="max-w-4xl mx-auto p-4 print:p-0">
          <div className="flex justify-end mb-4 print:hidden gap-2">
            <button
              onClick={() => setShowPreview(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              ← Back to Edit
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Printer size={18} /> Print
            </button>
          </div>

          <div ref={printRef} className="bg-white rounded-xl shadow-lg print:shadow-none p-8 print:p-4">
            {/* Bill Header */}
            <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
              <img
                src={billData.clinic === 'mindgrace' ? MIND_GRACE_LOGO : AASHA_LOGO}
                alt={clinicInfo.name}
                className="h-24 mx-auto mb-3 object-contain"
              />
              <h1 className={`text-2xl font-bold bg-gradient-to-r ${clinicInfo.color} bg-clip-text text-transparent`}>
                {clinicInfo.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1">{clinicInfo.tagline}</p>
              <p className="text-sm text-gray-600 mt-1">{clinicInfo.address}</p>
              <p className="text-sm text-gray-600">Phone: {clinicInfo.phone}</p>
            </div>

            {/* Invoice Info */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">TAX INVOICE</h2>
                <p className="text-sm text-gray-600">Invoice No: <span className="font-medium">{billData.invoiceNo}</span></p>
                <p className="text-sm text-gray-600">Date: <span className="font-medium">{new Date(billData.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
              </div>
            </div>

            {/* Patient Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Patient Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-500">Name:</span> <span className="font-medium">{billData.patientName || '—'}</span></p>
                <p><span className="text-gray-500">Age/Gender:</span> <span className="font-medium">{billData.patientAge || '—'} {billData.patientGender ? `/ ${billData.patientGender}` : ''}</span></p>
                <p><span className="text-gray-500">Contact:</span> <span className="font-medium">{billData.contactNumber || '—'}</span></p>
                <p><span className="text-gray-500">Address:</span> <span className="font-medium">{billData.address || '—'}</span></p>
                <p><span className="text-gray-500">Doctor:</span> <span className="font-medium">{billData.doctorName || '—'}</span></p>
                <p><span className="text-gray-500">Referral By:</span> <span className="font-medium">{billData.referralBy || '—'}</span></p>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full mb-6 text-sm">
              <thead>
                <tr className={`bg-gradient-to-r ${clinicInfo.color} text-white`}>
                  <th className="text-left py-2 px-3 rounded-tl-lg">#</th>
                  <th className="text-left py-2 px-3">Description</th>
                  <th className="text-center py-2 px-3">Qty</th>
                  <th className="text-right py-2 px-3">Rate (₹)</th>
                  <th className="text-right py-2 px-3 rounded-tr-lg">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {billData.lineItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 px-3">{index + 1}</td>
                    <td className="py-2 px-3">{item.description || '—'}</td>
                    <td className="py-2 px-3 text-center">{item.quantity}</td>
                    <td className="py-2 px-3 text-right">{item.rate.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-medium">{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-6">
              <div className="w-72">
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₹ {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between py-1 text-sm">
                    <span className="text-gray-600">Discount {billData.discountType === 'percent' ? `(${billData.discount}%)` : ''}:</span>
                    <span className="text-red-500">- ₹ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">GST (18%):</span>
                  <span>₹ {gst.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between py-2 px-3 rounded-lg bg-gradient-to-r ${clinicInfo.color} text-white font-bold text-lg mt-2`}>
                  <span>Total:</span>
                  <span>₹ {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment & Notes */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-gray-600">Payment Method: <span className="font-medium capitalize">{billData.paymentMethod}</span></p>
                  {billData.notes && <p className="text-gray-600 mt-1">Notes: {billData.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Thank you for your visit!</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">This is a computer-generated invoice.</p>
              <p className="text-xs text-gray-400 mt-1">{clinicInfo.name} | {clinicInfo.address}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Bill Generator</h1>
                <p className="text-xs text-gray-500">Mind Grace & Aasha Centers</p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              disabled={!billData.clinic}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Printer size={18} /> Preview & Print
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Clinic Selection */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Building2 size={20} className="text-blue-600" /> Select Clinic
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => updateField('clinic', 'mindgrace')}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                billData.clinic === 'mindgrace'
                  ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {billData.clinic === 'mindgrace' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <img src={MIND_GRACE_LOGO} alt="Mind Grace" className="h-16 object-contain mb-3" />
              <h3 className="font-bold text-gray-800">Mind Grace</h3>
              <p className="text-sm text-gray-500">Neuropsychiatric Clinic</p>
            </button>

            <button
              onClick={() => updateField('clinic', 'aasha')}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                billData.clinic === 'aasha'
                  ? 'border-green-500 bg-green-50 shadow-lg shadow-green-100'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }`}
            >
              {billData.clinic === 'aasha' && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              <img src={AASHA_LOGO} alt="Aasha" className="h-16 object-contain mb-3" />
              <h3 className="font-bold text-gray-800">Aasha</h3>
              <p className="text-sm text-gray-500">Early Intervention Center</p>
            </button>
          </div>
        </section>

        {/* Selected Clinic Logo Preview */}
        {clinicInfo && (
          <div className={`mb-8 p-4 rounded-2xl bg-gradient-to-r ${clinicInfo.color} text-white flex items-center gap-4`}>
            <img
              src={billData.clinic === 'mindgrace' ? MIND_GRACE_LOGO : AASHA_LOGO}
              alt={clinicInfo.name}
              className="h-16 object-contain bg-white rounded-lg p-1"
            />
            <div>
              <h3 className="font-bold text-lg">{clinicInfo.name}</h3>
              <p className="text-white/80 text-sm">{clinicInfo.address}</p>
            </div>
          </div>
        )}

        {/* Bill Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Invoice Details */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Hash size={20} className="text-blue-600" /> Invoice Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <input
                  type="text"
                  value={billData.invoiceNo}
                  onChange={(e) => updateField('invoiceNo', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                  placeholder="INV-XXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={14} className="inline mr-1" /> Date
                </label>
                <input
                  type="date"
                  value={billData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor / Therapist Name</label>
                <input
                  type="text"
                  value={billData.doctorName}
                  onChange={(e) => updateField('doctorName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                  placeholder="Dr. / Therapist Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referred By</label>
                <input
                  type="text"
                  value={billData.referralBy}
                  onChange={(e) => updateField('referralBy', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                  placeholder="Referring doctor/person (optional)"
                />
              </div>
            </div>
          </section>

          {/* Patient Details */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} className="text-blue-600" /> Patient Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  value={billData.patientName}
                  onChange={(e) => updateField('patientName', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                  placeholder="Full name"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="text"
                    value={billData.patientAge}
                    onChange={(e) => updateField('patientAge', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                    placeholder="e.g., 35 yrs"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={billData.patientGender}
                    onChange={(e) => updateField('patientGender', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone size={14} className="inline mr-1" /> Contact Number
                </label>
                <input
                  type="tel"
                  value={billData.contactNumber}
                  onChange={(e) => updateField('contactNumber', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  value={billData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none resize-none"
                  placeholder="Patient address"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Line Items */}
        <section className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" /> Services / Items
            </h2>
            <button
              onClick={addLineItem}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition flex items-center gap-1 text-sm font-medium"
            >
              <Plus size={16} /> Add Item
            </button>
          </div>

          <div className="space-y-3">
            {billData.lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 bg-gray-50 rounded-xl">
                <div className="col-span-12 md:col-span-5">
                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none text-sm"
                    placeholder="Consultation / Therapy / Assessment..."
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none text-sm"
                  />
                </div>
                <div className="col-span-4 md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.rate || ''}
                    onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-3 md:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">Amount</label>
                  <div className="px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700">
                    ₹ {(item.quantity * item.rate).toFixed(2)}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-1 flex justify-end">
                  <button
                    onClick={() => removeLineItem(item.id)}
                    disabled={billData.lineItems.length === 1}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Discount, Payment & Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Discount & Payment</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
                  <input
                    type="number"
                    min="0"
                    value={billData.discount || ''}
                    onChange={(e) => updateField('discount', parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={billData.discountType}
                    onChange={(e) => updateField('discountType', e.target.value as 'percent' | 'fixed')}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="fixed">Fixed (₹)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  value={billData.paymentMethod}
                  onChange={(e) => updateField('paymentMethod', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notes & Summary</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Remarks</label>
                <textarea
                  value={billData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition outline-none resize-none"
                  placeholder="Any additional notes..."
                />
              </div>
              {/* Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹ {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-500">- ₹ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%):</span>
                  <span className="font-medium">₹ {gst.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-800">Total:</span>
                  <span className="font-bold text-xl text-blue-600">₹ {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Print Button Bottom */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handlePrint}
            disabled={!billData.clinic}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-lg"
          >
            <Printer size={22} /> Generate Bill
          </button>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-400 pb-8">
          <p>Bill Generator for Mind Grace Neuropsychiatric Clinic & Aasha Early Intervention Center</p>
          <p className="mt-1">J123, Gamma 2, Greater Noida, Uttar Pradesh, India</p>
        </footer>
      </main>
    </div>
  );
}
