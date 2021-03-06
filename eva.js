/**
 * JavaScript Library Eva ver: 2.0
 * Author: Alexandr Drozd
 * email: dev.drozd@gmail.com
 * Released under the evaax license by 2016
 *
 */
 
(function(_w, _d){
	
	/**
	* Методы для работы с массивами
	*/
	var ExObj = function(a, b){
		return [].push.apply(this, ($.isType(a, 'string') ? (
				a.search(/^<\w+\/>$/) === 0 ? newEl(a, b) : _d.querySelectorAll(a)
			) : (a.length >= 0 && a !== _w ? a : (
					typeof a === 'object' ? [a] : []
				)
			))
		);
	}, newEl = function(a, b){
		var e = _d.createElement(a.replace(/^<(\w+)\/>$/, '$1'));
		if(b){
			for(var k in b){
				switch(k){
					case "css":
						for(var s in b[k]){
							e.style[s] = (
								$.isType(b[k][s], 'number') ? b[k][s]+'px' : b[k][s]
							);	
						}
					break;
					case "html": e.innerHTML = objToHtml(b[k]); break;
					case "text": e.textContent = b[k]; break;
					default:
						e.setAttribute(k, b[k]);
				}
			}
		}
		return [e];
	}, getJs = function(a){
		if(typeof a == 'string'){
			var c = '';
			a.replace(/<script(.*?)>([\s\S]*?)<\/script>/gmi, function(){
				c += arguments[2];
			});
			return c;
		}
	}, objToHtml = function(a){
		if(a != null && typeof a === 'object'){
			if(a.length > 1){
				var h = '';
				for(var i = 0; i < a.length; i++)
					h += a[i].outerHTML;
				a = h;
			} else
				a = a[0].outerHTML;
		}
		return a;
	}, pasteCb = function(e, a, b, p){
		j = getJs(a);
		if(b || j){
			var h = e.innerHTML;
			var tm = {
				fn: setInterval(function(){
					if(h !== e.innerHTML || tm.t >= 300){
						clearInterval(tm.fn);
						if(typeof b === 'function'){
							b.apply(e, [a]);
						}
						eval(j);
					}
					tm.t++;
				}, 1),
				t: 0
			};
		}
	};

	$ = function(a, b){
		return $.isType(a, 'object') && a.evaax ? a : (
			$.isType(a, 'function') ? (
				_d.readyState === "complete" ? a.apply(_d, [$]) : _w.addEventListener("load", a, false)
			) : new ExObj(a, b)
		);
	};
	
	/**
	* Публичные методы для работы с элементами
	*/
	$.fn = ExObj.prototype = {
		evaax: 'v 4.5',
		
		/**
		* Обработчики событий
		*/
		
		// Добавление в DOM
		ready: function(a){
			if(typeof a === 'function'){
				if(this.readyState === 'complete')
					a();
				else
					this.bind('DOMContentLoaded', a);
			}
			return this;
		},
		scroll: function(a,b){
			return this.bind('scroll', a, b);
		},
        resize: function(a){
            return this.bind('resize', a);
        },
        focus: function(a){
			return a ? this.bind('focus', a) : this.emit('focus');
        },
        blur: function(a) {
			return a ? this.bind('blur', a) : this.emit('blur');
        },
        emit: function(a, b){
			return this.each(function(){
				this.dispatchEvent(new Event(a, (b || {
					bubbles: true,
					cancelable: true
				})));
			});
        },
		click: function(a){
            return a ? this.bind('click', a) : this.each(function(){
				this.click();
			});
		},
        change: function(cb){
            return this.bind('change', cb);
        },
		bind: function (a, b, c){
			if(!b) return this;
			var t = a.split(/\s+/);
			for(i = 0; i < t.length; i++){
				this.each(function(){
					if(!this.events) this.events = {};
					if(!this.events[t[i]])
						this.events[t[i]] = [];
					if(c) $(this).unbind(t[i]);
					if(!b.name || !$.inArray(b, this.events[t[i]])){
						if(!this.events[t[i]]) this.events[t[i]] = [];
						this.events[t[i]].push(b);
					}
					this.addEventListener(t[i], b, false);
				});
			}
			return this;
		},
		unbind: function(act, b){
			function remove(t, a, e){
				if(!e) return this;
				for(var i = 0; i < e.length; i++){
					if(!b || (b && e[i] === b)){
						t.removeEventListener(a, e[i], false);
					}
				}
				if(!b) delete t.events[a];
			}
			function each(a){
				this.each(function(){
					var e = this.events || {};
					if(!a){
						for(var n in e)
							remove(this, n, e[n]);	
					} else
						remove(this, a, e[a]);
				});
			}
			if(arguments.length){
				var t = act.split(/\s+/);
				for(var i = 0; i < t.length; i++)
					each.apply(this, [t[i]]);
			} else
				each.apply(this);
			return this;
		},
		
		/**
		* Манипуляции с атрибутами
		*/
        attr: function(a, b){
			if(typeof a === 'object'){
				for(var i in a) this.attr(i, a[i]);
				return this;
			} else if(arguments.length > 1){
				return this.each(function(){
					this.setAttribute(a, b);
				});
			} else
				return this.length ? this[0].getAttribute(a) : this;
        },
		removeAttr: function(a){
			if(typeof a === 'object'){
				for(var i in a) this.removeAttr(i, a[i]);
				return this;
			} else {
				return this.each(function(){
					this.removeAttribute(a);
				});	
			}
		},
		replaceAttr: function(a, b){
			return this.each(function(i, e){
				var v = e.getAttribute(a);
				if(v != null) e.setAttribute(b, v);
				e.removeAttribute(a);
			});
		},
		hasAttr: function(a){
			return this[0].hasAttribute(a);
		},
		
		/**
		* Манипуляции с стилями
		*/
		hide: function(a){
			return this.each(function(){
				this.style.display = 'none';
			});
		},
		show: function(a){
			return this.each(function(){
				this.style.display = 'block';
			});
		},
		css: function(a, b){
			if($.isType(a, 'object')){
				for(var p in a){
					this.each(function(){
						this.style[p] = a[p];
					});
				}
				return this;
			} else {
				return b === []._ ? (
					this[0].currentStyle ? this[0].currentStyle[a] : (
						_d.defaultView && _d.defaultView.getComputedStyle ?
						_d.defaultView.getComputedStyle(this[0], "")[a] :
						this[0].style[a]
					)
				) : this.each(function(){
					return this.style[a] = b;
				});
			}
		},
		
		/**
		* Анимации
		*/
		fadeIn: function(a, b){
			return this.each(function(i, e){
				e.style.display = 'block';
				e.style.opacity = '0';
				setTimeout(function(){
					$(e).animate({
						opacity: '1'
					}, a, function(e){
						if(b) b.apply(e);
					});
				}, 50);	
			});
		},
		fadeOut: function(a, b){
			return this.each(function(){
				this.style.opacity = '1';
				$(this).animate({
					opacity: '0'
				}, a, function(e){
					if(b) b.apply(e);
					e.style.display = 'none';
				});	
			});
		},
		animate: function(a, b, c){
			if (b == 'slow' || b == 'fast') b = 200;
			return this.each(function(i, e){
				this.style.transition = (b || 400)+'ms';
				(function(j){
					while(true){
						if(j.style.transition.length > 0){
							$(j).css(a);
							setTimeout(function(){
								j.style.transition = '';
								if(c) c(j, b);
							}, (b-10 || 400));
							break;
						}
					}
				})(e);
			});
		},
		
		/**
		* Манипуляции с классами
		*/
		addClass: function(a){
			return this.each(function(){
				this.classList.add(a);
			});
		},
		removeClass: function(a, b){
			return this.each(function(){
				this.classList.remove(a);
			});
		},
		replaceClass: function(a, b){
			return this.each(function(){
				$(this).removeClass(a).addClass(b);
			});
		},
		toggleClass: function(a){
			var t = a.split(/\s+/);
			for(var i = 0; i < t.length; i++){
				this.each(function(){
					if($(this).hasClass(t[i]))
						$(this).removeClass(t[i]);
					else
						$(this).addClass(t[i]);
				});
			}
			return this;
		},
		hasClass: function(a){
			return this[0].classList.contains(a);
		},
		
		/**
		* Вставить в DOM и получить
		*/
		text: function(a){
			var text;
			this.each(function(){
				if(a === []._)
					text += this.textContent;
				else
					this.textContent = a;
			});
			return text || this;
		},
        val: function(a){
			if(arguments.length){
				return this.each(function(){
					this.value = a;
				});
			} else {
				return this.length ? (
					this[0].value ? this[0].value : this.attr('value') || ''
				) : this;
			}
        },
		html: function(a, b){
			a = objToHtml(a);
			return a === []._ ? this[0].innerHTML : this.each(function(){
				pasteCb(this, a, b);
				this.innerHTML = a;
			});
		},
		empty: function(){
			return this.each(function(){
				while(this.firstChild) this.removeChild(this.firstChild);
			});
		},
		incAdjHtml: function(a, b, c, d){
			a = objToHtml(a);
			return this.each(function(){
				pasteCb(this, a, c, d);
				this.insertAdjacentHTML(b, a);
			});
		},
		append: function(a, b){
			return this.incAdjHtml(a, 'beforeEnd', b);
		},
		prepend: function(a, b){
			return this.incAdjHtml(a, 'afterBegin', b);
		},
		before: function(a, b){
			return this.incAdjHtml(a, 'beforeBegin', b, true);
		},
		after: function(a, b){
			return this.incAdjHtml(a, 'afterEnd', b, true);
		},
		
		/**
		* Кординаты и размеры элементов
		*/
        position: function(){
            return this.length ? {
                top: this[0].offsetTop,
                left: this[0].offsetLeft
            } : '';
        },
		offset: function(){
			var e = _d.documentElement,
				b = this[0].getBoundingClientRect(),
				t = b.top+_w.pageYOffset-e.clientTop,
				l = b.left+_w.pageXOffset-e.clientLeft;
			return {
				top: t,
				left: l,
				width: b.width,
				height: b.height
			};
		},
        height: function(h){
			var b = _d.body;
			return arguments.length ? this.css('height', h) : (
				this.length ? (
					this[0] === _w ? _w.innerHeight : (
						this[0] === _d ? Math.max(
							b.scrollHeight,
							_d.documentElement.scrollHeight,
							b.offsetHeight,
							_d.documentElement.offsetHeight,
							b.clientHeight,
							_d.documentElement.clientHeight
						) : this[0].offsetHeight
					)
				) : this
			);
        },
        width: function(w){
			var b = _d.body;
            return arguments.length ? this.css('width', arguments[0]) : (
				this[0] === _w ? _w.innerWidth : (
					this[0] === _d ? Math.max(
						_d.documentElement.clientWidth,
						b.scrollWidth,
						_d.documentElement.scrollWidth,
						b.offsetWidth,
						_d.documentElement.offsetWidth
					) : (
						this.length ? this[0].offsetWidth : this
					)
				)
			);
        },
		
		/**
		* Скроллбар
		*/
		scrollTop: function(a, b, c){
			return a == []._ && this.length ? (
				this[0].scrollTop || _w.pageYOffset
			) : this.each(function(i, e){
				$.animate({
					start: $(e).scrollTop(),
					end: a,
					duration: b || 0,
					complete: c,
					draw: function(t, v){
						if(e == _w || e == _d)
							_w.scrollTo(0, Math.round(v));
						else
							e.scrollTop = Math.round(v);
					}
				});
			});
		},
		scrollIntoView: function(p){
			if(this.length) this[0].scrollIntoView(p);
			return this;
		},
        scrollheight: function(){
            if (!this.length) return false;
            return this[0].scrollHeight;
        },
        scrollWidth: function(){
            if (!this.length) return false;
            return this[0].scrollWidth;
        },
		
		/**
		* Проверки элементов
		*/
		is: function(a){
			if(this[0] === _d || a === _d || this[0] === _w || a === _w)
				return this[0] === a ? true : false;
			return (
				this[0].matches ||
				this[0].matchesSelector || 
				this[0].msMatchesSelector ||
				this[0].mozMatchesSelector || 
				this[0].webkitMatchesSelector ||
				this[0].oMatchesSelector
			).call(this[0], a);
		},
        isVisible: function(){
			return (
				this.css('display') === 'none' || 
				this.css('visibility') === 'hidden' || 
				this.css('opacity') === '0'
			) ? false : true;
        },
		
		/**
		* Получение элементов
		*/
		prev: function(){
			return $(this[0].previousElementSibling);
		},
		next: function(){
			return $(this[0].nextElementSibling);
		},
		first: function(){
			return this.length ? $(this[0]) : this;
		},
		last: function(){
			return this.length ? $(this[this.length-1]) : this;
		},
		get: function(a){
			return this[a] ? $(this[a]) : this;
		},
		filter: function(s){
			var arr = [];
			if(typeof s === 'string') {
				for(i = 0; i < this.length; i++){
					if($(this[i]).is(s))
						arr.push(this[i]);
				}
			} else if(typeof s === 'function'){
				for(i = 0; i < this.length; i++){
					if(s.call(this, i, this[i]) === true)
						arr.push(this[i]);
				}
			}
			return $(arr);
		},
		find: function(s){
			var arr = [], q, then = this;
			this.each(function(){
				q = Array.prototype.slice.call(this.querySelectorAll(s),'');
				if(q.length)
					arr = arr.concat(q);
			});
			return $(arr);
		},
		parent: function(s){
			if(s && this.length){
				var a = this[0], res;
				 while(a){
					 if($(a).is(s) && a !== this[0])
						 return a;
					 a = a.parentNode;
				 }
			}
			return this.length > 0 ? $(this[0].parentNode) : $([]);
		},
        parents: function(s){
            var a = this[0], res = [];
            while(a){
				if(a !== this[0]){
					if(s){
						if($(a).is(s))
							res.push(a);
					} else
						res.push(a);
				}
				a = a.parentNode;
            }
            return res.length ? $(res) : $([]);
        },
        children: function(s){
			var res = [];
            if (this.length) {
                if(!s){
                    var e = this[0].firstChild, el = [e];
                    while(e){
                        e = e.nextSibling;
                        if(e && e.nodeType == 1)
							el.push(e);
                    }
                    res = el;
				} else {
					res = this[0].querySelectorAll ? this[0].querySelectorAll(s) : [];
				}
            }
            return $(res);
        },
		
		/**
		* Копирование удаление, и перемещение
		*/
		clone: function(){
			res = [];
			this.each(function(){
				res.push(this.cloneNode(true));
			});
			return $(res);
		},
		remove: function(){
			return this.each(function(){
				if(this.parentNode)
					this.parentNode.removeChild(this);
			});
		},
		replaceWith: function(a, b){
			return this.each(function(){
				pasteCb(this, a, b);
				this.outerHTML = a;
			});
		},
		appendTo: function(s){
			var e = this;
			$(s).each(function(){
				this.appendChild(e[0]);
			});
			return e;
		},
		prependTo: function(s){
			var e = this;
			$(s).each(function(){
				this.insertBefore(e[0], this.firstChild);
			});
			return e;
		},
		
		/**
		* Цыклы
		*/
		each: function (a, b){
			for(var i = 0; i < this.length; i++){
				if(a.apply(this[i], [i, this[i]]) === false) break;
			}
			return this
		},
		forEach: function(a, b){
			[].forEach.call(this, a, b)
			return this
		},
		indexOf: function(a){
			return [].indexOf.call(this, a);
		},
		splice: function(a, b){
			[].splice.call(this, a, b);
			return this;
		}
	};
	
	/**
	* Публичные методы для общего применения
	*/
	$.each = function(o, f){
		if($.isType(o, 'object')){
			for(var i in o){
				if(f.call(o[i], i, o[i]) === false) break;	
			}
		} else 
			$.fn.each.apply(o, [f]);
		return o;
	};
	
	$.animate = function(a){
		var s = performance.now();
		requestAnimationFrame(function animate(t){
			var f = (t-s)/a.duration;
			if(f > 1) f = 1;
			a.draw(f, a.start+(a.end-(a.start))*f);
			if(f < 1)
				requestAnimationFrame(animate);
			else if(a.complete)
				a.complete();
		});
	};
	$.isType = function(a, b){
		var t = Object.prototype.toString.call(a).toLowerCase();
		return b ? (t === '[object '+b+']') : t;
	};
	$.trim = function(a){
		try {
			return a.trim();
		} catch(e){
			return (a || '').replace(/^\s+|\s+$/g, '');
		} 
	};
	$.extend = function(){
		var a = arguments, l = a.length, b = a[0] || {};
		for(var i = 1; i < l; i++){
			var o = a[i];
			if(!o) continue;
			for(var k in o){
				if(o.hasOwnProperty(k)){
					if(typeof o[k] === 'object') $.extend(b[k], o[k]);
					else b[k] = o[k];
				}
			}
		}
		return b;
	};
    $.now = function(){
        return +new Date;
    };
	$.inArray = function(a, b){
		return b.indexOf(a) >= 0;
	};
	$.ajax = function(a, b){
		var x;
		try {
			x = new XMLHttpRequest();
		} catch(e){
			try {
				x = new XDomainRequest();
			} catch(e){
				try {
					x = new ActiveXObject('Msxml2.XMLHTTP');
				} catch(e){
					try {
						x = new ActiveXObject('Microsoft.XMLHTTP');
					} catch(e){
												
					}
				}
			}
		}
		if(b.progress){
			function progress(e){
				if(e.lengthComputable){
					b.progress.apply(e, [Math.round((e.loaded/e.total)*100)]);
				}	
			}
			if($.isType(b.data, 'formdata'))
				x.upload.addEventListener('progress', progress);
			else
				x.addEventListener('progress', progress);
		}
		x.onreadystatechange = function(){
			return  this.readyState == 4 && this.status == 200 ? (
				b.success ? b.success.apply(this, [this.response]) : false
			) : return;
		};
		if($.isType(b.data, 'object')){
			b.data = Object.keys(b.data).reduce(function(a, k){
				a.push(k+'='+encodeURIComponent(b.data[k]));
				return a;
			},[]).join('&');
		}
		x.open(b.method, a+(b.method == 'GET' && b.data ? (
			(a.indexOf('?') != -1 ? '&' : '?')+b.data
		) : ''), b.async || true, b.user, b.password);
		x.responseType = b.responseType || 'text';
		x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		if(b.headers){
			for(var k in b.headers) x.setRequestHeader(k, b.headers[k]);
		} else if(!$.isType(b.data, 'formdata'))
			x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		x.send(b.data);
		return x;
	};
	$.getJSON = function(a, b, c){
		return $.ajax(a, {
			method: 'GET',
			success: b,
			progress: c,
			responseType: 'json'
		});
	};
	$.get = function(a, b, c, d, e){
		return $.ajax(a, {
			method: 'GET',
			data: b,
			success: c,
			progress: e,
			responseType: d
		});
	};
	$.post = function(url, data, cb, res, progress){
		return $.ajax(url, {
			method: 'POST',
			data: data,
			success: cb,
			progress: progress,
			responseType: res
		});
	};
})(window, document);