import Dashboard from "views/Dashboard.js";
import Number from "views/NumberSearch.js";
import NumberTest from "views/NumberSearch_test.js";
import Reporting from "views/Reporting.js";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/numbersearch",
    name: "Number Search",
    icon: "tim-icons icon-zoom-split",
    component: Number,
    layout: "/admin"
  },
  {
    path: "/numbersearchtest",
    name: "Number Search Test",
    icon: "tim-icons icon-zoom-split",
    component: NumberTest,
    layout: "/admin"
  },
  {
    path: "/reporting",
    name: "Reporting",
    icon: "tim-icons icon-cloud-download-93",
    component: Reporting,
    layout: "/admin"
  }
];
export default routes;
