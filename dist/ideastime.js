// Mirrors of the iDeasTime brand as published by the official site repo (official-site-2027),
// which stays the source of truth. When any of these change there, update them here too:
//   components/brand/Logo.tsx  mark geometry, dark-variant colours, wordmark
//   app/globals.css            --color-dark-section (#071A33), --color-accent (#C97B1E)
//   lib/site-config.ts         url, images.defaultOG
//   lib/contact.json           email, whatsapp, phoneDisplay
export const IDEASTIME = {
    contact: {
        email: 'cklam@ideastime.ltd',
        phoneDisplay: '+852 6329 5926',
        whatsapp: '85263295926'
    },
    mark: {
        left: '#7FA9DC',
        right: '#E3A24C'
    },
    ogImage: 'https://www.ideastime.ltd/images/og-default.jpg',
    siteUrl: 'https://www.ideastime.ltd',
    wordmark: {
        accent: '#C97B1E'
    }
};
export const IDEASTIME_BRAND = {
    name: 'iDeasTime',
    colors: {
        accent: '#E3A24C',
        background: '#071A33'
    },
    font: {
        family: 'Inter',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap'
    },
    ogImage: IDEASTIME.ogImage
};
const MARK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 56">' + `<rect width="42" height="56" rx="14" fill="${IDEASTIME.mark.left}"/>` + `<rect x="58" width="42" height="56" rx="14" fill="${IDEASTIME.mark.right}"/>` + '</svg>';
export const IDEASTIME_MARK_DATA_URI = `data:image/svg+xml,${encodeURIComponent(MARK_SVG)}`;
