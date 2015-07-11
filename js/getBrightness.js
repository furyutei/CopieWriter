// 参考： http://ofo.jp/osakana/cgtips/grayscale.phtml
//        osakana.factory - グレースケールのひみつ

// カラーコードから明度を取得（NTSC係数による加重平均法）
var getBrightness = function (colorcode, max_value) {
    // カラーコード(3桁もしくは6桁)
    if (!colorcode.match(/^#?([0-9a-fA-F]{3,6})$/)) {
        return false;
    }
    colorcode = RegExp.$1;
    if (0 < colorcode.length % 3) {
        return false;
    }
    var keta = colorcode.length / 3;
    
    if (isNaN(max_value) || max_value <= 0) {max_value = 100};
    
    // カラーコードをRGBそれぞれに分割
    var rgb = [];
    colorcode.replace(new RegExp('.{' + keta + '}', 'g'), function(hex) {
        rgb.push(parseInt(hex, 16));
        return hex;
    });
    
    // グレースケールに変換し、これを明度とみなす
    var rmod = 0.298912, gmod = 0.586611, bmod = 0.114478;
    var brightness = Math.floor( (rmod * rgb[0] + gmod * rgb[1] + bmod * rgb[2]) * max_value / (Math.pow(16, keta) - 1) );
    
    return brightness;
};  //  end of getBrightness()


// ■ end of file
