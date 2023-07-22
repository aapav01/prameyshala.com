require.config({
    paths: {
        fontawesome: "vendor/fontawesome/fontawesome.min",
        "fontawesome/regular": "vendor/fontawesome/regular.min",
        "fontawesome/light": "vendor/fontawesome/light.min",
        "fontawesome/duotone": "vendor/fontawesome/duotone.min",
    },
    shim: {
        fontawesome: {
            deps: [
                "fontawesome/regular",
                "fontawesome/light",
                "fontawesome/duotone",
            ],
        },
    },
});

require(["fontawesome"], function (fontawesome) {
    console.log("Loaded icons...");
});
