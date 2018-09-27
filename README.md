Color Factory
======================
> デジタルカラーカードで配色考察とかしちゃう君

## Features
* Tool
    * palette data save
    * undo `ctrl+z` / redo `ctrl+shift+z`
    * pick Background-color
    * select all `ctrl+a`
    * View
        * fill/text
        * filter: grayscale
        * color models
    * sortable: hue, hue(circle), saturationl, lightness, saturationv, value, chroma, gray, contrast
* Color cards
    * auto color name: Source: [XKCD Color Names](https://xkcd.com/color/rgb/)
    * selectable
    * movable
    * Right click on Card!
        * Rename
        * Duplicate
        * Reverse: fill/text
        * Delete
* Color picker
    * input model(format): Hex, RGB, HSL, HSV, XYZ, LAB, CMYK
    * HSV Color picker
    * Random Color
    * mixer:
        * between 2colors mixer
    * [WCAG2.0 1.4.3 Contrast](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast)
        * AAA(7:1)
        * AA(4.5:1)
        * A(3:1)
        * Not Readable
    * Alpha Blending: `a=1`
* Color lists
    * Web Color Names 140colors
    * [JIS慣用色 和名](http://www.color-sample.com/popular/jiscolor/ja/)
    * [JIS慣用色 英名](http://www.color-sample.com/popular/jiscolor/en/)
    * [Material UI Colors](http://material.io/guidelines/style/color.html#color-color-palette)
    * [RAL](http://www.ral-farben.de/): Source: http://www.ralcolor.com/
    * [PANTONE®](http://www.pantone.com): Source https://github.com/frontendstacked/color-palettes-for-sass
    * [crayola](https://www.w3schools.com/colors/colors_crayola.asp)

## Dependencies
* [svelte.js](https://svelte.technology/)
* [color.js](https://github.com/Qix-/color)

## Inspiration
* [mozilla/Color picker tool](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Colors/Color_picker_tool)
