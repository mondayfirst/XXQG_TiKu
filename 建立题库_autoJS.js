/*
    @author: mondayfirst
    @github: https://github.com/mondayfirst/XXQG_TiKu
    @description: 本脚本可在Auto.js上执行。
*/

// =====================参数设置====================
var query_mode = "Json"; // 服务器答案查找模式，二选一："Server" or "Json" 
var 挑战答题索引 = "000001000000000000002010" // 挑战答题部分ui相对根节点的嵌套位置索引
var host = "https://mondayfirst.top/tiku/" // 网络题库URL路径
var tk_path = "题库_排序版.json" // 本地题库路径
var imagetext_true = "wuHxrFx3diBjHfgf52v8MvsAjGQAAAAAElFTkSuQmCC" // 答题正确时Image控件文本
var imagetext_false = "v5IOXn6lQWYTJeqX2eHuNcrPesmSud2JdogYyGnRNxujMT8RS7y43zxY4coWepspQkvwRDTJtCTsZ5JW+8sGvTRDzFnDeO+BcOEpP0Rte6f+HwcGxeN2dglWfgH8P0C7HkCMJOAAAAAElFTkSuQmCC" // 答题错误时Image控件文本
var privateModeStartVersion = "2.33.999"
var cycle_wait_time = 100 // 单位是毫秒
// ================================================
// =====================主程序运行====================
// ================================================
// 判断是否是隐私模式版本，新版本为隐私模式不可截屏，2.33版本可截屏
var isPrivateMode = version1GreaterVersion2(getVersion("cn.xuexi.android"), privateModeStartVersion)
// 其它全局变量定义
var globalAnswerRunning = false
var globalLastdate = new Date().getTime();
var globalIsObjFrame = false


if (!isPrivateMode) {
    requestScreenCapture() // 请求截屏
}

var thread_handling_access_exceptions = handling_access_exceptions();
var thread_handling_submit_exceptions = handling_submit_exceptions();

// 设置查找参数
if (query_mode == "Server") {
    // 服务器答案查找模式
    var get_answer = get_answer_from_server
    var post_answer = post_answer_to_server
}
else if (query_mode == "Json") {
    // 本地Json答案查找模式
    if (files.isFile(tk_path))
        var globalTiku = JSON.parse(json_str = files.read(tk_path))
    else {
        toastLog("没有目标题库文件，将写新文件输出")
        var globalTiku = {}
    }
    var get_answer = get_answer_from_json
    var post_answer = post_answer_to_json
}
else {
    toastLog("未选择题目答案的查找模式!退出中...")
    exit()
}

// 循环运行
while (true) {
    // 获取根节点
    globalIsObjFrame = false
    if (!className("android.widget.Image").depth(26).textMatches(/\S+/).exists()) {
        sleep(100)
        var obj_node = get_ui_obj_from_posstr(挑战答题索引)
        if (obj_node == null) {
            sleep(random_time(1000))
            continue
        }
        // 记录开始时间
        if (!globalAnswerRunning) {
            globalLastdate = new Date().getTime();
            globalAnswerRunning = true
        }
        globalIsObjFrame = true
        // 获取目标控件和文本
        var q_ui = get_ui_question_from_obj_node(obj_node);
        var a_uis = get_ui_answsers_from_obj_node(obj_node);
        var question = q_ui.text();
        var answers = new Array()
        for (var i = 0; i < a_uis.length; i++) {
            answers.push(a_uis[i].text())
        }
        console.log(join_question_with_answer(question, answers)) // 显示拼接后的键
        // 滑动窗口
        swipe_to_view_the_last_answer(a_uis); // 滑动窗口来显示最后一个答案
        // 点击答案
        var true_answer_index = get_answer(question, answers)
        if (true_answer_index >= 0) {
            click_answer_radio_button(a_uis, question, answers, true_answer_index, false, obj_node);
        }
        else {
            // 如果没有查找到答案，就随机一个选项来点击，如果是非隐私模式，截屏查找正确答案，否则选项正确才更新答案
            click_answer_radio_button(a_uis, question, answers, random(0, a_uis.length - 1), true, obj_node);
        }
    }
    sleep(cycle_wait_time)
    // 处理答题失败和50题选项
    if (jump_tips_50TrueQuestions() || jump_tips_ErrorAnswer()) {
        sleep(2000)
    }
}
// ================================================
// =======================函数======================
// =====================操作函数====================
function jump_tips_ErrorAnswer() {
    if (text("结束本局").exists() && !(text("continue.2d7587d1").exists())) {
        var nowdate = new Date().getTime();
        if (globalIsObjFrame && (nowdate - globalLastdate < 10000)) {
            sleep(random_time(10000 - nowdate + globalLastdate))
            globalAnswerRunning = false
        }
        text("结束本局").findOne().click()
        text("再来一局").findOne().click()
        return true;
    }
    return false;
}
function jump_tips_50TrueQuestions() {
    if (text("结束本局").exists() && text("continue.2d7587d1").exists()) {
        text("继续").findOne(3000).click()
        return true;
    }
    return false;
}
function swipe_to_view_the_last_answer(answer_uis) {
    var length = answer_uis.length
    var flag = false
    if (length <= 1) {
        return null
    }
    for (var i = 0; i < 10; i++) {
        flag = answer_uis[length - 1].bounds().bottom == answer_uis[length - 1].bounds().top
        if (flag) {
            // 滑动参数，当题目与答案较长时，需要滑动屏幕让最后一个答案显露出来。
            swipe(answer_uis[0].bounds().left, parseInt(device.height / 2), answer_uis[0].bounds().left, parseInt(device.height * 4 / 5), 500)
            sleep(random_time(0))
        }
        else {
            break
        }
    }
}
function click_answer_radio_button(answer_uis, question, answers, idx, isMustPost, obj_node) {
    answer_uis[idx].parent().click();
    var ansb = obj_node.child(1).bounds()
    var answers_region = [ansb.left, ansb.top, ansb.width(), ansb.height()]
    sleep(200)
    if (text(imagetext_true).exists()) {
        // 点击正确，视参数来更新答案
        var true_ans = answers[idx]
        if (isMustPost) {
            post_answer(question, answers, true_ans)
        }
    }
    else {
        // 点击错误，如果是非隐私安全模式，立刻截图更新答案
        if (!isPrivateMode) {
            sleep(500)
            var true_ans = find_true_answer_from_img(answer_uis, answers_region)
            post_answer(question, answers, true_ans)
        }
    }
}

function handling_submit_exceptions() {
    var thread_handling_submit_exceptions = threads.start(function () {
        while (true) {
            text("提交失败").waitFor();
            textContains("重试").className("android.widget.Button").findOne(3000).click()
            sleep(random_time(2000));
        }
    });
    return thread_handling_submit_exceptions;
}
function handling_access_exceptions() {
    /**
     * 处理访问异常
     * 该函数来源：https://github.com/dundunnp/auto_xuexiqiangguo
     */
    // 在子线程执行的定时器，如果不用子线程，则无法获取弹出页面的控件
    var thread_handling_access_exceptions = threads.start(function () {
        while (true) {
            textContains("访问异常").waitFor();
            // 滑动按钮">>"位置
            idContains("nc_1_n1t").waitFor();
            var bound = idContains("nc_1_n1t").findOne().bounds();
            // 滑动边框位置
            text("向右滑动验证").waitFor();
            var slider_bound = text("向右滑动验证").findOne().bounds();
            // 通过更复杂的手势验证（先右后左再右）
            var x_start = bound.centerX();
            var dx = x_start - slider_bound.left;
            var x_end = slider_bound.right - dx;
            var x_mid = (x_end - x_start) * random(5, 8) / 10 + x_start;
            var back_x = (x_end - x_start) * random(2, 3) / 10;
            var y_start = random(bound.top, bound.bottom);
            var y_end = random(bound.top, bound.bottom);
            x_start = random(x_start - 7, x_start);
            x_end = random(x_end, x_end + 10);
            gesture(random_time(0), [x_start, y_start], [x_mid, y_end], [x_mid - back_x, y_start], [x_end, y_end]);
            sleep(random_time(0));
            if (textContains("刷新").exists()) {
                click("刷新");
                continue;
            }
            if (textContains("网络开小差").exists()) {
                click("确定");
                continue;
            }
            // 执行脚本只需通过一次验证即可，防止占用资源
            // break;
        }
    });
    return thread_handling_access_exceptions;
}
// =====================通用函数====================
function random_time(time) {
    return time + random(100, 1000);
}
function get_root_node(root_node_classname) {
    // 获取框架的根节点，假设根节点类名为FrameLayout
    obj = className(root_node_classname).findOne()
    while (true) {
        if (obj.parent() == null) {
            break
        } else {
            obj = obj.parent()
        }
    }
    return obj
}
function is_child_ui_existed(root_node, seq_str) {
    // 根据相对位置嵌套索引，判断目标子节点是否存在，同时obj变为目标子节点
    if (!root_node)
        return false
    obj = root_node
    try {
        for (var i = 0; i < seq_str.length; i++) {
            childUIs = obj.children()
            index = parseInt(seq_str[i])
            if (childUIs.length > index)
                obj = childUIs[index]
            else
                return false
        }
    }
    catch (err) {
        console.log(err.description)
        return false
    }
    return true
}

function getVersion(package_name) {
    // 该函数来源：https://blog.csdn.net/aa490791706/article/details/122863666
    let pkgs = context.getPackageManager().getInstalledPackages(0).toArray();
    for (let i in pkgs) {
        if (pkgs[i].packageName.toString() === package_name) {
            return pkgs[i].versionName;
        }
    }
}
function version1GreaterVersion2(version1, version2, equal) {
    // 该函数来源：https://blog.csdn.net/aa490791706/article/details/122863666
    if (equal && version1 === version2) {
        return true;
    }
    let versionArr1 = version1.split('.');
    let versionArr2 = version2.split('.');
    let result = false;
    for (var i = 0; i < versionArr1.length; i++) {
        if (versionArr1[i] > versionArr2[i]) {
            result = true;
            break;
        }
    }
    return result;
}

// =====================脚本函数====================
function get_ui_obj_from_posstr(seq_str) {
    // 根据相对位置嵌套索引，从根节点向下寻找目标子节点
    obj = get_root_node("FrameLayout")
    if (!is_child_ui_existed(obj, seq_str))
        return null
    return obj
}

function get_ui_question_from_obj_node(obj_node) {
    // 从目标节点根据相对位置获取题目文本所在的节点
    return obj_node.child(0)
}

function get_ui_answsers_from_obj_node(obj_node) {
    // 从目标节点根据相对位置获取答案文本所在的节点
    a_parent_uis = obj_node.child(1).children()
    a_uis = new Array()
    for (var i = 0; i < a_parent_uis.length; i++) {
        a_uis.push(obj_node.child(1).child(i).child(0).child(1))
    }
    return a_uis
}

function find_true_answer_from_img(Nodes, region) {
    // 截图并从图片中根据答案的颜色寻找正确的答案选项，输出答案的文本
    var img = images.captureScreen();
    var point = images.findColor(img, '#3dbf75', {
        // 目的是防止找到倒计时的绿色进度条
        region: region,
        threshold: 4
    });
    if (point == null) {
        toastLog("Error:未找到正确答案！截屏失效(手动更改隐私模式参数)或颜色错误")
        throw "Error:未找到正确答案！截屏失效(手动更改隐私模式参数)或颜色错误"
    }
    var true_ans = null
    var x = point.x
    var y = point.y
    for (var i = 0; i < Nodes.length; i++) {
        var a = Nodes[i].bounds()
        if (y >= a.top && y <= a.bottom) {
            true_ans = Nodes[i].text();
            break;
        }
    }
    if (true_ans == null) {
        toastLog("Error:未找到答案！")
        throw "Error:未找到答案！"
    }
    return true_ans
}
function join_question_with_answer(question, answers) {
    question = question.replace(/ /g, "")
    var sort_answers = ([].concat(answers)).sort()
    var key = ([question].concat(sort_answers)).join("|")
    return key
}
// =====================题库函数====================
/////////////////通过服务器获取答案
function post_answer_to_server(question, answers, true_ans) {
    // 发送请求到服务器更新答案
    var key = join_question_with_answer(question, answers)
    try {
        res = http.post(host + "add", {
            "q": key,
            "a": true_ans,
        })
    } catch (err) {
        console.log("服务器连接失败或超时，请检查网络主机地址或等待响应")
        sleep(10000)
    }
    log(question + res.statusCode)
}

function get_answer_from_server(question, answers) {
    // 从服务器获取正确答案，本地检索正确答案的索引并输出
    var true_answer_index = -1
    var key = join_question_with_answer(question, answers)
    try {
        res = http.post(host + "query", { "q": key })
    } catch (err) {
        console.log("服务器连接失败或超时，请检查网络主机地址或等待响应")
        sleep(10000)
    }
    if (res.statusCode == 200) {
        true_ans = res.body.string()
        for (var i = 0; i < answers.length; i++) {
            if (true_ans == answers[i]) {
                true_answer_index = i
                break
            }
        }
    }
    return true_answer_index
}

/////////////////通过本地json获取答案
function post_answer_to_json(question, answers, true_ans) {
    // 发送题目到Json更新答案
    var key = join_question_with_answer(question, answers)
    globalTiku[key] = true_ans
    files.write(tk_path, JSON.stringify(globalTiku))
}

function get_answer_from_json(question, answers) {
    // 从Json获取正确答案，本地检索正确答案的索引并输出
    if (!globalTiku)
        toastLog("ERROR:没有题库文件")
    var true_index = -1
    var key = join_question_with_answer(question, answers)
    var true_ans = globalTiku[key]
    for (var i = 0; i < answers.length; i++) {
        if (true_ans == answers[i]) {
            true_index = i
            break
        }
    }
    return true_index
}