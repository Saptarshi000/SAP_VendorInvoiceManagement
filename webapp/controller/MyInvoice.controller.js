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

        return Controller.extend("sapvim.controller.MyInvoice", {
            onInit: function () {
                let key = "S"
                
                this.getInvStatus(key)
                
                this.getCountDatas(this.byId("vendNo").getText())

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
                        console.log("countData",oData);
                        var jModel = new JSONModel(oData);
                        that.getView().setModel(jModel, "countData")

                        setTimeout(() => {
                            BusyIndicator.hide();
                          }, 2000);
                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })
            },
            getInvStatus: function (key) {
                BusyIndicator.show();
                var that = this;
                var venId = that.byId("vendNo").getText();
                
                this.byId("invDate").setDateValue(null)
                this.byId("RefN").setValue(null)

                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

               

                oModel.read(`/po_headerSet(VenderNo='${venId}',PoNo='',key='${key}')`, {
                    urlParameters: {
                        "$expand": "po_inv_statusSet",
                    },
                    success: function (oData) {
                        console.log("Inv Status")
                        console.log(oData);
                       
                        var jModel = new JSONModel(oData.po_inv_statusSet);
                        // // console.log(jModel)
                        that.getView().setModel(jModel, "invStatus");

                        setTimeout(() => {
                            BusyIndicator.hide();
                          }, 2000);
                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })
            },
            onclickSubmitted: function () {
                let key = "S"
                this.getInvStatus(key)
            },
            onclickverified: function () {
                let key = "V"
                this.getInvStatus(key)
            },
            onclickblocked: function () { 
                let key = "B"
                this.getInvStatus(key)
            },
            onclickcleared: function () { 
                let key = "C"
                this.getInvStatus(key)
            },
            onFilterInvoice: function(){
                var aFilter = [];
                var sQuery = this.byId("RefN").getValue()
                var dQuery = this.byId("invDate").getValue()
                
                if(sQuery){
                    aFilter.push( new Filter("portal_ref", FilterOperator.Contains, sQuery));
                }
                else{
                    aFilter.push( new Filter("inv_date", FilterOperator.Contains, dQuery));
                }
                
                // Filter Binding
                var oList = this.byId("tableObj");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);

                // Reset Filters
                this.byId("invDate").setDateValue(null)
                this.byId("RefN").setValue(null)
            }
        });
    });
