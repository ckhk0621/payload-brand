import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrandStyle } from './BrandStyle.js';
import { Signature } from './Signature.js';
/** admin.components.afterLogin — also carries the theme so login stays branded under a project Logo. */ export function LoginFooter({ brand, css, i18n }) {
    if (!brand || css === undefined) {
        return null;
    }
    return /*#__PURE__*/ _jsxs("div", {
        className: "pb-login-footer",
        children: [
            /*#__PURE__*/ _jsx(BrandStyle, {
                css: css,
                fontHref: brand.font?.href ?? null
            }),
            /*#__PURE__*/ _jsx(Signature, {
                language: i18n?.language
            })
        ]
    });
}
