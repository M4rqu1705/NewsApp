function set_theme(color) {
    const themes = ["default",
        "darkaquamarine",
        "coolmonochrome",
        "darkred",
        "ice-cream-cone",
        "fiery-earth",
        "bee",
        "darkblue",
        "cyanblue",
        "c1blue",
        "purple"
    ];

    color = color.toLowerCase().trim();

    if (themes.includes(color)) {
        localStorage.setItem("theme", color);

        switch (color.toLowerCase().trim()) {
            // root.style.setProperty("--main-bg-color",);
            // root.style.setProperty("--alternate-bg-color",);
            // root.style.setProperty("--main-color",);
            // root.style.setProperty("--accent-color",);
            // root.style.setProperty("--overlay-background",);
            // root.style.setProperty("--navbar-color",);

            case "default":
                root.style.setProperty("--main-bg-color", "#ffffff");
                root.style.setProperty("--alternate-bg-color", "#e5e5e5");
                root.style.setProperty("--main-color", "#000000");
                root.style.setProperty("--accent-color", "#fca311");
                root.style.setProperty("--overlay-background", "#ffffff");
                root.style.setProperty("--navbar-color", "#14213d");
                break;

            case "darkaquamarine":
                root.style.setProperty("--main-bg-color", "#ffffff");
                root.style.setProperty("--alternate-bg-color", "#d9d9d9");
                root.style.setProperty("--main-color", "#353535");
                root.style.setProperty("--accent-color", "#284b63");
                root.style.setProperty("--overlay-background", "#ffffff");
                root.style.setProperty("--navbar-color", "#3c6e71");
                break;

            case "coolmonochrome":
                root.style.setProperty("--main-bg-color", "#e0fbfc");
                root.style.setProperty("--alternate-bg-color", "#c2dfe3");
                root.style.setProperty("--main-color", "#253237");
                root.style.setProperty("--accent-color", "#5c6b73");
                root.style.setProperty("--overlay-background", "#e0fbfc");
                root.style.setProperty("--navbar-color", "#9db4c0");
                break;

            case "darkred":
                root.style.setProperty("--main-bg-color", "#edddd4");
                root.style.setProperty("--alternate-bg-color", "#cfbdb2");
                root.style.setProperty("--main-color", "#283d3b");
                root.style.setProperty("--accent-color", "#c44536");
                root.style.setProperty("--overlay-background", "#edddd4");
                root.style.setProperty("--navbar-color", "#772e25");
                break;

            case "ice-cream-cone":
                root.style.setProperty("--main-bg-color", "#faf9f9");
                root.style.setProperty("--alternate-bg-color", "#ffd6ba");
                root.style.setProperty("--main-color", "#555b6e");
                root.style.setProperty("--accent-color", "#89b0ae");
                root.style.setProperty("--overlay-background", "#faf9f9");
                root.style.setProperty("--navbar-color", "#bee3db");
                break;

            case "fiery-earth":
                root.style.setProperty("--main-bg-color", "#fffcf2");
                root.style.setProperty("--alternate-bg-color", "#ccc5b9");
                root.style.setProperty("--main-color", "#252422");
                root.style.setProperty("--accent-color", "#eb5e28");
                root.style.setProperty("--overlay-background", "#fffcf2");
                root.style.setProperty("--navbar-color", "#403d39");
                break;

            case "bee":
                root.style.setProperty("--main-bg-color", "#e8eddf");
                root.style.setProperty("--alternate-bg-color", "#cfdbd5");
                root.style.setProperty("--main-color", "#242423");
                root.style.setProperty("--accent-color", "#f5cb5c");
                root.style.setProperty("--overlay-background", "#e8eddf");
                root.style.setProperty("--navbar-color", "#333533");
                break;

            case "darkblue":
                root.style.setProperty("--main-bg-color", "#e0e1dd");
                root.style.setProperty("--alternate-bg-color", "#778da9");
                root.style.setProperty("--main-color", "#0d1b2a");
                root.style.setProperty("--accent-color", "#1b263b");
                root.style.setProperty("--overlay-background", "#e0e1dd");
                root.style.setProperty("--navbar-color", "#415a77");
                break;
            case "cyanblue":
                root.style.setProperty("--main-bg-color", "#caf0f8");
                root.style.setProperty("--alternate-bg-color", "#90e0ef");
                root.style.setProperty("--main-color", "#03045e");
                root.style.setProperty("--accent-color", "#00b4d8");
                root.style.setProperty("--overlay-background", "#caf0f8");
                root.style.setProperty("--navbar-color", "#0077b6");
                break;
            case "c1blue":
                root.style.setProperty("--main-bg-color", "#e0fbfc");
                root.style.setProperty("--alternate-bg-color", "#98c1d9");
                root.style.setProperty("--main-color", "#293241");
                root.style.setProperty("--accent-color", "#ee6c4d");
                root.style.setProperty("--overlay-background", "#e0fbfc");
                root.style.setProperty("--navbar-color", "#3d5a80");
                break;
            case "purple":
                root.style.setProperty("--main-bg-color", "#f3e9d2");
                root.style.setProperty("--alternate-bg-color", "#c9ada7");
                root.style.setProperty("--main-color", "#22223b");
                root.style.setProperty("--accent-color", "#4a4e69");
                root.style.setProperty("--overlay-background", "#f3e9d2");
                root.style.setProperty("--navbar-color", "#9a8c98");

                break;

        }
    }
}