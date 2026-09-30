import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { labelsFor } from '../copy.js';
import { Signature } from './Signature.js';
function displayName(user) {
    if (typeof user?.name === 'string' && user.name.trim() !== '') {
        return user.name.trim();
    }
    return typeof user?.email === 'string' ? user.email : null;
}
/** admin.components.beforeDashboard — appended after any project components. */ export function DashboardWelcome({ brand, i18n, user }) {
    const labels = labelsFor(i18n?.language);
    return /*#__PURE__*/ _jsxs("section", {
        className: "pb-dashboard-card",
        children: [
            /*#__PURE__*/ _jsx("h2", {
                className: "pb-dashboard-card__title",
                children: labels.greet(displayName(user))
            }),
            brand.welcome.dashboard ? /*#__PURE__*/ _jsx("p", {
                className: "pb-dashboard-card__text",
                children: brand.welcome.dashboard
            }) : null,
            /*#__PURE__*/ _jsx(Signature, {
                language: i18n?.language,
                showCredit: false
            })
        ]
    });
}
