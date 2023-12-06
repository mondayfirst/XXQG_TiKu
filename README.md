<p align="center">
    <h2 align="center">学习强国——挑战答题题库</h2>
    <p align="center">
        <a href="https://github.com/mondayfirst/XXQG_TiKu/blob/main/LICENSE" target="blank">
            <img src="https://img.shields.io/github/license/mondayfirst/XXQG_TiKu" alt="license"/>
        </a>
        <a href="https://github.com/mondayfirst/XXQG_TiKu/search?l=javascript" target="blank">
            <img src="https://img.shields.io/github/languages/top/mondayfirst/XXQG_TiKu" alt="languages"/>
        </a>
    </p>
</p>


简单胜过繁杂  

---
##### 一、注意：  
1. 格式：  
&emsp;&emsp;json文件中的格式是：`问题|答案1|答案2|...:正确答案`。问题(去除空格)，与可选答案之间以`|`符号分隔。  
&emsp;&emsp;`题库_排序版.json`为保证题目的唯一性，先去除可选答案的序号，再对几个选项进行列表排序。  
2. 预览  
&emsp;&emsp;首页不再显示题目，可点击`题库_排序版.md`文件全览题目  
3. 数据来源  
&emsp;&emsp;根据安卓手机无障碍服务获取控件内容，并在`挑战答题`页面自动答题获得全部题目与正确答案。  
&emsp;&emsp;因获取时间跨度较长，同一题目可能存在不同版本，一并保留。
4. 脚本  
&emsp;&emsp;详情见`xxqg_tiku_client/建立题库.js`代码文件（不再支持本地json），注释个人认为比较清楚。有问题提issue。  
5. 服务器  
&emsp;&emsp;服务器端仅提供简单flask单文件版本，不再使用复杂版本。  
6. 隐私模式  
&emsp;&emsp;隐私安全模式下无法截屏，只能通过随机选项点击后观察答案是否正确的步骤来获取正确答案。  
  

##### 二、免责声明  
&emsp;&emsp;本题库及相关代码仅用于个人学习，下载后请勿用于商业或违法活动。使用本题库时请**添加题库的来源说明**，增加本项目的曝光度。  
&emsp;&emsp;疑似使用：App Store上的“强国题库 - 强国学习好帮手”
##### 三、更新日志  
###### 20231206  
1. 修改服务器程序代码，支持错误答案上传，支持遇到新题或错题自动保存，服务器端存储方式退回到json格式
2. 移除：~~js脚本将json题库保存到本地~~
3. 移除：~~服务端通过docker部署~~
4. 修复：js脚本不能自动等待10秒连续答题的bug
5. 修复：js脚本因控件内容更改而无法保存的bug
6. 修改：每次答题等待结果的时间100ms->200ms，注意等待时间太少会重复上传不同选项的错题
###### 20230709
1. 添加：合并推送请求，增加一个基于Tkinter的，带有图形用户界面的学习强国挑战答题题库查询工具(pooneyy)
###### 20230106  
1. 修改服务器程序代码，服务器端存储方式改为SQL数据库
2. 修改仓库代码结构，使架构更合理  
3. 修改Dockerhub镜像文件，使其更易部署
###### 20221013  
1. 添加js脚本，可从Autox.js(Autox.js为Auto.js的分支, 应当支持Auto.js)创建db数据库(PutinYpa)。  
###### 20220920  
1. 缩短等待时间（2s->0.1s），来加快答题速度。可自行修改  
###### 20220918
1. 修复一处逻辑Bug(Tq7)并对截图识别区域进行限制(wangwang-code)
###### 20220917
1. 适配隐私安全版本，无法截屏时采用试错法  
2. 自动点击访问异常（借鉴） 
3. 减少答题错误再次答题的等待时间。  
&emsp;&emsp;等待时间从固定时间间隔变为距该轮答题开始10秒。当连续答对较多时，发起的新一轮挑战答题不会再等待。  
1. 避免错误选项提交，当截图没有找到正确答案时退出脚本  
2. 问题先去除空格，因空格的增减出现的题目现在唯一  
3. 答案错误自动修复，从题库中获取的答案也检查正确性  
###### 更早
...
