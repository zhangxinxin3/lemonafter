require(['../js/config.js'], function() {
    require(['mui', 'getuid', 'picker'], function(mui, getuid) {
        var result = document.querySelector('.result');
        var money = document.querySelector('.money');
        var complete = document.querySelector('.complete');
        var billBar = document.querySelector('.bill-bar');
        var slideGulp = document.querySelector('.mui-slider-group');
        var dtPicker;
        var type = 1;
        var ls = window.localStorage;
        var uid = getuid();
        var iname, cname, cid;
        var year = new Date().getFullYear();
        var time = year + '年' + document.querySelector('.result').innerHTML;
        init();

        function init() {
            dtPicker = new mui.DtPicker({ type: "date" });
            mui.ajax('/classify/find', {
                data: {
                    type: '1',
                    uid: uid
                },
                type: 'get',
                success: function(data) {
                    console.log(data);
                    if (data.code == 0) {
                        renderList(data.data);
                    }
                }
            });
        }
        addEvent();

        function addEvent() {
            result.addEventListener('tap', function() {
                dtPicker.show(function(SelectedItem) {
                    result.innerHTML = SelectedItem.m.text + '月' + SelectedItem.d.text + '日';
                    time = SelectedItem.y.text + '年' + SelectedItem.m.text + '月' + SelectedItem.d.text + '日';
                })
            });
            mui('.computer').on('tap', 'li', function() {
                if (this.innerHTML == 'X') {
                    money.value = money.value.slice(0, money.value.length - 1);
                } else {
                    money.value += this.innerHTML;
                }
            });
            mui('.mui-slider-group').on('click', 'dl', function() {
                iname = this.children[0].classList.value;
                cname = this.children[1].innerHTML;
                cid = this.dataset.id;
            });

            mui('.bill-bar').on('tap', 'p', function() {
                slideGulp.innerHTML = '';
                type = this.dataset.type;
                if (this.innerHTML == '收入') {
                    this.classList.add('color');
                    this.previousElementSibling.classList.remove('color');
                } else if (this.innerHTML == '支出') {
                    this.classList.add('color');
                    this.nextElementSibling.classList.remove('color');
                }
                mui.ajax('/classify/find', {
                    data: {
                        type: type,
                        uid: uid
                    },
                    type: 'get',
                    success: function(data) {
                        console.log(data);
                        if (data.code == 0) {
                            renderList(data.data);
                        } else {
                            alert(data.message);
                        }
                    }
                });
            })

            complete.addEventListener('tap', function() {
                mui.ajax('/bill/billList', {
                    data: {
                        iname: iname,
                        cname: cname,
                        type: type,
                        uid: uid,
                        time: time,
                        money: money.value,
                        cid: cid,
                    },
                    type: 'post',
                    success: function(data) {
                        if (data.code == 0) {
                            location.href = '/index.html';
                        } else {
                            alert(data.message);
                        }
                    }
                });
            })
        };

        function renderList(data) {
            console.log(data);
            var arr = [];
            var pageNum = Math.ceil(data.length / 8);
            for (var i = 0; i < pageNum; i++) {
                arr.push(data.splice(0, 8));
            }
            var html = '';
            arr.map(function(v) {
                html += `<div class="mui-slider-item">
                            <div>`;
                v.map(function(item) {
                    html += `<dl data-id=${item._id}>
                    <dt class="${item.iname}"></dt>
                    <dd>${item.cname}</dd>
                </dl>`
                });
                html += `</div></div>`;
            });
            document.querySelector('.mui-slider-group').innerHTML += html;
            var gallery = mui('.mui-slider');
            gallery.slider({

            });
            var len = slideGulp.children[slideGulp.children.length - 1].children[0].children;
            if (len.length > 8) {
                ocument.querySelector('.mui-slider-group').innerHTML += `<div class="mui-slider-item">
                            <div>
							<dl class="addList">
							    <dt>+</dt>
							    <dd>自定义</dd>
							</dl>
							</div>
							</div>`
            } else {
                slideGulp.children[slideGulp.children.length - 1].children[0].innerHTML += `
				<dl class="addList">
				    <dt>+</dt>
				    <dd>自定义</dd>
				</dl>
				`;
            }
            var add = document.querySelector('.addList');
            add.addEventListener('tap', function() {
                location.href = '/pages/addList.html?type=' + type;
            })
        };
    })
})