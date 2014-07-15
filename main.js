(function($){
    var knobId = '',
        cid = '';
    $(document).ready(function() {
        var $courseName = $('#course-name'),
            $mycarousel = $('#mycarousel'),
            $chapterList = $('#chapter-list')
        //初始化课程名称
        $courseName.text(chapterData.cname);

        var totalCourse = getTotalCourse(chapterData['chapter']);
        $mycarousel.jcarousel({
            size: totalCourse,
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

        /**
         * 控制右侧章节列表隐藏和显示
         */
        var showt = '';

        $('.chapter,.lecture').live('click',function(event) {
            var $this = $(this),
                curtClass = $this[0].classList[0],
                $leftContent = $('.left-content'),
                $rightContent = $('.right-content');
            $leftContent.stop(true,false);
            $rightContent.stop(true,false);
            if (showt) {
                if (showt != curtClass) {
                    $leftContent.animate({right: '0px'},function(){
                        $leftContent.animate({right: '300px'});
                    });
                    $rightContent.animate({width: '0px'},function(){
                        $rightContent.animate({width: '300px'});
                    });
                    $('.'+showt).removeClass('active');
                    showt = curtClass;
                }else{
                    $leftContent.animate({right: '0px'});
                    $rightContent.animate({width: '0px'});
                    showt = '';
                }
            }else{
                $leftContent.animate({right: '300px'});
                $rightContent.animate({width: '300px'});
                showt = curtClass;

            }
            $this.toggleClass('active');
        });
        /**
         * 点击课时左侧视频跳转到相应课时
         */
        $('.knob-name').click(function(event) {
            event.preventDefault();
            var $this = $(this),
                $period = $this.closest('.knob-item'),
                periodId = $period.attr('id'),
                periodIndex = getPeriodIndexById(chapterData['chapter'],periodId);
            $('#mycarousel').jcarousel('scroll',periodIndex);
        });;
    });
    //获取课时总数
    function getTotalCourse(chapter){
        var total = 0;
        for (var i = 0; i < chapter.length; i++) {
            total = total + chapter[i]['knob'].length;
        };
        return total;
    }
    //通过序号获取课时
    function getCourseByIndex(chapter,index){
        var chapObj,
            knobObj;
        for (var i = 0; i < chapter.length; i++) {
            var curtKnobSize = chapter[i]['knob'].length;
            if(index>curtKnobSize){
                index = index-curtKnobSize;
            }else{
                chapObj = $.extend({},chapter[i]);
                chapObj['size'] = curtKnobSize;
                knobObj = chapter[i]['knob'][(index-1)];
                break;
            }
        };
        chapObj['knob'] = knobObj;
        return chapObj;
    }
    //通过课时id获取视频序号
    function getPeriodIndexById(chapter,knId){
        var index = 1;

        out:
        for (var i = 0; i < chapter.length; i++) {
            var knobs = chapter[i]['knob'];
            for (var n = 0; n < knobs.length; n++) {
                if(knobs[n].knId == knId){
                    break out;
                }
                index++;
            };
        }
        return index;
    }
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
                var data = getCourseByIndex(chapterData['chapter'],i);
                var resultText = tempFn(data);
                carousel.add(i, resultText);
            }
        }
    };

    function itemLoadAfter(carousel, state) {

    }
    
})(jQuery);