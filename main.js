(function($){
    $(document).ready(function() {
        var $courseName = $('#course-name'),
            $mycarousel = $('#mycarousel'),
            $chapterList = $('#chapter-list')
        //初始化课程名称
        $courseName.text(chapterData.cname);
        
        $mycarousel.jcarousel({
            size: sourseData.length,
            vertical: true,
            scroll: 1,
            visible: 1,
            // This tells jCarousel NOT to autobuild prev/next buttons
            buttonNextHTML: null,
            buttonPrevHTML: null,
            initCallback: mycarousel_initCallback,
            itemLoadCallback: {
                onBeforeAnimation: itemLoadCallbackFunction,
                onAfterAnimation: itemLoadAfter
            }
        });
        //初始化右侧章节列表
        var def = {
            chapItem:document.getElementById('chapItem').text,
            knobItem:document.getElementById('knobItem').text
        }
        var chapList = doT.template(document.getElementById('chapList').text,undefined,def);
        var resultTpl = chapList(chapterData);
        $chapterList.html(resultTpl);
    });

    function mycarousel_initCallback(carousel) {
        $('#course_prev').click(function(event) {
            carousel.prev();
        });
        $('#course_next').click(function(event) {
            carousel.next();
        });
    }

    function itemLoadCallbackFunction(carousel, state) {
        for (var i = carousel.first; i <= carousel.last; i++) {
            // Check if the item already exists
            if (!carousel.has(i)) {
                // Add the item
                // // 1. Compile template function
                var tempFn = doT.template(document.getElementById('curtCourse').text);
                // 2. Use template function as many times as you like
                var data = sourseData[i];
                var resultText = tempFn(data);
                carousel.add(i, resultText);
            }
        }
    };

    function itemLoadAfter(carousel, state) {

    }
    
})(jQuery);