sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/date/UI5Date",
    "sap/m/ColumnListItem",
    "sap/m/Input",
    "sap/ui/core/format/NumberFormat",
    "sap/m/Popover",
    "sap/m/SearchField",
    "sap/m/StandardListItem",
    "sap/m/PDFViewer",
    "sap/m/List"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox, UI5Date, ColumnListItem, Input) {
        "use strict";

        return Controller.extend("sapvim.controller.InvoiceUpload", {
            onInit: function () {

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
                if (length >= 10) 
                {
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
            }
        });
    });
