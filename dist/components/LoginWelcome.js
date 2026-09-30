import { jsx as _jsx } from "react/jsx-runtime";
/** admin.components.beforeLogin — always registered so the importMap does not depend on brand content. */ export function LoginWelcome({ brand }) {
    return brand?.welcome.login ? /*#__PURE__*/ _jsx("p", {
        className: "pb-welcome",
        children: brand.welcome.login
    }) : null;
}
