import { Cartesian3, Math as CesiumMath, Matrix4, HeadingPitchRange } from 'cesium';

const useCameraLogic = (viewerRef) => {

    const flyToCityOverview = () => {
        if (!viewerRef.current) return;
        viewerRef.current.camera.flyTo({
            destination: Cartesian3.fromDegrees(-122.419, 37.7745, 2500),
            orientation: {
                heading: CesiumMath.toRadians(0),
                pitch: CesiumMath.toRadians(-35),
                roll: 0.0
            },
            duration: 3.0
        });
    };

    const flyToProperty = (entity) => {
        if (!viewerRef.current || !entity) return;
        viewerRef.current.flyTo(entity, {
            offset: {
                heading: CesiumMath.toRadians(0),
                pitch: CesiumMath.toRadians(-45),
                range: 400
            },
            duration: 2.0
        });
    };

    const orbitProperty = (entity) => {
        if (!viewerRef.current || !entity) return;
        const viewer = viewerRef.current;

        // Remove any existing orbit listeners if we wanted to be robust
        // For now, let's just implement a clean orbit

        const removeListener = viewer.clock.onTick.addEventListener(() => {
            const time = viewer.clock.currentTime;
            const modelMatrix = entity.computeModelMatrix(time);
            if (!modelMatrix) {
                removeListener();
                return;
            }

            const angle = Date.now() / 5000;
            const range = 500;

            viewer.camera.lookAtTransform(
                modelMatrix,
                new Cartesian3(range * Math.cos(angle), range * Math.sin(angle), 250)
            );

            // Stop orbit if user clicks or Esc?
            // We can just keep it until they click elsewhere which changes selectedProperty
        });

        // To allow breaking out of orbit:
        const stopOrbit = () => {
            removeListener();
            viewer.camera.lookAtTransform(Matrix4.IDENTITY);
        };

        // Auto-stop on click elsewhere
        const handler = (e) => {
            stopOrbit();
            window.removeEventListener('click', handler);
        };
        setTimeout(() => window.addEventListener('mousedown', handler), 100);
    };

    return {
        flyToCityOverview,
        flyToProperty,
        orbitProperty
    };
};

export default useCameraLogic;
