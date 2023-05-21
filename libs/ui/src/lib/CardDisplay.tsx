import { Marks, Orientation, Tokens } from '@card-engine-nx/basic';
import damageImage from './../images/damage.png';
import resourceImage from './../images/resource.png';
import progressImage from './../images/progress.png';
import { Card, CardActionArea, CardContent } from '@mui/material';

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

  const zoom = props.height / 600;

  return (
    <Card
      elevation={24}
      style={{
        border: props.onClick ? '2px solid yellow' : '2px solid white',
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
      <CardActionArea disabled={!props.onClick}>
        <CardContent sx={{ padding: 0 }}>
          <img src={props.image} width={width} height={height} alt="" />
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
