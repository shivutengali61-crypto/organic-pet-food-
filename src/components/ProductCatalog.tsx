import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { PetFoodProduct, ProductCategory, Species } from '../types';
import { ProductVisual } from './ProductVisual';
import { Search, Plus, Check, Star, Sparkles, Eye, ShieldCheck, Zap } from 'lucide-react';

interface ProductCatalogProps {
  onSelectProduct: (product: PetFoodProduct) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onSelectProduct }) => {
  const { products, addToCart, activePet } = useRealtime();
  
  const [speciesFilter, setSpeciesFilter] = useState<'all' | Species>('all');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  const filteredProducts = products.filter(product => {
    // Species filter
    if (speciesFilter !== 'all') {
      if (product.species !== 'both' && product.species !== speciesFilter) {
        return false;
      }
    }

    // Category filter
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchSubtitle = product.subtitle.toLowerCase().includes(q);
      const matchIngredient = product.keyIngredients.some(ing => ing.toLowerCase().includes(q));
      if (!matchName && !matchSubtitle && !matchIngredient) {
        return false;
      }
    }

    return true;
  });

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product: PetFoodProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    const chosenSize = selectedSizes[product.id] || product.weightOptions[0].size;
    addToCart(product, chosenSize, false);
    
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1400);
  };

  return (
    <section id="organic-food" className="py-16 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-stone-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Regenerative Organic Pantry
          </div>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight mt-1">
            Certified Organic Pet Food
          </h2>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Humanely raised proteins, zero synthetics, and small-batch preparation for optimal canine & feline vitality.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ingredients, formulas..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 placeholder:text-stone-400 transition-colors"
          />
        </div>
      </div>

      {/* Filter Bar: Segmented controls (valid interactive buttons) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-stone-100">
        {/* Species Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg self-start">
          <button
            onClick={() => setSpeciesFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              speciesFilter === 'all' 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Companions
          </button>
          <button
            onClick={() => setSpeciesFilter('dog')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              speciesFilter === 'dog' 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dogs
          </button>
          <button
            onClick={() => setSpeciesFilter('cat')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              speciesFilter === 'cat' 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Cats
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-[#163324] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            All Formulas
          </button>
          <button
            onClick={() => setCategoryFilter('raw-freeze-dried')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              categoryFilter === 'raw-freeze-dried'
                ? 'bg-[#163324] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Freeze-Dried Raw
          </button>
          <button
            onClick={() => setCategoryFilter('slow-cooked-stew')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              categoryFilter === 'slow-cooked-stew'
                ? 'bg-[#163324] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Slow-Cooked Stews
          </button>
          <button
            onClick={() => setCategoryFilter('bone-broth-topper')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              categoryFilter === 'bone-broth-topper'
                ? 'bg-[#163324] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Collagen Broths
          </button>
          <button
            onClick={() => setCategoryFilter('sensitive-digestion')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              categoryFilter === 'sensitive-digestion'
                ? 'bg-[#163324] text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            Sensitive Stomach
          </button>
        </div>
      </div>

      {/* Recommended for current pet notice */}
      {activePet && (
        <div className="flex items-center gap-2 py-3 text-xs text-stone-600">
          <span className="font-semibold text-emerald-800">Pet Tailoring Active:</span>
          <span>Showing whole organic foods suitable for {activePet.name} ({activePet.breed}, {activePet.weightLbs} lbs)</span>
        </div>
      )}

      {/* Product Grid: Strict 3-column desktop layout with generous gap */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 mt-6">
          <p className="text-stone-600 text-sm">No organic recipes match your current filter selections.</p>
          <button
            onClick={() => { setSpeciesFilter('all'); setCategoryFilter('all'); setSearchQuery(''); }}
            className="mt-3 text-xs font-semibold text-emerald-700 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {filteredProducts.map((product) => {
            const currentSelectedSize = selectedSizes[product.id] || product.weightOptions[0].size;
            const sizeOption = product.weightOptions.find(o => o.size === currentSelectedSize) || product.weightOptions[0];
            const displayPrice = (product.price * sizeOption.priceMultiplier).toFixed(2);
            const isJustAdded = justAddedId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group flex flex-col bg-white rounded-2xl border border-stone-200/90 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5"
              >
                {/* Image Container: 65-70% visual presence */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <ProductVisual product={product} />

                  {/* Stock notice without pill */}
                  {product.stockCount <= 8 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono tabular-nums text-amber-300">
                      Only {product.stockCount} left in batch
                    </div>
                  )}

                  {/* Hover Quick View Trigger */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-stone-900 text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      View Nutrition & Sizing
                    </span>
                  </div>
                </div>

                {/* Card Content: Consistent field order & typography */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    {/* Brand / Category unboxed text metadata */}
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="uppercase tracking-wider text-[11px] font-medium text-emerald-800">
                        {product.category.replace(/-/g, ' ')}
                      </span>
                      <div className="flex items-center gap-1 text-stone-700 font-mono text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="tabular-nums font-semibold">{product.rating}</span>
                        <span className="text-stone-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-900 transition-colors line-clamp-1">
                      {product.name}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {product.subtitle}
                    </p>
                  </div>

                  {/* Key ingredients unboxed preview */}
                  <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-100">
                    <span className="text-stone-400">Core: </span>
                    <span>{product.keyIngredients.slice(0, 3).join(', ')}</span>
                  </div>

                  {/* Weight Selector & Purchase Row */}
                  <div className="space-y-3 pt-2 border-t border-stone-100">
                    {/* Size Selector Buttons */}
                    <div className="flex items-center gap-1.5">
                      {product.weightOptions.map((opt) => (
                        <button
                          key={opt.size}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSizeChange(product.id, opt.size);
                          }}
                          className={`flex-1 py-1 px-1.5 text-[11px] font-medium rounded-md border text-center transition-colors truncate ${
                            currentSelectedSize === opt.size
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {opt.size.split(' ')[0]} {opt.size.split(' ')[1]}
                        </button>
                      ))}
                    </div>

                    {/* Price and Add to Cart Action */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-lg font-bold font-mono tabular-nums text-stone-950">
                          ₹{Math.round(Number(displayPrice)).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Subscribe & Save 10%: ₹{Math.round(Number(displayPrice) * 0.9).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#163324] hover:bg-[#1f4531] text-white shadow-sm'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
