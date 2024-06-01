import {
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
} from '@mui/material';
import { mapValues } from 'lodash';
import { createContext, useContext, useMemo } from 'react';
import { useAsync } from 'react-use';
import { Texture, TextureLoader } from 'three';
import { values } from '@card-engine-nx/basic';
import { Material } from '../types';

type MaterialDefiniton = { color: string; roughness: string; normal: string };

type TextureContextProps = {
  texture: Record<string, THREE.Texture>;
  material: Record<string, Material>;
};

const TexturesContext = createContext<TextureContextProps>({
  texture: {},
  material: {},
});

async function loadTextures(
  images: string[],
  materials: Array<MaterialDefiniton>
) {
  const materialUrls = materials.flatMap((m) => [
    m.color,
    m.normal,
    m.roughness,
  ]);
  const loader = new TextureLoader();
  const textures: Record<string, Texture> = {};
  for (const url of [...images, ...materialUrls]) {
    if (url) {
      textures[url] = await loader.loadAsync(url);
    }
  }
  return textures;
}

export const TexturesProvider = (
  props: React.PropsWithChildren<{
    textures: string[];
    materials: Record<string, MaterialDefiniton>;
  }>
) => {
  const textures = useAsync(() =>
    loadTextures(props.textures, values(props.materials))
  );

  const materials = useMemo(() => {
    if (textures.value) {
      return mapValues(props.materials, (v) => {
        if (textures.value) {
          return {
            color: textures.value[v.color],
            roughness: textures.value[v.roughness],
            normal: textures.value[v.normal],
          };
        } else {
          throw new Error('missing textures');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textures.value]);

  if (textures.loading || !textures.value || !materials) {
    return (
      <Dialog open maxWidth="md" fullWidth>
        <DialogTitle>Loading...</DialogTitle>
        <DialogContent>
          <LinearProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <TexturesContext.Provider
      value={{
        texture: textures.value,
        material: materials,
      }}
    >
      {props.children}
    </TexturesContext.Provider>
  );
};

export const useTextures = () => useContext(TexturesContext);
