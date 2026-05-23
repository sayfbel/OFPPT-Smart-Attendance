export const SCANNER_SIGNATURE_ID = 'SCANNER_AUTO_ISTA';

const scannerStampSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="120" viewBox="0 0 250 120">
    <rect width="246" height="116" x="2" y="2" rx="16" fill="#f8fafc" stroke="#16a34a" stroke-width="2.5" stroke-dasharray="6 4" />
    <rect width="238" height="108" x="6" y="6" rx="12" fill="none" stroke="#22c55e" stroke-width="1" opacity="0.3" />
    <g transform="translate(12, 0)">
        <circle cx="35" cy="60" r="22" fill="#dcfce7" />
        <circle cx="35" cy="60" r="18" fill="none" stroke="#16a34a" stroke-dasharray="3 2" />
        <path d="M28 60 l5 5 l10 -10" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    </g>
    <g transform="translate(68, 0)">
        <text x="10" y="38" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="10" fill="#0f172a" letter-spacing="1.5">SYSTEME DIGITAL</text>
        <text x="10" y="54" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="12" fill="#16a34a" letter-spacing="0.5">POINTAGE VALIDE</text>
        <line x1="10" y1="64" x2="160" y2="64" stroke="#e2e8f0" stroke-width="1.5" />
        <text x="10" y="78" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="7" fill="#64748b" letter-spacing="0.8">AUTHENTIFICATION PAR SCANNER QR</text>
        <text x="10" y="90" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="7" fill="#005596" letter-spacing="1.2">ISTA AUTOMATED SECURE</text>
        <text x="10" y="101" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="6.5" fill="#94a3b8" letter-spacing="0.5">REF: SCANNER_AUTO_ISTA</text>
    </g>
</svg>`;

export const getSignatureDataURI = (signature) => {
    if (signature === SCANNER_SIGNATURE_ID) {
        try {
            const base64 = btoa(unescape(encodeURIComponent(scannerStampSvg)));
            return `data:image/svg+xml;base64,${base64}`;
        } catch (e) {
            console.error("Failed to encode SVG", e);
            return signature;
        }
    }
    return signature;
};

export const isScannerSignature = (signature) => signature === SCANNER_SIGNATURE_ID;
