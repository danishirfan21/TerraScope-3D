const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const Property = require('./models/Property');

// Configuration: San Francisco Financial District
const BBOX = "37.788,-122.402,37.798,-122.392"; 

/**
 * Fetches building data from OpenStreetMap using the Overpass API
 */
async function fetchOSMData() {
    console.log('📡 Fetching building footprints from OpenStreetMap...');
    
    // Query for all buildings within the bounding box
    const query = `
        [out:json][timeout:25];
        (
          way["building"](${BBOX});
          relation["building"](${BBOX});
        );
        out body;
        >;
        out skel qt;
    `;

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('❌ Error fetching data from Overpass API:', error.message);
        throw error;
    }
}

/**
 * Transforms OSM ways into our Property model format
 */
function transformToGeoJSON(osmData) {
    const nodes = {};
    osmData.elements.filter(e => e.type === 'node').forEach(n => {
        nodes[n.id] = [n.lon, n.lat];
    });

    const buildings = osmData.elements.filter(e => e.type === 'way' && e.tags && e.tags.building);
    
    return buildings.map(way => {
        // Resolve coordinates
        const coordinates = way.nodes.map(nodeId => nodes[nodeId]).filter(coord => coord !== undefined);
        
        // Ensure polygon is closed
        if (coordinates.length > 0 && 
            (coordinates[0][0] !== coordinates[coordinates.length - 1][0] || 
             coordinates[0][1] !== coordinates[coordinates.length - 1][1])) {
            coordinates.push(coordinates[0]);
        }

        // Generate realistic but synthetic properties
        const height = parseInt(way.tags['building:levels']) * 3.5 || parseInt(way.tags.height) || Math.floor(Math.random() * 50) + 10;
        const yearBuilt = way.tags['start_date'] || Math.floor(Math.random() * (2020 - 1900)) + 1900;
        const price = (height * 50000) + (Math.random() * 1000000); // Higher buildings = higher price

        return {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [coordinates]
            },
            properties: {
                address: way.tags['addr:street'] ? `${way.tags['addr:housenumber'] || ''} ${way.tags['addr:street']}` : 'Commercial District Bld.',
                price: Math.round(price),
                height: height,
                yearBuilt: yearBuilt,
                owner: ['Estate Holdings Inc.', 'City Invest Group', 'Skyline Partners', 'Heritage Trust'][Math.floor(Math.random() * 4)],
                landUse: way.tags.office ? 'Commercial' : 'Residential'
            }
        };
    }).filter(b => b.geometry.coordinates[0].length >= 3);
}

/**
 * Main execution
 */
async function harvest() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('❌ MONGODB_URI is missing in .env file');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const osmData = await fetchOSMData();
        const properties = transformToGeoJSON(osmData);

        console.log(`✨ Transformed ${properties.length} buildings. Seeding database...`);

        // Insert into database
        if (properties.length > 0) {
            await Property.insertMany(properties);
            console.log('🚀 Successfully seeded live data from OpenStreetMap!');
        } else {
            console.log('⚠️ No buildings found in this area.');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('💥 Execution failed:', error);
        process.exit(1);
    }
}

harvest();
