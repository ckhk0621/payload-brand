import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BrandStyle } from './BrandStyle.js';
import { IdeastimeMark } from './IdeastimeMark.js';
function LogoContent({ brand }) {
    const logo = brand.logo;
    if (!logo) {
        return null;
    }
    if (logo.kind === 'ideastime') {
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx(IdeastimeMark, {
                    className: "pb-logo__mark"
                }),
                /*#__PURE__*/ _jsxs("span", {
                    className: "pb-wordmark",
                    children: [
                        "iDeas",
                        /*#__PURE__*/ _jsx("span", {
                            className: "pb-wordmark__accent",
                            children: "Time"
                        })
                    ]
                })
            ]
        });
    }
    if (logo.kind === 'image') {
        return /*#__PURE__*/ _jsx("img", {
            alt: brand.name ?? '',
            className: "pb-logo__img",
            src: logo.src
        });
    }
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx("img", {
                alt: "",
                className: "pb-logo__mark",
                src: logo.markSrc
            }),
            /*#__PURE__*/ _jsx("span", {
                className: "pb-wordmark",
                children: brand.name
            })
        ]
    });
}
/** admin.components.graphics.Logo — rendered on the login view. */ export function BrandLogo({ brand, css }) {
    if (!brand || css === undefined) {
        return null;
    }
    return /*#__PURE__*/ _jsxs("span", {
        "aria-label": brand.name ?? undefined,
        className: "pb-logo",
        children: [
            /*#__PURE__*/ _jsx(BrandStyle, {
                css: css,
                fontHref: brand.font?.href ?? null
            }),
            /*#__PURE__*/ _jsx(LogoContent, {
                brand: brand
            })
        ]
    });
}
