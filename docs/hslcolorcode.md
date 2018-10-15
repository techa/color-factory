# zaa - A short HSL color code like "#000"
Because RGB is inconvenient, I want to express color with HSL!
But HSL code "hsl()" is too long!
I would like to propose a short HSL code '$000'.

RGBは不便だからHSLで表記したい！
だけどHSLのコード”hsl()”は長過ぎる！
そこで短いHSLコード'%000'を提案したい。

    $ is prefix
       \
        $zaa   =>   hsl(350, 100%, 100%)
        ///
      [1] = Hue(*10)         0~35 as 0123456789abcdefghijklmnopqrstuvwxyz
      [2] = Saturation(*10)  0~10 as 0123456789a
      [3] = Lightness(*10)   0~10 as 0123456789a
    
    $ is prefix
       \
        $z9a0a0   =>   hsl(359, 100%, 100%)
        //////
      [1] = Hue(*10)         0~35 as 0123456789abcdefghijklmnopqrstuvwxyz
      [2] = Hue(*1)          0~9
      [3] = Saturation(*10)  0~10 as 0123456789a
      [4] = Saturation(*1)   0~9
      [5] = Lightness(*10)   0~10 as 0123456789a
      [6] = Lightness(*1)    0~9

## Hue0~35
* 0 Red
* 6 Yellow
* c Green(lime)
* i Cyan
* o Blue
* u Magenta
