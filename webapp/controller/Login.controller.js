sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/routing/History"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, BusyIndicator, History) {
        "use strict";

        return Controller.extend("sapvim.controller.Login", {
            onInit: function () {
                // this.getDataValue()
                // location.reload();

                // NAV STAFF
                window.onhashchange = function() {
                    if (window.innerDocClick) {
                        //Your own in-page mechanism triggered the hash change
                    } else {
                        //Browser back button was clicked
                        this.navBack(this.getOwnerComponent().getRouter())
                    }
                }
            },
            getDataValue: function () {
                BusyIndicator.show();
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
                                BusyIndicator.hide();
                                var routerObj = that.getOwnerComponent().getRouter();
                                routerObj.navTo("Screen1");
                            } else {
                                localStorage.setItem("userData", JSON.stringify(oData))
                                that.byId("password").setValue(null)

                                var routerObj = that.getOwnerComponent().getRouter();
                                BusyIndicator.hide();
                                routerObj.navTo("Screen1");
                            }

                        } else {
                            if(oData.Message === "FAIL"){
                                MessageBox.error("Invalid Credentials");
                                // console.log(oData.Message)
                            that.byId("password").setValue(null)
                            BusyIndicator.hide();
                            }
                            
                            
                        }


                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                        that.byId("password").setValue(null)
                        BusyIndicator.hide();
                    }
                })
            },

            // Navigation staff
            navBack: router => History.getInstance().getPreviousHash() !== undefined
            ?router.navTo("") 
            // window.history.go(-1) // Navigate back
            : router.navTo(""), // Navigate up

            // navButtonPress=".navBack($controller.getOwnerComponent().getRouter())"

            
        });
    });
