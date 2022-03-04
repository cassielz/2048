var nums = new Array()
var score = 0
var gameoverState = false
var hasConflicted = new Array()

var startx = 0
var starty = 0
var endx = 0
var endy = 0


// $(document).ready()
//jQuery的入口函数
$(function () {
    newgame()
})

//开始新游戏
function newgame() {
    if (documentWidth > 500) {
        containerWidth = 500;
        cellWidth = 100;
        cellSpace = 20;
    } else {
        //设置移动端尺寸
        settingForMobile();
    }

    init()
    //在随机的两个单元格中生成数字
    generateOneNumber()
    generateOneNumber()
}

function settingForMobile() {
    $('#header .wrapper').css('width', containerWidth);

    //我这里跟老师的不同：我用的是c3盒子模型，所以padding是包含在width里的
    $('#grid-container').css('width', containerWidth);
    $('#grid-container').css('height', containerWidth);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', containerWidth * 0.02);

    $('.grid-cell').css('width', cellWidth);
    $('.grid-cell').css('height', cellWidth);
    $('.grid-cell').css('border-radius', cellWidth * 0.06);
}

//初始化页面
function init() {
    //初始化（下层）单元格的位置
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $('#grid-cell-' + i + '-' + j)
            gridCell.css('top', getPosTop(i)).css('left', getPosLeft(j))
            // gridCell.css('left', getPosLeft(j))
        }
    }
    //初始化数组
    for (var i = 0; i < 4; i++) {
        nums[i] = new Array()
        hasConflicted[i] = new Array()
        for (var j = 0; j < 4; j++) {
            nums[i][j] = 0
            hasConflicted[i][j] = false
        }
    }

    // nums[0][2] = 4
    // nums[2][3] = 16

    updateView()

    score = 0
    updateScore(score)
    gameoverState = false
}

//动态创建（上层）单元格并初识化
function updateView() {
    //将上层所有单元格清空，然后重新初始化创建
    $('.number-cell').remove()

    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            //首先生成16个单元格
            $('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>')

            var numberCell = $('#number-cell-' + i + '-' + j)

            if (nums[i][j]) {
                numberCell.css('width', cellWidth).css('height', cellWidth)
                numberCell.css('top', getPosTop(i)).css('left', getPosLeft(j))
                numberCell.text(nums[i][j])
                numberCell.css('backgroundColor', getNumberBgdColor(nums[i][j]))
                numberCell.css('color', getNumberColor(nums[i][j]))
            } else {
                numberCell.css('width', 0).css('height', 0)
                numberCell.css('top', getPosTop(i) + cellWidth * 0.5).css('left', getPosLeft(j) + cellWidth * 0.5)
            }
            hasConflicted[i][j] = false

            //移动端尺寸
            $('.number-cell').css('border-radius', cellWidth * 0.06);
            $('.number-cell').css('font-size', cellWidth * 0.5);
            $('.number-cell').css('line-height', cellWidth + 'px');
        }
    }
}

/*
    在随机的单元格中生成一个随机数：
    1.在空余的单元格中随机找一个
    2.随机产生一个2或4
*/
function generateOneNumber() {
    //判断是否还有空间，如果没有空间则直接返回
    if (noSpace(nums)) {
        return
    }

    //随机一个空位置
    var count = 0
    var temp = new Array()
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (nums[i][j] == 0) {
                temp[count] = i * 4 + j  //1*4+3=7 ----> 7/4=1 7%4=3 
                count++;
            }
        }
    }

    var pos = Math.floor(Math.random() * count)
    var randx = Math.floor(temp[pos] / 4)
    var randy = Math.floor(temp[pos] % 4)

    //随机一个数字
    var randNum = Math.random() < 0.5 ? 2 : 4

    //在随机位置上显示随机数字
    nums[randx][randy] = randNum
    showNumberWithAnimation(randx, randy, randNum)
}

//实现键盘响应
$(document).keydown(function (event) {
    //阻止事件的默认动作
    event.preventDefault();

    switch (event.keyCode) {
        case 37: //left
            //判断是否可以向左移动
            if (canMoveLeft(nums)) {
                moveLeft();
                setTimeout(generateOneNumber, 200);
                setTimeout(isGameOver, 700);
            }
            break;
        case 38: //up
            if (canMoveUp(nums)) {
                moveUp();
                setTimeout(generateOneNumber, 200);
                setTimeout(isGameOver, 700);
            }
            break;
        case 39: //right
            if (canMoveRight(nums)) {
                moveRight();
                setTimeout(generateOneNumber, 200);
                setTimeout(isGameOver, 700);
            }
            break;
        case 40: //down
            if (canMoveDown(nums)) {
                moveDown();
                setTimeout(generateOneNumber, 200);
                setTimeout(isGameOver, 700);
            }
            break;
        default:
            break;
    }
})

//实现触摸滑动响应
document.addEventListener('touchstart', function (event) {
    startx = event.touches[0].pageX;
    starty = event.touches[0].pageY;
});

document.addEventListener('touchend', function (event) {
    endx = event.changedTouches[0].pageX;
    endy = event.changedTouches[0].pageY;

    //判断滑动方向
    var deltax = endx - startx;
    var deltay = endy - starty;

    //判断当滑动距离小于一定的阈值时不做任何操作
    if (Math.abs(deltax) < documentWidth * 0.08 && Math.abs(deltay) < documentWidth * 0.08) {
        return;
    }

    if (Math.abs(deltax) >= Math.abs(deltay)) { //水平方向移动
        if (deltax > 0) { //向右移动
            if (canMoveRight(nums)) {
                moveRight();
                setTimeout(generateOneNumber, 200);
                setTimeout(isGameOver, 500);
            }
        } else { //向左移动
            if (canMoveLeft(nums)) {
                moveLeft();
                setTimeout(generateOneNumber, 200);
                setTimeout(isGameOver, 500);
            }
        }
    } else { //垂直方向移动
        if (deltay > 0) { //向下移动
            if (canMoveDown(nums)) {
                moveDown();
                setTimeout(generateOneNumber, 200);
                setTimeout(isGameOver, 500);
            }
        } else { //向上移动
            if (canMoveUp(nums)) {
                moveUp();
                setTimeout(generateOneNumber, 200);
                setTimeout(isGameOver, 500);
            }
        }
    }

})

//向左移动
//需要对每一个数字的左边进行判断，选择落脚点，落脚点有两种情况：
//1.落脚点没有数字，并且移动路径中没有障碍物
//2.落脚点数字和自己相同，并且移动路径中没有障碍物
function moveLeft() {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            //有数字格（想要移动）
            if (nums[i][j]) {
                //同行最左边依次向右到j列之前检查空格 给数字格让位
                for (var k = 0; k < j; k++) {
                    if (nums[i][k] == 0 && noBlockHorizontal(i, k, j, nums)) {
                        //move
                        showMoveAnimation(i, j, i, k)
                        nums[i][k] = nums[i][j]
                        nums[i][j] = 0
                        break
                    } else if (nums[i][k] == nums[i][j] && noBlockHorizontal(i, k, j, nums) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k)
                        nums[i][k] = nums[i][k] * 2
                        nums[i][j] = 0
                        //统计分数
                        score += nums[i][k]
                        updateScore(score)

                        hasConflicted[i][k] = true
                        break
                    }
                }
            }
        }
    }
    setTimeout(updateView, 200);
}

function moveRight() {
    for (var i = 0; i < 4; i++) {
        for (var j = 2; j >= 0; j--) {
            //有数字格（想要移动）
            if (nums[i][j]) {
                //同行最右边依次向左到j列检查空格 给数字格让位
                for (var k = 3; k > j; k--) {
                    if (nums[i][k] == 0 && noBlockHorizontal(i, j, k, nums)) {
                        //move
                        showMoveAnimation(i, j, i, k)
                        nums[i][k] = nums[i][j]
                        nums[i][j] = 0
                        break
                    } else if (nums[i][k] == nums[i][j] && noBlockHorizontal(i, j, k, nums) && !hasConflicted[i][k]) {
                        showMoveAnimation(i, j, i, k)
                        nums[i][k] = nums[i][k] * 2
                        nums[i][j] = 0
                        //统计分数
                        score += nums[i][k]
                        updateScore(score)

                        hasConflicted[i][k] = true
                        break
                    }
                }
            }
        }
    }
    setTimeout(updateView, 200);
}

function moveUp() {
    for (var j = 0; j < 4; j++) {
        for (var i = 1; i < 4; i++) {
            if (nums[i][j]) {
                for (var k = 0; k < i; k++) {
                    if (nums[k][j] == 0 && noBlockVertical(j, k, i, nums)) {
                        showMoveAnimation(i, j, k, j)
                        nums[k][j] = nums[i][j]
                        nums[i][j] = 0
                        break
                    } else if (nums[k][j] == nums[i][j] && noBlockVertical(j, k, i, nums) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j)
                        nums[i][j] = 0
                        nums[k][j] *= 2
                        score += nums[k][j]
                        updateScore(score)

                        hasConflicted[k][j] = true
                        break
                    }
                }
            }
        }
    }
    setTimeout(updateView, 200);
}

function moveDown() {
    for (var j = 0; j < 4; j++) {
        for (var i = 2; i >= 0; i--) {
            if (nums[i][j]) {
                for (var k = 3; k > i; k--) {
                    if (nums[k][j] == 0 && noBlockVertical(j, i, k, nums)) {
                        showMoveAnimation(i, j, k, j)
                        nums[k][j] = nums[i][j]
                        nums[i][j] = 0
                        break
                    } else if (nums[k][j] == nums[i][j] && noBlockVertical(j, i, k, nums) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j)
                        nums[i][j] = 0
                        nums[k][j] *= 2
                        score += nums[k][j]
                        updateScore(score)

                        hasConflicted[k][j] = true
                        break
                    }
                }
            }
        }
    }
    setTimeout(updateView, 200);
}