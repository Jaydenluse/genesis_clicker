module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jersey: ['Jersey', 'sans-serif'],
        mp: ['MP', 'sans-serif'],
        mps: ['MPSYMBOL', 'sans-serif'],
        pepsi: ['PEPSI', 'sans-serif'],
        ad: ['AD', 'sans-serif']
      },
      colors: {
        'dark-blue': '#0f172a',
        'light-blue': '#38bdf8',
        'gray-blue': '#334155',
        'black': '#000000'
      },
    },
  },
  plugins: [],
}
