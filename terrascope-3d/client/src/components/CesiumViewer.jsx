import React, { useEffect, useRef, useState } from 'react';
import {
    Viewer,
    Ion,
    Color,
    Cartesian3,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Entity,
    GeoJsonDataSource,
    LabelStyle,
    VerticalOrigin,
    Cartesian2,
    HeightReference,
    CallbackProperty,
    Math as CesiumMath,
    EllipsoidTerrainProvider,
    ColorMaterialProperty
} from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";
import useStore from '../store/useStore';
import api from '../services/api';
import useCameraLogic from '../hooks/useCameraLogic';

if (import.meta.env.VITE_CESIUM_TOKEN) {
    Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN;
}

const CesiumViewer = () => {
    const containerRef = useRef(null);
    const viewerRef = useRef(null);
    const dataSourceRef = useRef(null);
    const lastBboxRef = useRef("");
    const [statsFetched, setStatsFetched] = useState(false);

    const {
        setSelectedProperty,
        selectedProperty,
        layers,
        filters,
        setProperties,
        topOpportunities,
        calculateMomentum,
        isInvestorMode,
        toggleLayer,
        setCityStats
    } = useStore();

    /**
     * Technical Optimization: Store Ref Sync
     * We sync the React state to a Ref so that Cesium's WebGL callback properties
     * (which run outside the React render cycle) can always access the freshest
     * data without triggering expensive entity re-renders.
     */
    const stateRef = useRef({ selectedProperty, layers, filters, topOpportunities, isInvestorMode });
    useEffect(() => {
        stateRef.current = { selectedProperty, layers, filters, topOpportunities, isInvestorMode };
        // Request a frame when state changes if in requestRenderMode
        if (viewerRef.current) viewerRef.current.scene.requestRender();
    }, [selectedProperty, layers, filters, topOpportunities, isInvestorMode]);

    const { flyToCityOverview, flyToProperty, orbitProperty } = useCameraLogic(viewerRef);

    /**
     * Lazy-Loading Strategy: BBOX Filtering
     * To support 1000+ buildings without client-side lag, we only fetch
     * data for the visible region.
     * Threshold: We use a 4-decimal precision BBOX string to avoid
     * redundant fetches on micro-movements while ensuring coverage.
     */
    const fetchVisibleProperties = async () => {
        if (!viewerRef.current) return;

        const viewer = viewerRef.current;
        const rect = viewer.camera.computeViewRectangle();
        if (!rect) return;

        // Convert Rectangle to BBOX string: minLng,minLat,maxLng,maxLat
        const bbox = `${CesiumMath.toDegrees(rect.west).toFixed(4)},${CesiumMath.toDegrees(rect.south).toFixed(4)},${CesiumMath.toDegrees(rect.east).toFixed(4)},${CesiumMath.toDegrees(rect.north).toFixed(4)}`;

        // Performance optimization: prevent duplicate API calls if BBOX hasn't changed significantly
        if (bbox === lastBboxRef.current) return;
        lastBboxRef.current = bbox;

        try {
            const { filters } = stateRef.current;
            const data = await api.getProperties({
                bbox,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                search: filters.searchQuery
            });

            setProperties(data.features);
            updateDataSource(data);
            calculateMomentum();

            // Fetch city-wide stats once
            if (!statsFetched) {
                const stats = await api.getCityAnalytics();
                setCityStats(stats);
                setStatsFetched(true);
            }
        } catch (err) {
            console.error("Fetch error", err);
        }
    };

    const updateDataSource = async (data) => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        if (dataSourceRef.current) {
            viewer.dataSources.remove(dataSourceRef.current);
        }

        const dataSource = await GeoJsonDataSource.load(data, { clampToGround: true });
        viewer.dataSources.add(dataSource);
        dataSourceRef.current = dataSource;

        dataSource.entities.values.forEach(entity => {
            const props = entity.properties.getValue(viewer.clock.currentTime);
            applyEntityStyle(entity, props);
        });
    };

    // 2. Advanced Styling (HSL Gradients, Pulse)
    const applyEntityStyle = (entity, props) => {
        const height = props.height || 10;
        const price = props.price || 500000;

        if (entity.polygon) {
            entity.polygon.extrudedHeight = height;
            entity.polygon.outline = true;
            entity.polygon.outlineColor = Color.BLACK.withAlpha(0.3);

            // Dynamic Material with Selection & State
            entity.polygon.material = new ColorMaterialProperty(new CallbackProperty((time, result) => {
                const { selectedProperty, layers, isInvestorMode, topOpportunities } = stateRef.current;
                const isTop = topOpportunities.some(op => (op.address || op.properties?.address) === props.address);

                // Selection Pulse (Blue)
                if (selectedProperty && (selectedProperty.cesiumId === entity.id || selectedProperty.address === props.address)) {
                    const pulse = (Math.sin(Date.now() / 200) + 1) / 2;
                    return Color.fromHsl(0.55, 0.8, 0.4 + pulse * 0.2, 0.9).clone(result);
                }

                // Focus Mode: Dim non-selected buildings
                if (selectedProperty) {
                    return Color.WHITE.withAlpha(0.05).clone(result);
                }

                // Top Opportunity Pulse (Gold)
                if (isTop && isInvestorMode) {
                    const pulse = (Math.sin(Date.now() / 400) + 1) / 2;
                    return Color.fromHsl(0.12, 0.9, 0.4 + pulse * 0.2, 0.8).clone(result);
                }

                // Layer Modes
                if (layers.zoning) {
                    const zoneColors = {
                        'Residential': Color.YELLOW, 'Commercial': Color.RED,
                        'Industrial': Color.PURPLE, 'Mixed-Use': Color.ORANGE, 'Public': Color.BLUE
                    };
                    return (zoneColors[props.landUse] || Color.GRAY).withAlpha(0.7).clone(result);
                }

                if (layers.density) {
                    const h = Math.min(height / 100, 1);
                    const alpha = Math.max(0.4, 0.8 - (height / 500));
                    return Color.fromHsl(0.35, 0.8, 0.2 + h * 0.6, alpha).clone(result);
                }

                if (layers.heatmap) {
                    const p = Math.min((price - 500000) / 5000000, 1);
                    const alpha = Math.max(0.4, 0.8 - (height / 500));
                    return Color.fromHsl((1 - p) * 0.35, 0.9, 0.5, alpha).clone(result);
                }

                if (layers.investmentScore) {
                    const score = props.investmentScore || 50;
                    const p = score / 100;
                    const alpha = Math.max(0.4, 0.8 - (height / 500));
                    // Green for high score (0.35), Red for low (0)
                    return Color.fromHsl(p * 0.35, 0.9, 0.5, alpha).clone(result);
                }

                // Default Enterprise Glassy look - Alpha mapping by height for spatial depth
                const hAlpha = Math.max(0.1, 0.5 - (height / 500));
                return Color.WHITE.withAlpha(hAlpha).clone(result);
            }, false));
        }

        entity.label = {
            text: props.address,
            font: '12px Inter, sans-serif',
            fillColor: Color.WHITE,
            outlineColor: Color.BLACK,
            outlineWidth: 2,
            style: LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: VerticalOrigin.BOTTOM,
            pixelOffset: new Cartesian2(0, -height - 10),
            heightReference: HeightReference.RELATIVE_TO_GROUND,
            show: stateRef.current.layers.labels || false,
            disableDepthTestDistance: 1000
        };
    };

    // 3. Initialization & Resource Lifecycle Management
    useEffect(() => {
        let viewer;
        const init = async () => {
            if (containerRef.current && !viewerRef.current) {
                viewer = new Viewer(containerRef.current, {
                    terrainProvider: new EllipsoidTerrainProvider(),
                    baseLayerPicker: false,
                    geocoder: false,
                    homeButton: false,
                    animation: false,
                    timeline: false,
                    /**
                     * Performance Optimization: requestRenderMode
                     * Instead of rendering at 60FPS constantly (which drains battery and CPU),
                     * we only render when the camera moves or data changes.
                     */
                    requestRenderMode: true,
                    maximumRenderTimeChange: 0.0,
                    infoBox: false,
                    selectionIndicator: false,
                });

                viewer.camera.setView({
                    destination: Cartesian3.fromDegrees(-122.419, 37.7745, 1200),
                    orientation: { heading: 0, pitch: -0.6, roll: 0 }
                });

                viewerRef.current = viewer;

                const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
                handler.setInputAction((click) => {
                    const picked = viewer.scene.pick(click.position);
                    if (picked && picked.id instanceof Entity) {
                        const props = picked.id.properties.getValue(viewer.clock.currentTime);
                        setSelectedProperty({ ...props, cesiumId: picked.id.id, properties: props });
                    } else {
                        setSelectedProperty(null);
                    }
                }, ScreenSpaceEventType.LEFT_CLICK);

                // Constraint tilt
                viewer.scene.screenSpaceCameraController.minimumPitch = CesiumMath.toRadians(-90);
                viewer.scene.screenSpaceCameraController.maximumPitch = CesiumMath.toRadians(-10);

                viewer.camera.moveEnd.addEventListener(fetchVisibleProperties);
                fetchVisibleProperties();
            }
        };
        init();

        return () => {
            if (viewer) {
                viewer.camera.moveEnd.removeEventListener(fetchVisibleProperties);
                viewer.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    // 4. Listeners for UI Events
    useEffect(() => {
        const handleCityOverview = () => {
            flyToCityOverview();
            if (!layers.heatmap) toggleLayer('heatmap');
        };
        window.addEventListener('city-overview', handleCityOverview);
        return () => window.removeEventListener('city-overview', handleCityOverview);
    }, [layers]);

    // Fly to selected property
    useEffect(() => {
        if (selectedProperty && dataSourceRef.current) {
            const entity = dataSourceRef.current.entities.getById(selectedProperty.cesiumId);
            if (entity) flyToProperty(entity);
        }
    }, [selectedProperty]);

    // Orbit handler
    useEffect(() => {
        const handleOrbit = (e) => {
            if (!dataSourceRef.current) return;
            const entity = dataSourceRef.current.entities.getById(e.detail.cesiumId);
            if (entity) orbitProperty(entity);
        };
        window.addEventListener('orbit-property', handleOrbit);
        return () => window.removeEventListener('orbit-property', handleOrbit);
    }, [dataSourceRef.current]);

    // Toggle base layers
    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.imageryLayers.get(0).show = layers.satellite;
            if (dataSourceRef.current) dataSourceRef.current.show = layers.buildings;
            viewerRef.current.scene.requestRender();
        }
    }, [layers.satellite, layers.buildings]);

    return (
        <div ref={containerRef} className="cesium-viewer" style={{ width: '100%', height: '100%', position: 'absolute' }} />
    );
};

export default CesiumViewer;
