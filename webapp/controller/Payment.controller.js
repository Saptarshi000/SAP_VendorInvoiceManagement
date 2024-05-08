sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("sapvim.controller.Payment", {
            onInit: function () {
                this.byId("tableTotalDue").setVisible(true)
                this.byId("tableOverDue").setVisible(false)
                this.byId("tableDueWith").setVisible(false)
            },
            onclickTotDue:function(){
                this.byId("tableTotalDue").setVisible(true)
                this.byId("tableOverDue").setVisible(false)
                this.byId("tableDueWith").setVisible(false)
            },
            onclickOvrDue:function(){
                this.byId("tableTotalDue").setVisible(false)
                this.byId("tableOverDue").setVisible(true)
                this.byId("tableDueWith").setVisible(false)
            },
            onclickDue30Days:function(){
                this.byId("tableTotalDue").setVisible(false)
                this.byId("tableOverDue").setVisible(false)
                this.byId("tableDueWith").setVisible(true)
            }
        });
    });
