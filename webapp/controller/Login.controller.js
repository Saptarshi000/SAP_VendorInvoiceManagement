sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("sapvim.controller.Login", {
            onInit: function () {
                // this.getDataValue()
                // location.reload();
            },
            getDataValue: function () {
                var that = this;

                let vId = this.byId("login").getValue()
                let pwd = this.byId("password").getValue()
                // console.log(vId, pwd)
                var oModel = this.getOwnerComponent().getModel("ZVENDOR_ONBOARD_SRV");

                // console.log(oModel)

                oModel.setUseBatch(false);

                oModel.read(`/Vendor_loginSet(Username='${vId}',Password='${pwd}')`, {
                    urlParameters: {
                        "$format": "json",
                    },
                    success: function (oData) {
                        // console.log(oData);

                        if (oData.Message === "SUCESS") {
                            if (localStorage.getItem("userData")) {
                                var routerObj = that.getOwnerComponent().getRouter();
                                routerObj.navTo("Screen1");
                            } else {
                                localStorage.setItem("userData", JSON.stringify(oData))
                                that.byId("password").setValue(null)

                                var routerObj = that.getOwnerComponent().getRouter();
                                routerObj.navTo("Screen1");
                            }

                        } else {
                            MessageBox.error(oData.Message);
                            // console.log(oData.Message)
                            that.byId("password").setValue(null)
                        }


                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                        that.byId("password").setValue(null)
                    }
                })
            }
        });
    });
