const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-preset-env": {
      stage: 2,
      browsers: "ios >= 12, safari >= 12, last 4 versions, not dead",
      features: {
        "cascade-layers": true,
        "oklab-function": true,
        "color-mix": true,
      },
    },
  },
};

export default config;
