// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        // This line tells Tailwind to look in the current directory (where tailwind.config.js is)
        // and recursively into all subdirectories, for any file ending with '.ejs'.
        './**/*.ejs',
        // If you also have other file types that contain Tailwind classes (e.g., HTML in public folder, or JS),
        // include them as well:
        './public/**/*.html', // Assuming static HTML files might be in a 'public' directory
        './src/**/*.{js,jsx,ts,tsx}', // If you have client-side JS/TS that uses Tailwind classes
        './view/**/*.{html,js,ejs}' // A more specific example if your views are only in 'views' folder
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};