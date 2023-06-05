import React, { useContext } from 'react';
import { useAsync } from 'react-use';
import { Texture, TextureLoader } from 'three';

type TextureContextProps = {
  texture: Record<string, THREE.Texture>;
};

const TexturesContext = React.createContext<TextureContextProps>({
  texture: {},
});

async function loadTextures(urls: string[]) {
  const loader = new TextureLoader();
  const textures: Record<string, Texture> = {};
  for (const url of urls) {
    console.log('loading texture', url);
    textures[url] = await loader.loadAsync(url);
  }
  return textures;
}

export const TexturesProvider = (
  props: React.PropsWithChildren<{ urls: string[] }>
) => {
  const textures = useAsync(() => loadTextures(props.urls));

  if (textures.loading || !textures.value) {
    return <>Loading textures</>;
  }

  return (
    <TexturesContext.Provider value={{ texture: textures.value }}>
      {props.children}
    </TexturesContext.Provider>
  );
};

export const useTextures = () => useContext(TexturesContext);
