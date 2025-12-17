import React, { useState } from 'react';
import { Search, Wrench, Truck, Package } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    name: 'Aluminium Ladder assorted type',
    type: 'TOOL',
    quantity: 535,
    image: '/plant-ladder.png',
  },
  {
    name: 'Scaffolding Planks',
    type: 'TOOL',
    quantity: 18570,
    image: '/plant-planks.png',
  },
  {
    name: 'Scaffolding Vertical & Ledger',
    type: 'TOOL',
    quantity: 16313,
    image: '/plant-ledger.png',
  },
  {
    name: 'Scaffolding Clamp assorted type',
    type: 'TOOL',
    quantity: 113444,
    image: '/plant-clamp.png',
  },
  {
    name: 'Scaffolding Pipe',
    type: 'EQUIPMENT',
    quantity: 84083,
    image: '/plant-pipe.png',
  },
  {
    name: 'Chain Pulley Block 5t - 10t',
    type: 'TOOL',
    quantity: 150,
    image: '/plant-chainpulley.png',
  },
  {
    name: 'Dshackle',
    type: 'TOOL',
    quantity: 280,
    image: '/plant-dshackle.png',
  },
  {
    name: 'Wire Rope Sling 52mm & 80mm',
    type: 'TOOL',
    quantity: 12,
    image: '/plant-ropesling.png',
  },
  {
    name: 'Magnetic Base Drill M/c',
    type: 'TOOL',
    quantity: 15,
    image: '/plant-magneticdrill.png',
  },
  {
    name: 'Hydraulic Press',
    type: 'TOOL',
    quantity: 1,
    image: '/plant-hydraulicpress.png',
  },
  {
    name: 'Plate Bending Machine',
    type: 'TOOL',
    quantity: 3,
    image: '/plant-bending.png',
  },
  {
    name: 'Compressor 13 CFM',
    type: 'TOOL',
    quantity: 6,
    image: '/plant-compressor.png',
  },
  {
    name: 'Auto Beveling Machine',
    type: 'TOOL',
    quantity: 1,
    image: '/plant-beveling.png',
  },
  {
    name: 'Plasma Cutting Machine',
    type: 'TOOL',
    quantity: 7,
    image: '/plant-plasma.png',
  },
  {
    name: 'Welding Machine',
    type: 'TOOL',
    quantity: 144,
    image: '/plant-welding.png',
  },
  {
    name: 'Power Pack 7.5 HP',
    type: 'TOOL',
    quantity: 1,
    image: '/plant-powerpack7.png',
  },
  {
    name: 'Vertical Hydraulic Jack 12t',
    type: 'TOOL',
    quantity: 13,
    image: '/plant-jack12.png',
  },
  {
    name: 'Power Pack 20 HP',
    type: 'TOOL',
    quantity: 2,
    image: '/plant-powerpack20.png',
  },
  {
    name: 'Vertical Hydraulic Jack 25t',
    type: 'TOOL',
    quantity: 60,
    image: '/plant-jack25.png',
  },
  {
    name: 'Farana F15',
    type: 'TOOL',
    quantity: 2,
    image: '/plant-farana15.png',
  },
  {
    name: 'FARANA F-20',
    type: 'TOOL',
    quantity: 2,
    image: '/plant-farana20.png',
  },
  {
    name: 'FARANA F-17',
    type: 'TOOL',
    quantity: 3,
    image: '/plant-farana17.png',
  },
  {
    name: 'Office Container',
    type: 'EQUIPMENT',
    quantity: 12,
    image: '/plant-container.png',
  },
];


const Plant = () => {
  const [search, setSearch] = useState('');
  const filtered = items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        
          {/* Header */}
        <div className="text-center mb-16 animate-fade-in relative z-10">
           <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-navy relative inline-block">
             Tool,Plants & Machinery
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-blue-600 rounded-full"></div>
           </h1>
           
           <div className="max-w-xl mx-auto mt-8">
              <div className="relative group">
                  <Input
                    type="text"
                    placeholder="SEARCH..."
                    className="w-full pl-6 h-12 rounded-lg border border-gray-200 bg-white shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500 transition-all uppercase text-sm tracking-widest placeholder:text-gray-400 font-light"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                     <Search className="h-4 w-4 text-gray-400" />
                  </div>
              </div>
           </div>
        </div>

        {/* List Layout */}
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground bg-white rounded-xl shadow-sm border border-dashed border-gray-200">
               <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
               <p className="text-xl">No matching items found</p>
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 p-6 flex flex-col md:flex-row items-center gap-6">
                 {/* Image */}
                 <div className="shrink-0">
                    <div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                       <img
                         src={item.image}
                         alt={item.name}
                         className="max-w-full max-h-full object-contain"
                         onError={e => { e.target.style.display = 'none'; }}
                       />
                       {/* Fallback Icon if Image Fails (handled by onError hiding img) */}
                       <Wrench className="w-8 h-8 text-gray-300 absolute -z-10" /> 
                    </div>
                 </div>
                 
                 {/* Content */}
                 <div className="flex-1 text-center md:text-left w-full">
                    <h3 className="font-bold text-lg text-navy mb-1">{item.name}</h3>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
                      {item.type}
                    </div>
                 </div>

                 {/* Quantity */}
                 <div className="text-center md:text-right shrink-0 min-w-[100px]">
                    <div className="text-[10px] text-gray-400 font-medium mb-1">Quantity</div>
                    <div className="text-xl md:text-2xl font-bold text-navy">{item.quantity.toLocaleString()}</div>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Plant;