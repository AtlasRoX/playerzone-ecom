'use client';
import { useState, useEffect, useRef } from 'react';
import { UploadCloud, CheckCircle2, XCircle, Shirt, Settings2, Users } from 'lucide-react';
import { getActiveDesigns, getActiveFabrics, submitCustomOrder } from '@/app/actions/customJerseys';

import { useSearchParams } from 'next/navigation';

type Design = { id: string; name: string; image: string };
type Fabric = { id: string; name: string; description: string; image: string | null };
type RosterEntry = { name: string; number: string; size: string };

export default function CustomJerseyBuilder() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  
  // Form State
  const [selectedDesignId, setSelectedDesignId] = useState<string>('');
  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string>('');
  const [selectedFabricId, setSelectedFabricId] = useState<string>('');
  const [roster, setRoster] = useState<RosterEntry[]>([{ name: '', number: '', size: 'M' }]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [note, setNote] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getActiveDesigns().then((res) => {
      setDesigns(res);
      const preselected = searchParams.get('designId');
      if (preselected) {
        setSelectedDesignId(preselected);
      }
    });
    getActiveFabrics().then(setFabrics);
  }, [searchParams]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomImageFile(file);
      setCustomImagePreview(URL.createObjectURL(file));
      setSelectedDesignId(''); // clear predefined design
    }
  };

  const addRosterEntry = () => {
    setRoster([...roster, { name: '', number: '', size: 'M' }]);
  };
  
  const updateRosterEntry = (index: number, field: keyof RosterEntry, value: string) => {
    const newRoster = [...roster];
    newRoster[index][field] = value;
    setRoster(newRoster);
  };
  
  const removeRosterEntry = (index: number) => {
    if (roster.length === 1) return;
    setRoster(roster.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!customerName || !customerPhone || !selectedFabricId) {
      alert("Please fill in all required fields (Name, Phone, Fabric).");
      return;
    }
    if (!selectedDesignId && !customImageFile) {
      alert("Please select a design or upload your own.");
      return;
    }

    setIsSubmitting(true);
    try {
      let customDesignImageUrl = '';
      
      // Upload custom image if provided
      if (customImageFile) {
        const formData = new FormData();
        formData.append('file', customImageFile);
        
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadRes.ok) throw new Error("Image upload failed");
        
        const uploadData = await uploadRes.json();
        customDesignImageUrl = uploadData.secure_url;
      }

      await submitCustomOrder({
        customerName,
        customerPhone,
        designId: selectedDesignId || undefined,
        customDesignImage: customDesignImageUrl,
        fabricId: selectedFabricId,
        quantity: roster.length,
        roster,
        note
      });

      setSubmitSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-4xl font-bold mb-4 tracking-tight">Order Submitted!</h2>
        <p className="text-neutral-500 max-w-md mx-auto mb-8">
          Thank you for your custom jersey request. We have received your order details and roster. We will contact you at {customerPhone} shortly to confirm and process your order!
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-colors"
        >
          Build Another Jersey
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-12">
        <h2 className="text-[44px] leading-12 tracking-[-2px] sm:text-[56px] font-medium mb-4">
          Customized Jerseys
        </h2>
        <p className="text-lg text-neutral-500 max-w-2xl">
          Design your perfect team uniform. Choose from our curated designs or upload your own, select premium fabrics, and add your team roster.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex gap-4 mb-12 border-b border-neutral-200 pb-6">
        {[
          { num: 1, title: 'Design', icon: <Shirt size={20} /> },
          { num: 2, title: 'Fabric', icon: <Settings2 size={20} /> },
          { num: 3, title: 'Roster & Details', icon: <Users size={20} /> },
        ].map(s => (
          <button 
            key={s.num}
            onClick={() => setStep(s.num)}
            className={`flex items-center gap-2 pb-6 -mb-[25px] border-b-2 transition-colors ${step === s.num ? 'border-black text-black font-medium' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
          >
            <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm ${step === s.num ? 'bg-black text-white' : 'bg-neutral-100'}`}>
              {s.num}
            </span>
            {s.title}
          </button>
        ))}
      </div>

      {/* STEP 1: DESIGN */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8">
            <h3 className="text-2xl font-medium mb-2">Select a Design</h3>
            <p className="text-neutral-500">Choose from our templates or upload your own concept.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Upload Custom Option */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${customImagePreview ? 'border-black bg-neutral-50' : 'border-neutral-300 hover:border-black hover:bg-neutral-50'}`}
            >
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              {customImagePreview ? (
                <>
                  <img src={customImagePreview} alt="Custom upload" className="absolute inset-0 w-full h-full object-cover rounded-2xl opacity-50" />
                  <div className="relative z-10 flex flex-col items-center">
                    <CheckCircle2 className="w-8 h-8 text-black mb-2" />
                    <span className="font-medium text-black">Uploaded</span>
                    <span className="text-sm text-black underline mt-2">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-neutral-400 mb-2" />
                  <span className="font-medium text-neutral-600">Upload Your Own</span>
                  <span className="text-sm text-neutral-400">PNG, JPG</span>
                </>
              )}
            </div>

            {/* Predefined Designs */}
            {designs.map(design => (
              <div 
                key={design.id}
                onClick={() => { setSelectedDesignId(design.id); setCustomImageFile(null); setCustomImagePreview(''); }}
                className={`relative aspect-[3/4] rounded-2xl cursor-pointer overflow-hidden group ${selectedDesignId === design.id ? 'ring-4 ring-black ring-offset-2' : ''}`}
              >
                <img src={design.image} alt={design.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-medium">{design.name}</p>
                </div>
                {selectedDesignId === design.id && (
                  <div className="absolute top-4 right-4 bg-white rounded-full p-1">
                    <CheckCircle2 className="w-5 h-5 text-black" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={() => setStep(2)}
              disabled={!selectedDesignId && !customImageFile}
              className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Fabrics
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: FABRIC */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8">
            <h3 className="text-2xl font-medium mb-2">Select Fabric</h3>
            <p className="text-neutral-500">Choose the material for your jerseys.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {fabrics.map(fabric => (
              <div 
                key={fabric.id}
                onClick={() => setSelectedFabricId(fabric.id)}
                className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${selectedFabricId === fabric.id ? 'border-black bg-neutral-50' : 'border-neutral-100 hover:border-neutral-300'}`}
              >
                {fabric.image && (
                  <div className="w-full h-32 rounded-xl mb-4 overflow-hidden">
                    <img src={fabric.image} alt={fabric.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg">{fabric.name}</h4>
                  {selectedFabricId === fabric.id && <CheckCircle2 className="w-5 h-5 text-black" />}
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed">{fabric.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="px-8 py-4 bg-neutral-100 text-neutral-800 rounded-full font-medium hover:bg-neutral-200">
              Back
            </button>
            <button 
              onClick={() => setStep(3)}
              disabled={!selectedFabricId}
              className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Roster
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: ROSTER & DETAILS */}
      {step === 3 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Roster */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-medium mb-2">Team Roster</h3>
                <p className="text-neutral-500">Total Quantity: {roster.length}</p>
              </div>
              <button onClick={addRosterEntry} className="text-sm font-medium px-4 py-2 bg-neutral-100 rounded-full hover:bg-neutral-200">
                + Add Player
              </button>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {roster.map((player, idx) => (
                <div key={idx} className="flex gap-3 items-center bg-white border border-neutral-200 p-3 rounded-xl">
                  <span className="w-6 text-center font-medium text-neutral-400">{idx + 1}</span>
                  <input 
                    type="text" 
                    placeholder="Player Name" 
                    value={player.name}
                    onChange={(e) => updateRosterEntry(idx, 'name', e.target.value)}
                    className="flex-1 bg-neutral-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                  />
                  <input 
                    type="text" 
                    placeholder="Number" 
                    value={player.number}
                    onChange={(e) => updateRosterEntry(idx, 'number', e.target.value)}
                    className="w-20 bg-neutral-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                  />
                  <select 
                    value={player.size}
                    onChange={(e) => updateRosterEntry(idx, 'size', e.target.value)}
                    className="w-20 bg-neutral-50 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black outline-none"
                  >
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="2XL">2XL</option>
                  </select>
                  <button onClick={() => removeRosterEntry(idx)} className="text-neutral-400 hover:text-red-500" disabled={roster.length === 1}>
                    <XCircle size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact & Notes */}
          <div>
            <div className="bg-neutral-50 p-8 rounded-3xl">
              <h3 className="text-2xl font-medium mb-6">Contact Details</h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Your Name *</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none" 
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number *</label>
                  <input 
                    type="tel" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none" 
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Additional Notes</label>
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-black outline-none resize-none h-24" 
                    placeholder="Any special requests regarding logos, colors, or placement..."
                  />
                </div>
              </div>

              <div className="border-t border-neutral-200 pt-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-500">Base Price (Fixed)</span>
                  <span className="font-medium">$49.99</span>
                </div>
                <div className="flex justify-between items-center text-sm text-neutral-400">
                  <span>* Final quote will be negotiated via phone</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="px-6 py-4 bg-white border border-neutral-200 text-neutral-800 rounded-full font-medium hover:bg-neutral-50">
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !customerName || !customerPhone}
                  className="flex-1 py-4 bg-black text-white rounded-full font-medium hover:bg-neutral-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
