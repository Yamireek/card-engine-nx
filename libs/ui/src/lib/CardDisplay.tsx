import { Marks, Orientation, Tokens } from '@card-engine-nx/basic';
import damageImage from './../images/damage.png';
import resourceImage from './../images/resource.png';
import progressImage from './../images/progress.png';

const ratio = 429 / 600;

export const CardDisplay = (props: {
  orientation: Orientation;
  height: number;
  tapped: boolean;
  image: string;
  onMouseEnter?: () => void;
  onClick?: () => void;
  mark?: Marks;
  token?: Tokens;
}) => {
  const width =
    props.orientation === 'portrait' ? props.height * ratio : props.height;

  const height =
    props.orientation === 'portrait' ? props.height : props.height * ratio;

  return (
    <div
      style={{
        border: props.onClick ? '2px solid yellow' : 'initial',
        height,
        width,
        position: 'relative',
        transform: props.tapped ? 'rotate(45deg)' : 'initial',
        transition: 'transform 0.25s ease 0s',
      }}
      onMouseEnter={() => {
        if (props.onMouseEnter) {
          props.onMouseEnter();
        }
      }}
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      <img src={props.image} width={width} height={height} alt="" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginLeft: '0%',
          marginTop: '3%',
          minWidth: '70%',
          justifyContent: 'space-evenly',
          position: 'absolute',
          top: 0,
        }}
      >
        {props.mark?.questing && (
          <div
            style={{
              position: 'relative',
              width: 20,
              height: 20,
              margin: 1,
              backgroundColor: 'white',
            }}
          >
            <img
              src="http://hallofbeorn.com/Images/willpower-med.png"
              width={20}
              height={20}
              alt=""
            />
          </div>
        )}
        {(props.mark?.attacking || props.mark?.attacked) && (
          <div
            style={{
              position: 'relative',
              width: 20,
              height: 20,
              margin: 1,
              backgroundColor: 'white',
            }}
          >
            <img
              src="http://hallofbeorn.com/Images/attack-small.png"
              width={20}
              height={20}
              alt=""
            />
          </div>
        )}
        {props.mark?.defending && (
          <div
            style={{
              position: 'relative',
              width: 20,
              height: 20,
              margin: 1,
              backgroundColor: 'white',
            }}
          >
            <img
              src="http://hallofbeorn.com/Images/defense-small.png"
              width={20}
              height={20}
              alt=""
            />
          </div>
        )}
      </div>
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
