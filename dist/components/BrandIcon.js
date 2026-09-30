import { jsx as _jsx } from "react/jsx-runtime";
import { IdeastimeMark } from './IdeastimeMark.js';
/** admin.components.graphics.Icon — rendered in the app header on authenticated views. */ export function BrandIcon({ brand }) {
    const mark = brand.mark;
    if (!mark) {
        return null;
    }
    if (mark.kind === 'ideastime') {
        return /*#__PURE__*/ _jsx(IdeastimeMark, {
            className: "pb-icon"
        });
    }
    return /*#__PURE__*/ _jsx("img", {
        alt: "",
        className: "pb-icon",
        src: mark.src
    });
}
