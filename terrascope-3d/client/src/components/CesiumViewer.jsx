import React, { useEffect, useRef } from 'react';
import { Viewer } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

const CesiumViewer = () => {
    const viewerRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && !viewerRef.current) {
            viewerRef.current = new Viewer(containerRef.current, {
                terrainProvider: undefined, // Add terrain provider here
                baseLayerPicker: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                navigationHelpButton: false,
                animation: false,
                timeline: false,
                fullscreenButton: false,
            });
        }

        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            id="cesium-container" 
            style={{ width: '100%', height: '100%', position: 'absolute' }} 
        />
    );
};

export default CesiumViewer;
