sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sapvim.controller.Navbar", {
            onInit: function () {

            },
            onClickHomeBtn: function () {
                var routerObj = this.getOwnerComponent().getRouter();
                routerObj.navTo("Screen1");
            },
            onClickNewInv: function () {
                var routerObj = this.getOwnerComponent().getRouter();
                routerObj.navTo("Screen2");
            },
            onClickMyInv: function () {
                var routerObj = this.getOwnerComponent().getRouter();
                routerObj.navTo("");
            },
            onClickInvStat: function () {
                var routerObj = this.getOwnerComponent().getRouter();
                routerObj.navTo("Screen4");
            },
            onClickpymntReceived: function () {
                var routerObj = this.getOwnerComponent().getRouter();
                routerObj.navTo("Screen5");
            },
            onClickReport: function () {
                var routerObj = this.getOwnerComponent().getRouter();
                routerObj.navTo("");
            }
        });
    });
