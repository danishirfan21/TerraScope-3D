import { create } from 'zustand';

const useStore = create((set) => ({
    properties: [],
    selectedProperty: null,
    filters: {
        minPrice: 0,
        maxPrice: 5000000,
        searchQuery: ''
    },
    layers: {
        satellite: true,
        buildings: true,
        heatmap: false
    },
    setProperties: (properties) => set({ properties }),
    setSelectedProperty: (property) => set({ selectedProperty: property }),
    updateFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),
    toggleLayer: (layer) => set((state) => ({
        layers: { ...state.layers, [layer]: !state.layers[layer] }
    })),
}));

export default useStore;
