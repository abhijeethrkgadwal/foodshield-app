import colors from './colors';

const theme = {
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
    mono: 'Poppins',
  },
  colors: {
    ...colors,
    primary: {
      600: colors.green,
      500: colors.gray,
    },
  },
};

export default theme;
