/*! manage ----> build at 2014-06-19T11:34:16 */
define("tadget/manage/1.0.0/main", ["gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "jquery/jquery/1.10.1/jquery.js", "./vendor/uicontrol", "gallery/underscore/1.4.4/underscore.js", "./vendor/scrollevent", "./vendor/placeholder", "./vendor/modal", "./routers/router", "./common", "./vendor/infor", "./collections/folder", "./vendor/backbone.paginator", "./models/file", "./models/crumbs", "./models/tree", "./views/maintree", "plugin/zTree/jquery.ztree.core-3.5.js", "plugin/zTree/jquery.ztree.exedit-3.5.js", "./vendor/jquery.autocomplete", "./userGuide", "./views/folder", "./views/file", "./vendor/detail", "./vendor/silde", "./vendor/copy", "./vendor/jquery.mousewheel", "plugin/jQueryUI/1.10.3/jquery.ui.js", "./vendor/forcedelete", "./vendor/ajaxfileupload", "./vendor/upfile", "./views/pager", "./views/crumbs"],
function(a) {
    var b = a("gallery/backbone/1.0.0/backbone.js"),
    c = a("jquery/jquery/1.10.1/jquery.js");
    a("./vendor/uicontrol"),
    a("./vendor/modal"),
    a("./routers/router"),
    a("./views/maintree"),
    a("./userGuide");
    var d = a("./collections/folder");
    window.$ = window.jQuery = c;
    var e = a("./views/folder"),
    f = a("./views/pager");
    new e({
        collection: d
    }),
    new f({
        collection: d
    }),
    window.collect = d,
    a("./views/crumbs"),
    b.history.start()
}),
define("tadget/manage/1.0.0/vendor/uicontrol", ["gallery/underscore/1.4.4/underscore.js", "jquery/jquery/1.10.1/jquery.js", "tadget/manage/1.0.0/vendor/scrollevent", "tadget/manage/1.0.0/vendor/placeholder"],
function(a) {
    var b = (a("gallery/underscore/1.4.4/underscore.js"), a("jquery/jquery/1.10.1/jquery.js")),
    c = b;
    a("tadget/manage/1.0.0/vendor/scrollevent")(c),
    a("tadget/manage/1.0.0/vendor/placeholder")(c),
    c.placeholder.shim();
    var d = c("#J_PicContainer"),
    e = function() {
        var a = c("#wrap").height(),
        b = c("#wrap").width(),
        e = a - 205,
        f = a - 180;
        c("#J_MainTreeRoom").css("height", e + "px"),
        d.css({
            height: f + "px"
        }).find("#J_Picture").css({
            "min-height": f - 35 + "px"
        }),
        c(".page-bar").eq(0).css({
            width: b - 214 + "px"
        }),
        c(".page-footer").eq(0).css({
            width: b - 214 + "px"
        })
    };
    c(window).on("resize", e),
    c(window).trigger("resize");
    var f = (c("#J_PageFooter"), c(".page-bar"));
    d.on("scrollstart",
    function() {
        f.css("box-shadow", "1px 2px 8px #D2D3D3")
    }),
    d.on("scrollstop",
    function() {
        $srollTop = d.scrollTop(),
        0 === $srollTop && f.css("box-shadow", "none")
    })
}),
define("tadget/manage/1.0.0/vendor/scrollevent", [],
function() {
    return function(a) {
        var b = a.event.special,
        c = "D" + +new Date,
        d = "D" + ( + new Date + 1);
        b.scrollstart = {
            setup: function() {
                var d, e = function(c) {
                    var e = this,
                    f = arguments;
                    d ? clearTimeout(d) : (c.type = "scrollstart", a.event.dispatch.apply(e, f)),
                    d = setTimeout(function() {
                        d = null
                    },
                    b.scrollstop.latency)
                };
                a(this).bind("scroll", e).data(c, e)
            },
            teardown: function() {
                a(this).unbind("scroll", a(this).data(c))
            }
        },
        b.scrollstop = {
            latency: 300,
            setup: function() {
                var c, e = function(d) {
                    var e = this,
                    f = arguments;
                    c && clearTimeout(c),
                    c = setTimeout(function() {
                        c = null,
                        d.type = "scrollstop",
                        a.event.dispatch.apply(e, f)
                    },
                    b.scrollstop.latency)
                };
                a(this).bind("scroll", e).data(d, e)
            },
            teardown: function() {
                a(this).unbind("scroll", a(this).data(d))
            }
        }
    }
}),
define("tadget/manage/1.0.0/vendor/placeholder", [],
function() {
    return function(a) {
        a.extend(a, {
            placeholder: {
                browser_supported: function() {
                    return void 0 !== this._supported ? this._supported: this._supported = !!("placeholder" in a('<input type="text">')[0])
                },
                shim: function(b) {
                    var c = {
                        color: "#888",
                        cls: "placeholder",
                        selector: "input[placeholder], textarea[placeholder]"
                    };
                    return a.extend(c, b),
                    !this.browser_supported() && a(c.selector)._placeholder_shim(c)
                }
            }
        }),
        a.extend(a.fn, {
            _placeholder_shim: function(b) {
                function c(b) {
                    var c = a(b).offsetParent().offset(),
                    d = a(b).offset();
                    return {
                        top: d.top - c.top,
                        left: d.left - c.left,
                        width: a(b).width()
                    }
                }
                function d(b) {
                    var e = b.data("target");
                    "undefined" != typeof e && (b.css(c(e)), a(window).one("resize",
                    function() {
                        d(b)
                    }))
                }
                return this.each(function() {
                    var e = a(this);
                    if (e.is(":visible")) {
                        if (e.data("placeholder")) {
                            var f = e.data("placeholder");
                            return f.css(c(e)),
                            !0
                        }
                        var g = {};
                        e.is("textarea") || "auto" == e.css("height") || (g = {
                            lineHeight: e.css("height"),
                            whiteSpace: "nowrap"
                        });
                        var h = a("<label />").text(e.attr("placeholder")).addClass(b.cls).css(a.extend({
                            position: "absolute",
                            display: "inline",
                            "float": "none",
                            overflow: "hidden",
                            textAlign: "left",
                            color: b.color,
                            cursor: "text",
                            paddingTop: e.css("padding-top"),
                            paddingRight: e.css("padding-right"),
                            paddingBottom: e.css("padding-bottom"),
                            paddingLeft: e.css("padding-left"),
                            fontSize: e.css("font-size"),
                            fontFamily: e.css("font-family"),
                            fontStyle: e.css("font-style"),
                            fontWeight: e.css("font-weight"),
                            textTransform: e.css("text-transform"),
                            backgroundColor: "transparent",
                            zIndex: 1
                        },
                        g)).css(c(this)).attr("for", this.id).data("target", e).click(function() {
                            a(this).data("target").focus()
                        }).insertBefore(this);
                        e.data("placeholder", h).focus(function() {
                            h.hide()
                        }).blur(function() {
                            h[e.val().length ? "hide": "show"]()
                        }).triggerHandler("blur"),
                        a(window).one("resize",
                        function() {
                            d(h)
                        })
                    }
                })
            }
        })
    }
}),
define("tadget/manage/1.0.0/vendor/modal", ["jquery/jquery/1.10.1/jquery.js"],
function(a, b, c) {
    function d(a, b, c) {
        n.html(u[a]),
        o.data("type", a),
        m.modal("show"),
        b && q.text(b),
        r.text(c ? c: "")
    }
    function e(a, b) {
        "warning" == b && (b = "danger"),
        null !== s && (p.removeClass("label-" + t), clearTimeout(s)),
        t = b,
        p.text(a).addClass("label-" + b).show(),
        s = setTimeout(function() {
            p.hide().removeClass("label-" + t),
            s = null
        },
        2e3)
    }
    function f() {
        m.modal("hide")
    }
    function g() {
        return o.data("type")
    }
    function h() {
        m.find(".modal-footer button").each(function() {
            this.disabled = !0
        })
    }
    var i, j;
    i = j = a("jquery/jquery/1.10.1/jquery.js");
    var k = function(a, b) {
        this.options = b,
        this.$element = j(a),
        this.$backdrop = null,
        this.isShown = null,
        this.options.remote && this.$element.load(this.options.remote)
    };
    k.DEFAULTS = {
        backdrop: !0,
        keyboard: !0,
        show: !0
    },
    k.prototype.toggle = function(a) {
        return this[this.isShown ? "hide": "show"](a)
    },
    k.prototype.show = function(a) {
        var b = this,
        c = j.Event("show.bs.modal", {
            relatedTarget: a
        });
        this.$element.trigger(c),
        this.isShown || c.isDefaultPrevented() || (this.isShown = !0, this.escape(), this.$element.on("click.dismiss.modal", '[data-dismiss="modal"]', j.proxy(this.hide, this)), this.backdrop(function() {
            var c = j.support.transition && b.$element.hasClass("fade");
            b.$element.parent().length || b.$element.appendTo(document.body),
            b.$element.show(),
            c && b.$element[0].offsetWidth,
            b.$element.addClass("in").attr("aria-hidden", !1),
            b.enforceFocus();
            var d = j.Event("shown.bs.modal", {
                relatedTarget: a
            });
            c ? b.$element.find(".modal-dialog").one(j.support.transition.end,
            function() {
                b.$element.focus().trigger(d)
            }).emulateTransitionEnd(300) : b.$element.focus().trigger(d)
        }))
    },
    k.prototype.hide = function(a) {
        a && a.preventDefault(),
        a = j.Event("hide.bs.modal"),
        this.$element.trigger(a),
        this.isShown && !a.isDefaultPrevented() && (this.isShown = !1, this.escape(), j(document).off("focusin.bs.modal"), this.$element.removeClass("in").attr("aria-hidden", !0).off("click.dismiss.modal"), j.support.transition && this.$element.hasClass("fade") ? this.$element.one(j.support.transition.end, j.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal())
    },
    k.prototype.enforceFocus = function() {
        j(document).off("focusin.bs.modal").on("focusin.bs.modal", j.proxy(function(a) {
            this.$element[0] === a.target || this.$element.has(a.target).length || this.$element.focus()
        },
        this))
    },
    k.prototype.escape = function() {
        this.isShown && this.options.keyboard ? this.$element.on("keyup.dismiss.bs.modal", j.proxy(function(a) {
            27 == a.which && this.hide()
        },
        this)) : this.isShown || this.$element.off("keyup.dismiss.bs.modal")
    },
    k.prototype.hideModal = function() {
        var a = this;
        this.$element.hide(),
        this.backdrop(function() {
            a.removeBackdrop(),
            a.$element.trigger("hidden.bs.modal")
        })
    },
    k.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove(),
        this.$backdrop = null
    },
    k.prototype.backdrop = function(a) {
        var b = this.$element.hasClass("fade") ? "fade": "";
        if (this.isShown && this.options.backdrop) {
            var c = j.support.transition && b;
            if (this.$backdrop = j('<div class="modal-backdrop ' + b + '" />').appendTo(document.body), this.$element.on("click.dismiss.modal", j.proxy(function(a) {
                a.target === a.currentTarget && ("static" == this.options.backdrop ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this))
            },
            this)), c && this.$backdrop[0].offsetWidth, this.$backdrop.addClass("in"), !a) return;
            c ? this.$backdrop.one(j.support.transition.end, a).emulateTransitionEnd(150) : a()
        } else ! this.isShown && this.$backdrop ? (this.$backdrop.removeClass("in"), j.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(j.support.transition.end, a).emulateTransitionEnd(150) : a()) : a && a()
    };
    var l = j.fn.modal;
    j.fn.modal = function(a, b) {
        return this.each(function() {
            var c = j(this),
            d = c.data("bs.modal"),
            e = j.extend({},
            k.DEFAULTS, c.data(), "object" == typeof a && a);
            d || c.data("bs.modal", d = new k(this, e)),
            "string" == typeof a ? d[a](b) : e.show && d.show(b)
        })
    },
    j.fn.modal.Constructor = k,
    j.fn.modal.noConflict = function() {
        return j.fn.modal = l,
        this
    },
    j(document).on("click.bs.modal.data-api", '[data-toggle="modal"]',
    function(a) {
        var b = j(this),
        c = b.attr("href"),
        d = j(b.attr("data-target") || c && c.replace(/.*(?=#[^\s]+$)/, "")),
        e = d.data("modal") ? "toggle": j.extend({
            remote: !/#/.test(c) && c
        },
        d.data(), b.data());
        a.preventDefault(),
        d.modal(e, this).one("hide",
        function() {
            b.is(":visible") && b.focus()
        })
    }),
    j(document).on("show.bs.modal", ".modal",
    function() {
        j(document.body).addClass("modal-open")
    }).on("hidden.bs.modal", ".modal",
    function() {
        j(document.body).removeClass("modal-open")
    });
    var m = j("#J_Modal"),
    n = m.find(".modal-body"),
    o = m.find("#J_ModalSure"),
    p = m.find(".modal-msg"),
    q = m.find(".modal-title"),
    r = m.find(".modal-subTitle"),
    s = null,
    t = "",
    u = {
        "delete-error": '<table class="table table-hover"><thead><tr><th>名称</th><th>位置</th><th>原因</th></tr></thead><tbody id="J_ErrorTable"></tbody></table>',
        "move-error": '<table class="table table-hover"><thead><tr><th>名称</th><th>位置</th><th>原因</th></tr></thead><tbody id="J_ErrorTable"></tbody></table>',
        "left-move": '<div class="left-move ztree" id="J_ModalTree"></div>',
        "left-delete": '<div class="left-delete">请确定是否删除选中文件夹及包含的所有图片? <span>(删除的图片7天内可以在回收站内还原)</span></div>',
        "new-folder": '<div class="new-folder"><input type="text" id="J_NewFoldername" tabindex=1 placeholder="新建文件夹"></div>',
        "delete-file": '<div class="delete-file">请确定是否删除选中文件夹及包含的所有图片? <span>(删除的图片7天内可以在回收站内还原)</span></div>',
        "finish-up": '<div class="finish-up">图片上传结束是否要立即查看上传的图片</div>',
        "move-file": '<div class="move-file ztree" id="J_ModalTree"></div>',
        "up-file": '<div class="up-file ztree" id="J_ModalTree"></div>',
        "replace-file": j("#J_RepalceContent").html(),
        "copy-file": '<div class="copy-file"><textarea id = "J_copy_textarea" rows="4"></textarea><p>您的浏览不支持自动复制，请使用 Ctrl + c 进行复制</p></div>',
        "to-phone": '<div class="to-phone">请确定是否要将选中的图片转成手机适配的图片?<span>(图片适配可能会导致一定失真，转换后原图不会删除)</span></div>',
        "phone-error": '<table class="table table-hover"><thead><tr><th>名称</th><th>原因</th></tr></thead><tbody id="J_ErrorPhoneTable"></tbody></table>'
    };
    m.on("hidden.bs.modal",
    function() {
        p.hide().removeClass("label-" + t),
        s = null,
        o.off("click"),
        m.find(".modal-footer button").eq(1).show(),
        r.text(""),
        m.find(".modal-footer button").each(function() {
            this.disabled = !1
        })
    }),
    c.exports = {
        $el: m,
        show: d,
        hide: f,
        disBtn: h,
        showMsg: e,
        type: g
    }
}),
define("tadget/manage/1.0.0/routers/router", ["gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "tadget/manage/1.0.0/common", "tadget/manage/1.0.0/vendor/infor", "jquery/jquery/1.10.1/jquery.js", "tadget/manage/1.0.0/collections/folder", "gallery/underscore/1.4.4/underscore.js", "tadget/manage/1.0.0/vendor/backbone.paginator", "tadget/manage/1.0.0/models/file", "tadget/manage/1.0.0/models/crumbs", "tadget/manage/1.0.0/models/tree"],
function(a, b, c) {
    var d, e, f, g, h;
    d = a("gallery/backbone/1.0.0/backbone.js"),
    f = a("tadget/manage/1.0.0/common"),
    g = a("tadget/manage/1.0.0/collections/folder"),
    h = a("tadget/manage/1.0.0/models/crumbs"),
    tree = a("tadget/manage/1.0.0/models/tree"),
    e = d.Router.extend({
        getURL: function() {
            var a = window.location.href,
            b = window.location.hash;
            return a.replace(b, "")
        },
        routes: {
            "goto/:folder/:page": "gotoFolder",
            "goods/:name/:id/:page": "getGoods",
            "search/:key/:page": "search",
            "specsearch/:type/:key/:from/:to/:page": "specsearch",
            "": "homeFolder"
        },
        gotoFolder: function(a, b) {
            g.gotoFolder(a, b),
            h.set({
                currentFolder: a
            },
            {
                silent: !0
            }),
            h.trigger("change:currentFolder"),
            tree.set({
                currentFolder: a
            }),
            window.collect = g
        },
        homeFolder: function() {
            g.gotoFolder(0, 1),
            h.set({
                currentFolder: "0"
            },
            {
                silent: !0
            }),
            h.trigger("change:currentFolder"),
            tree.set({
                currentFolder: "0"
            }),
            window.collect = g
        },
        getGoods: function(a, b, c) {
            g.getGoods(b),
            g.gotoFolder( - 1, c),
            h.set({
                goods: a,
                id: b
            },
            {
                silent: !0
            }),
            h.set({
                crumbs: []
            },
            {
                silent: !0
            }),
            h.trigger("change:goods")
        },
        search: function(a, b) {
            g.search(a),
            g.gotoFolder( - 1, b),
            h.set({
                search: a
            },
            {
                silent: !0
            }),
            h.set({
                crumbs: []
            },
            {
                silent: !0
            }),
            h.trigger("change:search")
        },
        specsearch: function(a, b, c, d, e) {
            g.specsearch(b, a, c, d, e),
            g.gotoFolder( - 1, e),
            h.set({
                specsearch: b,
                type: a,
                from: c,
                to: d
            },
            {
                silent: !0
            }),
            h.set({
                crumbs: []
            },
            {
                silent: !0
            }),
            h.trigger("change:specsearch")
        }
    }),
    c.exports = new e
}),
define("tadget/manage/1.0.0/common", ["tadget/manage/1.0.0/vendor/infor", "jquery/jquery/1.10.1/jquery.js"],
function(a, b, c) {
    var d = a("tadget/manage/1.0.0/vendor/infor"),
    e = {
        checkName: function(a, b) {
            if (!a) return "名称不能为空";
            if (b || (b = 20), e.getLength(a) > b) return "名称不能超过" + b + "个字符(1个汉字为2个字符)";
            var c = /[\\\/:*?"<>\|;]+/;
            return c.test(a) ? '名称不能包含特殊字符 \\ / : * ? " < > | ;': void 0
        },
        getLength: function(a) {
            for (var b = a.length,
            c = 0,
            d = 0; b > d; d++) a.charCodeAt(d) < 27 || a.charCodeAt(d) > 126 ? c += 2 : c++;
            return c
        },
        getData: function(a, b) {
            a._input_charset = "utf-8";
            var c = "get";
            "json_ref_query" === a.cmd && (c = "post"),
            jQuery.ajax({
                url: "/redaction/redaction/json.json",
                data: a,
                dataType: "json",
                type: c,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                success: function(a) {
                    a.success || "用户登陆已过期" !== a.message ? b(a) : window.location.reload()
                },
                error: function() {
                    d.show("服务器好像累了,请稍等一下再试", "info")
                }
            })
        },
        dateFormat: function(a) {
            var b = new Date(a),
            c = {
                y: b.getFullYear(),
                M: function() {
                    return b.getMonth() < 9 ? "0" + (b.getMonth() + 1) : b.getMonth() + 1
                },
                d: function() {
                    return b.getDate() < 10 ? "0" + b.getDate() : b.getDate()
                },
                h: function() {
                    return b.getHours() < 10 ? "0" + b.getHours() : b.getHours()
                },
                m: function() {
                    return b.getMinutes() < 10 ? "0" + b.getMinutes() : b.getMinutes()
                }
            };
            return "" + c.y + "/" + c.M() + "/" + c.d() + " " + c.h() + ":" + c.m()
        },
        sizeFormat: function(a) {
            return 1048576 > a ? (a / 1024).toFixed(2) + "k": (a / 1048576).toFixed(2) + "M"
        },
        useMsg: function() {
            this.getData({
                cmd: "json_user_query"
            },
            function(a) {
                var b;
                a.success && !a.module.isB2C ? (b = $(".use-show .used"), b.css({
                    width: a.module.ratio + "%"
                }).find(".number").text(a.module.usedSpace + "/" + a.module.availableSpace), a.module.ratio >= 90 && b.addClass("danger")) : a.success && a.module.isB2C && (b = $(".use-show .tmall"), b.text("已使用 " + a.module.usedSpace))
            })
        },
        flashPlayerVersion: function() {
            var a = "undefined",
            b = "object",
            c = "Shockwave Flash",
            d = "ShockwaveFlash.ShockwaveFlash",
            e = "application/x-shockwave-flash",
            f = window,
            g = document,
            h = navigator,
            i = typeof g.getElementById != a && typeof g.getElementsByTagName != a && typeof g.createElement != a,
            j = h.userAgent.toLowerCase(),
            k = h.platform.toLowerCase(),
            l = /win/.test(k ? k: j),
            m = /mac/.test(k ? k: j),
            n = /webkit/.test(j) ? parseFloat(j.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
            o = !1,
            p = [0, 0, 0],
            q = null;
            if (typeof h.plugins != a && typeof h.plugins[c] == b) q = h.plugins[c].description,
            !q || typeof h.mimeTypes != a && h.mimeTypes[e] && !h.mimeTypes[e].enabledPlugin || (plugin = !0, o = !1, q = q.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), p[0] = parseInt(q.replace(/^(.*)\..*$/, "$1"), 10), p[1] = parseInt(q.replace(/^.*\.(.*)\s.*$/, "$1"), 10), p[2] = /[a-zA-Z]/.test(q) ? parseInt(q.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0);
            else if (typeof f.ActiveXObject != a) try {
                var r = new ActiveXObject(d);
                r && (q = r.GetVariable("$version"), q && (o = !0, q = q.split(" ")[1].split(","), p = [parseInt(q[0], 10), parseInt(q[1], 10), parseInt(q[2], 10)]))
            } catch(s) {}
            return {
                w3: i,
                pv: p,
                wk: n,
                ie: o,
                win: l,
                mac: m
            }
        } ()
    };
    c.exports = e
}),
define("tadget/manage/1.0.0/vendor/infor", ["jquery/jquery/1.10.1/jquery.js"],
function(a, b, c) {
    function d() {
        this.box = e("#J_Infor_Box"),
        this.timer = null,
        this.curType = ""
    }
    var e = a("jquery/jquery/1.10.1/jquery.js");
    d.prototype = {
        show: function(a, b) {
            null !== this.timer && (this.box.removeClass("label-" + this.curType), clearTimeout(this.timer));
            var c = this;
            this.box.text(a),
            this.box.addClass("label-" + b),
            this.box.css({
                opacity: 1,
                filter: "alpha(opacity=100)",
                top: "95px",
                "z-index": "16000"
            }),
            this.curType = b,
            this.timer = setTimeout(function() {
                c.hide()
            },
            2e3)
        },
        hide: function() {
            this.box.css({
                opacity: 0,
                filter: "alpha(opacity=0)",
                top: "85px",
                "z-index": "-1"
            }),
            this.box.removeClass("label-" + this.curType),
            this.timer = null
        }
    },
    c.exports = new d
}),
define("tadget/manage/1.0.0/collections/folder", ["gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "gallery/underscore/1.4.4/underscore.js", "tadget/manage/1.0.0/vendor/infor", "jquery/jquery/1.10.1/jquery.js", "tadget/manage/1.0.0/vendor/backbone.paginator", "tadget/manage/1.0.0/models/file", "tadget/manage/1.0.0/common"],
function(a, b, c) {
    var d, e, f;
    d = a("gallery/backbone/1.0.0/backbone.js");
    var g = a("gallery/underscore/1.4.4/underscore.js"),
    h = a("tadget/manage/1.0.0/vendor/infor");
    a("tadget/manage/1.0.0/vendor/backbone.paginator"),
    e = a("tadget/manage/1.0.0/models/file"),
    f = d.Paginator.requestPager.extend({
        model: e,
        paginator_core: {
            type: "get",
            dataType: "json",
            url: "/redaction/redaction/json.json",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8"
        },
        paginator_ui: {
            currentFolder: 0,
            firstPage: 1,
            currentPage: 1,
            perPage: 60,
            totalPages: 10,
            totalRecords: 0,
            sortby: 0,
            btnNumber: 5
        },
        searchKey: "",
        _18x: -1,
        ignore_cat: 0,
        server_api: {
            order_by: function() {
                return this.sortby
            },
            ignore_cat: function() {
                return this.ignore_cat
            },
            client_type: function() {
                return this.client_type
            },
            status: function() {
                return this._18x
            },
            cat_id: function() {
                return - 1 == this.currentFolder ? null: this.currentFolder
            },
            page: function() {
                return this.currentPage
            },
            cmd: function() {
                return - 1 == this.currentFolder ? "json_res_search": "json_batch_query"
            },
            _input_charset: "utf-8"
        },
        gotoFolder: function(a, b) {
            this.currentFolder = a,
            -1 !== this.currentFolder && (delete this.server_api.type, delete this.server_api.key, delete this.server_api.create_start, delete this.server_api.create_end, delete this.server_api.itemId),
            this.goTo(b)
        },
        parse: function(a) {
            if (a.success || "用户登陆已过期" !== a.message) {
                if (a.success) return this.type = a.module.type,
                2 === this.type || 6 === this.type ? (this.currentPage = a.module.page, this.hasNext = a.module.hasNext, this.totalItem = a.module.item_module.length, this.totalPages = 1e4, a.module.item_module) : (this.totalRecords = a.module.total, this.currentPage = a.module.page, this.catNumber = a.module.cat_num, this.totalPages = Math.ceil(Number(a.module.total) / Number(this.perPage)), this.parseModalDate(a.module));
                h.show(a.message, "danger")
            } else window.location.reload()
        },
        parseModalDate: function(a) {
            return g.union(a.cat_module, a.file_module)
        },
        search: function(a) {
            this.server_api.key = encodeURI(a),
            delete this.server_api.type,
            delete this.server_api.create_start,
            delete this.server_api.create_end,
            delete this.server_api.itemId
        },
        specsearch: function(a, b, c, d) {
            ";" == a && (a = ""),
            this.server_api.type = b,
            this.server_api.key = encodeURI(a),
            this.server_api.create_start = c,
            this.server_api.create_end = d,
            delete this.server_api.itemId
        },
        getGoods: function(a) {
            this.server_api.itemId = a,
            this.server_api.type = -2,
            delete this.server_api.key,
            delete this.server_api.create_start,
            delete this.server_api.create_end
        }
    }),
    c.exports = new f
}),
define("tadget/manage/1.0.0/vendor/backbone.paginator", ["jquery/jquery/1.10.1/jquery.js", "gallery/underscore/1.4.4/underscore.js", "gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$"],
function(a) {
    var b, c, d;
    d = a("jquery/jquery/1.10.1/jquery.js"),
    c = a("gallery/underscore/1.4.4/underscore.js"),
    b = a("gallery/backbone/1.0.0/backbone.js"),
    b.Paginator = function(a, b, c) {
        "use strict";
        var d = b.map(a.VERSION.split("."),
        function(a) {
            return parseInt(a, 10)
        }),
        e = {};
        e.version = "0.8.1",
        e.clientPager = a.Collection.extend({
            useDiacriticsPlugin: !0,
            useLevenshteinPlugin: !0,
            sortColumn: "",
            sortDirection: "desc",
            lastSortColumn: "",
            fieldFilterRules: [],
            lastFieldFilterRules: [],
            filterFields: "",
            filterExpression: "",
            lastFilterExpression: "",
            defaults_ui: {
                firstPage: 0,
                currentPage: 1,
                perPage: 5,
                totalPages: 10,
                pagesInRange: 4
            },
            initialize: function() {
                this.on("add", this.addModel, this),
                this.on("remove", this.removeModel, this),
                this.setDefaults()
            },
            setDefaults: function() {
                var a = b.defaults(this.paginator_ui, this.defaults_ui);
                b.defaults(this, a)
            },
            addModel: function(a) {
                this.origModels.push(a)
            },
            removeModel: function(a) {
                var c = b.indexOf(this.origModels, a);
                this.origModels.splice(c, 1)
            },
            sync: function(e, f, g) {
                var h = this;
                this.setDefaults();
                var i = {};
                b.each(b.result(h, "server_api"),
                function(a, c) {
                    b.isFunction(a) && (a = b.bind(a, h), a = a()),
                    i[c] = a
                });
                var j = b.clone(h.paginator_core);
                b.each(j,
                function(a, c) {
                    b.isFunction(a) && (a = b.bind(a, h), a = a()),
                    j[c] = a
                }),
                j = b.defaults(j, {
                    timeout: 25e3,
                    cache: !1,
                    type: "GET",
                    dataType: "jsonp"
                }),
                j = b.extend(j, {
                    data: decodeURIComponent(c.param(i)),
                    processData: !1,
                    url: b.result(j, "url")
                },
                g);
                var k = !(0 === d[0] && 9 === d[1] && 10 === d[2]),
                l = j.success;
                j.success = function(a, b, c) {
                    l && (k ? l(a, b, c) : l(f, a, j)),
                    f && f.trigger && f.trigger("sync", f, a, j)
                };
                var m = j.error;
                j.error = function(a) {
                    m && m(f, a, j),
                    f && f.trigger && f.trigger("error", f, a, j)
                };
                var n = j.xhr = a.ajax(j);
                return f && f.trigger && f.trigger("request", f, n, j),
                n
            },
            nextPage: function(a) {
                this.currentPage < this.information.totalPages && (this.currentPage = ++this.currentPage, this.pager(a))
            },
            previousPage: function(a) {
                this.currentPage > 1 && (this.currentPage = --this.currentPage, this.pager(a))
            },
            goTo: function(a, b) {
                void 0 !== a && (this.currentPage = parseInt(a, 10), this.pager(b))
            },
            howManyPer: function(a) {
                if (void 0 !== a) {
                    var b = this.perPage;
                    this.perPage = parseInt(a, 10),
                    this.currentPage = Math.ceil((b * (this.currentPage - 1) + 1) / a),
                    this.pager()
                }
            },
            setSort: function(a, b) {
                void 0 !== a && void 0 !== b && (this.lastSortColumn = this.sortColumn, this.sortColumn = a, this.sortDirection = b, this.pager(), this.info())
            },
            setFieldFilter: function(a) {
                b.isEmpty(a) ? (this.lastFieldFilterRules = this.fieldFilterRules, this.fieldFilterRules = "", this.pager(), this.info()) : (this.lastFieldFilterRules = this.fieldFilterRules, this.fieldFilterRules = a, this.pager(), this.info())
            },
            doFakeFieldFilter: function(a) {
                if (!b.isEmpty(a)) {
                    var c = this.origModels;
                    return void 0 === c && (c = this.models),
                    c = this._fieldFilter(c, a),
                    "" !== this.filterExpression && (c = this._filter(c, this.filterFields, this.filterExpression)),
                    c.length
                }
            },
            setFilter: function(a, b) {
                void 0 !== a && void 0 !== b && (this.filterFields = a, this.lastFilterExpression = this.filterExpression, this.filterExpression = b, this.pager(), this.info())
            },
            doFakeFilter: function(a, c) {
                if (void 0 !== a && void 0 !== c) {
                    var d = this.origModels;
                    return void 0 === d && (d = this.models),
                    b.isEmpty(this.fieldFilterRules) || (d = this._fieldFilter(d, this.fieldFilterRules)),
                    d = this._filter(d, a, c),
                    d.length
                }
            },
            pager: function(a) {
                var c = this,
                d = this.perPage,
                e = (c.currentPage - 1) * d,
                f = e + d;
                void 0 === c.origModels && (c.origModels = c.models),
                c.models = c.origModels.slice(),
                "" !== this.sortColumn && (c.models = c._sort(c.models, this.sortColumn, this.sortDirection)),
                b.isEmpty(this.fieldFilterRules) || (c.models = c._fieldFilter(c.models, this.fieldFilterRules)),
                "" !== this.filterExpression && (c.models = c._filter(c.models, this.filterFields, this.filterExpression)),
                this.lastSortColumn === this.sortColumn && this.lastFilterExpression === this.filterExpression && b.isEqual(this.fieldFilterRules, this.lastFieldFilterRules) || (e = 0, f = e + d, c.currentPage = 1, this.lastSortColumn = this.sortColumn, this.lastFieldFilterRules = this.fieldFilterRules, this.lastFilterExpression = this.filterExpression),
                c.sortedAndFilteredModels = c.models.slice(),
                c.info(),
                c.reset(c.models.slice(e, f)),
                b.result(a, "success")
            },
            _sort: function(a, c, d) {
                return a = a.sort(function(a, e) {
                    var f = a.get(c),
                    g = e.get(c);
                    if (b.isUndefined(f) || b.isUndefined(g) || null === f || null === g) return 0;
                    if (f = f.toString().toLowerCase(), g = g.toString().toLowerCase(), "desc" === d) if (!f.match(/[^\-\d\.]/) && f.match(/-?[\d\.]+/) && !g.match(/[^\-\d\.]/) && g.match(/-?[\d\.]+/)) {
                        if (g - 0 > f - 0) return 1;
                        if (f - 0 > g - 0) return - 1
                    } else {
                        if (g > f) return 1;
                        if (f > g) return - 1
                    } else if (!f.match(/[^\-\d\.]/) && f.match(/-?[\d\.]+/) && !g.match(/[^\-\d\.]/) && g.match(/-?[\d\.]+/)) {
                        if (g - 0 > f - 0) return - 1;
                        if (f - 0 > g - 0) return 1
                    } else {
                        if (g > f) return - 1;
                        if (f > g) return 1
                    }
                    if (a.cid && e.cid) {
                        var h = a.cid,
                        i = e.cid;
                        if (i > h) return - 1;
                        if (h > i) return 1
                    }
                    return 0
                })
            },
            _fieldFilter: function(a, c) {
                if (b.isEmpty(c)) return a;
                var d = [];
                return b.each(a,
                function(a) {
                    var e = !0;
                    b.each(c,
                    function(c) {
                        if (!e) return ! 1;
                        if (e = !1, "function" === c.type) {
                            var d = b.wrap(c.value,
                            function(b) {
                                return b(a.get(c.field))
                            });
                            d() && (e = !0)
                        } else "required" === c.type ? b.isEmpty(a.get(c.field).toString()) || (e = !0) : "min" === c.type ? !b.isNaN(Number(a.get(c.field))) && !b.isNaN(Number(c.value)) && Number(a.get(c.field)) >= Number(c.value) && (e = !0) : "max" === c.type ? !b.isNaN(Number(a.get(c.field))) && !b.isNaN(Number(c.value)) && Number(a.get(c.field)) <= Number(c.value) && (e = !0) : "range" === c.type ? !b.isNaN(Number(a.get(c.field))) && b.isObject(c.value) && !b.isNaN(Number(c.value.min)) && !b.isNaN(Number(c.value.max)) && Number(a.get(c.field)) >= Number(c.value.min) && Number(a.get(c.field)) <= Number(c.value.max) && (e = !0) : "minLength" === c.type ? a.get(c.field).toString().length >= c.value && (e = !0) : "maxLength" === c.type ? a.get(c.field).toString().length <= c.value && (e = !0) : "rangeLength" === c.type ? b.isObject(c.value) && !b.isNaN(Number(c.value.min)) && !b.isNaN(Number(c.value.max)) && a.get(c.field).toString().length >= c.value.min && a.get(c.field).toString().length <= c.value.max && (e = !0) : "oneOf" === c.type ? b.isArray(c.value) && b.include(c.value, a.get(c.field)) && (e = !0) : "equalTo" === c.type ? c.value === a.get(c.field) && (e = !0) : "containsAllOf" === c.type ? b.isArray(c.value) && b.isArray(a.get(c.field)) && b.intersection(c.value, a.get(c.field)).length === c.value.length && (e = !0) : "pattern" === c.type ? a.get(c.field).toString().match(c.value) && (e = !0) : e = !1
                    }),
                    e && d.push(a)
                }),
                d
            },
            _filter: function(c, d, e) {
                var f = this,
                g = {};
                if (b.isString(d) ? g[d] = {
                    cmp_method: "regexp"
                }: b.isArray(d) ? b.each(d,
                function(a) {
                    g[a] = {
                        cmp_method: "regexp"
                    }
                }) : b.each(d,
                function(a, c) {
                    g[c] = b.defaults(a, {
                        cmp_method: "regexp"
                    })
                }), d = g, b.has(a.Paginator, "removeDiacritics") && f.useDiacriticsPlugin && (e = a.Paginator.removeDiacritics(e)), "" === e || !b.isString(e)) return c;
                var h = b.map(e.match(/\w+/gi),
                function(a) {
                    return a.toLowerCase()
                }),
                i = "(" + b.uniq(h).join("|") + ")",
                j = new RegExp(i, "igm"),
                k = [];
                return b.each(c,
                function(c) {
                    var g = [];
                    b.each(d,
                    function(d, i) {
                        var k = c.get(i);
                        if (k) {
                            var l = [];
                            if (k = b.has(a.Paginator, "removeDiacritics") && f.useDiacriticsPlugin ? a.Paginator.removeDiacritics(k.toString()) : k.toString(), "levenshtein" === d.cmp_method && b.has(a.Paginator, "levenshtein") && f.useLevenshteinPlugin) {
                                var m = a.Paginator.levenshtein(k, e);
                                b.defaults(d, {
                                    max_distance: 0
                                }),
                                m <= d.max_distance && (l = b.uniq(h))
                            } else l = k.match(j);
                            l = b.map(l,
                            function(a) {
                                return a.toString().toLowerCase()
                            }),
                            b.each(l,
                            function(a) {
                                g.push(a)
                            })
                        }
                    }),
                    g = b.uniq(b.without(g, "")),
                    b.isEmpty(b.difference(h, g)) && k.push(c)
                }),
                k
            },
            info: function() {
                var a = this,
                b = {},
                c = a.sortedAndFilteredModels ? a.sortedAndFilteredModels.length: a.length,
                d = Math.ceil(c / a.perPage);
                return b = {
                    totalUnfilteredRecords: a.origModels.length,
                    totalRecords: c,
                    currentPage: a.currentPage,
                    perPage: this.perPage,
                    totalPages: d,
                    lastPage: d,
                    previous: !1,
                    next: !1,
                    startRecord: 0 === c ? 0 : (a.currentPage - 1) * this.perPage + 1,
                    endRecord: Math.min(c, a.currentPage * this.perPage)
                },
                a.currentPage > 1 && (b.previous = a.currentPage - 1),
                a.currentPage < b.totalPages && (b.next = a.currentPage + 1),
                b.pageSet = a.setPagination(b),
                a.information = b,
                b
            },
            setPagination: function(a) {
                var b = [],
                c = 0,
                d = 0,
                e = 2 * this.pagesInRange,
                f = Math.ceil(a.totalRecords / a.perPage);
                if (f > 1) if (1 + e >= f) for (c = 1, d = f; d >= c; c++) b.push(c);
                else if (a.currentPage <= this.pagesInRange + 1) for (c = 1, d = 2 + e; d > c; c++) b.push(c);
                else if (f - this.pagesInRange > a.currentPage && a.currentPage > this.pagesInRange) for (c = a.currentPage - this.pagesInRange; c <= a.currentPage + this.pagesInRange; c++) b.push(c);
                else for (c = f - e; f >= c; c++) b.push(c);
                return b
            },
            bootstrap: function(a) {
                return b.extend(this, a),
                this.goTo(1),
                this.info(),
                this
            }
        }),
        e.clientPager.prototype.prevPage = e.clientPager.prototype.previousPage;
        var f = function() {
            var a = new c.Deferred;
            return a.reject(),
            a.promise()
        };
        return e.requestPager = a.Collection.extend({
            sync: function(e, f, g) {
                var h = this;
                h.setDefaults();
                var i = {};
                b.each(b.result(h, "server_api"),
                function(a, c) {
                    b.isFunction(a) && (a = b.bind(a, h), a = a()),
                    i[c] = a
                });
                var j = b.clone(h.paginator_core);
                b.each(j,
                function(a, c) {
                    b.isFunction(a) && (a = b.bind(a, h), a = a()),
                    j[c] = a
                }),
                j = b.defaults(j, {
                    timeout: 25e3,
                    cache: !1,
                    type: "GET",
                    dataType: "jsonp"
                }),
                g.data = decodeURIComponent(g.data ? c.param(b.extend(i, g.data)) : c.param(i)),
                j = b.extend(j, {
                    data: decodeURIComponent(c.param(i)),
                    processData: !1,
                    url: b.result(j, "url")
                },
                g);
                var k = !(0 === d[0] && 9 === d[1] && 10 === d[2]),
                l = j.success;
                j.success = function(a, b, c) {
                    l && (k ? l(a, b, c) : l(f, a, j)),
                    d[0] < 1 && f && f.trigger && f.trigger("sync", f, a, j)
                };
                var m = j.error;
                j.error = function(a) {
                    m && m(a),
                    f && f.trigger && f.trigger("error", f, a, j)
                };
                var n = j.xhr = a.ajax(j);
                return f && f.trigger && f.trigger("request", f, n, j),
                n
            },
            setDefaults: function() {
                var a = this;
                b.defaults(a.paginator_ui, {
                    firstPage: 0,
                    currentPage: 1,
                    perPage: 5,
                    totalPages: 10,
                    pagesInRange: 4
                }),
                b.each(a.paginator_ui,
                function(c, d) {
                    b.isUndefined(a[d]) && (a[d] = a.paginator_ui[d])
                })
            },
            requestNextPage: function(a) {
                return void 0 !== this.currentPage ? (this.currentPage += 1, this.pager(a)) : f()
            },
            requestPreviousPage: function(a) {
                return void 0 !== this.currentPage ? (this.currentPage -= 1, this.pager(a)) : f()
            },
            updateOrder: function(a, b) {
                return void 0 !== a ? (this.sortField = a, this.pager(b)) : f()
            },
            goTo: function(a, b) {
                return void 0 !== a ? (this.currentPage = parseInt(a, 10), this.pager(b)) : f()
            },
            howManyPer: function(a, b) {
                return void 0 !== a ? (this.currentPage = this.firstPage, this.perPage = a, this.pager(b)) : f()
            },
            info: function() {
                var a = {
                    totalRecords: this.totalRecords || 0,
                    currentPage: this.currentPage,
                    firstPage: this.firstPage,
                    totalPages: Math.ceil(this.totalRecords / this.perPage),
                    lastPage: this.totalPages,
                    perPage: this.perPage,
                    previous: !1,
                    next: !1
                };
                return this.currentPage > 1 && (a.previous = this.currentPage - 1),
                this.currentPage < a.totalPages && (a.next = this.currentPage + 1),
                a.hasNext = a.next,
                a.hasPrevious = a.next,
                a.pageSet = this.setPagination(a),
                this.information = a,
                a
            },
            setPagination: function(a) {
                var b = [],
                c = 0,
                d = 0,
                e = 2 * this.pagesInRange,
                f = Math.ceil(a.totalRecords / a.perPage);
                if (f > 1) if (1 + e >= f) for (c = 1, d = f; d >= c; c++) b.push(c);
                else if (a.currentPage <= this.pagesInRange + 1) for (c = 1, d = 2 + e; d > c; c++) b.push(c);
                else if (f - this.pagesInRange > a.currentPage && a.currentPage > this.pagesInRange) for (c = a.currentPage - this.pagesInRange; c <= a.currentPage + this.pagesInRange; c++) b.push(c);
                else for (c = f - e; f >= c; c++) b.push(c);
                return b
            },
            pager: function(a) {
                return b.isObject(a) || (a = {}),
                this.fetch({
                    reset: !0
                })
            },
            url: function() {
                return void 0 !== this.paginator_core && void 0 !== this.paginator_core.url ? this.paginator_core.url: null
            },
            bootstrap: function(a) {
                return b.extend(this, a),
                this.setDefaults(),
                this.info(),
                this
            }
        }),
        e.requestPager.prototype.nextPage = e.requestPager.prototype.requestNextPage,
        e.requestPager.prototype.prevPage = e.requestPager.prototype.requestPreviousPage,
        e
    } (b, c, jQuery)
}),
define("tadget/manage/1.0.0/models/file", ["gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "jquery/jquery/1.10.1/jquery.js", "tadget/manage/1.0.0/vendor/infor", "tadget/manage/1.0.0/common"],
function(a, b, c) {
    var d = a("gallery/backbone/1.0.0/backbone.js"),
    e = a("jquery/jquery/1.10.1/jquery.js"),
    f = a("tadget/manage/1.0.0/vendor/infor"),
    g = a("tadget/manage/1.0.0/common"),
    h = d.Model.extend({
        saveName: function(a) {
            var b = {};
            this.get("fullUrl") ? (b.cmd = "json_file_update", b.file_id = this.get("pictureId"), b.name = this.get("name")) : (b.cmd = "json_cat_update", b.cat_id = this.get("pictureCategoryId"), b.cat_name = this.get("pictureCategoryName")),
            this.syncData(b, e.proxy(this.saveNameCB, this)),
            this.prename = a
        },
        saveNameCB: function(a) {
            a.success ? f.show("重命名成功", "success") : (f.show("重名失败: " + a.message, "danger"), this.set(this.get("fullUrl") ? {
                name: this.prename
            }: {
                pictureCategoryName: this.prename
            }))
        },
        syncData: g.getData
    });
    c.exports = h
}),
define("tadget/manage/1.0.0/models/crumbs", ["gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$"],
function(a, b, c) {
    var d = a("gallery/backbone/1.0.0/backbone.js"),
    e = d.Model.extend({
        defaults: {
            currentFolder: -1,
            crumbs: {}
        },
        url: AJAX_URL,
        parse: function(a) {
            return a.success ? {
                crumbs: a.module
            }: {
                crumbs: [{
                    id: "0",
                    name: a.message
                }]
            }
        }
    });
    c.exports = new e
}),
define("tadget/manage/1.0.0/models/tree", ["gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$"],
function(a, b, c) {
    var d = a("gallery/backbone/1.0.0/backbone.js"),
    e = d.Model.extend({
        url: AJAX_URL,
        defaults: {
            nodes: {},
            currentFolder: "0"
        },
        parse: function(a) {
            return a.success ? (console.log(a), {
                nodes: a.module
            }) : void console.log(a.message)
        },
        option: {
            dataType: "jsonp",
            type: "get",
            jsonpCallback: "successMethod",
            data: {
                _input_charset: "utf-8",
                cmd: "json_dirTree_query"
            }
        },
        syncTree: function() {
            this.fetch(this.option)
        }
    });
    c.exports = new e({
        nodes: ZTREENODE
    })
}),
define("tadget/manage/1.0.0/views/maintree", ["tadget/manage/1.0.0/routers/router", "gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "tadget/manage/1.0.0/common", "tadget/manage/1.0.0/vendor/infor", "jquery/jquery/1.10.1/jquery.js", "tadget/manage/1.0.0/collections/folder", "gallery/underscore/1.4.4/underscore.js", "tadget/manage/1.0.0/vendor/backbone.paginator", "tadget/manage/1.0.0/models/file", "tadget/manage/1.0.0/models/crumbs", "tadget/manage/1.0.0/models/tree", "tadget/manage/1.0.0/vendor/modal", "plugin/zTree/jquery.ztree.core-3.5.js", "plugin/zTree/jquery.ztree.exedit-3.5.js", "tadget/manage/1.0.0/vendor/jquery.autocomplete"],
function(a, b, c) {
    var d, e, f, g, h, i, j, k, l;
    d = a("tadget/manage/1.0.0/routers/router"),
    e = f = a("jquery/jquery/1.10.1/jquery.js"),
    g = a("gallery/backbone/1.0.0/backbone.js"),
    h = a("gallery/underscore/1.4.4/underscore.js"),
    l = a("tadget/manage/1.0.0/common"),
    i = a("tadget/manage/1.0.0/models/tree"),
    crumbs = a("tadget/manage/1.0.0/models/crumbs"),
    j = a("tadget/manage/1.0.0/vendor/infor"),
    k = a("tadget/manage/1.0.0/vendor/modal"),
    a("plugin/zTree/jquery.ztree.core-3.5.js")(f),
    a("plugin/zTree/jquery.ztree.exedit-3.5.js")(f),
    a("tadget/manage/1.0.0/vendor/jquery.autocomplete")(f),
    TreeView = g.View.extend({
        el: ".tree-container",
        preNode: {},
        initialize: function() {
            this.model.on("change:nodes", this.rendTree, this),
            this.model.on("addFolder", this.addFolder, this),
            this.model.on("removeFolders", this.removeFolders, this),
            this.model.on("rename", this.renameNode, this),
            this.model.on("change:currentFolder", this.selectFolder, this),
            this.model.on("moveFile", this.moveFile, this),
            this.model.on("upFile", this.afterUpFile, this);
            this.rightMenu = this.$(".rightButton"),
            f(document).on("contextmenu", ".tree-container .rightButton",
            function(a) {
                a.preventDefault()
            }),
            this.rendTree(),
            this.model.trigger("change:currentFolder")
        },
        events: {
            "click .tree-add": "newFolder",
            "click .tree-move": "moveFolder",
            "click .tree-rename": "renameFolder",
            "click .tree-delete": "deleteFolder",
            "focus #J_search_folder": "searchTree",
            "click .search-btn": "onClickSearch",
            "keypress #J_search_folder": "onEnterSearch"
        },
        getData: l.getData,
        isfreezeNode: function(a) {
            return null !== a && void 0 === a.id ? (j.show("此文件夹正在同步,请稍后再操作..", "danger"), !1) : !0
        },
        beforeClick: function(a, b) {
            return this.isfreezeNode(b)
        },
        beforeDblClick: function(a, b) {
            return this.isfreezeNode(b)
        },
        beforeDrag: function(a, b) {
            return this.isfreezeNode(b[0])
        },
        beforeDrop: function(a, b, c, d) {
            var e = !0;
            return ! c || "0" == c.id && "inner" !== d || c.id === b[0].id ? e = !1 : c.getParentNode() && b[0].getParentNode().id == c.getParentNode().id && "inner" !== d && (e = !1),
            ("0" === b[0].type || "1" === b[0].type) && (j.show("系统目录不允许移动", "danger"), e = !1),
            e
        },
        beforeRightClick: function(a, b) {
            return this.isfreezeNode(b)
        },
        beforeRename: function() {
            return ! 0
        },
        onClick: function(a, b, c) {
            var e = "goto/" + c.id + "/1";
            d.navigate(e, {
                trigger: !0
            })
        },
        testName: function(a) {
            var b = !0,
            c = a.name,
            d = l.checkName(c);
            d && (j.show(d, "danger"), b = !1);
            var e = a.getParentNode();
            brotherNodes = null === e ? self.tree.getNodes() : e.children;
            var f = h.some(brotherNodes,
            function(b) {
                return b.name === c && b.tId !== a.tId
            });
            return f && (j.show("同一目录存在同名文件", "danger"), b = !1),
            b
        },
        onRightClick: function(a, b, c) {
            var d;
            if (this.rightMenu.find(".disabled").removeClass("disabled"), null === c) this.tree.getSelectedNodes().length > 0 && (d = this.tree.getSelectedNodes()[0]);
            else if (d = a.target.id, d = /J_MainTree_\d*/gi.exec(d), null !== d) {
                var e = this.tree.getNodeByTId(d[0]);
                this.tree.selectNode(e),
                this.gotoFoler(e)
            }
            var g = f("#wrap").width(),
            h = f("#wrap").height(),
            i = this.rightMenu.outerWidth(),
            j = this.rightMenu.outerHeight(),
            k = 0,
            l = 0,
            m = a;
            k = m.clientX + i < g ? m.clientX: g - i,
            l = m.clientY + j < h ? m.clientY: m.clientY - j,
            this.rightMenu.css({
                left: k + "px",
                top: l + "px"
            }),
            this.rightMenu.show();
            var n = this;
            f(document).one("click",
            function() {
                n.rightMenu.hide()
            })
        },
        onDrop: function(a, b, c, d, e) {
            var f = this,
            g = 0,
            h = c[0].id;
            null !== d && h !== d.id && ("inner" !== e && (d = d.getParentNode()), d && (g = d.id), f.getData({
                cmd: "json_batch_move",
                dir_id: g,
                dir_ids: h
            },
            function(a) {
                a.success ? (f.unFreezeNode(d), f.sycNodeData(), a.module.dir_failure_module.length > 0 || a.module.file_failure_module.length > 0 ? (f.someFaile(a.module, "move"), f.refresh()) : (f.gotoFoler(d), crumbs.trigger("change:currentFolder"), j.show("移动成功", "success"))) : (j.show("移动失败: " + a.message + ",回滚操作", "danger"), f.refresh())
            }))
        },
        onRename: function(a, b, c, d) {
            var e = this,
            g = c.id;
            if (d) return void 0 === g && (e.tree.removeNode(c), h.delay(function() {
                e.tree.selectNode(k)
            },
            1)),
            !1;
            c.name = f.trim(c.name),
            this.tree.updateNode(c);
            var i = e.testName(c);
            if (e.freezeNode(c), g) {
                if (!i) return c.id = e.preNode.id,
                c.name = e.preNode.name,
                void e.tree.updateNode(c);
                e.getData({
                    cmd: "json_cat_update",
                    cat_id: g,
                    cat_name: c.name
                },
                function(a) {
                    a.success ? (j.show("重命名成功", "success"), e.unFreezeNode(c), e.gotoFoler(c), crumbs.trigger("change:currentFolder"), e.sycNodeData()) : (j.show("重命名失败: " + a.message), e.refresh())
                })
            } else {
                var k = c.getParentNode(c);
                if (!i) return e.tree.removeNode(c),
                void h.delay(function() {
                    e.tree.selectNode(k)
                },
                1);
                var l = 0;
                null !== k && (l = k.id),
                e.getData({
                    cmd: "json_add_dir",
                    dir_id: l,
                    name: c.name
                },
                function(a) {
                    a.success ? (e.unFreezeNode(c), c.id = a.module.pictureCategoryId, e.gotoFoler(c), j.show("新建文件夹成功", "success"), e.sycNodeData()) : (j.show("新建文件夹失败: " + a.message, "danger"), e.refresh())
                })
            }
        },
        newFolder: function() {
            var a = this.tree,
            b = !1,
            c = a.getSelectedNodes(),
            d = c[0];
            if (d) {
                if (d.isFreezing === !0) return;
                d = a.addNodes(d, {
                    pId: d.id,
                    isParent: b,
                    name: ""
                })
            } else d = a.addNodes(null, {
                pId: 0,
                isParent: b,
                name: ""
            });
            a.editName(d[0])
        },
        moveFolder: function() {
            var a = this,
            b = a.tree.getSelectedNodes();
            if (0 === b.length) return void j.show("请选择一个文件夹", "info");
            if ("0" === b[0].id) return void j.show("根目录不允许移动", "danger");
            if ("0" === b[0].type || "1" === b[0].type) return void j.show("系统目录不允许移动", "danger");
            k.show("left-move", "移动到", "");
            var c = {
                callback: {
                    beforeExpand: function(a, c) {
                        var d = h.find(b,
                        function(a) {
                            return a.id == c.id
                        });
                        return void 0 === d ? !0 : (k.showMsg("请不要移动到同源目录下", "danger"), !1)
                    },
                    beforeClick: function(a, c) {
                        var d = b[0].getParentNode();
                        if (d.id == c.id) return k.showMsg("当前文件就在这个文件夹下,不需要移动", "danger"),
                        !1;
                        var e = h.find(b,
                        function(a) {
                            return a.id == c.id
                        });
                        return void 0 === e ? !0 : (k.showMsg("请不要移动到同源目录下", "danger"), !1)
                    },
                    beforeDblClick: function() {
                        return ! 1
                    },
                    onExpand: function() {}
                }
            },
            d = f.fn.zTree.init(f("#J_ModalTree"), c, ZTREENODE);
            f("#J_ModalSure").on("click",
            function() {
                if ("left-move" === k.type()) {
                    var c, e, f;
                    if (!d.getSelectedNodes()[0]) return void k.showMsg("请选择目标目录", "danger");
                    c = d.getSelectedNodes()[0].id,
                    e = a.tree.getNodeByParam("id", c, null),
                    f = b[0],
                    a.moveFile({
                        cat: [f.id],
                        pic: [],
                        targetId: c
                    })
                }
            })
        },
        moveFile: function(a) {
            optionData = {
                cmd: "json_batch_move",
                dir_id: a.targetId
            },
            a.pic.length > 0 && (optionData.file_ids = a.pic.join(",")),
            a.cat.length > 0 && (optionData.dir_ids = a.cat.join(",")),
            k.showMsg("移动中,请稍后", "info"),
            this.getData(optionData, f.proxy(this.moveResult, this, a.targetId))
        },
        moveResult: function(a, b) {
            var c, d, e;
            k.hide(),
            b.success ? (b.module.dir_failure_module.length > 0 || b.module.file_failure_module.length > 0 ? this.someFaile(b.module, "move") : j.show("移动成功", "success"), c = this.tree.getNodesByParam("id", a, null)[0], this.gotoFoler(c), e = b.module.dir_success_module, h.each(e,
            function(a) {
                d = this.tree.getNodesByParam("id", a.cat_id, null)[0],
                d && this.tree.moveNode(c, d, "inner")
            },
            this), this.sycNodeData()) : j.show("移动出错: " + b.message, "danger")
        },
        renameFolder: function() {
            var a = this.tree,
            b = a.getSelectedNodes(),
            c = b[0];
            return c ? "0" === c.id ? void j.show("根目录不允许命名", "danger") : "1" === c.type || "0" === c.type ? void j.show("系统目录不允许重命名", "danger") : (this.preNode = {
                id: c.id,
                name: c.name
            },
            void a.editName(c)) : void j.show("请选择一个文件夹", "info")
        },
        deleteFolder: function(a) {
            if (!f(a.currentTarget).parents().eq(1).hasClass("rightButton") || !f(a.currentTarget).hasClass("disabled")) {
                var b = this,
                c = b.tree.getSelectedNodes();
                if (0 === c.length) return void j.show("请选择一个文件夹", "info");
                if ("0" === c[0].id) return void j.show("根目录不允许删除", "danger");
                if ("1" === c[0].type || "0" === c[0].type) return void j.show("系统目录不允许删除", "danger");
                k.show("left-delete", "删除当前文件"),
                f("#J_ModalSure").on("click", f.proxy(this.doDelete, this, c))
            }
        },
        doDelete: function(a) {
            var b = this;
            "left-delete" === k.type() && (k.showMsg("删除中,请稍后...", "info"), b.getData({
                cmd: "json_batch_delete",
                dir_ids: a[0].id
            },
            function(c) {
                if (k.hide(), c.success) {
                    if (c.module.dir_failure_module.length > 0 || c.module.file_failure_module.length > 0) {
                        b.someFaile(c.module, "delete");
                        var d = [];
                        h.each(c.module.dir_success_module,
                        function(a) {
                            d.push(a.cat_id)
                        }),
                        b.removeFolders(d)
                    } else {
                        j.show("删除成功", "success"),
                        b.tree.removeNode(a[0]);
                        var e = a[0].getParentNode();
                        b.gotoFoler(e),
                        k.hide()
                    }
                    b.sycNodeData()
                } else j.show("删除出错:" + c.message, "danger")
            }))
        },
        someFaile: function(a, b) {
            var c, d, e;
            "delete" == b ? k.show("delete-error", "删除异常", "下列文件没有被删除") : k.show("move-error", "移动异常", "下列文件没有被移动"),
            k.$el.find(".modal-footer button").eq(1).hide(),
            d = [],
            c = h.template('<tr><td title="<%=name%>"><%=name%></td><td title="<%=position%>"><%=position%></td><td title="<%=message%>"><%=message%></td></tr>'),
            e = h.union(a.dir_failure_module, a.file_failure_module),
            h.each(e,
            function(a) {
                d.push(c(a))
            },
            this),
            k.$el.find("#J_ErrorTable").html(d.join("")),
            f("#J_ModalSure").on("click",
            function() {
                k.hide()
            })
        },
        onBlurSearch: function() {},
        onClickSearch: function() {
            var a = f.trim(this.$el.find("#J_search_folder").val());
            if ("" !== a) {
                var b = this.tree.getNodesByParam("name", a, null);
                b.length > 0 ? this.gotoFoler(b[0]) : j.show("没有搜到结果", "danger")
            }
        },
        onEnterSearch: function(a) {
            13 == a.keyCode && this.onClickSearch(a)
        },
        searchTree: function() {
            function a(a) {
                function b(a) {
                    h.forEach(a.children,
                    function(a) {
                        c.push({
                            value: a.name,
                            id: a.id
                        }),
                        b(a)
                    })
                }
                var c = [];
                return b(a),
                c
            }
            var b = this,
            c = this.$el.find("#J_search_folder"),
            d = ZTREENODE;
            c.select();
            var e = a(d);
            c.autocomplete({
                lookup: e,
                lookupFilter: function(a, b) {
                    return - 1 != a.value.indexOf(b)
                },
                onSelect: function(a) {
                    var c = b.tree.getNodesByParam("id", a.id, null);
                    c.length > 0 && b.gotoFoler(c[0])
                }
            })
        },
        freezeNode: function(a) {
            a && (a.isFreezing = !1)
        },
        unFreezeNode: function(a) {
            a && (a.isFreezing = !1)
        },
        refresh: function() {
            this.rendTree()
        },
        gotoFoler: function(a) {
            var b = a.id,
            c = "goto/" + b + "/1";
            d.navigate(c, {
                trigger: !0
            }),
            this.model.set({
                currentFolder: b
            })
        },
        rendTree: function() {
            var a = {
                edit: {
                    enable: !0,
                    showRemoveBtn: !1,
                    showRenameBtn: !1
                },
                view: {
                    selectedMulti: !1
                },
                callback: {
                    beforeClick: f.proxy(this.beforeClick, this),
                    beforeDblClick: f.proxy(this.beforeDblClick, this),
                    beforeDrag: f.proxy(this.beforeDrag, this),
                    beforeRightClick: f.proxy(this.beforeRightClick, this),
                    beforeRename: f.proxy(this.beforeRename, this),
                    beforeDrop: f.proxy(this.beforeDrop, this),
                    onExpand: f.proxy(this.onExpand, this),
                    onClick: f.proxy(this.onClick, this),
                    onRightClick: f.proxy(this.onRightClick, this),
                    onDrop: f.proxy(this.onDrop, this),
                    onRename: f.proxy(this.onRename, this)
                }
            };
            f.fn.zTree.destroy("J_MainTree"),
            this.tree = f.fn.zTree.init(f("#J_MainTree"), a, ZTREENODE);
            var b = this.tree.getNodesByParam("id", this.model.get("currentFolder"), null)[0];
            b && this.gotoFoler(b)
        },
        addFolder: function(a) {
            var b = this.tree.getSelectedNodes()[0];
            this.tree.addNodes(b, {
                isParent: !1,
                name: a.name,
                id: a.id
            }),
            this.sycNodeData()
        },
        removeFolders: function(a) {
            for (var b, c = this.tree.getSelectedNodes()[0], d = 0; d < a.length; d++) b = this.tree.getNodesByParam("id", a[d], c),
            b.length > 0 && this.tree.removeNode(b[0]);
            this.sycNodeData()
        },
        selectFolder: function() {
            var a = this.model.get("currentFolder");
            if (Number(a) < 0) this.tree.cancelSelectedNode();
            else {
                var b = this.tree.getNodesByParam("id", a);
                b.length > 0 && this.tree.selectNode(b[0])
            }
        },
        renameNode: function(a) {
            var b = this.tree.getNodesByParam("id", a.id);
            b.length > 0 && (b[0].name = a.name, this.tree.updateNode(b[0])),
            this.sycNodeData()
        },
        sycNodeData: function() {
            var a = this;
            this.getData({
                cmd: "json_dirTree_query"
            },
            function(b) {
                b.success && (ZTREENODE = b.module, a.model.set({
                    nodes: ZTREENODE
                },
                {
                    silent: !0
                }))
            })
        },
        afterUpFile: function() {
            setTimeout(function() {
                window.location.reload()
            },
            20)
        }
    }),
    c.exports = new TreeView({
        model: i
    })
}),
define("tadget/manage/1.0.0/vendor/jquery.autocomplete", [],
function() {
    return function(a) {
        "use strict";
        function b(c, d) {
            var e = function() {},
            f = this,
            g = {
                autoSelectFirst: !1,
                appendTo: "body",
                serviceUrl: null,
                lookup: null,
                onSelect: null,
                width: "auto",
                minChars: 1,
                maxHeight: 300,
                deferRequestBy: 0,
                params: {},
                formatResult: b.formatResult,
                delimiter: null,
                zIndex: 9999,
                type: "GET",
                noCache: !1,
                onSearchStart: e,
                onSearchComplete: e,
                onSearchError: e,
                containerClass: "autocomplete-suggestions",
                tabDisabled: !1,
                dataType: "text",
                currentRequest: null,
                lookupFilter: function(a, b, c) {
                    return - 1 !== a.value.toLowerCase().indexOf(c)
                },
                paramName: "query",
                transformResult: function(b) {
                    return "string" == typeof b ? a.parseJSON(b) : b
                }
            };
            f.element = c,
            f.el = a(c),
            f.suggestions = [],
            f.badQueries = [],
            f.selectedIndex = -1,
            f.currentValue = f.element.value,
            f.intervalId = 0,
            f.cachedResponse = [],
            f.onChangeInterval = null,
            f.onChange = null,
            f.isLocal = !1,
            f.suggestionsContainer = null,
            f.options = a.extend({},
            g, d),
            f.classes = {
                selected: "autocomplete-selected",
                suggestion: "autocomplete-suggestion"
            },
            f.hint = null,
            f.hintValue = "",
            f.selection = null,
            f.initialize(),
            f.setOptions(d)
        }
        var c = function() {
            return {
                escapeRegExChars: function(a) {
                    return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                },
                createNode: function(a) {
                    var b = document.createElement("div");
                    return b.innerHTML = a,
                    b.firstChild
                }
            }
        } (),
        d = {
            ESC: 27,
            TAB: 9,
            RETURN: 13,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40
        };
        b.utils = c,
        a.Autocomplete = b,
        b.formatResult = function(a, b) {
            var d = "(" + c.escapeRegExChars(b) + ")";
            return a.value.replace(new RegExp(d, "gi"), "<strong>$1</strong>")
        },
        b.prototype = {
            killerFn: null,
            initialize: function() {
                var c, d = this,
                e = "." + d.classes.suggestion,
                f = d.classes.selected,
                g = d.options;
                d.element.setAttribute("autocomplete", "off"),
                d.killerFn = function(b) {
                    0 === a(b.target).closest("." + d.options.containerClass).length && (d.killSuggestions(), d.disableKillerFn())
                },
                d.suggestionsContainer = b.utils.createNode('<div class="' + g.containerClass + '" style="position: absolute; display: none;"></div>'),
                c = a(d.suggestionsContainer),
                c.appendTo(g.appendTo),
                "auto" !== g.width && c.width(g.width),
                c.on("mouseover.autocomplete", e,
                function() {
                    d.activate(a(this).data("index"))
                }),
                c.on("mouseout.autocomplete",
                function() {
                    d.selectedIndex = -1,
                    c.children("." + f).removeClass(f)
                }),
                c.on("click.autocomplete", e,
                function() {
                    d.select(a(this).data("index"))
                }),
                d.fixPosition(),
                d.fixPositionCapture = function() {
                    d.visible && d.fixPosition()
                },
                a(window).on("resize", d.fixPositionCapture),
                d.el.on("keydown.autocomplete",
                function(a) {
                    d.onKeyPress(a)
                }),
                d.el.on("keyup.autocomplete",
                function(a) {
                    d.onKeyUp(a)
                }),
                d.el.on("blur.autocomplete",
                function() {
                    d.onBlur()
                }),
                d.el.on("focus.autocomplete",
                function() {
                    d.fixPosition()
                }),
                d.el.on("change.autocomplete",
                function(a) {
                    d.onKeyUp(a)
                })
            },
            onBlur: function() {
                this.enableKillerFn()
            },
            setOptions: function(b) {
                var c = this,
                d = c.options;
                a.extend(d, b),
                c.isLocal = a.isArray(d.lookup),
                c.isLocal && (d.lookup = c.verifySuggestionsFormat(d.lookup)),
                a(c.suggestionsContainer).css({
                    "max-height": d.maxHeight + "px",
                    width: d.width + "px",
                    "z-index": d.zIndex
                })
            },
            clearCache: function() {
                this.cachedResponse = [],
                this.badQueries = []
            },
            clear: function() {
                this.clearCache(),
                this.currentValue = "",
                this.suggestions = []
            },
            disable: function() {
                this.disabled = !0
            },
            enable: function() {
                this.disabled = !1
            },
            fixPosition: function() {
                var b, c = this;
                "body" === c.options.appendTo && (b = c.el.offset(), a(c.suggestionsContainer).css({
                    top: b.top + c.el.outerHeight() + "px",
                    left: b.left + "px"
                }))
            },
            enableKillerFn: function() {
                var b = this;
                a(document).on("click.autocomplete", b.killerFn)
            },
            disableKillerFn: function() {
                var b = this;
                a(document).off("click.autocomplete", b.killerFn)
            },
            killSuggestions: function() {
                var a = this;
                a.stopKillSuggestions(),
                a.intervalId = window.setInterval(function() {
                    a.hide(),
                    a.stopKillSuggestions()
                },
                300)
            },
            stopKillSuggestions: function() {
                window.clearInterval(this.intervalId)
            },
            isCursorAtEnd: function() {
                var a, b = this,
                c = b.el.val().length,
                d = b.element.selectionStart;
                return "number" == typeof d ? d === c: document.selection ? (a = document.selection.createRange(), a.moveStart("character", -c), c === a.text.length) : !0
            },
            onKeyPress: function(a) {
                var b = this;
                if (!b.disabled && !b.visible && a.which === d.DOWN && b.currentValue) return void b.suggest();
                if (!b.disabled && b.visible) {
                    switch (a.which) {
                    case d.ESC:
                        b.el.val(b.currentValue),
                        b.hide();
                        break;
                    case d.RIGHT:
                        if (b.hint && b.options.onHint && b.isCursorAtEnd()) {
                            b.selectHint();
                            break
                        }
                        return;
                    case d.TAB:
                        if (b.hint && b.options.onHint) return void b.selectHint();
                    case d.RETURN:
                        if ( - 1 === b.selectedIndex) return void b.hide();
                        if (b.select(b.selectedIndex), a.which === d.TAB && b.options.tabDisabled === !1) return;
                        break;
                    case d.UP:
                        b.moveUp();
                        break;
                    case d.DOWN:
                        b.moveDown();
                        break;
                    default:
                        return
                    }
                    a.stopImmediatePropagation(),
                    a.preventDefault()
                }
            },
            onKeyUp: function(a) {
                var b = this;
                if (!b.disabled) {
                    switch (a.which) {
                    case d.UP:
                    case d.DOWN:
                        return
                    }
                    clearInterval(b.onChangeInterval),
                    b.currentValue !== b.el.val() && (b.findBestHint(), b.options.deferRequestBy > 0 ? b.onChangeInterval = setInterval(function() {
                        b.onValueChange()
                    },
                    b.options.deferRequestBy) : b.onValueChange())
                }
            },
            onValueChange: function() {
                var b, c = this;
                c.selection && (c.selection = null, (c.options.onInvalidateSelection || a.noop)()),
                clearInterval(c.onChangeInterval),
                c.currentValue = c.el.val(),
                b = c.getQuery(c.currentValue),
                c.selectedIndex = -1,
                b.length < c.options.minChars ? c.hide() : c.getSuggestions(b)
            },
            getQuery: function(b) {
                var c, d = this.options.delimiter;
                return d ? (c = b.split(d), a.trim(c[c.length - 1])) : a.trim(b)
            },
            getSuggestionsLocal: function(b) {
                var c = this,
                d = b.toLowerCase(),
                e = c.options.lookupFilter;
                return {
                    suggestions: a.grep(c.options.lookup,
                    function(a) {
                        return e(a, b, d)
                    })
                }
            },
            getSuggestions: function(b) {
                var c, d = this,
                e = d.options,
                f = e.serviceUrl;
                if (c = d.isLocal ? d.getSuggestionsLocal(b) : d.cachedResponse[b], c && a.isArray(c.suggestions)) d.suggestions = c.suggestions,
                d.suggest();
                else if (!d.isBadQuery(b)) {
                    if (e.params[e.paramName] = b, e.onSearchStart.call(d.element, e.params) === !1) return;
                    a.isFunction(e.serviceUrl) && (f = e.serviceUrl.call(d.element, b)),
                    null != this.currentRequest && this.currentRequest.abort(),
                    this.currentRequest = a.ajax({
                        url: f,
                        data: e.ignoreParams ? null: e.params,
                        type: e.type,
                        dataType: e.dataType
                    }).done(function(a) {
                        d.processResponse(a, b),
                        e.onSearchComplete.call(d.element, b)
                    }).fail(function(a, c, f) {
                        e.onSearchError.call(d.element, b, a, c, f)
                    })
                }
            },
            isBadQuery: function(a) {
                for (var b = this.badQueries,
                c = b.length; c--;) if (0 === a.indexOf(b[c])) return ! 0;
                return ! 1
            },
            hide: function() {
                var b = this;
                b.visible = !1,
                b.selectedIndex = -1,
                a(b.suggestionsContainer).hide(),
                b.signalHint(null)
            },
            suggest: function() {
                if (0 === this.suggestions.length) return void this.hide();
                var b, c = this,
                d = c.options.formatResult,
                e = c.getQuery(c.currentValue),
                f = c.classes.suggestion,
                g = c.classes.selected,
                h = a(c.suggestionsContainer),
                i = "";
                a.each(c.suggestions,
                function(a, b) {
                    i += '<div class="' + f + '" data-index="' + a + '">' + d(b, e) + "</div>"
                }),
                "auto" === c.options.width && (b = c.el.outerWidth() - 2, h.width(b > 0 ? b: 300)),
                h.html(i).show(),
                c.visible = !0,
                c.options.autoSelectFirst && (c.selectedIndex = 0, h.children().first().addClass(g)),
                c.findBestHint()
            },
            findBestHint: function() {
                var b = this,
                c = b.el.val().toLowerCase(),
                d = null;
                c && (a.each(b.suggestions,
                function(a, b) {
                    var e = 0 === b.value.toLowerCase().indexOf(c);
                    return e && (d = b),
                    !e
                }), b.signalHint(d))
            },
            signalHint: function(b) {
                var c = "",
                d = this;
                b && (c = d.currentValue + b.value.substr(d.currentValue.length)),
                d.hintValue !== c && (d.hintValue = c, d.hint = b, (this.options.onHint || a.noop)(c))
            },
            verifySuggestionsFormat: function(b) {
                return b.length && "string" == typeof b[0] ? a.map(b,
                function(a) {
                    return {
                        value: a,
                        data: null
                    }
                }) : b
            },
            processResponse: function(a, b) {
                var c = this,
                d = c.options,
                e = d.transformResult(a, b);
                e.suggestions = c.verifySuggestionsFormat(e.suggestions),
                d.noCache || (c.cachedResponse[e[d.paramName]] = e, 0 === e.suggestions.length && c.badQueries.push(e[d.paramName])),
                b === c.getQuery(c.currentValue) && (c.suggestions = e.suggestions, c.suggest())
            },
            activate: function(b) {
                var c, d = this,
                e = d.classes.selected,
                f = a(d.suggestionsContainer),
                g = f.children();
                return f.children("." + e).removeClass(e),
                d.selectedIndex = b,
                -1 !== d.selectedIndex && g.length > d.selectedIndex ? (c = g.get(d.selectedIndex), a(c).addClass(e), c) : null
            },
            selectHint: function() {
                var b = this,
                c = a.inArray(b.hint, b.suggestions);
                b.select(c)
            },
            select: function(a) {
                var b = this;
                b.hide(),
                b.onSelect(a)
            },
            moveUp: function() {
                var b = this;
                if ( - 1 !== b.selectedIndex) return 0 === b.selectedIndex ? (a(b.suggestionsContainer).children().first().removeClass(b.classes.selected), b.selectedIndex = -1, b.el.val(b.currentValue), void b.findBestHint()) : void b.adjustScroll(b.selectedIndex - 1)
            },
            moveDown: function() {
                var a = this;
                a.selectedIndex !== a.suggestions.length - 1 && a.adjustScroll(a.selectedIndex + 1)
            },
            adjustScroll: function(b) {
                var c, d, e, f = this,
                g = f.activate(b),
                h = 25;
                g && (c = g.offsetTop, d = a(f.suggestionsContainer).scrollTop(), e = d + f.options.maxHeight - h, d > c ? a(f.suggestionsContainer).scrollTop(c) : c > e && a(f.suggestionsContainer).scrollTop(c - f.options.maxHeight + h), f.el.val(f.getValue(f.suggestions[b].value)), f.signalHint(null))
            },
            onSelect: function(b) {
                var c = this,
                d = c.options.onSelect,
                e = c.suggestions[b];
                c.currentValue = c.getValue(e.value),
                c.el.val(c.currentValue),
                c.signalHint(null),
                c.suggestions = [],
                c.selection = e,
                a.isFunction(d) && d.call(c.element, e)
            },
            getValue: function(a) {
                var b, c, d = this,
                e = d.options.delimiter;
                return e ? (b = d.currentValue, c = b.split(e), 1 === c.length ? a: b.substr(0, b.length - c[c.length - 1].length) + a) : a
            },
            dispose: function() {
                var b = this;
                b.el.off(".autocomplete").removeData("autocomplete"),
                b.disableKillerFn(),
                a(window).off("resize", b.fixPositionCapture),
                a(b.suggestionsContainer).remove()
            }
        },
        a.fn.autocomplete = function(c, d) {
            var e = "autocomplete";
            return 0 === arguments.length ? this.first().data(e) : this.each(function() {
                var f = a(this),
                g = f.data(e);
                "string" == typeof c ? g && "function" == typeof g[c] && g[c](d) : (g && g.dispose && g.dispose(), g = new b(this, c), f.data(e, g))
            })
        }
    }
}),
define("tadget/manage/1.0.0/userGuide", ["jquery/jquery/1.10.1/jquery.js"],
function(a) {
    var b = a("jquery/jquery/1.10.1/jquery.js");
    if (window.isFirst && 1 == window.isFirst) {
        var c = 350;
        b(".J_overlay").removeClass("hidden"),
        b(".J_step:first").show(),
        b(".J_steps").delegate(".J_next", "click",
        function() {
            var a = b(this).closest(".J_step").next();
            a.siblings().hide(c),
            a.show(c)
        }),
        b(".J_steps").delegate(".J_prev", "click",
        function() {
            var a = b(this).closest(".J_step").prev();
            a.siblings().hide(c),
            a.show(c)
        }),
        b(".J_steps").delegate(".J_close", "click",
        function() {
            b(".J_steps").hide(),
            b(".J_overlay").addClass("hidden")
        })
    }
}),
define("tadget/manage/1.0.0/views/folder", ["jquery/jquery/1.10.1/jquery.js", "gallery/underscore/1.4.4/underscore.js", "gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "tadget/manage/1.0.0/views/file", "tadget/manage/1.0.0/common", "tadget/manage/1.0.0/vendor/infor", "tadget/manage/1.0.0/routers/router", "tadget/manage/1.0.0/collections/folder", "tadget/manage/1.0.0/vendor/backbone.paginator", "tadget/manage/1.0.0/models/file", "tadget/manage/1.0.0/models/crumbs", "tadget/manage/1.0.0/models/tree", "tadget/manage/1.0.0/vendor/detail", "tadget/manage/1.0.0/vendor/silde", "tadget/manage/1.0.0/vendor/copy", "tadget/manage/1.0.0/vendor/jquery.mousewheel", "plugin/jQueryUI/1.10.3/jquery.ui.js", "tadget/manage/1.0.0/vendor/modal", "tadget/manage/1.0.0/vendor/forcedelete", "plugin/zTree/jquery.ztree.core-3.5.js", "plugin/zTree/jquery.ztree.exedit-3.5.js", "tadget/manage/1.0.0/vendor/ajaxfileupload", "tadget/manage/1.0.0/vendor/upfile"],
function(a, b, c) {
    var d, e, f, g, h, i, j, k, l, m, n = a("jquery/jquery/1.10.1/jquery.js"),
    o = a("gallery/underscore/1.4.4/underscore.js");
    d = a("gallery/backbone/1.0.0/backbone.js"),
    f = a("tadget/manage/1.0.0/views/file"),
    a("plugin/jQueryUI/1.10.3/jquery.ui.js")(n),
    h = a("tadget/manage/1.0.0/common"),
    modal = a("tadget/manage/1.0.0/vendor/modal"),
    i = a("tadget/manage/1.0.0/vendor/infor"),
    e = a("tadget/manage/1.0.0/models/file"),
    l = a("tadget/manage/1.0.0/models/tree"),
    k = a("tadget/manage/1.0.0/vendor/copy"),
    router = a("tadget/manage/1.0.0/routers/router"),
    m = a("tadget/manage/1.0.0/vendor/forcedelete"),
    a("plugin/zTree/jquery.ztree.core-3.5.js")(n),
    a("plugin/zTree/jquery.ztree.exedit-3.5.js")(n),
    a("tadget/manage/1.0.0/vendor/ajaxfileupload")(n),
    j = a("tadget/manage/1.0.0/vendor/upfile"),
    g = d.View.extend({
        el: "#J_Picture",
        initialize: function() {
            var a = this.collection;
            this.selectedPic = [],
            this.selectedFol = [],
            this.picIds = [],
            this.$selectedBar = n("#J_SelectBar"),
            this.$sortBar = n("#J_SortBar"),
            this.$controlBar = n("#J_ControlBar"),
            this.$rightMenu = n("#J_PicRightmenu"),
            this.$toggleRef = n("#J_Quot"),
            this.$selectedAll = n("#J_SelectAll"),
            a.on("add", this.onAdd, this),
            a.on("reset", this.onReset, this),
            a.on("set", this.onSet, this),
            a.on("remove", this.onRemove, this),
            this.$el.selectable({
                scrollSnapY: 10,
                cancel: ".img-name,.folder-name,input",
                filter: ".item",
                selecting: n.proxy(this.selecting, this),
                unselecting: n.proxy(this.unselecting, this),
                stop: n.proxy(this.selectStop, this)
            }),
            this.$selectedAll.on("change", n.proxy(this.selectAll, this)),
            this.$toggleRef.find("[role=menuitem]").on("click", n.proxy(this.toggleRef, this)),
            n("#J_UpAndNew").on("click", ".up", n.proxy(this.upFile, this)).on("click", ".new", n.proxy(this.newFolder, this)),
            this.$controlBar.on("click", ".replace", n.proxy(this.replaceFile, this)).on("click", ".copy", n.proxy(this.copyFile, this)).on("click", ".move", n.proxy(this.moveFile, this)).on("click", ".rename", n.proxy(this.renameFile, this)).on("click", ".check-see", n.proxy(this.checkSeeFile, this)).on("click", ".edit", n.proxy(this.gotoEdit, this)).on("click", ".delete", n.proxy(this.deleteFile, this)).on("click", ".tophone", n.proxy(this.tophone, this)),
            n(document).on("contextmenu", "#J_Picture", n.proxy(this.onRightclick, this)),
            n(document).on("click",
            function() {
                n("#J_PicRightmenu").hide()
            }),
            n(document).on("contextmenu", "#J_PicRightmenu",
            function(a) {
                a.preventDefault()
            }),
            this.$rightMenu.on("click", ".replace", n.proxy(this.replaceFile, this)).on("click", ".copy", n.proxy(this.copyFile, this)).on("click", ".move", n.proxy(this.moveFile, this)).on("click", ".rename", n.proxy(this.renameFile, this)).on("click", ".check-see", n.proxy(this.checkSeeFile, this)).on("click", ".edit", n.proxy(this.gotoEdit, this)).on("click", ".delete", n.proxy(this.deleteFile, this)).on("click", ".upfile", n.proxy(this.upFile, this)).on("click", ".newfolder", n.proxy(this.newFolder, this)).on("click", ".tophone", n.proxy(this.tophone, this))
        },
        getData: h.getData,
        newAdd: function(a) {
            this.collection.length >= 60 && this.collection.pop(),
            this.collection.unshift(a),
            this.collection.totalRecords++,
            this.collection.catNumber++,
            this.showFolderInfo();
            var b = {
                name: a.pictureCategoryName,
                id: a.pictureCategoryId
            };
            l.trigger("addFolder", b)
        },
        onAdd: function(a) {
            var b = new f({
                model: a
            });
            if (a.get("fullUrl")) this.$el.append(b.render().el);
            else {
                var c = this.$el.children(".item").has(".folder");
                c.length > 0 ? c.eq(0).before(b.render().el) : this.$el.children(".list-head").after(b.render().el)
            }
        },
        addOne: function(a) {
            var b = new f({
                model: a
            });
            this.$el.append(b.render().el),
            a.get("fullUrl") && this.picIds.push(a.get("pictureId"))
        },
        onReset: function() {
            var a = this.collection;
            if (this.$el.children(".item").remove(), a.each(this.addOne, this), this.picIds.length > 0) {
                var b = {
                    cmd: "json_ref_query",
                    file_ids: this.picIds.join(",")
                };
                this.getData(b, n.proxy(this.queryRefCB, this)),
                this.picIds = []
            }
            this.showFolderInfo(),
            this.selectedPic = [],
            this.selectedFol = [],
            "-1" != a.currentFolder && l.set({
                currentFolder: a.currentFolder
            }),
            k(["#J_Picture .copy-link", "#J_Picture .copy-code", "#J_Picture .copy-pic"]),
            this.$selectedAll[0].checked = !1
        },
        queryRefCB: function(a) {
            a.success ? o.each(a.module,
            function(a) {
                if (a.is_ref) {
                    var b = this.collection.where({
                        pictureId: a.id
                    })[0];
                    b && b.set({
                        hasRef: !0
                    })
                }
            },
            this) : i.show("引用关系查询失败: " + a.message, "danger")
        },
        onRemove: function() {},
        refresh: function() {
            this.collection.pager()
        },
        selectSelectableElements: function(a, b) {
            b && !b.data("selectable-item") && b.each(function() {
                var a = n(this),
                b = a.offset();
                n.data(this, "selectable-item", {
                    element: this,
                    $element: a,
                    left: b.left,
                    top: b.top,
                    right: b.left + a.outerWidth(),
                    bottom: b.top + a.outerHeight(),
                    startselected: !1,
                    selected: a.hasClass("ui-selected"),
                    selecting: a.hasClass("ui-selecting"),
                    unselecting: a.hasClass("ui-unselecting")
                })
            }),
            n(".ui-selected", a).not(b).removeClass("ui-selected").addClass("ui-unselecting"),
            n(b).not(".ui-selected").addClass("ui-selecting"),
            a.data("ui-selectable")._mouseStop(null)
        },
        prev: -1,
        selecting: function(a, b) {
            var c = n(".item", a.target),
            d = c.index(b.selecting);
            if (a.shiftKey && this.prev > -1) {
                var e = c.slice(Math.min(this.prev, d), 1 + Math.max(this.prev, d)).filter(".item");
                this.selectSelectableElements(this.$el, e)
            } else this.prev = d
        },
        unselecting: function() {
            this.$selectedAll[0].checked = !1
        },
        oldTime: 0,
        oldElement: null,
        selectStop: function() {
            var a = this,
            b = 0,
            c = 0;
            a.selectedPic = [],
            a.selectedFol = [];
            var d = this.$el.children(".ui-selected");
            d.each(function() {
                var b = n(this).data("ID");
                1 == b.type ? a.selectedFol.push(b.id) : 2 == b.type && a.selectedPic.push(b.id)
            }),
            1 == d.length && (c = d.eq(0), b = (new Date).getTime(), b - this.oldTime > 100 && b - this.oldTime < 400 && c.is(this.oldElement) ? (c.trigger("dblclick"), this.oldTime = 0) : (this.oldTime = b, this.oldElement = c)),
            d.length === this.collection.length && (this.$selectedAll[0].checked = !0),
            n("input").trigger("blur"),
            n(document).trigger("click"),
            a.selectInfo()
        },
        selectAll: function() {
            var a = this.$selectedAll.get(0).checked;
            a ? this.selectSelectableElements(this.$el, this.$el.find(".item")) : this.selectSelectableElements(this.$el, null)
        },
        selectInfo: function() {
            var a = "",
            b = this.$controlBar.children().hide(),
            c = this.$rightMenu.children().hide(),
            d = (this.collection, this.selectedFol.length),
            e = this.selectedPic.length;
            if (d >= 1 && e >= 1) a = "已经选择了" + this.selectedFol.length + "个文件夹和" + this.selectedPic.length + "张图片",
            b.filter(".move,.delete").show(),
            c.filter(".move,.delete").show(),
            this.$sortBar.hide();
            else if (d >= 1 && 1 > e) a = "已经选择了" + this.selectedFol.length + "文件夹",
            1 == d ? (b.filter(".move,.rename,.delete").show(), c.filter(".move,.rename,.delete").show()) : (b.filter(".move,.delete").show(), c.filter(".move,.delete").show()),
            this.$sortBar.hide();
            else if (1 > d && e >= 1) {
                if (a = "已经选择了" + this.selectedPic.length + "张图片", 1 == e) {
                    var f = this.$el.children(".ui-selected").eq(0).data("ID").isFreezed;
                    if (f) b.filter(".delete").show(),
                    c.filter(".delete").show();
                    else {
                        b.filter(".replace,.move,.rename,.delete,.edit,.tophone").show(),
                        c.filter(".replace,.move,.rename,.delete,.edit,.tophone").show();
                        var g = this.collection.where({
                            pictureId: this.selectedPic[0]
                        });
                        g[0].get("hasRef") && (b.filter(".check-see").show(), c.filter(".check-see").show())
                    }
                } else b.filter(".copy,.move,.delete,.tophone").show(),
                c.filter(".copy,.move,.delete,.tophone").show();
                this.$sortBar.hide()
            } else a = this.showFolderInfo();
            this.$selectedBar.find(".selected-msg").text(a)
        },
        upFile: function() {
            var a = l.get("currentFolder");
            if (0 > a) return void i.show("请选择一个文件夹,再上传", "danger");
            var b = "goto/" + a + "/1";
            router.navigate(b, {
                trigger: !0
            }),
            j.up(String(a), n.proxy(this.upCallback, this))
        },
        upCallback: function(a, b) {
            var c = "goto/" + a + "/1";
            1 === b ? (router.navigate(c, {
                trigger: !1
            }), l.set({
                currentFolder: a
            }), l.trigger("upFile", a)) : (a == this.collection.currentFolder ? this.refresh() : router.navigate(c, {
                trigger: !0
            }), this.useMsg())
        },
        useMsg: h.useMsg,
        newFolder: function() {
            var a = l.get("currentFolder");
            if (0 > a) return void i.show("请选择一个文件夹,再新建文件夹", "danger");
            var b = "goto/" + a + "/1";
            router.navigate(b, {
                trigger: !0
            });
            var c = "请输入文件夹名称";
            modal.show("new-folder", "新建文件夹", c),
            n("#J_ModalSure").off("click").on("click", n.proxy(this.newFolderFB, this))
        },
        newFolderFB: function() {
            if ("new-folder" === modal.type()) {
                var a = n.trim(n("#J_NewFoldername").val()),
                b = h.checkName(a);
                if (b) return modal.showMsg(b, "danger"),
                void n("#J_NewFoldername").focus();
                var c = this;
                modal.showMsg("新建文件中", "info"),
                c.getData({
                    cmd: "json_add_dir",
                    dir_id: l.get("currentFolder"),
                    name: a
                },
                function(a) {
                    a.success ? (modal.hide(), i.show("文件新建成功", "success"), c.newAdd(a.module)) : (modal.showMsg("新建失败: " + a.message, "danger"), n("#J_NewFoldername").focus())
                })
            }
        },
        showFolderInfo: function() {
            var a = this.collection;
            return this.$controlBar.children().hide(),
            this.$sortBar.show(),
            txt = 2 === a.type || 6 === a.type ? "共" + a.totalItem + "个宝贝": void 0 !== a.totalRecords || void 0 !== a.catNumber ? a.ignore_cat || -2 === a.type ? "共" + (a.totalRecords - a.catNumber) + "张图片": "共" + a.catNumber + "个文件夹和" + (a.totalRecords - a.catNumber) + "张图片": "查询数据中请稍后",
            this.$selectedBar.find(".selected-msg").text(txt),
            txt
        },
        replaceFile: function() {
            modal.show("replace-file", "替换图片", ""),
            n("#J_ModalSure").off("click").on("click", n.proxy(this.replaceFileFB, this))
        },
        replaceFileFB: function() {
            var a;
            if (window.FormData) {
                if (a = n("#J_NewPicture")[0].files[0], !a) return void modal.showMsg("你还没有选择图片", "danger");
                if (!/image\/(jpg|jpeg|png|gif)/i.test(a.type)) return void modal.showMsg("只能支持jpg、gif、png、jpeg四种格式的图片！", "danger");
                var b = new FormData;
                b.append("file", a),
                b.append("cmd", "json_file_replace"),
                b.append("file_id", this.selectedPic[0]),
                b.append("compressRate", 0),
                b.append("compressMaxWidth", 0),
                b.append("water", n("#J_AddWaterReplace").get(0).checked),
                b.append("_input_charset", "utf-8"),
                modal.showMsg("图片替换中...", "info"),
                n.ajax({
                    url: AJAX_URL,
                    type: "POST",
                    data: b,
                    contentType: !1,
                    processData: !1,
                    success: n.proxy(this.replaceFileSucc, this)
                })
            } else {
                if (a = n("#J_NewPicture").val(), "" === a) return void modal.showMsg("你还没有选择图片", "danger");
                if (!/(jpg|jpeg|png|gif)$/i.test(a)) return void modal.showMsg("只能支持jpg、gif、png、jpeg四种格式的图片！", "danger");
                var c = this,
                d = n("#J_AddWaterReplace").get(0).checked;
                modal.showMsg("图片替换中...", "info"),
                n.ajaxFileUpload({
                    url: AJAX_URL,
                    secureuri: !1,
                    fileElementId: "J_NewPicture",
                    dataType: "json",
                    data: {
                        cmd: "json_file_replace",
                        file_id: c.selectedPic[0],
                        water: d,
                        _input_charset: "utf-8",
                        is_ie: !0
                    },
                    success: n.proxy(c.replaceFileSucc, c),
                    error: function() {}
                })
            }
        },
        replaceFileSucc: function(a) {
            if (modal.hide(), a.success) {
                i.show("图片替换成功", "success");
                var b = this.collection.where({
                    pictureId: a.module.pictureId
                })[0];
                b.set(a.module, {
                    silent: !0
                }),
                b.trigger("reRende")
            } else i.show("图片替换失败: " + a.message, "danger")
        },
        $backdrop: {},
        $copyModal: n("#J_CopyModel"),
        copyModalShow: function() {
            this.$copyModal.show(),
            this.$backdrop = n('<div class="modal-backdrop" />').appendTo(document.body).css({
                opacity: "0.5",
                filter: "alpha(opacity=50)"
            });
            var a = this;
            this.$copyModal.off("click").on("click",
            function(b) { (n(b.target).hasClass("close") || n(b.target).parents(".modal-dialog").length < 1) && a.copyModalHide()
            })
        },
        copyModalHide: function() {
            this.$copyModal.hide(),
            this.$backdrop.remove()
        },
        copyFile: function() {
            function a() {
                b.find(".item").each(function(a) {
                    n(this).children(".number").text(++a)
                })
            }
            var b = this.$copyModal;
            this.copyModalShow();
            var c = this,
            d = [],
            e = {},
            f = o.template(b.find("#J_CopyItem").html()),
            g = this.collection.filter(function(a) {
                return o.contains(c.selectedPic, a.get("pictureId"))
            });
            o.each(g,
            function(a, b) {
                e.url = a.get("fullUrl") + "_160x160.jpg",
                e.number = b + 1,
                d.push(f(e))
            }),
            b.find(".copy-pic-container").html(d.join("")).sortable({
                stop: a
            }).disableSelection(),
            k(["#copy_code", "#copy_image", "#copy_url"])
        },
        moveFile: function() {
            "已选择: " + this.selectedFol.length + "个文件夹和" + this.selectedPic.length + "张图片";
            modal.show("move-file", "移动到", ""),
            this.getData({
                cmd: "json_dirTree_query"
            },
            n.proxy(this.showModalTree, this))
        },
        treeNodeTest: function(a, b) {
            var c;
            return c = o.some(this.selectedFol,
            function(a) {
                return b.id === a
            },
            this),
            c && modal.showMsg("请不要移动到同源目录下", "danger"),
            !c
        },
        treeNodeClickTest: function(a, b) {
            return b.id == self.collection.currentFolder ? (modal.showMsg("当前文件就在这个文件夹下,不需要移动", "danger"), !1) : this.treeNodeTest(a, b)
        },
        treeCallback: {
            beforeExpand: n.proxy(this.treeNodeTest, this),
            beforeClick: n.proxy(this.treeNodeClickTest, this),
            beforeDblClick: function() {
                return ! 1
            }
        },
        showModalTree: function() {
            var a = this,
            b = {
                callback: {
                    beforeExpand: n.proxy(a.treeNodeTest, a),
                    beforeClick: n.proxy(a.treeNodeTest, a),
                    beforeDblClick: n.proxy(a.treeNodeTest, a)
                }
            },
            c = n.fn.zTree.init(n("#J_ModalTree"), b, ZTREENODE);
            n("#J_ModalSure").off("click").on("click",
            function() {
                if ("move-file" === modal.type()) {
                    var b;
                    b = c.getSelectedNodes()[0] ? c.getSelectedNodes()[0].id: 0,
                    a.moveFileCB(b)
                }
            })
        },
        moveFileCB: function(a) {
            l.trigger("moveFile", {
                cat: this.selectedFol,
                pic: this.selectedPic,
                targetId: a
            })
        },
        renameFile: function() {
            var a, b;
            if (this.selectedFol.length > 0) {
                if (a = this.collection.where({
                    pictureCategoryId: this.selectedFol[0]
                }), b = a[0].get("type"), "0" == b || "1" == b) return void i.show("系统目录不允许修改", "danger")
            } else a = this.collection.where({
                pictureId: this.selectedPic[0]
            });
            a.length > 0 && a[0].set({
                edit: !0
            })
        },
        deleteFile: function() {
            {
                var a = this;
                "已经选择了" + this.selectedFol.length + "个文件夹和" + this.selectedPic.length + "张图片"
            }
            modal.show("delete-file", "删除文件", ""),
            n("#J_ModalSure").on("click",
            function() {
                if ("delete-file" === modal.type()) {
                    modal.showMsg("删除中...", "info"),
                    modal.disBtn();
                    var b = {
                        cmd: "json_batch_delete"
                    };
                    a.selectedPic.length > 0 && (b.file_ids = a.selectedPic.join(",")),
                    a.selectedFol.length > 0 && (b.dir_ids = a.selectedFol.join(",")),
                    a.getData(b,
                    function(b) {
                        a.deleteFileCB(b)
                    })
                }
            })
        },
        deleteFileCB: function(a) {
            if (modal.hide(), a.success) {
                var b = [];
                o.each(a.module.dir_success_module,
                function(a) {
                    b.push(a.cat_id)
                }),
                l.trigger("removeFolders", b),
                a.module.dir_failure_module.length > 0 || a.module.file_failure_module.length > 0 ? m.doErrorlist(a.module) : i.show("删除成功", "success"),
                this.useMsg(),
                this.refresh()
            } else i.show("删除出错, 请重试...", "danger")
        },
        tophone: function() {
            {
                var a = this;
                "已经选择了" + this.selectedFol.length + "个文件夹和" + this.selectedPic.length + "张图片"
            }
            modal.show("to-phone", "适配手机"),
            n("#J_ModalSure").on("click",
            function() {
                if ("to-phone" === modal.type()) {
                    modal.showMsg("适配中...", "info"),
                    modal.disBtn();
                    var b = {
                        cmd: "json_file_convert"
                    };
                    a.selectedPic.length > 0 && (b.file_ids = a.selectedPic.join(",")),
                    a.getData(b,
                    function(b) {
                        a.tophoneCB(b)
                    })
                }
            })
        },
        tophoneCB: function(a) {
            var b, c;
            modal.hide(),
            a.success ? (console.log(a), a.module.file_failure_module.length > 0 ? (modal.show("phone-error", "适配异常", "下列图片没有被适配"), modal.$el.find(".modal-footer button").eq(1).hide(), c = [], b = o.template('<tr><td title="<%=name%>"><%=name%></td><td title="<%=message%>"><%=message%></td></tr>'), o.each(a.module.file_failure_module,
            function(a) {
                c.push(b(a))
            }), modal.$el.find("#J_ErrorPhoneTable").html(c.join("")), n("#J_ModalSure").on("click",
            function() {
                modal.hide()
            })) : i.show("适配成功", "success"), this.useMsg(), this.refresh()) : i.show("适配出错, 请重试...", "danger")
        },
        someFaile: function(a) {
            var b, c, d;
            modal.show("move-error", "移动异常", "下列文件没有被移动"),
            modal.$el.find(".modal-footer button").eq(1).hide(),
            c = [],
            b = o.template('<tr><td title="<%=name%>"><%=name%></td><td title="<%=position%>"><%=position%></td><td title="<%=message%>"><%=message%></td></tr>'),
            d = o.union(a.dir_failure_module, a.file_failure_module),
            o.each(d,
            function(a) {
                c.push(b(a))
            }),
            modal.$el.find("#J_ErrorTable").html(c.join("")),
            n("#J_ModalSure").on("click",
            function() {
                modal.hide()
            })
        },
        checkSeeFile: function() {
            var a = n("#J_ReferenceModal");
            a.modal("show");
            var b = this;
            a.find(".img-replace").off("click").on("click",
            function() {
                a.modal("hide"),
                b.replaceFile()
            });
            var c = {
                cmd: "json_file_ref",
                file_id: this.selectedPic[0]
            },
            d = this.collection.where({
                pictureId: this.selectedPic[0]
            });
            d.length < 1 || (a.find(".cur-img img").attr("src", d[0].get("fullUrl") + "_160x160.jpg?t=" + d[0].get("gmtModified")), this.getData(c, n.proxy(this.checkSeeFileCB, this)))
        },
        checkSeeFileCB: function(a) {
            var b, c, d, e;
            b = n("#J_ReferenceModal"),
            d = b.find("tbody"),
            c = o.template(b.find("#J_ReferTemp").html()),
            e = [],
            a.success ? (b.find(".ref-number").text(a.module.module.length), o.each(a.module.module,
            function(a) {
                e.push(c(a))
            })) : e.push("<tr><td>" + a.message + "</td></td>"),
            d.html(e.join(""))
        },
        gotoEdit: function() {
            var a = "/redaction/picEdit.htm?picture_id=" + this.selectedPic[0];
            window.open(a)
        },
        onRightclick: function(a) {
            if ("INPUT" === a.target.tagName) return ! 0;
            if (a.preventDefault(), 2 !== this.collection.type && 6 != this.collection.type) {
                "J_Picture" === a.target.id ? (this.selectSelectableElements(this.$el, null), this.$rightMenu.children(".upfile,.newfolder").show()) : n(a.target).parents(".item").length > 0 && !n(a.target).parents(".item").hasClass("ui-selected") ? this.selectSelectableElements(this.$el, n(a.target).parents(".item")) : n(a.target).hasClass("item") && !n(a.target).hasClass("ui-selected") && this.selectSelectableElements(this.$el, n(a.target));
                var b = n("#wrap").width(),
                c = n("#wrap").height(),
                d = this.$rightMenu.outerWidth(),
                e = this.$rightMenu.outerHeight(),
                f = 0,
                g = 0;
                return f = a.clientX + d < b ? a.clientX: b - d,
                g = a.clientY + e < c ? a.clientY: a.clientY - e,
                this.$rightMenu.css({
                    left: f + "px",
                    top: g + "px"
                }),
                this.$rightMenu.show(),
                !1
            }
        },
        toggleRef: function(a) {
            var b = n(a.target),
            c = b.data("type"),
            d = this.$toggleRef.find(".dropdown-toggle"),
            e = 0,
            f = "";
            d.data("type", c).children("span").text(b.text()),
            this.selectSelectableElements(this.$el, null),
            1 == c ? (this.collection.each(function(a) {
                a.get("hasRef") || !a.get("fullUrl") ? a.set({
                    visible: !1
                }) : (e++, a.set({
                    visible: !0
                }))
            },
            this), f = "本页共有未引用图片" + e + "张", this.$selectedBar.find(".selected-msg").text(f)) : 2 == c ? (this.collection.each(function(a) {
                a.get("hasRef") ? (e++, a.set({
                    visible: !0
                })) : a.set({
                    visible: !1
                })
            },
            this), f = "本页共有引用图片" + e + "张", this.$selectedBar.find(".selected-msg").text(f)) : this.collection.each(function(a) {
                a.set({
                    visible: !0
                })
            },
            this)
        }
    }),
    c.exports = g
}),
define("tadget/manage/1.0.0/views/file", ["jquery/jquery/1.10.1/jquery.js", "gallery/underscore/1.4.4/underscore.js", "gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "tadget/manage/1.0.0/common", "tadget/manage/1.0.0/vendor/infor", "tadget/manage/1.0.0/routers/router", "tadget/manage/1.0.0/collections/folder", "tadget/manage/1.0.0/vendor/backbone.paginator", "tadget/manage/1.0.0/models/file", "tadget/manage/1.0.0/models/crumbs", "tadget/manage/1.0.0/models/tree", "tadget/manage/1.0.0/vendor/detail", "tadget/manage/1.0.0/vendor/silde", "tadget/manage/1.0.0/vendor/copy", "tadget/manage/1.0.0/vendor/jquery.mousewheel"],
function(a, b, c) {
    var d, e, f, g, h, i = a("jquery/jquery/1.10.1/jquery.js"),
    j = a("gallery/underscore/1.4.4/underscore.js");
    d = a("gallery/backbone/1.0.0/backbone.js"),
    f = a("tadget/manage/1.0.0/common"),
    router = a("tadget/manage/1.0.0/routers/router"),
    info = a("tadget/manage/1.0.0/vendor/infor"),
    util = a("tadget/manage/1.0.0/vendor/detail"),
    g = a("tadget/manage/1.0.0/models/tree"),
    h = a("tadget/manage/1.0.0/vendor/copy"),
    e = d.View.extend({
        tagName: "div",
        events: {
            dblclick: "onDblclick",
            mouseenter: "onMouseenter",
            mouseleave: "onMouseleave",
            "mouseenter .handle>li": "onClipon",
            "click .img-name,.folder-name": "changName"
        },
        attributes: {
            "class": "item ui-widget-content"
        },
        templatePic: j.template(i("#itemTemplatePic").html()),
        templateFol: j.template(i("#itemTemplateFol").html()),
        initialize: function() {
            this.model.on("change:pictureCategoryId", this.render, this),
            this.model.on("remove", this.remove, this),
            this.model.on("change:edit", this.edit, this),
            this.model.on("change:pictureCategoryName", this.rename, this),
            this.model.on("change:name", this.rename, this),
            this.model.on("change:hasRef", this.showRef, this),
            this.model.on("change:visible", this.toggleShow, this),
            this.model.on("reRende", this.reRende, this)
        },
        dateFormat: f.dateFormat,
        sizeFormat: f.sizeFormat,
        render: function() {
            var a = {},
            b = "",
            c = this.model.toJSON(),
            d = !1;
            return c.fullUrl ? (a.name = c.name, a.shortname = this.initName(c.name), 1 == c.status ? (a.freezed = !0, a.url = "getFrozenImage.do?path=" + c.picturePath + "&height=160&width=160&", a.why = c.frezonMessage, d = !0) : (a.freezed = !1, a.url = c.fullUrl), a.clientType = c.clientType, a.type = this.getPitrueTpye(c.fullUrl), a.px = c.pixel, a.size = this.sizeFormat(c.sizes), a.t = c.gmtModified, a.time = this.dateFormat(c.gmtModified), b = this.templatePic(a), this.$el.data("ID", {
                type: 2,
                id: c.pictureId,
                isFreezed: d
            })) : c.pictureCategoryId ? (a.name = c.pictureCategoryName, a.shortname = c.pictureCategoryName, a.time = this.dateFormat(c.gmtModified), b = this.templateFol(a), this.$el.data("ID", {
                type: 1,
                id: c.pictureCategoryId,
                isFreezed: d
            })) : (a.name = c.itemTitle, a.shortname = this.initName(c.itemTitle), b = j.template(i("#itemTemplateGo").html(), a), this.$el.data("ID", {
                type: 3,
                id: c.itemId,
                isFreezed: !1
            })),
            this.$el.html(b),
            this
        },
        reRende: function() {
            this.render(),
            this.model.get("hasRef") && this.showRef(),
            h(this.$el.find(".handle li"))
        },
        initName: function(a) {
            for (var b = 0,
            c = a.length - 1,
            d = 0,
            e = "",
            f = ""; c > b && 20 > d; b++, c--) a.charCodeAt(b) < 27 || a.charCodeAt(b) > 126 ? d += 2 : d++,
            a.charCodeAt(c) < 27 || a.charCodeAt(c) > 126 ? d += 2 : d++,
            e += a.charAt(b),
            f = a.charAt(c) + f;
            return d >= 20 && c > b ? e + "···" + f: a
        },
        getPitrueTpye: function(a) {
            var b = /(jpg|png|gif|jpeg)/gi.exec(a);
            return b ? b[0] : "类型未知"
        },
        remove: function() {
            this.$el.remove()
        },
        edit: function() {
            var a = this,
            b = this.$el.find("input");
            b.show().focus(),
            b.off("blur").on("blur",
            function() {
                var c = i.trim(b.val()),
                d = "";
                b.hide(),
                a.model.set({
                    edit: !1
                },
                {
                    silent: !0
                });
                var e;
                if (a.model.get("fullUrl")) {
                    if (d = a.model.get("name"), e = f.checkName(c, 50), c === d) return void b.off("blur");
                    if (e) return info.show(e, "danger"),
                    b.val(d),
                    void b.off("blur");
                    a.model.set({
                        name: c
                    },
                    {
                        silent: !0
                    }),
                    a.$el.find(".img-name").text(a.initName(c)).attr("title", c),
                    a.model.saveName(d)
                } else {
                    if (e = f.checkName(c), d = a.model.get("pictureCategoryName"), c === d) return void b.off("blur");
                    if (e) return info.show(e, "danger"),
                    b.val(d),
                    void b.off("blur");
                    a.model.set({
                        pictureCategoryName: c
                    },
                    {
                        silent: !0
                    }),
                    a.$el.find(".folder-name").text(c).attr("title", c),
                    a.model.saveName(d);
                    var h = {
                        name: c,
                        id: a.model.get("pictureCategoryId")
                    };
                    g.trigger("rename", h)
                }
                b.off("blur")
            }),
            b.off("keypress").on("keypress",
            function(a) {
                13 == a.keyCode && b.blur()
            })
        },
        rename: function() {
            if (this.model.get("fullUrl")) this.$el.find(".img-name").text(this.initName(this.model.get("name"))).attr("title", this.model.get("name"));
            else {
                this.$el.find(".folder-name").text(this.model.get("pictureCategoryName")).attr("title", this.model.get("name"));
                var a = {
                    name: this.model.get("pictureCategoryName"),
                    id: this.model.get("pictureCategoryId")
                };
                g.trigger("rename", a)
            }
        },
        changName: function() {
            this.edit()
        },
        onMouseleave: function(a) {
            "LI" !== a.target.tagName && this.$el.removeClass("on")
        },
        onMouseenter: function() {
            this.model.get("fullUrl") && this.$el.find(".handle>li").removeClass("hover-clip")
        },
        onClipon: function(a) {
            this.$el.addClass("on"),
            i(a.target).addClass("hover-clip")
        },
        onDblclick: function() {
            var a = "";
            this.model.get("fullUrl") ? util.previewById(this.model.get("pictureId")) : this.model.get("pictureCategoryId") ? (a = "goto/" + this.model.get("pictureCategoryId") + "/1", router.navigate(a, {
                trigger: !0
            })) : (a = "goods/" + encodeURIComponent(this.model.get("itemTitle")) + "/" + this.model.get("itemId") + "/1", router.navigate(a, {
                trigger: !0
            }))
        },
        showRef: function() {
            this.$el.find(".qout").addClass("in").end().find(".isref").text("是")
        },
        toggleShow: function() {
            this.model.get("visible") ? this.$el.show() : this.$el.hide()
        }
    }),
    c.exports = e
}),
define("tadget/manage/1.0.0/vendor/detail", ["jquery/jquery/1.10.1/jquery.js", "gallery/underscore/1.4.4/underscore.js", "tadget/manage/1.0.0/vendor/infor", "tadget/manage/1.0.0/vendor/silde", "tadget/manage/1.0.0/common", "tadget/manage/1.0.0/vendor/copy", "tadget/manage/1.0.0/collections/folder", "gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "tadget/manage/1.0.0/vendor/backbone.paginator", "tadget/manage/1.0.0/models/file", "tadget/manage/1.0.0/vendor/jquery.mousewheel"],
function(a, b, c) {
    function d(a) {
        var b = document.documentElement.clientWidth - 430,
        c = document.documentElement.clientHeight - 165;
        a.bigImageHook.style.width = b + "px",
        a.bigImageHook.style.height = c + "px",
        a.bigImage && a.adjustImagePos(a.bigImage),
        a.pageStep = m(90),
        a.thumbListBox.style.width = l() + "px",
        q("#J_detail_info").height(c)
    }
    function e() {
        y && y.prev()
    }
    function f() {
        y && y.next()
    }
    function g(a) {
        if (y) switch (a.keyCode) {
        case 39:
        case 40:
            f(),
            a.halt();
            break;
        case 37:
        case 38:
            e(),
            a.halt();
            break;
        case 27:
            k();
            break;
        case 115:
            a.shiftKey && (p(), a.preventDefault())
        }
    }
    function h(a) {
        var b = a.deltaY;
        b > 0 ? e() : f()
    }
    function i() {
        q(document).on("keydown", g),
        q(document).on("mousewheel", h),
        z.find(".close-slide").on("click", k),
        z.find("#J-detail-property").on("click", "a", k)
    }
    function j() {
        q(document).off("keydown", g),
        q(document).off("mousewheel", h),
        z.find(".close-slide").off("click"),
        z.find("#J-detail-property").on("click")
    }
    function k() {
        q("#J_detail").hide(),
        j()
    }
    function l() {
        return document.documentElement.clientWidth - 200
    }
    function m(a) {
        return Math.floor(l() / a)
    }
    function n(a) {
        var b = r.map(x,
        function(a) {
            var b = a.fullUrl,
            c = a.gmtModified;
            return t.getImgSrcBySize(b, 160, c)
        });
        if (y) y.refresh(b);
        else {
            var c = 90,
            e = m(c),
            f = z.find("#J_bigimage");
            f.disableSelection(),
            y = new Slide({
                bigImageHook: f[0],
                root: z[0],
                convert: function(a) {
                    var b = x[a],
                    c = b.fullUrl + "?t=" + b.gmtModified;
                    return c
                },
                thumbWidth: 90,
                thumbHeight: 90,
                pageStep: e,
                direction: "h",
                thumbClass: "slide-thumb",
                thumbBoxClass: "slide-nav"
            },
            b),
            y.on("switch",
            function() {
                t.refreshDetail(this.activeIndex)
            }),
            y.on("click_prev_page",
            function() {
                y.indicator.left = "-222px"
            }),
            y.on("click_next_page",
            function() {
                y.indicator.left = "-222px"
            }),
            q(window).on("resize", d.bind(null, y)),
            q("#J_detail_info").on("mousewheel",
            function(a) {
                a.stopPropagation()
            })
        }
        d(y),
        y.switchTo(a || 0)
    }
    function o(a) {
        for (var b = 0,
        c = x.length; c > b; b++) if (x[b].pictureId === a) return b;
        return 0
    }
    function p(a) {
        z.show(),
        i(),
        n(a)
    }
    var q, r, s, t, u, v, w;
    q = a("jquery/jquery/1.10.1/jquery.js"),
    r = a("gallery/underscore/1.4.4/underscore.js"),
    s = a("tadget/manage/1.0.0/vendor/infor"),
    t = a("tadget/manage/1.0.0/vendor/silde"),
    u = a("tadget/manage/1.0.0/common"),
    v = a("tadget/manage/1.0.0/vendor/copy"),
    w = a("tadget/manage/1.0.0/collections/folder"),
    a("tadget/manage/1.0.0/vendor/jquery.mousewheel")(q);
    var x = [],
    y = null,
    z = q("#J_detail"),
    A = z.find("#J_detail_act");
    t.getAllImages = function() {
        return r.filter(w.toJSON(),
        function(a) {
            return !! a.fullUrl
        })
    },
    t.getImgSrcBySize = function(a, b, c) {
        return b ? a + (a.indexOf("alicdn") > 0 ? "/n_" + b + "x" + b: "_" + b + "x" + b + ".jpg") + "?t=" + c: a
    };
    var B = [["原"], ["大", [620, 1e4]], ["中", [310, 310]], ["小", [160, 160]], ["小", [120, 120]], ["小", [80, 80]], ["小", [60, 60]], ["小", [40, 40]], ["小", [30, 30]]],
    C = function(a, b, c) {
        var d = a.split("x")[0],
        e = a.split("x")[1],
        f = parseFloat(d) / b,
        g = parseFloat(e) / c;
        return (d > b || e > c) && (f > g ? (d /= f, e /= f) : (d /= g, e /= g)),
        parseInt(d, 10) + "x" + parseInt(e, 10)
    },
    D = {
        $detailEdit: A.find("#J_DetailEdit"),
        $detailLink: A.find("#J_DetailLink"),
        $detailCode: A.find("#J_DetailCode"),
        $detailPic: A.find("#J_DetailPic"),
        $detailOriginal: A.find("#J_DetailOriginal"),
        $detailPixel: z.find("#J_detail_pixel"),
        property: function(a) {
            var b = [];
            b.push('<h3 class="property-title">图片属性</h3>'),
            b.push("<p>上传时间：" + u.dateFormat(a.gmtCreate) + "</p>"),
            b.push("<p>原图大小：" + u.sizeFormat(a.sizes) + "</p>"),
            b.push("<p>原图尺寸：" + a.pixel + "</p>"),
            b.push('<p>原图位置：<a href="#goto/' + a.pictureCategoryId + '/1">' + a.pictureCategoryName + "</a>"),
            z.find("#J-detail-property").html(b.join(""))
        },
        name: function(a) {
            z.find("#J_detail_name").html(a.name)
        },
        act: function(a) {
            z.find("#J_detail_act");
            1 != status && D.$detailEdit.attr("href", "/redaction/picEdit.htm?picture_id=" + a.pictureId),
            D.$detailLink.attr("data-clipboard-text", a.fullUrl + ",link"),
            D.$detailCode.attr("data-clipboard-text", '<img src="' + a.fullUrl + '" />,code'),
            D.$detailPic.attr("data-clipboard-text", '<img src="' + a.fullUrl + '" />,pic'),
            D.$detailOriginal.attr("href", a.fullUrl)
        },
        pixel: function(a) {
            {
                var b = B,
                c = '<h3 class="property-title">图片尺寸</h3>',
                d = [];
                a.pixel
            }
            r.forEach(b,
            function(b) {
                var c = a.pixel,
                e = a.fullUrl,
                f = e;
                if (b[1]) {
                    var g = b[1][0],
                    h = b[1][1];
                    c = C(c, g, h),
                    f += f.indexOf("alicdn") > 0 ? "/n_" + g + "x" + h: "_" + g + "x" + h + ".jpg",
                    e += f.indexOf("alicdn") > 0 ? "/n_" + g + "x" + h: "_" + g + "x" + h + ".jpg"
                }
                d.push('<p><span class="pixel-size">' + b[0] + "：" + c + '</span><span class="copy-size-box"> | <a  data-clipboard-text="' + f + '">复制</a></span> <a href="' + e + '" target="_blank">查看</a></p>')
            }),
            D.$detailPixel.html(c + '<div class="pixel-infor">' + d.join("") + "</div>")
        }
    },
    E = function(a) {
        var b = x[a];
        D.property(b),
        D.name(b),
        D.act(b),
        D.pixel(b),
        v(["#J_detail_pixel a[data-clipboard-text]", "#J_detail_act a[data-clipboard-text]"])
    };
    t.refresh = D,
    t.refreshDetail = E,
    t.previewById = function(a) {
        x = t.getAllImages();
        var b = o(a);
        p(b)
    },
    c.exports = t
}),
define("tadget/manage/1.0.0/vendor/silde", ["gallery/underscore/1.4.4/underscore.js"],
function(a, b, c) {
    function d(a, b) {
        function c(c) {
            c = c || window.event; {
                var e = c.target || c.srcElement,
                f = "className",
                h = document.documentElement;
                new Date
            }
            if (e !== h) {
                b = b || f;
                do {
                    var i = b === f ? e.className: e.getAttribute(b);
                    i && g.forEach(i.split(" "),
                    function(b) {
                        var f = d[b];
                        "function" == typeof f && (f = [f]),
                        f instanceof Array && g.forEach(f,
                        function(d) {
                            if ("function" == typeof d) {
                                var f = d(e, c, a, b);
                                "A" === e.nodeName && e.href.indexOf("#") === e.href.length - 1 && (f = !0),
                                f && (c.preventDefault ? (c.preventDefault(), c.stopPropagation()) : (c.returnValue = !1, c.cancelBubble = !0))
                            }
                        })
                    })
                } while (( e = e . parentNode ) && e !== a && e !== h)
            }
        }
        var d = a.execs = a.execs || {};
        return a.addEventListener ? a.addEventListener("click", c, !1) : a.attachEvent ? a.attachEvent("onclick", c) : a.onclick = c,
        a.listen = function() {
            var b, c = arguments[0],
            e = arguments[1],
            f = typeof c;
            if ("string" === f) b = d[c] = d[c] || [],
            b.push(e);
            else if (c instanceof Array) g.forEach(c,
            function(b) {
                a.listen(b.name, b.exec)
            });
            else if ("object" === f) for (var h in c) a.listen(h, c[h]);
            return a
        },
        a.removeListen = function(b, d) {
            var e = a.execs;
            if (e) {
                if (!b) return void(a.removeEventListener ? a.removeEventListener("click", c, !1) : a.detachEvent ? a.detachEvent("onclick", c) : a.onclick = null);
                var f = e[b] || [];
                return g.forEach(f,
                function(a, b) {
                    a === d && f.splice(b, 1)
                }),
                a
            }
        },
        a
    }
    function e(a, b) {
        var c = !1;
        return function() {
            c || (c = !0, a.apply(null, arguments), setTimeout(function() {
                c = !1
            },
            b))
        }
    }
    function f(a, b, c, d, e) {
        function f() {
            i += distance;
            var d = (Math.sin(i) + 1) / 2 * g;
            i >= Math.PI / 2 ? a.style[j] = c + "px": (a.style[j] = b + d + "px", setTimeout(f, h))
        }
        if (a && a.nodeType && 1 === a.nodeType) {
            d = d || 300;
            var g = c - b,
            h = 35,
            i = -Math.PI / 2,
            j = "v" === e ? "top": "left";
            distance = Math.PI / (d / h),
            a.style[j] = b + "px",
            f()
        }
    }
    var g = a("gallery/underscore/1.4.4/underscore.js");
    "undefined" == typeof util && (window.util = {}),
    "function" !== Function.prototype.bind && (Function.prototype.bind = function(a) {
        function b(b) {
            var c = this;
            if (1 < arguments.length) {
                var d = a.call(arguments, 1);
                return function() {
                    return c.apply(b, arguments.length ? d.concat(a.call(arguments)) : d)
                }
            }
            return function() {
                return arguments.length ? c.apply(b, arguments) : c.call(b)
            }
        }
        return b
    } (Array.prototype.slice)),
    function() {
        if (!window.console) {
            var a = function() {};
            window.console = {
                log: a,
                info: a,
                debug: a,
                profile: a,
                dir: a
            }
        }
        g.forEach("info debug profile dir".split(" "),
        function(a) {
            console[a] || (console[a] = console.log)
        })
    } ();
    var h = {
        fire: function(a) {
            this.exec = this.exec || {},
            a = a.toLowerCase();
            var b = this,
            c = Array.prototype.slice.call(arguments, 1),
            d = b.exec[a] || [];
            g.forEach(d,
            function(a) {
                try {
                    a.apply(b, c)
                } catch(d) {
                    console.log(d, a, c)
                }
            })
        },
        on: function(a, b) {
            this.exec = this.exec || {},
            a = a.toLowerCase(),
            this.exec[a] = this.exec[a] || [],
            this.exec[a].push(b)
        },
        off: function(a, b) {
            var c = this.exec;
            if (c) {
                if (!a) return void(this.exec = null);
                if (a = a.toLowerCase(), !b) return void(c[a] = null);
                for (var d = c[a] || [], e = 0, f = d.length; f > e; e++) d[e] === b && (d.splice(e, 1), e--)
            }
        }
    }; !
    function(a) {
        function b(a, c, d, e) {
            if (c) switch (a) {
            case "swap":
                c.className = b("check", c, d) ? c.className.replace(d, e) : c.className.replace(e, d);
                break;
            case "add":
                b("check", c, d) || (c.className += c.className ? " " + d: d);
                break;
            case "remove":
                var f = c.className.match(" " + d) ? " " + d: d;
                c.className = c.className.replace(f, "");
                break;
            case "check":
                for (var g = !1,
                h = c.className.split(" "), i = 0; i < h.length; i++) h[i] == d && (g = !0);
                return g
            }
        }
        function c(a, b) {
            for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c])
        }
        function i(a) {
            return a.src
        }
        function j(a, b) {
            for (var c = a.getElementsByTagName(b), d = c.length; d--;) {
                var e = c[d];
                e.onclick = e.onmouseover = e.onmouseout = null,
                e.parentNode.removeChild(e)
            }
        }
        function k(a, b, c) {
            if (0 !== a.offsetWidth) {
                var d, e;
                if (a.getAttribute("originWidth") || (d = a.offsetWidth, e = a.offsetHeight, a.setAttribute("originWidth", d), a.setAttribute("originHeight", e)), d = d || +a.getAttribute("originWidth") || a.offsetWidth, e = e || +a.getAttribute("originHeight") || a.offsetHeight, !(b > d && c > e)) {
                    var f = Math.min(b / d, c / e);
                    a.style.width = f * d + "px",
                    a.style.height = f * e + "px"
                }
            }
        }
        function l(a, b, c) {
            var d = 0;
            k(a, b, c),
            d = c - a.offsetHeight,
            a.style.marginTop = (d > 0 ? d: 0) / 2 + "px"
        }
        function m(a, b) {
            if (!a.bigImageHook) {
                var d = r.createElement("div");
                r.body.appendChild(d),
                a.bigImageHook = d
            }
            c(this, s),
            c(this, a),
            this.root = this.root || r.body,
            this.urls = b,
            this.length = b.length,
            this.loading = new q(this.bigImageHook),
            this.activeIndex = 0,
            this.activePage = 0,
            this.init()
        }
        function n(b, c) {
            var d;
            c = c || a.event;
            var e = c.offsetX || c.x || c.layerX || 0;
            return d = c.target || c.srcElement,
            e > d.clientWidth / 2 ? "right": "left"
        }
        function o(a, b) {
            var c = n(a, b);
            a.style.cursor = "right" === c ? "url(http://assets.taobaocdn.com/apps/tadget/picture/img/next.cur), pointer": "url(http://assets.taobaocdn.com/apps/tadget/picture/img/pre.cur), pointer"
        }
        function p(b) {
            b = b || a.event,
            o(this, b)
        }
        var q = function(a) {
            this.hook = a
        };
        q.prototype = {
            init: function() {
                if (!this.elm) {
                    var a = r.createElement("div");
                    a.className = "loading",
                    this.hook.appendChild(a),
                    this.elm = a
                }
            },
            show: function(a) {
                this.init();
                var b = this.elm;
                b.innerHTML = a || "加载中，请稍候...",
                b.style.cssText = "top:50%;left:40%;margin-top:-" + b.clientHeight / 2 + "px;margin-left:" + b.clientWidth / 2 + "px;"
            },
            hide: function() {
                this.elm.style.display = "none"
            }
        };
        var r = a.document,
        s = {
            prevClass: "slide-prev",
            nextClass: "slide-next",
            prevPageClass: "slide-prev-page",
            nextPageClass: "slide-next-page",
            thumbClass: "thumb",
            thumbListClass: "thumb-list",
            thumbBoxClass: "thumb-box",
            thumbListBoxClass: "thumb-list-box",
            disabledClassPosfix: "-disabled",
            thumbHeight: 160,
            thumbWidth: 160,
            pageStep: 8,
            activeIndex: 0,
            direction: "v",
            circular: !1,
            convert: i
        },
        t = {
            indicator: function(a, b, c) {
                a.thumbs[b];
                toThumb = a.thumbs[c],
                elm = a.indicator,
                start = 0,
                end = 0,
                elm || (elm = r.createElement("div"), elm.className = "slide-indicator", a.thumbListBox.appendChild(elm), a.indicator = elm),
                "v" === a.direction ? (start = parseInt(elm.style.top, 10) || 0, end = c % a.pageStep * a.thumbHeight) : (start = parseInt(elm.style.left, 10) || 0, end = c % a.pageStep * a.thumbWidth);
                var d = "v" === direction ? "top": "left";
                elm.style[d] = end + "px"
            },
            border: function(a, b, c) {
                var d = a.thumbs[b],
                e = a.thumbs[c];
                d.style.borderColor = "#484848",
                d.style.backgroundColor = "#4A4A4A",
                d.style.filter = "alpha(opacity=50)",
                d.style.opacity = "0.5",
                e.style.borderColor = "green",
                e.style.backgroundColor = "#fff",
                e.style.filter = "alpha(opacity=100)",
                e.style.opacity = "1"
            }
        };
        m.prototype = {
            constructor: m,
            getUrlByIndex: function(a) {
                var b = this.urls[a];
                return this.convert(a, b)
            },
            adjustImagePos: function(a) {
                var b = this.bigImageHook;
                l(a, b.clientWidth, b.clientHeight)
            },
            clearChain: function() {
                var a = this.bigImage;
                a && (a.onload = a.onerror = null)
            },
            onLoad: function() {
                var a = this,
                b = a.bigImage;
                b && (a.adjustImagePos(b), b.style.visibility = "visible"),
                a.clearChain(),
                a.loading.hide()
            },
            onError: function() {
                this.loading.show("图片加载失败，请浏览下一张"),
                this.clearChain()
            },
            getPageByIndex: function(a) {
                return Math.floor(a / this.pageStep)
            },
            checkPage: function(a, b) {
                var c = this,
                d = c.getPageByIndex(b);
                c.toPage(d)
            },
            switchTo: function(a) {
                if (! (0 > a || a > this.length - 1)) {
                    this.loading.show();
                    var b = this,
                    c = b.getUrlByIndex(a),
                    d = b.bigImageHook;
                    j(d, "img");
                    var e = new Image;
                    e.style.visibility = "hidden",
                    b.bigImageHook.appendChild(e),
                    b.bigImage = e,
                    e.onload = null,
                    e.onload = b.onLoad.bind(b),
                    e.onerror = function() {
                        b.onError()
                    },
                    e.src = c,
                    b.checkPage(this.activeIndex, a),
                    t.border(b, this.activeIndex, a),
                    this.activeIndex = a,
                    b.fire("switch")
                }
            },
            prev: function() {
                this.switchTo(this.activeIndex - 1),
                this.fire("prev")
            },
            next: function() {
                this.switchTo(this.activeIndex + 1),
                this.fire("next")
            },
            toPage: function(a) {
                var c, d, e = this,
                g = e.listNode,
                h = (e.activeIndex, Math.ceil(e.length / e.pageStep) - 1),
                i = 0,
                j = 0,
                k = 0,
                l = e.activePage;
                a = Math.min(a, h),
                a = Math.max(a, i),
                l !== a && ("v" === e.direction ? (j = g.style.top, k = -a * e.pageStep * e.thumbHeight) : (j = g.style.left, k = -a * e.pageStep * e.thumbWidth), j = parseInt(j, 10) || 0, f(g, j, k, 700, e.direction)),
                h > 1 && (0 === a ? (c = "add", d = "remove") : a === h ? (c = "remove", d = "add") : (c = "remove", d = "remove"), b(c, e.prevPageNode, e.prevPageClass + e.disabledClassPosfix), b(d, e.nextPageNode, e.nextPageClass + e.disabledClassPosfix)),
                this.activePage = a
            },
            prevPage: function() {
                this.toPage(this.activePage - 1),
                this.fire("prevPage")
            },
            nextPage: function() {
                this.toPage(this.activePage + 1),
                this.fire("nextPage")
            },
            createThumbs: function(a) {
                function b() {
                    l(this, c.thumbWidth - 10, c.thumbHeight - 10),
                    this.style.marginTop = (c.thumbHeight - this.height) / 2 + "px",
                    this.style.visibility = "",
                    this.onload = this.onerror = null
                }
                var c = this,
                d = r.createDocumentFragment(),
                e = r.createElement("div"),
                f = r.createElement("div"),
                h = r.createElement("ol");
                f.className = c.thumbListBoxClass,
                e.className = c.thumbBoxClass,
                f.style.cssText = "v" === c.direction ? "height:" + c.thumbHeight * c.pageStep + "px;width:" + c.thumbWidth + "px;overflow:hidden;": "width:" + c.thumbWidth * c.pageStep + "px;height:" + c.thumbHeight + "px;overflow:hidden;",
                h.className = c.thumbListClass,
                d.appendChild(e),
                e.appendChild(f),
                f.appendChild(h),
                c.root.appendChild(d),
                c.thumbs = [],
                c.thumbnails = [],
                g.forEach(a,
                function(a, d) {
                    var e = r.createElement("li"),
                    f = new Image;
                    h.appendChild(e),
                    e.appendChild(f),
                    e.setAttribute("index", d),
                    e.className = c.thumbClass,
                    f.style.visibility = "hidden",
                    f.onload = b,
                    f.src = a,
                    c.thumbs.push(e),
                    c.thumbnails.push(f)
                }),
                c.listNode = h,
                c.thumbContainer = e,
                c.thumbListBox = f
            },
            createActionDOM: function() {
                if (! (this.length / this.pageStep < 1)) {
                    var a = this,
                    b = r.createElement("a"),
                    c = b.cloneNode(!1);
                    b.href = c.href = "#",
                    b.className = a.prevPageClass,
                    c.className = a.nextPageClass,
                    a.thumbContainer.appendChild(b),
                    a.thumbContainer.appendChild(c),
                    b.title = b.innerHTML = "上一页",
                    c.title = c.innerHTML = "下一页",
                    a.root.listen(a.prevPageClass,
                    function() {
                        a.prevPage(),
                        a.fire("click_prev_page")
                    }),
                    a.root.listen(a.nextPageClass,
                    function() {
                        a.nextPage(),
                        a.fire("click_next_page")
                    }),
                    a.prevPageNode = b,
                    a.nextPageNode = c
                }
            },
            listenKeyboard: function() {},
            splice: function(a, b) {
                var c = this.thumbs.splice(a, b)[0];
                this.urls.splice(a, b),
                this.thumbnails.splice(a, b),
                c.parentNode.removeChild(c)
            },
            destroy: function() {
                var a = this;
                a.bigImageHook.onmouseover = null,
                a.bigImageHook.onclick = null,
                a.loading = null
            },
            init: function() {
                function b(b) {
                    b = b || a.event;
                    var d = n(this, b);
                    "right" === d ? c.next() : c.prev()
                }
                var c = this;
                d(c.root),
                c.createThumbs(c.urls),
                c.root.listen(c.thumbClass,
                function(a) {
                    var b = a.getAttribute("index");
                    c.switchTo( + b)
                }),
                c.bigImageHook.onmousemove = p,
                c.bigImageHook.onclick = b,
                c.createActionDOM()
            },
            refresh: function(a) {
                $(this.listNode).remove(),
                $(this.thumbContainer).remove(),
                $(this.thumbListBox).remove(),
                this.activeIndex = 0,
                this.activePage = 0,
                this.urls = a,
                this.length = a.length,
                this.createThumbs(a),
                this.createActionDOM()
            }
        },
        o = e(o, 100),
        c(m.prototype, h),
        a.Slide = m
    } (window, void 0),
    c.exports = window.util
}),
define("tadget/manage/1.0.0/vendor/copy", ["jquery/jquery/1.10.1/jquery.js", "tadget/manage/1.0.0/vendor/infor", "gallery/underscore/1.4.4/underscore.js"],
function(a, b, c) {
    var d, e = "http://gtms01.alicdn.com/tps/i1/T1ABFJFn8gXXXtxVjX.swf",
    f = a("jquery/jquery/1.10.1/jquery.js"),
    g = a("tadget/manage/1.0.0/vendor/infor"),
    h = a("gallery/underscore/1.4.4/underscore.js"),
    i = navigator.userAgent.indexOf("MSIE 8.0"),
    j = 0,
    k = function(a) {
        var b = f("#J_CopyModel"),
        c = b.find("input[name=size]:checked").val(),
        d = [],
        e = "<br/><br/>\r\n";
        return b.find("img").each(function(b, e) {
            d.push("code" == a || "pic" == a ? '<img src="' + e.src.replace("_160x160.jpg", c) + '"/>': e.src.replace("_160x160.jpg", c))
        }),
        b.find("input[name=space]")[0].checked && (e = "<br/>\r\n"),
        "link" == a && (e = "\r\n"),
        d.join(e)
    },
    l = function() {
        j++,
        3 === j && i > 0 && f("#J_IE8Modal").modal("show")
    };
    ZeroClipboard.setDefaults({
        trustedOrigins: [window.location.protocol + "//" + window.location.host],
        allowScriptAccess: "always",
        moviePath: e
    }),
    d = new ZeroClipboard,
    d.on("load",
    function() {
        d.on("dataRequested",
        function(a) {
            var b = a.options.text.split(",");
            "pic" === b[1] && a.setFormat("html"),
            a.setText("get" === b[0] ? k(b[1]) : decodeURIComponent(b[0]))
        }),
        d.on("complete",
        function() {
            g.show("复制成功", "success"),
            l(),
            f(document).trigger("click")
        }),
        d.on("wrongflash",
        function() {
            alert("您的flash版本太低, 已经不支持复制功能, \n 请下载升级最新版的flash ")
        })
    }),
    d.initCopy = function(a) {
        h.each(a,
        function(a) {
            d.glue(f(a))
        })
    },
    c.exports = d.initCopy
}),
define("tadget/manage/1.0.0/vendor/jquery.mousewheel", [],
function(a, b, c) { !
    function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof b ? c.exports = a: a(jQuery)
    } (function(a) {
        function b(b) {
            var f = b || window.event,
            g = h.call(arguments, 1),
            i = 0,
            j = 0,
            k = 0,
            l = 0;
            return b = a.event.fix(f),
            b.type = "mousewheel",
            "detail" in f && (k = -1 * f.detail),
            "wheelDelta" in f && (k = f.wheelDelta),
            "wheelDeltaY" in f && (k = f.wheelDeltaY),
            "wheelDeltaX" in f && (j = -1 * f.wheelDeltaX),
            "axis" in f && f.axis === f.HORIZONTAL_AXIS && (j = -1 * k, k = 0),
            i = 0 === k ? j: k,
            "deltaY" in f && (k = -1 * f.deltaY, i = k),
            "deltaX" in f && (j = f.deltaX, 0 === k && (i = -1 * j)),
            0 !== k || 0 !== j ? (l = Math.max(Math.abs(k), Math.abs(j)), (!e || e > l) && (e = l), i = Math[i >= 1 ? "floor": "ceil"](i / e), j = Math[j >= 1 ? "floor": "ceil"](j / e), k = Math[k >= 1 ? "floor": "ceil"](k / e), b.deltaX = j, b.deltaY = k, b.deltaFactor = e, g.unshift(b, i, j, k), d && clearTimeout(d), d = setTimeout(c, 200), (a.event.dispatch || a.event.handle).apply(this, g)) : void 0
        }
        function c() {
            e = null
        }
        var d, e, f = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
        g = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
        h = Array.prototype.slice;
        if (a.event.fixHooks) for (var i = f.length; i;) a.event.fixHooks[f[--i]] = a.event.mouseHooks;
        a.event.special.mousewheel = {
            version: "3.1.6",
            setup: function() {
                if (this.addEventListener) for (var a = g.length; a;) this.addEventListener(g[--a], b, !1);
                else this.onmousewheel = b
            },
            teardown: function() {
                if (this.removeEventListener) for (var a = g.length; a;) this.removeEventListener(g[--a], b, !1);
                else this.onmousewheel = null
            }
        },
        a.fn.extend({
            mousewheel: function(a) {
                return a ? this.bind("mousewheel", a) : this.trigger("mousewheel")
            },
            unmousewheel: function(a) {
                return this.unbind("mousewheel", a)
            }
        })
    })
}),
define("tadget/manage/1.0.0/vendor/forcedelete", ["jquery/jquery/1.10.1/jquery.js", "gallery/underscore/1.4.4/underscore.js", "tadget/manage/1.0.0/common", "tadget/manage/1.0.0/vendor/infor", "tadget/manage/1.0.0/collections/folder", "gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "tadget/manage/1.0.0/vendor/backbone.paginator", "tadget/manage/1.0.0/models/file", "tadget/manage/1.0.0/models/tree"],
function(a, b, c) {
    function d() {
        this.model = e("#J_ForceDeleteModel"),
        this.tpl = f.template(this.model.find("#J_DeteleErrorTpl").html()),
        this.bindEvent()
    }
    var e = a("jquery/jquery/1.10.1/jquery.js"),
    f = a("gallery/underscore/1.4.4/underscore.js"),
    g = a("tadget/manage/1.0.0/common"),
    h = a("tadget/manage/1.0.0/vendor/infor"),
    i = a("tadget/manage/1.0.0/collections/folder"),
    j = a("tadget/manage/1.0.0/models/tree");
    d.prototype = {
        bindEvent: function() {
            this.find("#J_ForceDelete").on("click", e.proxy(this.doDelete, this)),
            this.find("#J_SelectAllDelete").on("click", e.proxy(this.select, this))
        },
        doDelete: function() {
            var a = [],
            b = [];
            if (f.each(this.find("tbody input[type=checkbox]"),
            function(c) {
                c.checked && ("图片" === e(c).data("type") ? b.push(e(c).data("id")) : a.push(e(c).data("id")))
            }), 0 === a.length && 0 === b.length) h.show("请选择要强制删除的文件", "info");
            else {
                var c = {
                    cmd: "json_batch_delete",
                    force: !0
                };
                b.length > 0 && (c.file_ids = b.join(",")),
                a.length > 0 && (c.dir_ids = a.join(",")),
                this.find("#J_ForceDelete").text("强制删除中....").get(0).disabled = !0,
                g.getData(c, e.proxy(this.deleteCB, this))
            }
        },
        deleteCB: function(a) {
            if (a.success) {
                var b = [];
                f.each(a.module.dir_success_module,
                function(a) {
                    b.push(a.cat_id)
                }),
                j.trigger("removeFolders", b),
                a.module.dir_failure_module.length > 0 || a.module.file_failure_module.length > 0 ? this.doErrorlist(a.module) : (h.show("删除成功", "success"), this.model.modal("hide")),
                i.pager(),
                g.useMsg()
            } else h.show(a.message, "danger");
            this.find("#J_ForceDelete").text("强制删除").get(0).disabled = !1,
            this.find("#J_SelectAllDelete")[0].checked = !1
        },
        select: function() {
            var a = this.find("tbody input[type=checkbox]");
            this.find("#J_SelectAllDelete").get(0).checked ? f.each(a,
            function(a) {
                a.checked = !0
            }) : f.each(a,
            function(a) {
                a.checked = !1
            })
        },
        find: function(a) {
            return this.model.find(a)
        },
        doErrorlist: function(a) {
            var b, c;
            b = "",
            c = this,
            f.each(a.file_failure_module,
            function(a) {
                a.type = "图片",
                b += c.tpl(a)
            }),
            f.each(a.dir_failure_module,
            function(a) {
                a.type = "文件夹",
                b += c.tpl(a)
            }),
            this.model.modal("show"),
            this.find("tbody").html(b)
        }
    },
    c.exports = new d
}),
define("tadget/manage/1.0.0/vendor/ajaxfileupload", [],
function() {
    return function(a) {
        a.extend({
            createUploadIframe: function(b, c) {
                var d = "jUploadFrame" + b,
                e = '<iframe id="' + d + '" name="' + d + '" style="position:absolute; top:-9999px; left:-9999px"';
                return window.ActiveXObject && ("boolean" == typeof c ? e += ' src="javascript:false"': "string" == typeof c && (e += ' src="' + c + '"')),
                e += " />",
                a(e).appendTo(document.body),
                a("#" + d).get(0)
            },
            createUploadForm: function(b, c, d) {
                var e = "jUploadForm" + b,
                f = "jUploadFile" + b,
                g = a('<form  action="" method="POST" name="' + e + '" id="' + e + '" enctype="multipart/form-data"></form>');
                if (d) for (var h in d) a('<input type="hidden" name="' + h + '" value="' + d[h] + '" />').appendTo(g);
                var i = a("#" + c),
                j = a(i).clone();
                return a(i).attr("id", f),
                a(i).before(j),
                a(i).appendTo(g),
                a(g).css("position", "absolute"),
                a(g).css("top", "-1200px"),
                a(g).css("left", "-1200px"),
                a(g).appendTo("body"),
                g
            },
            ajaxFileUpload: function(b) {
                b = a.extend({},
                a.ajaxSettings, b);
                var c = (new Date).getTime(),
                d = a.createUploadForm(c, b.fileElementId, "undefined" == typeof b.data ? !1 : b.data),
                e = (a.createUploadIframe(c, b.secureuri), "jUploadFrame" + c),
                f = "jUploadForm" + c;
                b.global && !a.active++&&a.event.trigger("ajaxStart");
                var g = !1,
                h = {};
                b.global && a.event.trigger("ajaxSend", [h, b]);
                var i = function(c) {
                    var f = document.getElementById(e);
                    try {
                        f.contentWindow ? (h.responseText = f.contentWindow.document.body ? f.contentWindow.document.body.innerHTML: null, h.responseXML = f.contentWindow.document.XMLDocument ? f.contentWindow.document.XMLDocument: f.contentWindow.document) : f.contentDocument && (h.responseText = f.contentDocument.document.body ? f.contentDocument.document.body.innerHTML: null, h.responseXML = f.contentDocument.document.XMLDocument ? f.contentDocument.document.XMLDocument: f.contentDocument.document)
                    } catch(i) {
                        b.error(b, h, null, i)
                    }
                    if (h || "timeout" == c) {
                        g = !0;
                        var j;
                        try {
                            if (j = "timeout" != c ? "success": "error", "error" != j) {
                                var k = a.uploadHttpData(h, b.dataType);
                                b.success && b.success(k, j),
                                b.global && a.event.trigger("ajaxSuccess", [h, b])
                            } else b.error(b, h, j)
                        } catch(i) {
                            j = "error",
                            b.error(b, h, j, i)
                        }
                        b.global && a.event.trigger("ajaxComplete", [h, b]),
                        b.global && !--a.active && a.event.trigger("ajaxStop"),
                        b.complete && b.complete(h, j),
                        a(f).unbind(),
                        setTimeout(function() {
                            try {
                                a(f).remove(),
                                a(d).remove()
                            } catch(c) {
                                b.error(b, h, null, c)
                            }
                        },
                        100),
                        h = null
                    }
                };
                b.timeout > 0 && setTimeout(function() {
                    g || i("timeout")
                },
                b.timeout);
                try {
                    var d = a("#" + f);
                    a(d).attr("action", b.url),
                    a(d).attr("method", "POST"),
                    a(d).attr("target", e),
                    d.encoding ? a(d).attr("encoding", "multipart/form-data") : a(d).attr("enctype", "multipart/form-data"),
                    a(d).submit()
                } catch(j) {
                    b.error(b, h, null, j)
                }
                return a("#" + e).load(i),
                {
                    abort: function() {}
                }
            },
            uploadHttpData: function(b, c) {
                var d = !c;
                return d = "xml" == c || d ? b.responseXML: b.responseText,
                "script" == c && a.globalEval(d),
                "json" == c && (/^</.test(d) ? (d = $("data").text(), d = a.parseJSON(temp)) : d = a.parseJSON(d)),
                "html" == c && a("<div>").html(d).evalScripts(),
                d
            }
        })
    }
}),
define("tadget/manage/1.0.0/vendor/upfile", ["jquery/jquery/1.10.1/jquery.js", "gallery/underscore/1.4.4/underscore.js", "tadget/manage/1.0.0/routers/router", "gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "tadget/manage/1.0.0/common", "tadget/manage/1.0.0/vendor/infor", "tadget/manage/1.0.0/collections/folder", "tadget/manage/1.0.0/vendor/backbone.paginator", "tadget/manage/1.0.0/models/file", "tadget/manage/1.0.0/models/crumbs", "tadget/manage/1.0.0/models/tree", "tadget/manage/1.0.0/vendor/modal", "plugin/zTree/jquery.ztree.core-3.5.js", "plugin/zTree/jquery.ztree.exedit-3.5.js"],
function(a, b, c) {
    function d() {
        return iswindows = -1 != navigator.userAgent.indexOf("Windows", 0) ? 1 : 0,
        iswindows ? (G = document.getElementById("J_plugin"), G.valid ? (G.version !== window.ACTIVE_VERSION && (B.find(".activex-up").removeClass("active"), B.find(".without-plu .p1").text("上传控件已经更新了,请下载新控件")), document.attachEvent ? G.attachEvent("onfinishtbupload", h) : G.addEventListener("finishtbupload", h, !1), 1) : (B.find(".activex-up").removeClass("active"), 2)) : (B.find(".activex-up").removeClass("active").addClass("unwindows"), 3)
    }
    function e() {
        this.checked ? (B.find(".size").show(), B.find("#J_UserSize").val(620), B.find(".dropdown-toggle").data("type", 620).children("span").text("手机图片")) : (B.find(".size").hide(), B.find(".user-size").hide(), B.find("#J_UserSize").val(0))
    }
    function f() {
        var a = x(this),
        b = B.find(".dropdown-toggle"),
        c = a.data("type");
        b.data("type", c).children("span").text(a.text()),
        "0" == c ? B.find(".user-size").show() : B.find(".user-size").hide(),
        B.find("#J_UserSize").val(c)
    }
    function g() {
        var a = x("#J_UpSetting"),
        b = {};
        b.water = a.find("#J_IsWater").get(0).checked,
        b.is_public = a.find("#J_IsProtectUp").get(0).checked;
        var c = parseInt(a.find("#J_UserSize").val(), 10);
        return b.resize_width = isNaN(c) ? 0 : c,
        b
    }
    function h() {
        F(H, 1)
    }
    function i() {
        q();
        var a = g();
        window.params_OWN_COMM.dirId = H + "",
        window.params_OWN_COMM.ext.water = String(a.water),
        window.params_OWN_COMM.ext.isPublic = String(a.is_public),
        window.params_OWN_COMM.ext.resize_width = String(a.resize_width),
        G.UploadPicToTbTrader("utf-8", JSON.stringify(window.params_OWN_COMM))
    }
    function j() {
        window.COMMON_UPLOAD_PARAMS.dirId = H,
        window.COMMON_UPLOAD_PARAMS.placeholder = "J_UpFlash",
        window.COMMON_UPLOAD_PARAMS.callback = {
            fileSelected: K.fileSelected,
            fileUploaded: K.fileUploaded,
            finishUpload: K.finishUpload
        },
        x(function() {
            MediaUploader(COMMON_UPLOAD_PARAMS)
        })
    }
    function k() {
        C.removeClass("to-min"),
        C.show(),
        null == E && (E = x('<div class="modal-backdrop" />').appendTo(document.body).css({
            opacity: "0.5",
            filter: "alpha(opacity=50)"
        })),
        E.off("click").on("click",
        function() {
            m()
        }),
        r(2),
        I = !0
    }
    function l() {
        C.removeClass("to-min"),
        setTimeout(function() {
            r(2)
        },
        300)
    }
    function m() {
        C.addClass("to-min"),
        C.hasClass("to-right-buttom") || C.addClass("to-right-buttom"),
        E && (E.remove(), E = null),
        D.hide()
    }
    function n() {
        return J ? void z.show("正在上传中,请不要关闭上传窗口", "warning") : (C.hide(), E && (E.remove(), E = null), C.hide().find(".up-container").empty().end().find(".up-infor").empty().end().removeClass("to-right-buttom"), K.success = 0, K.fail = 0, C.find(".mian-head").html("上传图片"), D.hide(), void(I = !1))
    }
    function o() {
        m(),
        F(H)
    }
    function p() {
        B.show(),
        r(1),
        E = x('<div class="modal-backdrop" />').appendTo(document.body).css({
            opacity: "0.5",
            filter: "alpha(opacity=50)"
        });
        B.off("click").on("click",
        function(a) { (x(a.target).hasClass("close") || x(a.target).parents(".modal-dialog").length < 1) && q()
        })
    }
    function q() {
        B.hide(),
        E.remove(),
        E = null,
        D.hide()
    }
    function r(a) {
        var b;
        b = 1 === a ? B.find(".flash-up .btn").offset() : C.find(".up-button .btn").offset(),
        D.show().css({
            left: b.left + "px",
            top: b.top + "px"
        })
    }
    function s(a) {
        t([{
            name: "获取当前位置中,请稍后"
        }]),
        common.getData({
            cmd: "json_dir_path",
            dir_id: a
        },
        function(a) {
            var b = {};
            b = a.success ? a.module: [{
                id: "0",
                name: a.message
            }],
            t(b)
        })
    }
    function t(a) {
        for (var b = "",
        c = "<li>",
        d = '<span class="divider">&gt;</span></li>',
        e = 0; e < a.length - 1; e++) b = b + c + a[e].name + d;
        b = b + c + a[a.length - 1].name + "</li>",
        B.find(".breadcrumb").html(b),
        r(1)
    }
    function u() {
        if (B.find(".tree-box").toggle("fast"), 260 != B.find(".tree-box").height()) {
            var a = {
                callback: {
                    onClick: function(a, b, c) {
                        H = c.id,
                        B.find(".tree-box").hide(),
                        s(H)
                    }
                }
            };
            x.fn.zTree.destroy("J_UpTree");
            var b = x.fn.zTree.init(B.find("#J_UpTree"), a, ZTREENODE),
            c = b.getNodesByParam("id", H, null);
            c.length > 0 && b.selectNode(c[0])
        }
    }
    function v(a, b) {
        F = b,
        H = a,
        I ? l() : (s(a), B.find(".tree-box").hide(), n(), p())
    }
    function w() {
        B.find(".show-tree").on("click", u),
        B.find("#J_UpActivX").on("click", i),
        B.find("#J_IsResize").on("change", e),
        B.find("#J_Resize [role=menuitem]").on("click", f),
        C.find(".close-dialog").on("click", n),
        C.find(".to-min").on("click", m),
        C.find(".to-max").on("click", l),
        C.find("#J_CheckUp").on("click", o),
        j()
    }
    var x, y, z, A;
    x = a("jquery/jquery/1.10.1/jquery.js"),
    y = a("gallery/underscore/1.4.4/underscore.js"),
    router = a("tadget/manage/1.0.0/routers/router"),
    common = a("tadget/manage/1.0.0/common"),
    z = a("tadget/manage/1.0.0/vendor/infor"),
    A = a("tadget/manage/1.0.0/vendor/modal");
    var B = x("#J_UpfileModal"),
    C = x("#J_FlashUp"),
    D = x(".flash-up-btn"),
    E = null;
    a("plugin/zTree/jquery.ztree.core-3.5.js")(x),
    a("plugin/zTree/jquery.ztree.exedit-3.5.js")(x);
    var F, G, H = "0",
    I = !1,
    J = !1,
    K = {
        order: 0,
        success: 0,
        fail: 0,
        fileSelected: function(a) {
            J = !0,
            B.hide(),
            I || k(),
            C.find(".mian-head").html("上传文件中");
            for (var b = "",
            c = {},
            d = y.template(C.find("#J_UpItem").html()), e = 0; e < a.length; e++) c.id = a[e].id,
            c.name = a[e].name,
            c.size = common.sizeFormat(a[e].size),
            b = d(c) + b;
            C.removeClass("to-min").find(".up-container").prepend(b),
            window.COMMON_UPLOAD_PARAMS.dirId = H;
            var f = g();
            window.COMMON_UPLOAD_PARAMS.watermark = String(f.water),
            window.COMMON_UPLOAD_PARAMS.compressMaxWidth = String(f.resize_width),
            window.COMMON_UPLOAD_PARAMS.isPublic = String(f.is_public)
        },
        fileUploaded: function(a) {
            a.result ? (K.success++, C.find("li[data-id=" + a.id + "] .img-up-result").html('<span class="up-success" title="上传成功"></span>')) : (K.fail++, C.find("li[data-id=" + a.id + "] .img-up-result").html('<span class="up-fail" title="上传失败"></span><span class="fail-message">' + a.error + "</span>"));
            var b = "";
            K.success > 0 && (b = '<span class="number">' + K.success + "</span>个文件上传成功"),
            K.fail > 0 && (b = b + '&nbsp;<span class="number">' + K.fail + "</span>个上传失败"),
            C.find(".up-infor").html(b),
            J = !1
        },
        finishUpload: function() {
            var a = "全部上传成功";
            K.fail > 0 && (a = "部分上传成功"),
            C.find(".mian-head").html(a),
            o()
        }
    };
    w(),
    d(),
    c.exports = {
        up: v
    }
}),
define("tadget/manage/1.0.0/views/pager", ["jquery/jquery/1.10.1/jquery.js", "gallery/underscore/1.4.4/underscore.js", "gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "tadget/manage/1.0.0/views/file", "tadget/manage/1.0.0/common", "tadget/manage/1.0.0/vendor/infor", "tadget/manage/1.0.0/routers/router", "tadget/manage/1.0.0/collections/folder", "tadget/manage/1.0.0/vendor/backbone.paginator", "tadget/manage/1.0.0/models/file", "tadget/manage/1.0.0/models/crumbs", "tadget/manage/1.0.0/models/tree", "tadget/manage/1.0.0/vendor/detail", "tadget/manage/1.0.0/vendor/silde", "tadget/manage/1.0.0/vendor/copy", "tadget/manage/1.0.0/vendor/jquery.mousewheel", "plugin/jQueryUI/1.10.3/jquery.ui.js"],
function(a, b, c) {
    var d, e, f, g, h, i, j = a("jquery/jquery/1.10.1/jquery.js"),
    k = a("gallery/underscore/1.4.4/underscore.js");
    d = a("gallery/backbone/1.0.0/backbone.js"),
    e = a("tadget/manage/1.0.0/views/file"),
    g = a("tadget/manage/1.0.0/common"),
    h = a("tadget/manage/1.0.0/routers/router"),
    i = a("tadget/manage/1.0.0/vendor/infor"),
    a("plugin/jQueryUI/1.10.3/jquery.ui.js")(j),
    f = d.View.extend({
        events: {
            "click .servernext": "nextResultPage",
            "click .serverprevious": "previousResultPage",
            "click .page": "gotoPage"
        },
        el: "#J_Pager",
        template: k.template(j("#paginationTemplate").html()),
        initialize: function() {
            var a = this;
            a.$picContainer = j(".pic-container"),
            a.$sort = j("#J_Sort"),
            a.$isShowFolder = j("#J_IsShowFolder"),
            a.$_18x = j("#J_18x"),
            a.$clientType = j("#J_WhereUsed"),
            a.$searchForm = j("#J_SearForm"),
            a.collection.on("reset", a.render, a),
            j("#J_ShowList").on("click", a.showList),
            j("#J_ShowPic").on("click", a.showPic),
            this.collection.ignore_cat = this.$isShowFolder[0].checked ? 1 : 0,
            a.$isShowFolder.on("change", j.proxy(a.isShowFolder, a)),
            a.$sort.find("[role=menuitem]").on("click", j.proxy(a.sort, a)),
            a.$_18x.find("[role=menuitem]").on("click", j.proxy(a.do18x, a)),
            a.$clientType.find("[role=menuitem]").on("click", j.proxy(a.changeClinet, a)),
            j("#J_GotoPage").on("click",
            function(b) {
                a.jumpPage(b)
            }),
            a.$searchForm.find(".search-btn").on("click", j.proxy(this.normalSearch, this)),
            a.$searchForm.find(".search-input").on("keypress", j.proxy(function(a) {
                13 === a.keyCode && this.normalSearch()
            },
            this)),
            a.$searchForm.find(".spec-search a").on("click", j.proxy(this.specSearch, this)),
            a.$searchForm.find("#J_SsType").on("change", j.proxy(this.changSearchType, this)),
            j(document).on("click",
            function(a) {
                0 === j(a.target).parents("#J_SpecForm").length && 0 === j(a.target).parents(".spec-search").length && j("#J_SpecForm").hide()
            })
        },
        render: function() {
            var a = this.collection,
            b = "";
            b = 2 === a.type || 6 === a.type ? k.template(j("#paginationItem").html(), {
                currentPage: a.currentPage,
                hasNext: a.hasNext
            }) : this.template(a.info()),
            this.$el.html(b)
        },
        changePage: function(a) {
            var b = window.location.hash,
            c = "goto/0/" + a;
            "" !== b && (c = b.replace(/\/[0-9]+$/g, "/" + a)),
            h.navigate(c, {
                trigger: !0
            })
        },
        nextResultPage: function(a) {
            if (a.preventDefault(), !j(a.target).hasClass("disabled")) {
                var b = ++this.collection.currentPage;
                this.changePage(b)
            }
        },
        previousResultPage: function(a) {
            if (a.preventDefault(), !j(a.target).hasClass("disabled")) {
                var b = --this.collection.currentPage;
                this.changePage(b)
            }
        },
        gotoPage: function(a) {
            a.preventDefault();
            var b = j(a.target).text();
            this.changePage(b)
        },
        showPic: function() {
            var a = j(this).find(".big-pic");
            a.hasClass("active") || (j(".pic-container").removeClass("list-show"), a.addClass("active"), j("#J_ShowList .list").removeClass("active"))
        },
        showList: function() {
            var a = j(this).find(".list");
            a.hasClass("active") || (j(".pic-container").addClass("list-show"), a.addClass("active"), j("#J_ShowPic .big-pic").removeClass("active"))
        },
        isShowFolder: function() {
            this.collection.ignore_cat = this.$isShowFolder[0].checked ? 1 : 0,
            this.changePage("1"),
            this.collection.goTo(1)
        },
        sort: function(a) {
            var b = {
                0 : "down",
                1 : "up",
                2 : "down",
                3 : "up",
                6 : "down",
                7 : "up"
            },
            c = j(a.target),
            d = c.data("type"),
            e = this.$sort.find(".dropdown-toggle");
            e.text(c.text()).data("type", d),
            e.removeClass("up down").addClass(b[c.data("type")]),
            this.collection.sortby = d,
            this.changePage("1"),
            this.collection.goTo(1)
        },
        do18x: function(a) {
            var b = j(a.target),
            c = b.data("type"),
            d = this.$_18x.find(".dropdown-toggle");
            d.data("type", c).children("span").text(b.text()),
            this.collection._18x = c,
            this.changePage("1"),
            this.collection.goTo(1)
        },
        changeClinet: function(a) {
            var b = j(a.target),
            c = b.data("type"),
            d = this.$clientType.find(".dropdown-toggle");
            d.data("type", c).children("span").text(b.text()),
            this.collection.client_type = c,
            this.changePage("1"),
            this.collection.goTo(1)
        },
        jumpPage: function(a) {
            a.preventDefault();
            var b = j("#J_GotoPageNumber").val();
            b > 0 && b <= this.collection.totalPages ? this.changePage(b) : i.show("请输入正确的页码", "danger")
        },
        normalSearch: function() {
            var a = j.trim(this.$searchForm.find(".search-input").val());
            if ("" !== a) {
                var b = g.checkName(a, 100);
                if (b) return void i.show(b, "danger");
                var c = "search/" + a + "/1";
                h.navigate(c, {
                    trigger: !0
                })
            }
        },
        changSearchType: function() {
            var a = Number(this.$searchForm.find("#J_SsType").val()),
            b = this.$searchForm.find("#J_SsTime"),
            c = this.$searchForm.find("#J_SsKey"),
            d = {
                1 : "请输入图片或者文件夹名称",
                2 : "请输入宝贝名称",
                3 : "请输入图片名称",
                4 : "请输入图片名称",
                5 : "请输入宝贝名称",
                6 : "请输入宝贝名称",
                7 : "请输入图片名称",
                8 : "请输入图片名称",
                9 : "请输入图片名称",
                10 : "请输入图片名称"
            };
            1 === a || 3 === a || 4 === a ? b.show() : (b.hide(), b.find("input").val("")),
            6 === a || 7 === a ? (c.parents(".control-group").hide(), b.find("input").val("")) : c.parents(".control-group").show(),
            c.attr("placeholder", d[a])
        },
        specSearch: function() {
            var a = j("#J_SpecForm");
            a.fadeToggle(),
            a.find(".close").off("click").one("click",
            function() {
                a.fadeOut()
            }),
            j.datepicker.regional["zh-TW"] = {
                closeText: "关闭",
                prevText: "&lt;",
                nextText: "&gt;",
                currentText: "今天",
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                dayNames: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
                dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
                dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
                weekHeader: "周",
                dateFormat: "yy-mm-dd",
                firstDay: 1,
                isRTL: !1,
                showMonthAfterYear: !0,
                yearSuffix: "年"
            },
            j.datepicker.setDefaults(j.datepicker.regional["zh-TW"]),
            a.find(".time-input").datepicker(),
            a.find(".search").off("click").on("click",
            function(b) {
                b.preventDefault();
                var c = a.find(".key-input").val(),
                d = j.trim(a.find(".time-input[name=start]").val()),
                e = j.trim(a.find(".time-input[name=end]").val()),
                f = a.find("#J_SsType").val(),
                k = g.checkName(c, 100);
                if (k && "名称不能为空" !== k) return void i.show(k, "danger");
                "" === j.trim(c) && (c = ";"),
                "" === d && (d = "0"),
                "" === e && (e = "0");
                var l = "specsearch/" + f + "/" + c + "/" + d + "/" + e + "/1";
                h.navigate(l, {
                    trigger: !0
                })
            })
        }
    }),
    c.exports = f
}),
define("tadget/manage/1.0.0/views/crumbs", ["jquery/jquery/1.10.1/jquery.js", "gallery/underscore/1.4.4/underscore.js", "gallery/backbone/1.0.0/backbone.js", "gallery/underscore/1.4.4/underscore", "$", "tadget/manage/1.0.0/models/crumbs", "tadget/manage/1.0.0/common", "tadget/manage/1.0.0/vendor/infor"],
function(a, b, c) {
    var d, e, f, g, h;
    f = a("jquery/jquery/1.10.1/jquery.js"),
    e = a("gallery/underscore/1.4.4/underscore.js"),
    d = a("gallery/backbone/1.0.0/backbone.js"),
    crumbs = a("tadget/manage/1.0.0/models/crumbs"),
    h = a("tadget/manage/1.0.0/common"),
    g = d.View.extend({
        el: "#J_Crumbs",
        item: e.template('<li class="folder"><a href="#goto/<%=id%>/1"><i class="icon"></i><%=name%></a><span class="divider">&gt;</span></li>'),
        homeItem: e.template('<li class="home"><a href="#goto/<%=id%>/1"><i class="icon"></i><%=name%></a><span class="divider">&gt;</span></li>'),
        nodleItemsStart: '<li class="noodle"><i class="icon"></i><span class="divider">></span><ul class="dropdown-menu"><s class="arrow icon"></s>',
        nodleItemsEnd: "</ul></li>",
        initialize: function() {
            this.listenTo(this.model, "change:crumbs", this.render),
            this.listenTo(this.model, "change:currentFolder", this.getCrumbs),
            this.listenTo(this.model, "change:search", this.doSearch),
            this.listenTo(this.model, "change:specsearch", this.doSpecsearch),
            this.listenTo(this.model, "change:goods", this.goodsMod),
            f(window).on("resize", f.proxy(this.resizeCB, this))
        },
        option: {
            dataType: "json",
            type: "get",
            data: {
                _input_charset: "utf-8",
                cmd: "json_dir_path"
            }
        },
        resizeCB: function() {
            var a = window.location.hash;
            /specsearch/gi.test(a) ? this.doSpecsearch() : /search/gi.test(a) ? this.doSearch() : this.render()
        },
        getLength: function(a) {
            return 7 * h.getLength(a) + 20
        },
        getCrumbs: function() {
            this.option.data.dir_id = this.model.get("currentFolder"),
            this.model.fetch(this.option)
        },
        render: function() {
            var a = "",
            b = "",
            c = this.model.get("crumbs"),
            d = this.$el.width(),
            e = 93,
            f = this.getLength(c[c.length - 1].name);
            f + 29 > d ? b = '<li class="active folder"><a><i class="icon"></i>' + c[c.length - 1].name + '</a><span class="divider">&gt;</span></li>': a = '<li class="active">' + c[c.length - 1].name + "</li>",
            e += this.getLength(c[c.length - 1].name);
            for (var g = c.length - 2; g >= 1; g--) e += this.getLength(c[g].name),
            d > e ? a = this.item(c[g]) + a: b += this.item(c[g]);
            b.length > 0 || e > d ? (b += this.homeItem(c[0]), b = this.nodleItemsStart + b + this.nodleItemsEnd, this.$el.html(b + a)) : (a = c.length > 1 ? this.homeItem(c[0]) + a: '<li class="active home"><i class="icon"></i>' + c[0].name + "</li>", this.$el.html(a))
        },
        renderByData: function(a) {
            var b = e.template('<li class="folder"><a href="<%=url%>"><i class="icon"></i><%=name%></a><span class="divider">&gt;</span></li>'),
            c = "",
            d = "",
            f = this.$el.width(),
            g = 0,
            h = this.getLength(a[a.length - 1].name);
            h + 29 > f ? d = '<li class="active folder"><a><i class="icon"></i>' + a[a.length - 1].name + '</a><span class="divider">&gt;</span></li>': c = '<li class="active">' + a[a.length - 1].name + "</li>",
            g += this.getLength(a[a.length - 1].name);
            for (var i = a.length - 2; i >= 0; i--) g += this.getLength(a[i].name),
            f > g ? c = b(a[i]) + c: d += b(a[i]);
            d.length > 0 || g > f ? (d = this.nodleItemsStart + d + this.nodleItemsEnd, this.$el.html(d + c)) : this.$el.html(c)
        },
        suitableLen: function(a) {
            var b = parseInt(this.$el.width() / 14) - 5 - 2,
            c = "";
            if (b <= h.getLength(a)) {
                for (var d = 0; b > d; d++) a.charCodeAt(d) < 27 || a.charCodeAt(d) > 126 ? c += a.charAt(d) : (c += a.charAt(d), c += a.charAt(++d));
                c += "..."
            } else c = a;
            return c
        },
        doSearch: function() {
            var a = this.model.get("search");
            this.$el.text(this.suitableLen(a) + "的搜索结果")
        },
        searchType: {
            1 : "文件夹/图片名称",
            2 : "宝贝名称",
            3 : "手机图片",
            4 : "PC 图片",
            5 : "宝贝引用的图片",
            6 : "店铺引用的图片",
            7 : "未引用",
            8 : "审核未通过",
            9 : "审核通过",
            10 : "审核中"
        },
        doSpecsearch: function() {
            var a = this.model.get("specsearch");
            if (";" == a) {
                var b = this.model.get("type");
                this.$el.text("按" + this.searchType[b] + "过滤的结果")
            } else this.$el.text(this.suitableLen(a) + "的搜索结果")
        },
        goodsMod: function() {
            var a, b, c, d, e = [];
            b = this.model.get("type"),
            b && (c = this.model.get("specsearch"), a = ";" == c ? "按" + this.searchType[b] + "过滤的结果": this.suitableLen(c) + "的搜索结果", d = "#specsearch/" + b + "/" + c + "/" + this.model.get("from") + "/" + this.model.get("to") + "/1", e.push({
                name: a,
                url: d
            })),
            e.push({
                name: "宝贝: " + decodeURIComponent(this.model.get("goods")),
                url: ""
            }),
            this.renderByData(e)
        }
    }),
    c.exports = new g({
        model: crumbs
    })
});