import {extendTheme} from 'native-base';
import colors from './colors';

const theme = extendTheme({
  fontConfig: {
    Poppins: {
      400: {
        normal: 'Poppins-Regular',
      },
      500: {
        normal: 'Poppins-Medium',
      },
      600: {
        normal: 'Poppins-SemiBold',
      },
      700: {
        normal: 'Poppins-Bold',
      },
    },
  },
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
    mono: 'Poppins',
  },
  colors: {
    primary: {
      600: colors.green,
      500: colors.gray
    },
  },
  components: {
    Input: {
      baseStyle: {
        borderRadius: 8,
      },
      defaultProps: {
        size: 'lg',
      },
    },
    TextArea: {
      defaultProps: {
        size: 'lg',
      },
    },
    Button: {
      baseStyle: {
        borderRadius: 8,
      },
      variants: {
        solid: {
          _text: {
            fontWeight: 'bold',
          },
        },
        outline: {
          _text: {
            fontWeight: 'bold',
          },
        },
      },
    },
    Select: {
      defaultProps: {
        size: 'lg',
      },
    },
  },
});

export default theme;
