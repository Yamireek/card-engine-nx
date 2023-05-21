import { CardDisplay } from '@card-engine-nx/ui';

export const App = () => {
  return (
    <CardDisplay
      height={600}
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
      tapped
      orientation="portrait"
    />
  );
};
