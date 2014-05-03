//jquery跑document ready要跑的函式
$(function() {

    //設domain
    //x:scale
    x = d3.scale.linear().domain([0, 960]).range([0, 960]);

    //y:scale
    y = d3.scale.linear().domain([0, 720]).range([720, 0]);

    SVGWIDTH = 960;
    SVGHEIGHT = 720;
    LINE_MULTIPLER = 3;

    // svg = d3.select('div#svg-container').append('svg')
    //     .attr('id', 'graph')
    //     .attr('width', SVGWIDTH)
    //     .attr('height', SVGHEIGHT);
    var BIRTH;


    d3.csv("data/first.csv", function(d) {
            if (!BIRTH) {
                BIRTH = new Date(d["date"]);
                d['dist'] = 0;
            } else {
                var eventdate = new Date(d['date']);
                // console.log(eventdate);
                var misec = (eventdate.getTime() - BIRTH.getTime());
                d['dist'] = misec / 86400000;
            }
            // console.log(d);
            return d
        },
        function(e, d) {

            //Add Old of Every Year.
            birth_year = (new Date(d[0]['date'])).getFullYear();
            this_year = (new Date()).getFullYear();
            var years = [];
            for (var i = birth_year; i <= this_year; i++) {
                var pass_year = []
                pass_year['event'] = '.' + (i - birth_year) + '歲';
                pass_year['date'] = i + '-01-01';
                var date = new Date(pass_year['date']);
                var misec = (date.getTime() - BIRTH.getTime());
                pass_year['dist'] = misec / 86400000;
                console.log(pass_year);
                years.push(pass_year);
            }

            //讀完csv跑的函式
            d = d.sortBy(function(n) {
                return n['dist']
            })

            console.log(d);

            var MAX_HEIGHT = d.max(function(n) {
                return n['dist']
            });
            $('div#wrapper').css('height', MAX_HEIGHT['dist'] * LINE_MULTIPLER);

            //一些常用到的attributes:
            //text:x,y
            //rect:x,y,width,height,fill,stroke-fill
            //line:x1,y1,x2,y2,stroke,stroke-fill,stroke-dasharray
            //circle:cx,cy,r


            d3events = d3.select('div#wrapper').selectAll('div').data(d).enter();


            d3events.append('div')
                .attr('class', function(d, i) {
                    var str = 'event ';
                    if (i % 2 == 0) {
                        str += 'even';
                    } else {
                        str += 'odd';
                    }
                    return str;

                })
                .style('position', 'absolute')
                .style('top', function(d) {
                    return d['dist'] * LINE_MULTIPLER + "px";
                })
                .html(function(d) {
                    return d['event'];
                })

            d3years = d3.select('div#wrapper').selectAll('h3').data(years).enter();

            d3years.append('h3')
                .style('position', 'absolute')
                .style('top', function(d) {
                    return d['dist'] * LINE_MULTIPLER + "px";
                })
                .attr('class', 'year').text(function(d) {
                    return d['event'].from(1);
                })

            // groups = svg.selectAll('div#wrapper').data(d).enter().append('div').text(function(d) {
            //     console.log(d);
            //     return d['event'];
            // });
            //jquery: 
            $('.even').css('left', function() {
                wid = $(this).css('width').split('px')[0];
                wid = "-" + (parseInt(wid) + 14) + 'px';
                console.log(wid);
                return wid;
            })

        });
});