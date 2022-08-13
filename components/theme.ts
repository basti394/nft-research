import {
    extendTheme,
    withDefaultColorScheme,
    ThemeConfig,
    theme as baseTheme,
} from "@chakra-ui/react";

const config: ThemeConfig = {
    initialColorMode: "light",
};

const colorTheme = {
    "50": "#E5F4FF",
    "100": "#B8E0FF",
    "200": "#8ACDFF",
    "300": "#5CB9FF",
    "400": "#2EA5FF",
    "500": "#0091FF",
    "600": "#0074CC",
    "700": "#005799",
    "800": "#003A66",
    "900": "#001D33",
};
// See: https://chakra-ui.com/docs/styled-system/theming/customize-theme#using-theme-extensions
const colors = {
    brand: {
        ...colorTheme,
        errorLight: baseTheme.colors.red[400],
        errorDark: baseTheme.colors.red[300],
        spotifyGreen: "#1DB954",
        spotifyHover: "#54e888",
        youtubeRed: "#FF0000",
        youtubeHover: baseTheme.colors.red[400],
    },
};

export default extendTheme(
    { config, colors },
    withDefaultColorScheme({
        colorScheme: "brand",
    }),
) as {
    config: typeof config;
};
