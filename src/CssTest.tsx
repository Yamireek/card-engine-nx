import { image } from '@card-engine-nx/ui';

export const CssTest = () => {
  const width = 512;
  const height = 512;
  const perspective = 1024;
  return (
    <div
      style={{
        width,
        height,       
        marginLeft: 0,
        marginTop: 0,
        perspective,
      }}
    >
      <img
        src={image.test}
        alt=""
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'blue',
          transformOrigin: 'center center',
          transform: 'translateZ(0) rotateX(45deg)',
          transition: 'all 1s',
        }}
      />
    </div>
  );
};
