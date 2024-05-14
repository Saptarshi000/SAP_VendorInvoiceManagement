sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/BusyIndicator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, BusyIndicator) {
        "use strict";

       const v = "";

        return Controller.extend("sapvim.controller.Payment", {
            onInit: function () {

                if (localStorage.getItem("userData")) {
                    let data = JSON.parse(localStorage.getItem("userData"))
                    var venId = data.Username
                    this.v = data.Username
                    // this.byId('_IDGenText2').setText(data.Username);
                } else {
                    var routerObj = this.getOwnerComponent().getRouter();
                    routerObj.navTo("Screen7");
                }


                this.onclickTotDue();
                this.getCountDatas(venId)
            },
            getCountDatas: function (venId) {
                BusyIndicator.show();
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                // console.log(venId);
                console.log(oModel)

                oModel.setUseBatch(false);

                oModel.read(`/po_totSet('${venId}')`, {
                    success: function (oData) {
                        console.log("countData", oData);
                        var jModel = new JSONModel(oData);
                        that.getView().setModel(jModel, "countData")

                        setTimeout(() => {
                            BusyIndicator.hide();
                        }, 1000);
                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })
            },
            onclickTotDue: function () {
                let key = ""
                this.byId("tableTotalDue").setVisible(true)
                this.byId("tableOverDue").setVisible(false)
                this.byId("tableDueWith").setVisible(false)
                this.getInvPmnt(key, this.v)
            },
            onclickOvrDue: function () {
                let key = "o"
                this.byId("tableTotalDue").setVisible(false)
                this.byId("tableOverDue").setVisible(true)
                this.byId("tableDueWith").setVisible(false)
                // console.log(this.v)
                this.getInvPmnt(key, this.v)
            },
            onclickDue30Days: function () {
                let key = "w"
                this.byId("tableTotalDue").setVisible(false)
                this.byId("tableOverDue").setVisible(false)
                this.byId("tableDueWith").setVisible(true)
                // console.log(this.v)
                this.getInvPmnt(key, this.v)
            },
            getInvPmnt: function (key,venId) {
                BusyIndicator.show();
                var that = this;
                // var venId = "0000000099"
                // 0017300002

                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

                oModel.read(`/po_dueheaderSet(Lifnr='${venId}',l_key='${key}')`, {
                    urlParameters: {
                        "$expand": "po_duelineitemSet",
                    },
                    success: function (oData) {
                        console.log("Inv Pymnt")
                        console.log(key)
                        console.log(oData);

                        var jModel = new JSONModel(oData.po_duelineitemSet);
                        // // console.log(jModel)
                        that.getView().setModel(jModel, "invPymt");

                        setTimeout(() => {
                            BusyIndicator.hide();
                        }, 2000);
                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })
            }
        });
    });
