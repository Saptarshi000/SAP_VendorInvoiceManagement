sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/date/UI5Date",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/m/StandardListItem",
    "sap/m/PDFViewer",
    "sap/m/List",
    "sap/m/ActionListItem",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/BusyIndicator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, UI5Date, ColumnListItem, Input, StandardListItem, PDFViewer, List, ActionListItem, Dialog, Button, ButtonType, JSONModel, BusyIndicator) {
        "use strict";

        return Controller.extend("sapvim.controller.InvoiceUpload", {
            onInit: function () {
                this.byId("invDate").setMaxDate(new Date());
            },
            getAllPO: function () {
                var that = this;

                var venId = that.byId("vendNo").getValue();
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

                oModel.read(`/po_totSet('${venId}')`, {
                    urlParameters: {
                        "$expand": "po_listSet",
                    },
                    success: function (oData) {
                        console.log(oData.po_listSet.results);
                        var dataSetDetails = oData.po_listSet.results
                        // var jModel = new JSONModel(oData);
                        // that.getView().setModel(jModel, "homeValue")

                        // Create a List control to display po 
                        var oList = new sap.m.List({
                            selectionChange: function (oEvent) {
                                var selectedItem = oEvent.getParameter("listItem");
                                // console.log("Selected costcenter:", selectedItem.getTitle());
                                var oInput = that.getView().byId('poNo');
                                if (oInput) {
                                    oInput.setValue(selectedItem.getTitle());
                                } else {
                                    console.error("Input field not found.");
                                }
                                oDialog.close();
                                console.log(that.byId("poNo").getValue())
                                that.getPoLineItems(that.byId("poNo").getValue())
                            },
                            mode: sap.m.ListMode.SingleSelectLeft
                        });

                        // Add list items for each po detail
                        for (let po of dataSetDetails) {
                            var listItem = new StandardListItem({
                                title: po['po_no']
                            });
                            oList.addItem(listItem);
                        }

                        // Create the Dialog with the List control as content
                        var oDialog = new sap.m.Dialog({
                            title: "Choose ",
                            content: oList, endButton: new sap.m.Button({
                                text: "Close",
                                press: function () {
                                    oDialog.close();
                                }
                            })
                        });
                        that.getView().addDependent(oDialog);
                        oDialog.open();


                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })
            },
            getPoLineItems: function (po_num) {
                var that = this;
                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

                oModel.read(`/po_headerSet(VenderNo='',PoNo='${po_num}',key='')`, {
                    urlParameters: {
                        "$expand": "po_lineitemSet",
                    },
                    success: function (oData) {
                        console.log("PO LINES")
                        console.log(oData.po_lineitemSet);
                        var jModel = new JSONModel(oData.po_lineitemSet);
                        // console.log(jModel)
                        that.getView().setModel(jModel, "poLineItems");

                        // console.log()


                        console.log("CHeck table")

                        var aItems = that.byId("tableObj").getItems()

                        for (let oItem of aItems) {
                            var oInput = oItem.getAggregation("cells")[4].getProperty("text")
                            console.log(oInput)

                            var oInput2 = oItem.getAggregation("cells")[5].getId()
                            console.log(oInput2)

                            if (oInput == 0) {
                                sap.ui.getCore().byId(oInput2).setEditable(false);
                            } else {
                                sap.ui.getCore().byId(oInput2).setEditable(true);
                            }
                        }
                    },
                    error: function (oError) {
                        console.log("Error");
                        console.log(oError)
                    }
                })
            },
            handleChangeQty: function (oEvent) {
                var aItems = this.byId("tableObj").getItems()
                for (let oItem of aItems) {
                    let oText = oItem.getAggregation("cells")[7].getProperty("text")
                    console.log(oText)

                    let oInput = oItem.getAggregation("cells")[5].getValue()
                    console.log(oInput)

                    let tot = parseFloat(oText) * parseFloat(oInput)

                    var ooText = oItem.getCells()[8];
                    ooText.setText(tot);
                }
            },
            handleFileChange: function (oEvent) {

                this.selectedFile = oEvent.getParameters().files[0];
                var fileUploaderObj = this.byId("invDoc");
                var fileName = fileUploaderObj.getValue();

                var fileNameTextObj = this.byId("selectedFileText");
                fileNameTextObj.setText(fileName);

                this.getView().byId("_IDGenPDFViewer").setSource(URL.createObjectURL(this.selectedFile));

                if (!fileName) {
                    MessageBox.warning("No File Selected");
                }
            },
            openPDF: function () {
                this.byId("_IDGenPDFViewer").downloadPDF();
            },
            // handleFileChangeESign: function (oEvent) {

            //     this.selectedFile = oEvent.getParameters().files[0];
            //     var fileUploaderObj = this.byId("eSign");
            //     var fileName = fileUploaderObj.getValue();

            //     var fileNameTextObj = this.byId("selectedFileTextESign");
            //     fileNameTextObj.setText(fileName);

            //     this.getView().byId("_IDGenPDFViewerESign").setSource(URL.createObjectURL(this.selectedFile));

            //     if (!fileName) {
            //         MessageBox.warning("No File Selected");
            //     }
            // }, 
            // openPDFeSign: function () {
            //     this.byId("_IDGenPDFViewerESign").downloadPDF();
            // },
            addRow: function () {
                var columns = new ColumnListItem({
                    cells: [
                        new Input({ maxLength: 100 }),
                        new Input({ maxLength: 100 }),
                        new Input({ maxLength: 100 }),
                        new Input({ maxLength: 100 }),
                        new Input({ maxLength: 100 }),
                        new Input({ maxLength: 100 }),
                        new Input({ maxLength: 100 }),
                        new Input({ maxLength: 100 }),
                        new Input({ maxLength: 100 }),
                        // qty,
                        // taxAmtObj,
                        // taxCodeInput,
                        // new Input({maxLength:100}),
                        // hCodeInput,
                        // new Input({maxLength:100})
                    ]
                });

                var tableObj = this.byId('tableObj')
                var length = tableObj.getItems().length;
                if (length >= 10) {
                    MessageBox.warning("Cannot add more than 10 rows");
                } else {
                    tableObj.addItem(columns);
                }
            },
            deleteRow: function () {
                var tableObj = this.byId('tableObj');
                var rows = tableObj.getItems();
                var selectedRows = tableObj.getSelectedItems();
                var length = rows.length;
                if (selectedRows.length > 0) {
                    selectedRows.forEach(function (selectedRow) {
                        tableObj.removeItem(selectedRow);
                    })
                }
                else if (length > 0) {
                    tableObj.removeItem(rows[length - 1]);
                }
                else {
                    MessageBox.warning("No rows to delete");
                }
                // this.totalAmt();
            },
            onPressubmit: function () {
                var that = this
                var oTable_Selected = this.getView().byId("tableObj").getSelectedItems();

                var jsonArr = [];
                var sumAmt = 0;

                for (let selectedItem of oTable_Selected) {
                    sumAmt = sumAmt + parseFloat(selectedItem.getCells()[8].getText())
                    // console.log( selectedItem.getCells()[8].getText() )
                    jsonArr.push({
                        "PoNo": this.byId("poNo").getValue(),
                        "PortalNo": "",
                        "LineNo": selectedItem.getCells()[0].getText(),
                        "Item": selectedItem.getCells()[1].getText(),
                        "ItemDesc": selectedItem.getCells()[2].getText(),
                        "OrderQuantity": selectedItem.getCells()[3].getText(),
                        "DeliverQuantity": selectedItem.getCells()[4].getText(),
                        "InvoiceQty": selectedItem.getCells()[5].getValue(),
                        "Taxcode": selectedItem.getCells()[6].getText(),
                        "Taxamt": "0.000",
                        "Netpr": selectedItem.getCells()[7].getText(),
                        "Netwr": selectedItem.getCells()[8].getText(),
                        "Uom": ""
                    })
                }

                let payload = {
                    "VenderNo": this.byId("vendNo").getValue(),
                    "PoNo": this.byId("poNo").getValue(),
                    "PortalNo": "",
                    "InvoiceNo": this.byId("VIN").getValue(),
                    "InvoiceDate": this.byId("invDate").getValue(),
                    "Email": this.byId("email").getValue(),
                    "TotalSubAmt": sumAmt.toString(),
                    "po_lineitemSet": {
                        "results": jsonArr
                    }
                }
                console.log(payload)

                var oModel = this.getOwnerComponent().getModel();
                oModel.setUseBatch(false);

                oModel.create("/po_headerSet", payload, {
                    success: function (oData, oResponse) {

                        that.byId("poNo").setValue(null)
                        that.byId("VIN").setValue(null)
                        that.byId("invDate").setDateValue(null)
                        that.byId("invDoc").setValue(null)

                        let p = JSON.parse(oResponse.headers['sap-message'])
                        MessageBox.success(`${p.message}`)
                    },
                    error: function (err) {
                        var rr = JSON.parse(err.responseText)
                        MessageBox.error(rr.error.message.value);
                    }
                })

            }
        });
    });
