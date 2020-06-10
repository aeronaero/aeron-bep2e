// tailwind.config.js
module.exports = {
    
    purge: {
        enabled: true,
        content: [    
            'src/*.js',
            'src/**/*.js',
        ],
    },
    theme: {
        fontFamily: {
            'sans': ['Helvetica', 'Arial', 'sans-serif'],
        },
        extend: {
            colors: {
                aero: {
                    '700': '#1f4263',
                    '800': '#033152',
                    '900': '#002b4b',
                }
            }
        }
    }
}

