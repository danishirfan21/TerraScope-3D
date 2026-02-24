import React, { useEffect, useRef } from 'react';
import {
    Viewer,
    Ion,
    createWorldTerrainAsync,
    Color,
    Cartesian3,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Entity,
    GeoJsonDataSource,
    OpenStreetMapImageryProvider,
    createOsmBuildingsAsync,
    VerticalOrigin,
    Cartesian2,
    EllipsoidTerrainProvider,
    LabelStyle,
    HeightReference
} from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import useStore from '../store/useStore';
import api from '../services/api';

// Set your Cesium Ion access token here
if (import.meta.env.VITE_CESIUM_TOKEN) {
    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;
}

const CesiumViewer = () => {
    const containerRef = useRef(null);
    const viewerRef = useRef(null);
    const dataSourceRef = useRef(null);
    const handlerRef = useRef(null);
    const streetLayerRef = useRef(null);
    const osmBuildingsRef = useRef(null);
    const worldTerrainRef = useRef(null);
    const { setSelectedProperty, selectedProperty, layers, filters, setProperties } = useStore();

    useEffect(() => {
        const initCesium = async () => {
            if (containerRef.current && !viewerRef.current) {
                worldTerrainRef.current = await createWorldTerrainAsync();

                const viewer = new Viewer(containerRef.current, {
                    terrainProvider: layers.terrain ? worldTerrainRef.current : new EllipsoidTerrainProvider(),
                    baseLayerPicker: false,
                    geocoder: false,
                    homeButton: false,
                    sceneModePicker: true,
                    navigationHelpButton: false,
                    animation: false,
                    timeline: false,
                    fullscreenButton: true,
                    requestRenderMode: true,
                });

                // Add OSM Street Layer but hide it initially
                const osmProvider = new OpenStreetMapImageryProvider({
                    url: 'https://a.tile.openstreetmap.org/'
                });
                streetLayerRef.current = viewer.imageryLayers.addImageryProvider(osmProvider);
                streetLayerRef.current.show = false;

                // Add OSM Buildings but hide it initially
                const buildingsTileset = await createOsmBuildingsAsync();
                osmBuildingsRef.current = viewer.scene.primitives.add(buildingsTileset);
                osmBuildingsRef.current.show = false;

                viewer.camera.setView({
                    destination: Cartesian3.fromDegrees(-122.397, 37.793, 1000),
                    orientation: {
                        heading: 0.0,
                        pitch: -0.5,
                        roll: 0.0
                    }
                });

                viewerRef.current = viewer;

                // Setup Click Handler
                const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
                handlerRef.current = handler;
                handler.setInputAction((click) => {
                    const pickedObject = viewer.scene.pick(click.position);
                    if (pickedObject && pickedObject.id instanceof Entity) {
                        const entity = pickedObject.id;
                        const props = entity.properties.getValue(viewer.clock.currentTime);
                        setSelectedProperty({ ...props, cesiumId: entity.id });

                        // Highlight logic
                        dataSourceRef.current.entities.values.forEach(e => {
                            if (e.polygon) {
                                e.polygon.outlineColor = Color.BLACK;
                                e.polygon.outlineWidth = 1;
                            }
                        });
                        if (entity.polygon) {
                            entity.polygon.outlineColor = Color.YELLOW;
                            entity.polygon.outlineWidth = 3;
                        }

                    } else {
                        setSelectedProperty(null);
                        if (dataSourceRef.current) {
                            dataSourceRef.current.entities.values.forEach(e => {
                                if (e.polygon) {
                                    e.polygon.outlineColor = Color.BLACK;
                                    e.polygon.outlineWidth = 1;
                                }
                            });
                        }
                    }
                }, ScreenSpaceEventType.LEFT_CLICK);

                // Load Data
                loadPropertyData(viewer);
            }
        };

        const loadPropertyData = async (viewer) => {
            try {
                const data = await api.getProperties();
                setProperties(data.features);

                const dataSource = await GeoJsonDataSource.load(data, {
                    clampToGround: true
                });

                viewer.dataSources.add(dataSource);
                dataSourceRef.current = dataSource;

                const entities = dataSource.entities.values;
                entities.forEach((entity) => {
                    const props = entity.properties.getValue(viewer.clock.currentTime);
                    const height = props.height || 10;
                    const price = props.price || 0;

                    if (entity.polygon) {
                        entity.polygon.extrudedHeight = height;
                        entity.polygon.material = getPriceColor(price);
                        entity.polygon.outline = true;
                        entity.polygon.outlineColor = Color.BLACK;
                    }

                    // Add Label
                    entity.label = {
                        text: props.address,
                        font: '14px sans-serif',
                        fillColor: Color.WHITE,
                        outlineColor: Color.BLACK,
                        outlineWidth: 2,
                        style: LabelStyle.FILL_AND_OUTLINE,
                        verticalOrigin: VerticalOrigin.BOTTOM,
                        pixelOffset: new Cartesian2(0, -20),
                        heightReference: HeightReference.CLAMP_TO_GROUND,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY, // Ensure label is visible
                        show: false
                    };
                });
            } catch (error) {
                console.error('Failed to load properties into Cesium:', error);
            }
        };

        initCesium();

        return () => {
            if (handlerRef.current) {
                handlerRef.current.destroy();
            }
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    const getPriceColor = (price, heatmapEnabled) => {
        if (!heatmapEnabled) return Color.WHITE.withAlpha(0.6);
        if (price > 2000000) return Color.RED.withAlpha(0.6);
        if (price > 1000000) return Color.ORANGE.withAlpha(0.6);
        return Color.GREEN.withAlpha(0.6);
    };

    // Handle flyTo when selectedProperty changes from outside (e.g. search)
    useEffect(() => {
        if (viewerRef.current && selectedProperty && dataSourceRef.current) {
            const entity = dataSourceRef.current.entities.getById(selectedProperty.cesiumId || selectedProperty.id);
            if (entity) {
                viewerRef.current.flyTo(entity, {
                    offset: {
                        heading: 0,
                        pitch: -0.5,
                        range: 500
                    }
                });
            }
        }
    }, [selectedProperty]);

    // Handle layer visibility and filtering
    useEffect(() => {
        if (viewerRef.current) {
            // Toggle Satellite
            if (viewerRef.current.imageryLayers.length > 0) {
                viewerRef.current.imageryLayers.get(0).show = layers.satellite;
            }

            // Toggle Street (OSM)
            if (streetLayerRef.current) {
                streetLayerRef.current.show = layers.street;
            }

            // Toggle OSM Buildings
            if (osmBuildingsRef.current) {
                osmBuildingsRef.current.show = layers.osmBuildings;
            }

            // Toggle Terrain
            if (viewerRef.current && worldTerrainRef.current) {
                const currentIsTerrain = !(viewerRef.current.terrainProvider instanceof EllipsoidTerrainProvider);
                if (layers.terrain !== currentIsTerrain) {
                    viewerRef.current.terrainProvider = layers.terrain
                        ? worldTerrainRef.current
                        : new EllipsoidTerrainProvider();
                }
            }

            if (dataSourceRef.current) {
                dataSourceRef.current.show = layers.buildings;

                dataSourceRef.current.entities.values.forEach(entity => {
                    const props = entity.properties.getValue(viewerRef.current.clock.currentTime);

                    // Update Color based on Heatmap toggle
                    if (entity.polygon) {
                        entity.polygon.material = getPriceColor(props.price, layers.heatmap);
                    }

                    // Filtering logic
                    const isVisible = props.price >= filters.minPrice &&
                                    props.price <= filters.maxPrice &&
                                    (filters.searchQuery === '' ||
                                     props.address.toLowerCase().includes(filters.searchQuery.toLowerCase()));
                    entity.show = isVisible;

                    // Toggle label visibility
                    if (entity.label) {
                        entity.label.show = isVisible && layers.labels;
                    }
                });
                viewerRef.current.scene.requestRender();
            }
        }
    }, [layers.satellite, layers.buildings, layers.heatmap, layers.street, layers.osmBuildings, layers.labels, layers.terrain, filters]);

    return (
        <div 
            ref={containerRef} 
            className="cesium-container"
            style={{ width: '100%', height: '100%', position: 'absolute' }} 
        />
    );
};

export default CesiumViewer;
