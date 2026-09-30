import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { IDEASTIME } from '../ideastime.js';
/** Dark-variant iDeasTime "eyes" mark (official-site-2027/components/brand/Logo.tsx). */ export function IdeastimeMark({ className }) {
    return /*#__PURE__*/ _jsxs("svg", {
        "aria-hidden": "true",
        className: className,
        role: "presentation",
        viewBox: "0 0 100 56",
        children: [
            /*#__PURE__*/ _jsx("rect", {
                fill: IDEASTIME.mark.left,
                height: "56",
                rx: "14",
                width: "42",
                x: "0",
                y: "0"
            }),
            /*#__PURE__*/ _jsx("rect", {
                fill: IDEASTIME.mark.right,
                height: "56",
                rx: "14",
                width: "42",
                x: "58",
                y: "0"
            })
        ]
    });
}
