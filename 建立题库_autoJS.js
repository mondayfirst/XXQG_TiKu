/*
    @author: Mondayfirst
    @github: https://github.com/Mondayfirst/XXQG_TiKu
    @description: 本脚本可在Auto.js上执行。
*/

// =====================主程序====================
requestScreenCapture() // 请求截屏

// 设置查找参数
var query_mode = "Json" // "Server" or "Json"
if (query_mode == "Server") {
    // 服务器答案查找模式
    var host="http://mondayfirst.top/tiku/"
    var get_answer = get_answer_from_server
    var post_answer = post_answer_to_server
}
else if (query_mode == "Json") {
    // 本地Json答案查找模式
    var tk_path = "我的题库.json"
    // 注意：tk参数是全局变量
    if (files.isFile(tk_path))
        var tk = JSON.parse(json_str = files.read(tk_path)) 
    else {
        console.log("没有目标题库文件，将写新文件输出")
        toast("没有目标题库文件，将写新文件输出")
        var tk = {}
    }
    var get_answer = get_answer_from_json
    var post_answer = post_answer_to_json
}
else {
    console.log("未选择题目答案的查找模式")
}

// 挑战答题部分ui相对根节点的嵌套位置索引
var 挑战答题索引 = "000001000000000000002010"

// 循环运行
while (true) {
    var obj_node = get_ui_obj_from_posstr(挑战答题索引)
    if (obj_node == null) {
        sleep(1000)
        continue
    }
    var q_ui = get_ui_question_from_obj_node(obj_node)
    var a_uis = get_ui_answsers_from_obj_node(obj_node)
    var answers = new Array()
    for (var i = 0; i < a_uis.length; i++) {
        answers.push(a_uis[i].text())
    }
    console.log(q_ui.text() + answers.join("|"))
    if (a_uis.length > 1) {
        for (var i = 0; i < 4; i++){
            if (a_uis[a_uis.length - 1].bounds().bottom == a_uis[a_uis.length - 2].bounds().bottom) {
                // 滑动参数，当题目与答案较长时，需要滑动屏幕让最后一个答案显露出来。
                swipe(500, 1000, 500, 1400, 1000) 
            }
            else {
                break
            }
        }
    }
    var true_answer_index = get_answer(q_ui.text(), answers)
    if (true_answer_index < 0) {
        // 如果没有查找到答案，就通过点击第一个选项来获取正确答案
        a_uis[0].parent().click()
        sleep(700)
        var true_ans = find_true_answer_from_img(a_uis)
        console.log(q_ui.text() + true_ans)
        post_answer(q_ui.text(), answers, true_ans)
    }
    else {
        a_uis[true_answer_index].parent().click()
    }
    sleep(2000)
    if (text("结束本局").exists()) {
        toast("等待8秒")
        sleep(8000)
        text("结束本局").findOne().click()
        text("再来一局").findOne().click()
    }
}

// =====================基础函数====================
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

// =====================学习强国====================
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

function find_true_answer_from_img(Nodes) {
    // 截图并从图片中根据答案的颜色寻找正确的答案选项，输出答案的文本
    var img = images.captureScreen();
    point = images.findColor(img, "#3dbf75")
    var true_ans = null
    for (var i = 0; i < Nodes.length; i++) {
        var a = Nodes[i].bounds()
        var x = point.x
        var y = point.y
        if (x >= a.left && y >= a.top && x <= a.right && y <= a.bottom) {
            true_ans = Nodes[i].text()
            break;
        }
    }
    if (!true_ans) {
        true_ans = Nodes[0].text()
    }
    return true_ans
}

function join_question_with_answer(question, answers) {
    var sort_answers = ([].concat(answers)).sort()
    var key = ([question].concat(sort_answers)).join("|")
    return key
}

/////////////////通过服务器获取答案
function post_answer_to_server(question, answers, true_ans) {
    // 发送请求到服务器更新答案
    var key = join_question_with_answer(question, answers)
    res = http.post(host + "add", {
        "q": key,
        "a": true_ans,
    })
    log(question + res.statusCode)
}

function get_answer_from_server(question, answers) {
    // 从服务器获取正确答案，本地检索正确答案的索引并输出
    var true_answer_index = -1
    var key = join_question_with_answer(question, answers)
    res = http.post(host + "query", {"q": key})
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
    tk[key] = true_ans
    files.write(tk_path, JSON.stringify(tk))
}

function get_answer_from_json(question, answers) {
    // 从Json获取正确答案，本地检索正确答案的索引并输出
    if (!tk)
        toastLog("ERROR:没有题库文件")
    var true_index = -1
    var key = join_question_with_answer(question, answers)
    var true_ans = tk[key]
    for (var i = 0; i < answers.length; i++) {
        if (true_ans == answers[i]) {
            true_index = i
            break
        }
    }
    return true_index
}