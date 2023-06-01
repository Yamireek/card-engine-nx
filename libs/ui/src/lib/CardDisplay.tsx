import { Marks, Orientation, Tokens } from '@card-engine-nx/basic';
import damageImage from './../images/damage.png';
import resourceImage from './../images/resource.png';
import progressImage from './../images/progress.png';

export const cardRatio = 430 / 600;

export const CardDisplay = (props: {
  orientation: Orientation;
  scale: number;
  tapped?: boolean;
  image: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  mark?: Marks;
  token?: Tokens;
}) => {
  const zoom = props.scale;

  return (
    <div
      style={{
        position: 'relative',
        transition: 'transform 0.25s ease 0s',
        boxShadow: props.onClick ? '0px 0px 20px yellow' : '0px 0px 5px black',
        backgroundColor: 'black',
        width: '100%',
        height: '100%',
      }}
      onMouseEnter={() => {
        if (props.onMouseEnter) {
          props.onMouseEnter();
        }
      }}
      onMouseLeave={() => {
        if (props.onMouseLeave) {
          props.onMouseLeave();
        }
      }}
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <img
        src={props.image}
        alt=""
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
      {props.mark?.questing && (
        <div
          style={{
            position: 'absolute',
            top: 107 * zoom,
            left: 82 * zoom,
            width: 28 * zoom,
            height: 32 * zoom,
            backgroundColor: 'yellow',
            opacity: 0.5,
          }}
        />
      )}

      {(props.mark?.attacked || props.mark?.attacking) && (
        <div
          style={{
            position: 'absolute',
            top: 152 * zoom,
            left: 82 * zoom,
            width: 28 * zoom,
            height: 32 * zoom,
            backgroundColor: 'yellow',
            opacity: 0.5,
          }}
        />
      )}

      {props.mark?.defending && (
        <div
          style={{
            position: 'absolute',
            top: 202 * zoom,
            left: 82 * zoom,
            width: 28 * zoom,
            height: 32 * zoom,
            backgroundColor: 'yellow',
            opacity: 0.5,
          }}
        />
      )}

      {props.token && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginLeft: '30%',
            marginTop: '20%',
            minWidth: '70%',
            justifyContent: 'space-evenly',
            position: 'absolute',
            top: 0,
          }}
        >
          {props.token.progress ? (
            <div
              style={{
                position: 'relative',
                width: 45,
                height: 45,
                margin: 1,
              }}
            >
              <img src={progressImage} width={42} height={42} alt="" />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: 'x-large',
                }}
              >
                {props.token.progress}
              </div>
            </div>
          ) : undefined}
          {props.token.resources ? (
            <div
              style={{
                position: 'relative',
                width: 40,
                height: 40,
                margin: 2,
              }}
            >
              <img src={resourceImage} width={42} height={42} alt="" />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: 'x-large',
                }}
              >
                {props.token.resources}
              </div>
            </div>
          ) : undefined}

          {props.token.damage ? (
            <div
              style={{
                position: 'relative',
                width: 40,
                height: 40,
                margin: 2,
              }}
            >
              <img src={damageImage} width={42} height={42} alt="" />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                  fontSize: 'x-large',
                }}
              >
                {props.token.damage}
              </div>
            </div>
          ) : undefined}
        </div>
      )}
    </div>
  );
};
