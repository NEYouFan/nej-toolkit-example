<!DOCTYPE html>
<html>
<head>
    <#include "./common/macro.ftl"/>
    <meta charset="utf-8"/>
    <title>NEJ Module Sample - 前端实例</title>
    <link href="${csRoot}template.css" rel="stylesheet" type="text/css"/>
    <link href="${csRoot}app.css" rel="stylesheet" type="text/css"/>
    <style>
        .a{_background:url(/res/image/loading.gif) no-repeat center center;}
    </style>
</head>
<body id="www-wd-com">
    <img src="/res/image/loading.gif" alt="" class="test" style="display:none">
    <!-- @nocompress -->
    <div class="g-doc">
        <div class="g-hd">
            <h1 class="m-logo">网易-杭研院-前端技术组-实例库</h1>
            <h2 class="m-title">NEJ Module Sample</h2>
        </div>
        <div class="g-bd" id="module-box"></div>
        <div class="g-bd">
            <div class="m-foot">
                如有任何问题，请联系：蔡剑飞(<a href="mailto:caijf@corp.netease.com">caijf@corp.netease.com</a>)
            </div>
        </div>
        <div class="g-ft">
            <div class="m-foot">
                &nbsp;&copy;&nbsp;网易-杭研院-前端技术组
            </div>
        </div>
    </div>
    <!-- @nocompress -->

    <!-- @IGNORE -->
    <script src="${jsRoot}cache/tag.data.js"></script>
    <script src="${jsRoot}cache/blog.data.js"></script>
    <!-- /@IGNORE -->

    <!-- @IGNORE {mode:'test'} -->
    <script>console.log('remove if test mode');</script>
    <!-- /@IGNORE -->

    <!-- @noparse -->
    <img src="/res/image/loading.gif" alt="" class="test" style="display:none;">
    <script src="/res/a.js" type="text/javascript"></script>
    <link href="/res/a.css" rel="stylesheet" type="text/css"/>
    <script>
        location.portrait1 = '/res/image/sprite.png';
    </script>
    <!-- /@noparse -->

    <script>
        location.portrait2 = '/res/image/sprite.png';
    </script>

    <!-- @VERSION -->
    <script>location.config={root:'/src/html/'};</script>

    <script src="${nejRoot}"></script>
    <script src="${jsRoot}page/app2.js"></script>
</body>
</html>