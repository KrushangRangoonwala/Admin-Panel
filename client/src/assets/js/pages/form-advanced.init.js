import Choices from "choices.js";
import Pickr from "@simonwep/pickr";
import flatpickr from "flatpickr";


document.addEventListener("DOMContentLoaded", function () {
    // your entire Choices / Pickr / Flatpickr setup here
    // Choices.js: initialize on any element with [data-trigger]
    document.querySelectorAll("[data-trigger]").forEach((el) => {
        new Choices(el, {
            placeholderValue: "This is a placeholder set in the config",
            searchPlaceholderValue: "This is a search placeholder",
        });
    });

    // Example of manual Choices on specific elements
    // new Choices("#choices-single-no-search", {
    //   searchEnabled: false,
    //   removeItemButton: true,
    //   choices: [
    //     { value: "One", label: "Label One" },
    //     { value: "Two", label: "Label Two", disabled: true },
    //     { value: "Three", label: "Label Three" },
    //   ],
    // }).setChoices(
    //   [
    //     { value: "Four", label: "Label Four", disabled: true },
    //     { value: "Five", label: "Label Five" },
    //     { value: "Six", label: "Label Six", selected: true },
    //   ],
    //   "value",
    //   "label",
    //   false
    // );

    // new Choices("#choices-single-no-sorting", { shouldSort: false });
    // new Choices("#choices-multiple-remove-button", { removeItemButton: true });
    // new Choices(document.getElementById("choices-multiple-groups"));
    // new Choices(document.getElementById("choices-text-remove-button"), {
    //   delimiter: ",",
    //   editItems: true,
    //   maxItemCount: 5,
    //   removeItemButton: true,
    // });
    // new Choices("#choices-text-unique-values", {
    //   paste: false,
    //   duplicateItemsAllowed: false,
    //   editItems: true,
    // });
    // new Choices("#choices-text-disabled", {
    //   addItems: false,
    //   removeItems: false,
    // }).disable();

    // Pickr: init multiple pickers
    // ["classic", "monolith", "nano"].forEach((theme) => {
    //     Pickr.create({
    //         el: `.${theme}-colorpicker`,
    //         theme,
    //         default: "#038edc",
    //         swatches: [
    //             "rgba(244, 67, 54, 1)",
    //             "rgba(233, 30, 99, 0.95)",
    //             "rgba(156, 39, 176, 0.9)",
    //             "rgba(103, 58, 183, 0.85)",
    //             "rgba(63, 81, 181, 0.8)",
    //         ],
    //         defaultRepresentation: "HEXA",
    //         components: {
    //             preview: true,
    //             opacity: true,
    //             hue: true,
    //             interaction: {
    //                 hex: true,
    //                 rgba: true,
    //                 hsva: true,
    //                 input: true,
    //                 clear: true,
    //                 save: true,
    //             },
    //         },
    //     });
    // });

    // Flatpickr: attach to inputs
    flatpickr("#datepicker-basic");
    flatpickr("#datepicker-datetime", {
        enableTime: true,
        dateFormat: "m-d-Y H:i",
    });
    flatpickr("#datepicker-humanfd", {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    });
    flatpickr("#datepicker-minmax", {
        minDate: "today",
        maxDate: new Date().fp_incr(14),
    });
    flatpickr("#datepicker-disable", {
        disable: ["2025-01-30", "2025-02-21", "2025-03-08", new Date(2025, 4, 9)],
        dateFormat: "Y-m-d",
    });
    flatpickr("#datepicker-multiple", { mode: "multiple", dateFormat: "Y-m-d" });
    flatpickr("#datepicker-range", { mode: "range" });
    flatpickr("#datepicker-timepicker", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
    });
    flatpickr("#datepicker-inline", { inline: true });
});
