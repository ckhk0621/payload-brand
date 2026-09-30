import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { labelsFor } from '../copy.js';
import { IDEASTIME } from '../ideastime.js';
export function Signature({ language, showCredit = true }) {
    const labels = labelsFor(language);
    const { email, phoneDisplay, whatsapp } = IDEASTIME.contact;
    return /*#__PURE__*/ _jsxs("div", {
        className: "pb-signature",
        children: [
            showCredit ? /*#__PURE__*/ _jsxs("a", {
                href: IDEASTIME.siteUrl,
                rel: "noopener",
                target: "_blank",
                children: [
                    "Crafted by ",
                    /*#__PURE__*/ _jsx("span", {
                        className: "pb-signature__brand",
                        children: "iDeasTime"
                    })
                ]
            }) : null,
            /*#__PURE__*/ _jsx("span", {
                children: labels.help
            }),
            /*#__PURE__*/ _jsx("a", {
                href: `mailto:${email}`,
                children: email
            }),
            /*#__PURE__*/ _jsxs("a", {
                href: `https://wa.me/${whatsapp}`,
                rel: "noopener",
                target: "_blank",
                children: [
                    "WhatsApp ",
                    phoneDisplay
                ]
            })
        ]
    });
}
