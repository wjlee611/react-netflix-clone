// import original module declarations
import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    red: srting;
    black: {
      veryDark: srting;
      darker: srting;
      lighter: srting;
    };
    white: {
      lighter: srting;
      darker: srting;
    };
  }
}
