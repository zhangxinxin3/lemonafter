require(['./js/config.js'], function() {
    require(['mui', 'getuid', 'moment', 'picker', 'poppicker'], function(mui, getuid, moment) {
        var mor = document.querySelector('.mor');
        var result = document.querySelector('.result');
        var view = document.querySelector('.mui-table-view'); //年 
        var month = document.querySelector('.month'); //月
        var screen = document.querySelector('.screen');
        var con = document.querySelector('.con'); //切换
        var bill = document.querySelector('.bill'); //账单
        var chart = document.querySelector('.chart'); //图表
        var reset = document.querySelector('.reset');
        var sure = document.querySelector('.sure');
        var adds = document.querySelector('.adds');
        var picker, poppicker, title;
        var nowYear = new Date().getFullYear(),
            nowMonth = new Date().getMonth() + 1;
        var year,
            month,
            classify = [];
        var uid = getuid();
        var backdrop = document.querySelector('.mui-off-canvas-backdrop');
        var time = result.innerHTML;
        var allTypes = Array.from(document.querySelectorAll('.allType p'));
        var allClasses = Array.from(document.querySelectorAll('.allClass p'));
        var cname = [];
        init();
        aside();

        function init() {
            poppicker = new mui.PopPicker();
            poppicker.setData([{
                value: "年",
                text: "年"
            }, {
                value: "月",
                text: "月"
            }]);
            picker = new mui.DtPicker({ type: "month" });

        }
        getList();

        function getList() {
            mui.ajax('/classify/find', {
                data: {
                    uid: getuid()
                },
                success: function(data) {
                    var payHtml = '',
                        iconHtml = '';
                    data.data.forEach(function(item) {
                        classify.push(item.cname);
                        if (item.type == '1') {
                            payHtml += `<p>${item.cname}</p>`;
                        } else {
                            iconHtml += `<p>${item.cname}</p>`;
                        }
                    });
                    document.querySelector('.allType').innerHTML = payHtml;
                    document.querySelector('.allClass').innerHTML = iconHtml;
                    local('year');
                }
            });
        }

        function local(type) {
            cname = classify.join(',');
            mui.ajax('/bill/getTime', {
                data: {
                    uid: uid,
                    time: time,
                    cname: cname
                },
                type: 'get',
                success: function(data) {
                    if (data.code == 0) {
                        if (type) {
                            renderYear(data.data);
                        } else {
                            renderMonth(data.data);
                        }
                    }
                }
            });
        }

        function renderYear(data) {
            var obj = {},
                yearArr = [],
                yearHtml = '';
            data.forEach(function(item) {
                var time = moment(item.time).utc().format('MM');
                if (!obj[time]) {
                    obj[time] = {
                        time: time,
                        totalPay: 0,
                        totalIcon: 0,
                        list: []
                    }
                }
                obj[time].list.push(item);
                if (item.type == '1') {
                    obj[time].totalPay += item.money * 1;
                } else {
                    obj[time].totalIcon += item.money * 1;
                }
            });
            for (var i in obj) {
                yearArr.push(obj[i]);
            }
            yearArr.forEach(function(item) {
                yearHtml += `<li class="mui-table-view-cell mui-collapse">
                    <a class="mui-navigate-right" href="#">
                        <dl>
                            <dt class="mui-icon mui-icon-star"></dt>
                            <dd>${item.time}月</dd>
                        </dl>
                        <div class="cen">
                            <p>
                                <i>花费</i>
                                <i>${item.totalPay}</i>
                            </p>
                            <p>
                                <i>收入</i>
                                <i>${item.totalIcon}</i>
                            </p>
                            <p>
                                <i>结余</i>
                                <i>${item.totalIcon*1-item.totalPay*1}</i>
                            </p>
                        </div>
                    </a>
                    <ul class="mui-collapse-content">`
                item.list.forEach(function(items) {
                    yearHtml += `
                    <li class="mui-table-view-cell">
                        <div class="mui-slider-right mui-disabled">
                            <a class="mui-btn mui-btn-red delBill" id="delBill" data-id="${items._id}">删除</a>
                        </div>
                        <dl class="wai mui-slider-handle">
                            <dt>
                                <dl class="nei">
                                    <dt class="mui-icon mui-icon-star"></dt>
                            <dd class="mui-aside-list-pay">${items.cname}</dd>
                        </dl>
                        </dt>
                        <dd class="${items.type== "1" ?'payColor':'icomeColor'}">${items.money}</dd>
                        </dl> </li> `;
                });
                yearHtml += `</ul>
                </li>`;
            });
            document.querySelector('.mui-table-view').innerHTML += yearHtml;
        }

        function renderMonth(data) {
            var obj = {},
                monthArr = [],
                monthHtml = '';
            data.forEach(function(item) {
                var time = moment(item.time).utc().format('MM-DD');
                if (!obj[time]) {
                    obj[time] = {
                        time: time,
                        totalmoney: 0,
                        list: []
                    }
                }
                obj[time].list.push(item);
                if (item.type == '1') {
                    obj[time].totalmoney += item.money * 1;
                } else {
                    obj[time].totalmoney += item.money * 1;
                }
            });
            for (var i in obj) {
                monthArr.push(obj[i]);
            }
            monthArr.forEach(function(item) {
                monthHtml += `
                            <div class="month-tit">
                            <dl>
                                <dt class="mui-icon mui-icon-star"></dt>
                                <dd>${item.time}</dd>
                            </dl>
                            <p>支出 ${item.totalmoney}</p>
                        </div>
                        <ul class="monthes">`;
                item.list.forEach(function(items) {
                    monthHtml += `<li class="mui-table-view-cell">
                    <div class="mui-slider-right mui-disabled">
						<a class="mui-btn mui-btn-red delBill" id="delBill" data-id="${items._id}">删除</a>
					</div>
                    <dl class="wai mui-slider-handle">
                                    <dt>
                                <dl class="nei">
                                    <dt class="mui-icon mui-icon-star"></dt>
                                    <dd class="mui-aside-list-icon">${items.cname}</dd>
                                </dl>
                                </dt>
                                <dd class="${items.type=="1" ?'payColor':'icomeColor'}">${items.money}</dd>
                                </dl></li>`
                });

                monthHtml += `</ul>`;
            });
            document.querySelector('.month').innerHTML += monthHtml;
        }
        addEvent();

        function addEvent() {
            mor.addEventListener('tap', function() {
                poppicker.pickers[0].setSelectedValue('fourth', 2000);
                poppicker.show(function(SelectedItem) {
                    title = SelectedItem[0].text;
                    mor.innerHTML = title;
                    if (title == '年') {
                        result.innerHTML = nowYear;
                        month.style.display = 'none';
                        view.style.display = 'block';
                        local('year');
                    } else {
                        nowMonth = nowMonth * 1 < 10 ? '0' + nowMonth * 1 : nowMonth * 1;
                        result.innerHTML = nowYear + '-' + nowMonth;
                        view.style.display = 'none';
                        month.style.display = 'block';
                        local();
                    }
                })
            })
            result.addEventListener('tap', function() {
                var titleY = document.querySelector('[data-id="title-y"]'),
                    titleM = document.querySelector('[data-id="title-m"]'),
                    pickeY = document.querySelector('[data-id="picker-y"]'),
                    pickeM = document.querySelector('[data-id="picker-m"]');
                if (mor.innerHTML == '年') {
                    titleM.style.display = 'none';
                    titleY.style.width = '100%';
                    pickeY.style.width = '100%';
                    pickeM.style.display = 'none';
                } else {
                    titleM.style.display = 'inline-block';
                    titleY.style.width = '50%';
                    pickeY.style.width = '50%';
                    pickeM.style.display = 'block';
                }
                picker.show(function(SelectedItem) {
                    year = SelectedItem.y.text;
                    month = SelectedItem.m.text;
                    if (mor.innerHTML == '年') {
                        result.innerHTML = year;
                    } else {
                        result.innerHTML = year + '-' + month;
                    }
                })
            });
            del.map(function(item) {
                item.addEventListener('tap', function() {
                    var id = this.dataset.id;
                    console.log(id);
                    mui.ajax('/bill/delBill', {
                        data: {
                            id: id
                        },
                        success: function(data) {
                            console.log(data);
                            if (data.code == 0) {
                                alert(data.message);
                            } else {
                                alert(data.message);
                            }
                        }
                    });
                })
            });
            screen.addEventListener('tap', function() {
                mui('.mui-off-canvas-wrap').offCanvas().show();
            });
            mui('.con').on('tap', 'p', function() {
                if (this.innerHTML == '账单') {
                    this.classList.add('color');
                    this.nextElementSibling.classList.remove('color');
                    bill.style.display = 'block';
                    chart.style.display = 'none';
                } else {
                    this.classList.add('color');
                    this.previousElementSibling.classList.remove('color');
                    bill.style.display = 'none';
                    chart.style.display = 'block';
                }
            });
            adds.addEventListener('tap', function() {
                location.href = './pages/addBills.html'
            })
        }

        function aside() {
            mui('.type').on('tap', 'p', function() {
                this.classList.toggle('addActive');
                if (this.classList.contains('addActive')) {
                    var num = this.classList[0];
                    var pa = Array.from(document.querySelector('[data-name=' + num + ']').children);
                    pa.forEach(function(e) {
                        e.classList.add('addActive');
                    });
                } else {
                    var num = this.classList[0];
                    var pa = Array.from(document.querySelector('[data-name=' + num + ']').children);
                    pa.forEach(function(e) {
                        e.classList.remove('addActive');
                    });
                }
            });

            mui('.allType').on('tap', 'p', function() {
                this.classList.toggle('addActive');
                var len = Array.from(this.parentElement.querySelectorAll('[class="addActive"]')).length;
                if (len == allTypes.length) {
                    document.querySelector('.allBill').classList.add('addActive');
                } else {
                    document.querySelector('.allBill').classList.remove('addActive');
                }
            });

            mui('.allClass').on('tap', 'p', function() {
                this.classList.toggle('addActive');
                var lens = Array.from(this.parentElement.querySelectorAll('[class="addActive"]')).length;
                if (lens == allClasses.length) {
                    document.querySelector('.allTion').classList.add('addActive');
                } else {
                    document.querySelector('.allTion').classList.remove('addActive');
                }
            });
            reset.addEventListener('tap', function() {
                var aac = Array.from(document.querySelectorAll('.list p'));
                aac.map(function(v) {
                    v.classList.remove('addActive');
                });
            });
            sure.addEventListener('tap', function() {
                mui('.mui-off-canvas-wrap').offCanvas().close();
                cname = [];
                var checkeds = Array.from(document.querySelectorAll('.allType>.addActive'));
                checkeds.forEach(function(item) {
                    cname.push(item.innerHTML)
                });
                cname = cname.join(',');
                mui.ajax('/bill/getTime', {
                    data: {
                        uid: uid,
                        time: time,
                        cname: cname
                    },
                    type: 'get',
                    success: function(data) {
                        document.querySelector('.mui-table-view').innerHTML = '';
                        renderYear(data.data);
                        // if (data.code == 0) {
                        //     if (type) {
                        //         renderYear(data.data);
                        //     } else {
                        //         renderMonth(data.data);
                        //     }
                        // }
                    }
                });
            })
        }
    })
})