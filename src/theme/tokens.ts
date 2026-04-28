export const tokens = {
    components: {
        button: {
            default: '#6115CD',
            pressed: '#4E11A4',
            disabled: '#D5C9FF',
        },
        likeButton: {
            active: {
                default: '#FF2B75',
                pressed: '#EA276B',
                disabled: '#FFBAD2',
            },
            inactive: {
                default: '#EFF2F7',
                pressed: '#DDDDDD',
                disabled: '#FFFFFF',
            },
        },
    },
    colors: {
        primary: '#6115CD',
        appBackground: 'F5F8FD',
        gray: '#57626F',
        alternativeGray: '#C3CAD1',
        white: '#FFFFFF',
        alternativeWhite: '#FFEAF1',
    },
    spacing: {
        xs: 4,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
    },
    radius: {
        xs: 6,
        sm: 12,
        md: 14,
        lg: 20,
        full: 999,
    },
    typography: {
        size: {
            sm: 12,
            md: 14,
            lg: 18,
            xl: 28,
        },
        weight: {
            regular: '400' as const,
            medium: '500' as const,
            bold: '700' as const,
        },
    },
};
