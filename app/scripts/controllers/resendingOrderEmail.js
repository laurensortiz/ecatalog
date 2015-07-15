'use strict';

angular.module('conductivEcatalogApp')
    .controller('ResendingOrderEmailCtrl', function ($scope, catalog, $rootScope, order) {

        $scope.emails = "";

        $scope.resendingOrderEmailPopupOptions = {
            backdropFade: false,
            dialogFade: false,
            backdropClick: false,
            dialogClass: "modal small-form-modal drop-shadow"
        }

        $scope.sendEmails = function () {
            order.sendEmail($scope.$parent.order.id, "Excel", 'PO #' + $scope.$parent.order.purchaseOrder, $scope.emails.split(","));
            $scope.closeResendingOrderEmailDialog();
            $scope.openEmailConfirmationModal();
        }

        $scope.showEmailConfirmationModal = false;

        $scope.emailConfirmationModalOptns = {
            backdropFade: false,
            dialogFade: false,
            backdropClick: false,
            dialogClass: "modal small-modal drop-shadow"
        };

        $scope.closeEmailConfirmationModal = function () {
            $scope.showEmailConfirmationModal = false;
        };
        $scope.openEmailConfirmationModal = function () {
            $scope.showEmailConfirmationModal = true;
        };

    });