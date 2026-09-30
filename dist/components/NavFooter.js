import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrandStyle } from './BrandStyle.js';
import { Signature } from './Signature.js';
/** admin.components.afterNavLinks — carries the theme on every authenticated view. */ export function NavFooter({ brand, css, i18n }) {
    return /*#__PURE__*/ _jsxs("div", {
        className: "pb-nav-footer",
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
