ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        $(element).toggle(valueAccessor());
    },
    update: function (element, valueAccessor) {
        valueAccessor() ? $(element).fadeIn() : $(element).fadeOut();
    }
};
