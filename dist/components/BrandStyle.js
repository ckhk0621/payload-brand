import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
export const THEME_STYLE_HREF = 'payload-brand-theme';
/** React 19 hoists both elements into <head> and dedupes them by href. */ export function BrandStyle({ css, fontHref }) {
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            fontHref ? /*#__PURE__*/ _jsx("link", {
                href: fontHref,
                precedence: "default",
                rel: "stylesheet"
            }) : null,
            /*#__PURE__*/ _jsx("style", {
                href: THEME_STYLE_HREF,
                precedence: "default",
                children: css
            })
        ]
    });
}
