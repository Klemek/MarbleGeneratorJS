'floor|round|max|min|sqrt|pow'
.split('|')
    .forEach(function (p) {
        window[p] = Math[p];
    });

var ctx = canvas.getContext('2d'),
    width, height, T, Kr, seed0,
    Kg, Kb, S, w, h, map;



ctx.lineWidth = 0;

window.onresize = function () {
    update();
}

var seed = seed0 = Math.random();

function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function randint(mi, ma) {
    return floor(random() * (ma - mi) + mi);
}

function div(k) {
    return round(random() * 2 * k) - k;
}

function rgb(hsl) {
    var h = hsl[0] / 60,
        s = hsl[1],
        l = hsl[2],
        c = s * (1 - abs(2 * l - 1)),
        x = c * (1 - abs(h % 2 - 1)),
        m = l - c / 2,
        rgb;
    if (isNaN(h)) {
        rgb = [0, 0, 0];
    } else if (h < 1) {
        rgb = [c, x, 0];
    } else if (h < 2) {
        rgb = [x, c, 0];
    } else if (h < 3) {
        rgb = [0, c, x];
    } else if (h < 4) {
        rgb = [0, x, c];
    } else if (h < 5) {
        rgb = [x, 0, c];
    } else {
        rgb = [c, 0, x];
    }
    return [floor((rgb[0] + m) * 255), floor((rgb[1] + m) * 255), floor((rgb[2] + m) * 255)];
}

function padleft(s, v, n) {
    while (s.length < n) {
        s = v + s;
    }
    return s;
}

function hexa(rgb) {
    return "#" + padleft(rgb[0].toString(16), "0", 2) + padleft(rgb[1].toString(16), "0", 2) + padleft(rgb[2].toString(16), "0", 2);
}

function draw(map, T, w, h) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var j = 0; j < h; j += 1) {
        map = gen(map, w, j);
        for (var i = 0; i < w; i += 1) {
            ctx.fillStyle = hexa(map[i]);
            ctx.fillRect(i * T, j * T, (i + 1) * T, (j + 1) * T);
        }
    }
}

function mat(w) {
    var map = [],
        i;
    for (i = 0; i < w; i += 1) {
        map.push([0, 0, 0]);
    }
    return map;
}

function gen(map, w, y) {

    map2 = mat(w);

    if (y === 0) {
        if (rand.checked) {
            map2[0] = [randint(0, 256), randint(0, 256), randint(0, 256)];
        } else {
            map2[0] = [parseInt(r.value), parseInt(g.value), parseInt(b.value)];
        }
    }

    for (i = 0; i < w; i += 1) {
        if (i > 0 && y === 0) {
            var a1 = map2[i - 1][0],
                a2 = map2[i - 1][1],
                a3 = map2[i - 1][2];
        } else if (y > 0 && i === 0) {
            var a1 = map[i][0],
                a2 = map[i][1],
                a3 = map[i][2];
        } else if (i > 0 && y > 0) {
            var a1 = round(S * map2[i - 1][0] + (1 - S) * map[i][0]),
                a2 = round(S * map2[i - 1][1] + (1 - S) * map[i][1]),
                a3 = round(S * map2[i - 1][2] + (1 - S) * map[i][2]);
        }
        if (i !== 0 || y !== 0) {
            var v1 = a1 + div(Kr * fn(i, y)),
                v2 = a2 + div(Kg * fn(i, y)),
                v3 = a3 + div(Kb * fn(i, y));
            v1 = max(min(v1, 255), 0);
            v2 = max(min(v2, 255), 0);
            v3 = max(min(v3, 255), 0);
            map2[i] = [v1, v2, v3];
        }
    }
    return map2;
}

function fn(x, y) {
    return 1;
    /*var r = round(sqrt(pow(x, 2) + pow(y, 2)));
    if (r % 30 <= 5) {
        return 3;
    } else {
        return 1;
    }*/
}

function update() {
    newseed(false);
    update2();
    height = canvas.height = window.innerHeight;
    width = canvas.width = window.innerWidth;
    T = s.value;
    Kr = rdiv.value;
    Kg = gdiv.value;
    Kb = bdiv.value;
    S = slo.value / 100;
    w = floor(width / T) + 1;
    h = floor(height / T) + 1;
    draw(map, T, w, h);
}

function update2() {
    sl.textContent = "Size of squares : " + s.value;
    if (rand.checked) {
        color.textContent = "Base Color : Random";
    } else {
        color.textContent = "Base Color : (" + r.value + "," + g.value + "," + b.value + ")";
    }
    if (rdiv.value === gdiv.value && rdiv.value === bdiv.value) {
        $("div").val(rdiv.value);
        divl.textContent = "Divergence : " + divn.value;
    } else {
        divl.textContent = "Divergence : (" + rdiv.value + "," +
            gdiv.value + "," + bdiv.value + ")";
    }
    slol.textContent = "Slope : " + (slo.value / 100);

}

function update3() {
    rdiv.value = gdiv.value = bdiv.value = divn.value;
    update2();
}

function reset() {
    s.value = 10;
    rand.checked = true;
    lock.checked = false;
    r.value = g.value = b.value = 0;
    slo.value = 50;
    divn.value = rdiv.value = gdiv.value = bdiv.value = 20;
    newseed(false);
    update();
}

function amaze() {
    newseed(true);
    s.value = randint(5, 15);
    rand.checked = false;
    r.value = randint(0, 256);
    g.value = randint(0, 256);
    b.value = randint(0, 256);
    slo.value = randint(30, 70);
    divn.value = 0;
    rdiv.value = randint(0, 50);
    gdiv.value = randint(0, 50);
    bdiv.value = randint(0, 50);
    update();
}

function newseed(ignore) {
    if (!lock.checked || ignore) {
        seedt.value = random();
    }
    seed = seed0 = seedt.value;
}

function newseedbutton() {
    newseed(true);
    update();
}

function changeseed() {
    lock.checked = true;
    update();
}

function wheel(e) {
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    s.value = max(min(parseInt(s.value) + delta, 50), 1);
    update();
}

$(document).ready(function() {
    $('input[type=range]').on('input change',function(event){
    if(event.currentTarget.id != 'div'){
        update();
    }
    });
    $('#seedt').on('input change',changeseed);
    $('div').on('input change',update3);
    $('input[type=checkbox]').on('input',update);

    $('#newseed').click(newseedbutton);
    $('#reset').click(reset);
    $('#amaze').click(amaze);

    document.addEventListener("mousewheel", wheel, false);
    document.addEventListener("DOMMouseScroll", wheel, false);
    reset();
});

