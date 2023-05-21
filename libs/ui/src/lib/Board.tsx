import { CardDisplay } from './CardDisplay';
import './style.css';

export const Board = (props: { perspective: number; rotate: number }) => {
  return (
    <div
      style={{
        perspective: props.perspective,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          height: 600,
          width: 600,
          backgroundImage: 'url(https://i.imgur.com/sHn4yAA.jpg)',
          objectFit: 'cover',
          transform: `rotateX(${props.rotate}deg)`,
          transition: 'transform 1s',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />

      <div
        style={{
          transform: `rotateX(${props.rotate}deg)`,
          transition: 'transform 1s',
          position: 'absolute',
          top: 200,
          left: (600 - 430 / 3) / 2,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            position: 'relative',

            transition: 'transform 1s',
          }}
        >
          <CardDisplay
            height={200}
            image="https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg"
            mark={{
              attacking: true,
              attacked: true,
              defending: true,
              questing: true,
            }}
            token={{
              damage: 1,
              progress: 1,
              resources: 1,
            }}
            orientation="portrait"
          />
        </div>

        <div
          style={{
            transform: `translateZ(10px)`,
            transition: 'transform 1s',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <CardDisplay
            height={200}
            image="https://s3.amazonaws.com/hallofbeorn-resources/Images/Cards/Core-Set/Aragorn.jpg"
            mark={{
              attacking: true,
              attacked: true,
              defending: true,
              questing: true,
            }}
            token={{
              damage: 1,
              progress: 1,
              resources: 1,
            }}
            orientation="portrait"
          />
        </div>
      </div>
    </div>
  );
};
