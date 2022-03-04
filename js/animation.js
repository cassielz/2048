function showNumberWithAnimation(i, j, randNumber) {
    var numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css('backgroundColor', getNumberBgdColor(randNumber));
    numberCell.css('color', getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        width: cellWidth,
        height: cellWidth,
        top: getPosTop(i),
        left: getPosLeft(j)
    }, 500);
}

function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $('#number-cell-' + fromx + '-' + fromy)
    numberCell.animate({
        top: getPosTop(tox),
        left: getPosLeft(toy),
    }, 200)

}