module.exports = {
    "src/**/*.{js,jsx,ts,tsx}": ["npm run lint:fix", "npm run test"],
    "src/**/*.{js,jsx,ts,tsx,css,scss,md}": "prettier --write --ignore-unknown",
};
