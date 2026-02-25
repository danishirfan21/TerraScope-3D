import { create } from 'zustand';

// Business logic for Enterprise Spatial Intelligence
export const calculateMomentum = (yieldVal = 0, appreciation = 0, risk = 0) => {
  // Enterprise weighted formula
  const score = (yieldVal * 0.4) + (appreciation * 0.5) - (risk * 0.1);
  return Number(Math.max(0, Math.min(10, score)).toFixed(1));
};

export const calculateInvestmentScore = (prop) => {
  if (!prop) return 0;
  const yieldVal = prop.yield || 0;
  const appreciation = prop.appreciationRate || 0;
  const risk = prop.zoningRisk || 0;
  const density = (prop.height || 10) / 100; // Mock density factor

  const score = (yieldVal * 300) + (appreciation * 400) - (risk * 20) + (density * 50);
  return Number(Math.max(0, Math.min(100, score)).toFixed(0));
};

const useStore = create((set, get) => ({
    properties: [],
    selectedProperty: null,
    isInvestorMode: false,
    marketMomentum: 68, // Default enterprise momentum
    cityStats: {
        avgROI: 5.4,
        totalValue: 8400000000,
        propertyCount: 0,
        hotZones: ['Downtown', 'Financial District', 'SoMa']
    },
    topOpportunities: [],

    filters: {
        minPrice: 0,
        maxPrice: 5000000,
        searchQuery: '',
        showImputed: false
    },

    layers: {
        satellite: true,
        buildings: true,
        heatmap: false,
        zoning: false,
        density: false,
        labels: false,
        terrain: true,
    },

    setProperties: (properties) => {
        // When properties are updated, calculate top opportunities
        const sorted = [...properties]
            .map(p => {
                const props = p.properties || p;
                const momentum = calculateMomentum(props.yield, props.appreciationRate, props.zoningRisk);
                const investmentScore = calculateInvestmentScore(props);
                // Attach score to the property object for UI display
                if (p.properties) {
                    p.properties.investmentScore = investmentScore;
                } else {
                    p.investmentScore = investmentScore;
                }
                return { ...p, momentum };
            })
            .sort((a, b) => b.momentum - a.momentum)
            .slice(0, 5);

        set({
            properties,
            topOpportunities: sorted.map(s => s.properties || s)
        });
    },

    setSelectedProperty: (property) => set({ selectedProperty: property }),

    setInvestorMode: (isInvestorMode) => set({ isInvestorMode }),

    setCityStats: (stats) => set((state) => ({
        cityStats: { ...state.cityStats, ...stats }
    })),

    updateFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),

    toggleLayer: (layer) => set((state) => ({
        layers: { ...state.layers, [layer]: !state.layers[layer] }
    })),

    // Triggered when data needs recalculation
    calculateMomentum: () => {
        const { properties } = get();
        const sorted = [...properties]
            .map(p => {
                const props = p.properties || p;
                const momentum = calculateMomentum(props.yield, props.appreciationRate, props.zoningRisk);
                const investmentScore = calculateInvestmentScore(props);
                if (p.properties) {
                    p.properties.investmentScore = investmentScore;
                } else {
                    p.investmentScore = investmentScore;
                }
                return { ...p, momentum };
            })
            .sort((a, b) => b.momentum - a.momentum)
            .slice(0, 5);
        set({ topOpportunities: sorted.map(s => s.properties || s) });
    }
}));

export default useStore;
