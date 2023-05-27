import {
  EventManager,
  ReactThreeFiber,
  useFrame,
  useThree,
} from '@react-three/fiber';
import * as React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

class Impl extends OrbitControls {
  constructor(
    object: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    domElement?: HTMLElement
  ) {
    super(object, domElement);

    this.screenSpacePanning = false; // pan orthogonal to world-space direction camera.up

    this.mouseButtons.LEFT = THREE.MOUSE.PAN;
    this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

    this.touches.ONE = THREE.TOUCH.PAN;
    this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  }
}

export type CustomControlsProps = ReactThreeFiber.Overwrite<
  ReactThreeFiber.Object3DNode<Impl, typeof Impl>,
  {
    target?: ReactThreeFiber.Vector3;
    camera?: THREE.Camera;
    makeDefault?: boolean;
    onChange?: (e?: THREE.Event) => void;
    onStart?: (e?: THREE.Event) => void;
    onEnd?: (e?: THREE.Event) => void;
    domElement?: HTMLElement;
  }
>;

export const CustomControls = React.forwardRef<Impl, CustomControlsProps>(
  (props = { enableDamping: true }, ref) => {
    const {
      domElement,
      camera,
      makeDefault,
      onChange,
      onStart,
      onEnd,
      ...rest
    } = props;
    const invalidate = useThree((state) => state.invalidate);
    const defaultCamera = useThree((state) => state.camera);
    const gl = useThree((state) => state.gl);
    const events = useThree(
      (state) => state.events
    ) as EventManager<HTMLElement>;
    const set = useThree((state) => state.set);
    const get = useThree((state) => state.get);
    const explDomElement = (domElement ||
      events.connected ||
      gl.domElement) as HTMLElement;

    const explCamera = camera || defaultCamera;
    const controls = React.useMemo(
      () => new Impl(explCamera as any),
      [explCamera]
    );

    React.useEffect(() => {
      controls.connect(explDomElement);
      const callback = (e: THREE.Event) => {
        invalidate();
        if (onChange) onChange(e);
      };
      controls.addEventListener('change', callback);

      if (onStart) controls.addEventListener('start', onStart);
      if (onEnd) controls.addEventListener('end', onEnd);

      return () => {
        controls.dispose();
        controls.removeEventListener('change', callback);
        if (onStart) controls.removeEventListener('start', onStart);
        if (onEnd) controls.removeEventListener('end', onEnd);
      };
    }, [onChange, onStart, onEnd, controls, invalidate, explDomElement]);

    React.useEffect(() => {
      if (makeDefault) {
        const old = get().controls;
        set({ controls });
        return () => set({ controls: old });
      }
    }, [makeDefault, controls]);

    useFrame(() => controls.update(), -1);

    return <primitive ref={ref} object={controls} enableDamping {...rest} />;
  }
);
