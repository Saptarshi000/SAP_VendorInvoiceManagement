sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/UIComponent"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, BusyIndicator, UIComponent) {
        "use strict";

        return Controller.extend("sapvim.controller.Home", {
            // onBeforeRendering: function () {
            // },
            // onAfterRendering: function () {
            //     console.log("onAfterRendering method executing")
            // },
            onInit: function () {
                // let data;
                // if(localStorage.getItem("userData")){
                //     data = JSON.parse( localStorage.getItem("userData") )
                //     this.byId('venID').setText(data.Username);
                // }else{
                //     var routerObj = this.getOwnerComponent().getRouter();
                //     routerObj.navTo("Screen7");
                // }

                // var a = this.byId('venID').getText();

                // console.log(a)
                // this.getDataValue(a);
                console.log("ONINIT method executing")

                // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                // oRouter.getRoute("home").attachPatternMatched(this.setDataonUI, this);

                var oRouter = UIComponent.getRouterFor(this);
                oRouter.attachRouteMatched(this.setDataonUI, this);

                var oData = {
                    "SelectedProduct": "USD",
                    "SelectedProduct2": "PO",
                    "SelectedProduct3": "PO123",
                    "SelectedProduct4": "Apollo Private Limited",
                    "ProductCollection": [
                        {
                            "cuurencyId": "USD",
                            "Name": "USD"
                        },
                        {
                            "cuurencyId": "INR",
                            "Name": "INR"
                        },
                        {
                            "cuurencyId": "AUD",
                            "Name": "AUD"
                        },
                        {
                            "cuurencyId": "CAD",
                            "Name": "CAD"
                        },
                        {
                            "cuurencyId": "EUR",
                            "Name": "EUR"
                        }
                    ],
                    "ProductCollection2": [
                        {
                            "cuurencyId": "PO",
                            "Name": "PO"
                        },
                        {
                            "cuurencyId": "Non-Po",
                            "Name": "Non-Po"
                        },
                    ],
                    "ProductCollection3": [
                        {
                            "PoNo": "PO123",
                            "Name": "PO123"
                        },
                        {
                            "PoNo": "PO1234",
                            "Name": "PO1234"
                        },
                        {
                            "PoNo": "PO12345",
                            "Name": "PO12345"
                        },
                    ],
                    "ProductCollection4": [
                        {
                            "PoNo": "Apollo Private Limited",
                            "Name": "Apollo Private Limited"
                        },
                        {
                            "PoNo": "Dr Reddy Labs",
                            "Name": "Dr Reddy Labs"
                        },
                        {
                            "PoNo": "Matrix Labs",
                            "Name": "Matrix Labs"
                        },
                    ],
                    "Editable": true,
                    "Enabled": true
                };

                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel);

                // var oVizFrame = this.oVizFrame = this.getView().byId("_IDGenVizFrame1");
                // var oVizFrame1 = this.oVizFrame = this.getView().byId("_IDGendfVizFrame1");
                var jsonData1 = [
                    { Month: 'Jan', Invoices: "454" },
                    { Month: 'Feb', Invoices: "512" },
                    { Month: 'Mar', Invoices: "156" },
                    { Month: 'Apr', Invoices: "56" },
                    { Month: 'May', Invoices: "562" },
                    { Month: 'Jun', Invoices: "566" },
                ]
                var jsonModel = new JSONModel();
                jsonModel.setData(jsonData1);
                // oVizFrame.setModel(jsonModel);
                // oVizFrame1.setModel(jsonModel);
            },
            setDataonUI: function () {
                console.log("setDataonUI method executing")

                let data;
                if (localStorage.getItem("userData")) {
                    data = JSON.parse(localStorage.getItem("userData"))
                    this.byId('venID').setText(data.Username);
                } else {
                    var routerObj = this.getOwnerComponent().getRouter();
                    routerObj.navTo("Screen7");
                }

                var a = this.byId('venID').getText();
                this.getDataValue(a);
                this.getGraphData(a)
            },
            getDataValue: function (venId) {
                BusyIndicator.show();
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                // console.log(venId);
                // console.log(oModel)

                oModel.setUseBatch(false);

                oModel.read(`/po_totSet('${venId}')`, {
                    success: function (oData) {
                        console.log(oData);
                        var jModel = new JSONModel(oData);
                        that.getView().setModel(jModel, "homeValue")

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
            getGraphData: function (venId) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();

                oModel.setUseBatch(false);

                oModel.read(`/po_totSet('${venId}')`, {
                    urlParameters: {
                        "$expand": "graphDetailsNav"
                    },
                    success: function (oData) {
                        console.log(oData);
                        var jsonData = oData.graphDetailsNav

                        var setMonths = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

                        // var maindata = odata.graphDetailsNav
                        for(var i=0 ; i<(jsonData.results).length ; i++){
                            jsonData.results[i].month = setMonths[i];
                        }

                        
                        var oModel = new JSONModel(jsonData);
                        that.getView().setModel(oModel, "graphData");
                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })

            }
        });
    });
