import { createContext, useContext } from 'react';
import { useAsync } from 'react-use';
import { Texture, TextureLoader } from 'three';
import { LoadingDialog } from '../dialogs/LoadingDialog';

type TextureContextProps = {
  texture: Record<string, THREE.Texture>;
};

const TexturesContext = createContext<TextureContextProps>({
  texture: {},
});

async function loadTextures(images: string[]) {
  const loader = new TextureLoader();
  const textures: Record<string, Texture> = {};
  for (const url of [...images]) {
    if (url) {
      textures[url] = await loader.loadAsync(url);
    }
  }
  return textures;
}

export const TexturesProvider = (
  props: React.PropsWithChildren<{
    textures: string[];
  }>
) => {
  const textures = useAsync(() => loadTextures(props.textures));

  if (textures.loading || !textures.value) {
    return <LoadingDialog />;
  }

  return (
    <TexturesContext.Provider
      value={{
        texture: textures.value,
      }}
    >
      {props.children}
    </TexturesContext.Provider>
  );
};

export const useTextures = () => useContext(TexturesContext);
