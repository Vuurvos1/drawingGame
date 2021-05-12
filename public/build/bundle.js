
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const socket = writable({});
    const paint = writable({});
    const gameState = writable('');
    const users = writable([]);
    const username = writable('');
    const userImg = writable('./img/userImg/user1.png');

    /* src\components\Chat.svelte generated by Svelte v3.38.2 */
    const file = "src\\components\\Chat.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (44:4) {#each comments as comment}
    function create_each_block(ctx) {
    	let p;
    	let span;
    	let t0_value = `${/*comment*/ ctx[8].username}: ` + "";
    	let t0;
    	let t1;
    	let t2_value = /*comment*/ ctx[8].message + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			p = element("p");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			add_location(span, file, 45, 8, 1002);
    			attr_dev(p, "class", "svelte-olpjlc");
    			add_location(p, file, 44, 6, 989);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, span);
    			append_dev(span, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*comments*/ 1 && t0_value !== (t0_value = `${/*comment*/ ctx[8].username}: ` + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*comments*/ 1 && t2_value !== (t2_value = /*comment*/ ctx[8].message + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(44:4) {#each comments as comment}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let input;
    	let div1_class_value;
    	let mounted;
    	let dispose;
    	let each_value = /*comments*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			input = element("input");
    			attr_dev(div0, "class", "messages svelte-olpjlc");
    			add_location(div0, file, 42, 2, 910);
    			attr_dev(input, "placeholder", "Send a Message");
    			add_location(input, file, 52, 2, 1173);
    			attr_dev(div1, "class", div1_class_value = "" + (null_to_empty(`${/*$$props*/ ctx[3].class} chat scrollable`) + " svelte-olpjlc"));
    			add_location(div1, file, 41, 0, 858);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			/*div0_binding*/ ctx[4](div0);
    			append_dev(div1, t);
    			append_dev(div1, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "keydown", /*handleKeydown*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*comments*/ 1) {
    				each_value = /*comments*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$$props*/ 8 && div1_class_value !== (div1_class_value = "" + (null_to_empty(`${/*$$props*/ ctx[3].class} chat scrollable`) + " svelte-olpjlc"))) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			/*div0_binding*/ ctx[4](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $socket;
    	let $username;
    	validate_store(socket, "socket");
    	component_subscribe($$self, socket, $$value => $$invalidate(6, $socket = $$value));
    	validate_store(username, "username");
    	component_subscribe($$self, username, $$value => $$invalidate(7, $username = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Chat", slots, []);
    	let comments = [];

    	// autoscroll stuff
    	let div;

    	let autoscroll;

    	beforeUpdate(() => {
    		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
    	});

    	afterUpdate(() => {
    		if (autoscroll) {
    			div.scrollTo(0, div.scrollHeight);
    		}
    	});

    	function handleKeydown(event) {
    		if (event.key === "Enter") {
    			const text = event.target.value;
    			if (!text) return;

    			const data = {
    				id: $socket.id,
    				username: $username,
    				message: text
    			};

    			$$invalidate(0, comments = comments.concat(data));
    			$socket.emit("message", data);
    			event.target.value = "";
    		}
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			div = $$value;
    			$$invalidate(1, div);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({
    		socket,
    		username,
    		beforeUpdate,
    		afterUpdate,
    		comments,
    		div,
    		autoscroll,
    		handleKeydown,
    		$socket,
    		$username
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
    		if ("comments" in $$props) $$invalidate(0, comments = $$new_props.comments);
    		if ("div" in $$props) $$invalidate(1, div = $$new_props.div);
    		if ("autoscroll" in $$props) autoscroll = $$new_props.autoscroll;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [comments, div, handleKeydown, $$props, div0_binding];
    }

    class Chat extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chat",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    // querySelectors
    const q = document.querySelector.bind(document);
    const qa = document.querySelectorAll.bind(document);

    function getMouseCoordsOnCanvas(canvas, e) {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      return { x: x, y: y };
    }

    class Point {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
    }

    class Fill {
      constructor(canvas, point, color) {
        this.ctx = canvas.getContext('2d');

        this.imageData = this.ctx.getImageData(
          0,
          0,
          this.ctx.canvas.width,
          this.ctx.canvas.height
        );

        const targetColor = this.getPixel(point);
        const fillColor = this.hexToRgba(color);

        this.fillStack = [];

        this.floodFill(point, targetColor, fillColor);
        this.fillColor();
      }

      floodFill(point, targetCol, fillCol) {
        if (this.colorMatch(targetCol, fillCol)) return;

        const currentCol = this.getPixel(point);

        if (this.colorMatch(currentCol, targetCol)) {
          this.setPixel(point, fillCol);

          // pixel right
          this.fillStack.push([
            new Point(point.x + 1, point.y),
            targetCol,
            fillCol,
          ]);

          // pixel left
          this.fillStack.push([
            new Point(point.x - 1, point.y),
            targetCol,
            fillCol,
          ]);

          // pixel down
          this.fillStack.push([
            new Point(point.x, point.y + 1),
            targetCol,
            fillCol,
          ]);

          // pixel up
          this.fillStack.push([
            new Point(point.x, point.y - 1),
            targetCol,
            fillCol,
          ]);
        }
      }

      fillColor() {
        if (this.fillStack.length > 0) {
          const range = this.fillStack.length;
          for (let i = 0; i < range; i++) {
            this.floodFill(
              this.fillStack[i][0],
              this.fillStack[i][1],
              this.fillStack[i][2]
            );
          }

          this.fillStack.splice(0, range);

          this.fillColor();
        } else {
          this.ctx.putImageData(this.imageData, 0, 0);
          this.fillStack = [];
        }
      }

      getPixel(point) {
        if (
          point.x < 0 ||
          point.y < 0 ||
          point.x > this.imageData.width ||
          point.y > this.imageData.height
        ) {
          return [-1, -1, -1, -1];
        } else {
          const offset = (point.y * this.imageData.width + point.x) * 4;

          return [
            this.imageData.data[offset],
            this.imageData.data[offset + 1],
            this.imageData.data[offset + 2],
            this.imageData.data[offset + 3],
          ];
        }
      }

      setPixel(point, fillCol) {
        const offset = (point.y * this.imageData.width + point.x) * 4;

        this.imageData.data[offset] = fillCol[0]; // red
        this.imageData.data[offset + 1] = fillCol[1]; // green
        this.imageData.data[offset + 2] = fillCol[2]; // blue
        this.imageData.data[offset + 3] = fillCol[3]; // alpha
      }

      colorMatch(a, b) {
        return a[0] == b[0] && a[1] == b[1] && a[3] == b[3] && a[3] == b[3];
      }

      hexToRgba(hex) {
        const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
        return [r, g, b, 255];
      }
    }

    // limit imput rate to requestAnimationFrame (should be same as screen refresh rate)
    // might want to lock this to ~90 inputs per second
    let drawFrame = true;
    function animate() {
      drawFrame = true;

      window.requestAnimationFrame(animate);
    }

    window.requestAnimationFrame(animate);

    class Paint {
      constructor(canvasId) {
        this.canvas = q(canvasId);
        this.ctx = canvas.getContext('2d');

        this.undoStack = [];
        this.undoLimit = 3; // max 3 undo moves
      }

      set activeTool(tool) {
        this.tool = tool;
      }

      set lineWidth(lineWidth) {
        // _ to prevent conflict
        this._lineWidth = lineWidth;
        this.ctx.lineWidth = this._lineWidth;
      }

      set selectColor(col) {
        this.color = col;
        this.ctx.strokeStyle = this.color;
      }

      init() {
        this.canvas.onmousedown = (e) => this.onMouseDown(e);
        // ensure right canvas scale (width and height)
        this.canvas.width = this.canvas.getBoundingClientRect().width;
        this.canvas.height = this.canvas.getBoundingClientRect().height;

        this.ctx.lineWidth = 3;
      }

      onMouseDown(e) {
        this.savedData = this.ctx.getImageData(
          0,
          0,
          this.ctx.canvas.width,
          this.ctx.canvas.height
        );

        if (this.undoStack.length >= this.undoLimit) {
          this.undoStack.shift();
        }
        this.undoStack.push(this.savedData);

        this.canvas.onmousemove = (e) => this.onMouseMove(e);
        document.onmouseup = (e) => this.onMouseUp(e);

        this.startPos = getMouseCoordsOnCanvas(this.canvas, e);

        // save array to other clients
        get_store_value(socket).emit('saveMove', true);

        let data = {};
        switch (this.tool) {
          case 'brush':
            this.ctx.beginPath();
            this.ctx.moveTo(this.startPos.x, this.startPos.y);

            // send event to server
            data = {
              x: this.startPos.x,
              y: this.startPos.y,
              lineWidth: this.lineWidth,
              color: this.color,
            };

            get_store_value(socket).emit('startStoke', data);
            break;

          case 'fill':
            new Fill(this.canvas, this.startPos, this.color);

            // send event to server
            data = {
              pos: this.startPos,
              col: this.color,
            };

            get_store_value(socket).emit('floodFill', data);
            break;

          case 'erase':
            this.ctx.clearRect(
              this.startPos.x,
              this.startPos.y,
              this._lineWidth,
              this._lineWidth
            );

            // send event to server
            data = {
              x: this.currentPos.x,
              y: this.currentPos.y,
            };

            get_store_value(socket).emit('erase', data);
            break;
        }
      }

      onMouseMove(e) {
        // Limit mouse move events
        if (!drawFrame) return;
        drawFrame = false;

        this.currentPos = getMouseCoordsOnCanvas(this.canvas, e);

        let data = {};
        switch (this.tool) {
          case 'brush':
            this.drawFreeLine();

            // send event to server
            data = {
              x: this.currentPos.x,
              y: this.currentPos.y,
            };

            get_store_value(socket).emit('drawStroke', data);
            break;
          case 'erase':
            this.ctx.clearRect(
              this.currentPos.x,
              this.currentPos.y,
              this._lineWidth,
              this._lineWidth
            );

            // send event to server
            data = {
              x: this.currentPos.x,
              y: this.currentPos.y,
              lineWidth: this.lineWidth,
              color: this.color,
            };

            get_store_value(socket).emit('erase', data);
            break;
        }
      }

      onMouseUp(e) {
        this.canvas.onmousemove = null;
        document.onmouseup = null;
      }

      drawFreeLine() {
        this.ctx.lineTo(this.currentPos.x, this.currentPos.y);
        this.ctx.stroke();
      }

      undoMove() {
        if (this.undoStack.length > 0) {
          this.ctx.putImageData(this.undoStack[this.undoStack.length - 1], 0, 0);
          this.undoStack.pop();
        }
      }
    }

    /* src\components\game\Canvas.svelte generated by Svelte v3.38.2 */
    const file$1 = "src\\components\\game\\Canvas.svelte";

    function create_fragment$1(ctx) {
    	let canvas;
    	let canvas_class_value;

    	const block = {
    		c: function create() {
    			canvas = element("canvas");
    			attr_dev(canvas, "id", "canvas");
    			attr_dev(canvas, "class", canvas_class_value = /*$$props*/ ctx[0].class);
    			add_location(canvas, file$1, 89, 0, 2240);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && canvas_class_value !== (canvas_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(canvas, "class", canvas_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $paint;
    	let $socket;
    	validate_store(paint, "paint");
    	component_subscribe($$self, paint, $$value => $$invalidate(1, $paint = $$value));
    	validate_store(socket, "socket");
    	component_subscribe($$self, socket, $$value => $$invalidate(2, $socket = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Canvas", slots, []);

    	onMount(() => {
    		const canvasId = "#canvas";
    		set_store_value(paint, $paint = new Paint(canvasId), $paint);

    		// set defealt tools
    		set_store_value(paint, $paint.activeTool = "brush", $paint);

    		set_store_value(paint, $paint.lineWidth = 3, $paint);
    		set_store_value(paint, $paint.selectColor = "#000000", $paint);

    		// initialize paint
    		$paint.init();

    		const canvasEl = document.querySelector(canvasId);
    		const ctx = canvasEl.getContext("2d");

    		// doesn't work
    		// get existing canvas
    		$socket.on("requestCanvas", data => {
    			const savedData = canvasEl.toDataURL();
    			const sendData = { id: data.id, imgData: savedData };
    			$socket.emit("sendCanvas", sendData);
    		});

    		$socket.on("recieveCanvas", data => {
    			// this triggers multiple times when more users are in a lobby for some reason but works
    			let img = new Image();

    			img.src = data.imgData;

    			img.onload = function () {
    				ctx.drawImage(img, 0, 0);
    			};
    		});

    		$socket.on("floodFill", data => {
    			new Fill(canvasEl, data.pos, data.col);
    		});

    		$socket.on("startStroke", data => {
    			ctx.lineWidth = data.lineWidth;
    			ctx.strokeStyle = data.color;
    			ctx.beginPath();
    			ctx.moveTo(data.x, data.y);
    		});

    		$socket.on("drawStroke", data => {
    			ctx.lineTo(data.x, data.y);
    			ctx.stroke();
    		});

    		let undoStack = [];
    		const undoLimit = 3;

    		$socket.on("saveMove", data => {
    			const savedData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    			if (undoStack.length >= undoLimit) {
    				undoStack.shift();
    			}

    			undoStack.push(savedData);
    		});

    		$socket.on("undoMove", data => {
    			if (undoStack) {
    				ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
    				undoStack.pop();
    			}
    		});

    		$socket.on("erase", data => {
    			ctx.clearRect(data.x, data.y, lineWidth, lineWidth);
    		});
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		q,
    		qa,
    		Paint,
    		Fill,
    		socket,
    		paint,
    		$paint,
    		$socket
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Canvas extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Canvas",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\components\icons\Pencil.svelte generated by Svelte v3.38.2 */

    const file$2 = "src\\components\\icons\\Pencil.svelte";

    function create_fragment$2(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$2, 6, 2, 124);
    			attr_dev(path1, "d", "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z");
    			add_location(path1, file$2, 7, 2, 166);
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Pencil", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Pencil extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Pencil",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\icons\Erase.svelte generated by Svelte v3.38.2 */

    const file$3 = "src\\components\\icons\\Erase.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M23.7231 7.14129L16.8587 0.276966C16.4894 -0.0922875 15.8907 -0.0923568 15.5214 0.276966L4.85934 10.9391L13.0609 19.1407L23.7231 8.47859C24.0923 8.10941 24.0923 7.51068 23.7231 7.14129Z");
    			add_location(path0, file$3, 6, 2, 124);
    			attr_dev(path1, "d", "M3.16554 12.6328L0.276992 15.5214C-0.0923308 15.8906 -0.0923308 16.4893 0.276992 16.8585L7.14138 23.7231C7.51064 24.0923 8.10937 24.0921 8.47862 23.7231L11.3671 20.8345L3.16554 12.6328Z");
    			add_location(path1, file$3, 9, 2, 334);
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Erase", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Erase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Erase",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\icons\Undo.svelte generated by Svelte v3.38.2 */

    const file$4 = "src\\components\\icons\\Undo.svelte";

    function create_fragment$4(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$4, 6, 2, 124);
    			attr_dev(path1, "d", "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z");
    			add_location(path1, file$4, 7, 2, 166);
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$4, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Undo", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Undo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Undo",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\icons\Bucket.svelte generated by Svelte v3.38.2 */

    const file$5 = "src\\components\\icons\\Bucket.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let path;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M22.3208 10.8681V9.38393H20.0487L13.1788 2.51389L13.7968 1.89598L12.7473 0.846466L3.81651 9.77724C3.28923 9.75161 2.55318 9.87856 1.87986 10.4291C0.319004 11.7051 -0.27427 14.6481 0.116464 19.176L1.5951 19.0485C1.27392 15.3272 1.69612 13.4008 2.19668 12.4048L2.74237 12.9505L3.36038 12.3325L14.1816 23.1536L24 13.3353L21.5329 10.8682H22.3208V10.8681ZM21.9011 13.3352L14.1816 21.0547L4.40988 11.283L12.1294 3.5635L17.9499 9.38403H13.4508C13.3434 9.08542 13.1728 8.80471 12.9339 8.56586C12.5134 8.14544 11.9543 7.91381 11.3597 7.91391C10.765 7.91391 10.206 8.14544 9.78547 8.56586C8.91742 9.4339 8.91742 10.8462 9.78547 11.7143C10.206 12.1347 10.765 12.3663 11.3597 12.3663C11.9543 12.3663 12.5134 12.1347 12.934 11.7142C13.1802 11.4679 13.354 11.1771 13.4606 10.8681L19.4341 10.868L21.9011 13.3352ZM11.8846 10.6648C11.7444 10.805 11.558 10.8822 11.3598 10.8822C11.1616 10.8822 10.9752 10.805 10.8351 10.6648C10.5458 10.3755 10.5458 9.90468 10.8351 9.61547C10.9753 9.47526 11.1616 9.39818 11.3598 9.39818C11.558 9.39818 11.7444 9.47526 11.8845 9.61537C12.1737 9.90478 12.1737 10.3755 11.8846 10.6648Z");
    			add_location(path, file$5, 6, 2, 124);
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Bucket", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Bucket extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Bucket",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\components\icons\Delete.svelte generated by Svelte v3.38.2 */

    const file$6 = "src\\components\\icons\\Delete.svelte";

    function create_fragment$6(ctx) {
    	let svg;
    	let path0;
    	let path1;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M0 0h24v24H0z");
    			attr_dev(path0, "fill", "none");
    			add_location(path0, file$6, 6, 2, 124);
    			attr_dev(path1, "d", "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z");
    			add_location(path1, file$6, 7, 2, 166);
    			attr_dev(svg, "class", svg_class_value = /*$$props*/ ctx[0].class);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "24");
    			attr_dev(svg, "height", "24");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			add_location(svg, file$6, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && svg_class_value !== (svg_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Delete", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Delete extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Delete",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\game\CanvasTools.svelte generated by Svelte v3.38.2 */
    const file$7 = "src\\components\\game\\CanvasTools.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	return child_ctx;
    }

    // (90:4) {#each brushColors as color}
    function create_each_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[7](/*color*/ ctx[17]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "data-brushcolor", /*color*/ ctx[17]);
    			attr_dev(button, "style", `background-color: ${/*color*/ ctx[17]}`);
    			attr_dev(button, "class", "svelte-213hft");
    			add_location(button, file$7, 90, 6, 1863);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(90:4) {#each brushColors as color}",
    		ctx
    	});

    	return block;
    }

    // (122:35) 
    function create_if_block_4(ctx) {
    	let delete_1;
    	let current;
    	delete_1 = new Delete({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(delete_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(delete_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(delete_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(delete_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(delete_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(122:35) ",
    		ctx
    	});

    	return block;
    }

    // (120:33) 
    function create_if_block_3(ctx) {
    	let bucket;
    	let current;
    	bucket = new Bucket({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(bucket.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bucket, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bucket.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bucket.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bucket, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(120:33) ",
    		ctx
    	});

    	return block;
    }

    // (118:33) 
    function create_if_block_2(ctx) {
    	let undo;
    	let current;
    	undo = new Undo({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(undo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(undo, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(undo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(undo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(undo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(118:33) ",
    		ctx
    	});

    	return block;
    }

    // (116:34) 
    function create_if_block_1(ctx) {
    	let erase;
    	let current;
    	erase = new Erase({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(erase.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(erase, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(erase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(erase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(erase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(116:34) ",
    		ctx
    	});

    	return block;
    }

    // (114:8) {#if tool == 'brush'}
    function create_if_block(ctx) {
    	let pencil;
    	let current;
    	pencil = new Pencil({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(pencil.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pencil, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pencil.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pencil.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pencil, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(114:8) {#if tool == 'brush'}",
    		ctx
    	});

    	return block;
    }

    // (103:4) {#each tools as tool}
    function create_each_block_1(ctx) {
    	let button;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	const if_block_creators = [
    		create_if_block,
    		create_if_block_1,
    		create_if_block_2,
    		create_if_block_3,
    		create_if_block_4
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*tool*/ ctx[14] == "brush") return 0;
    		if (/*tool*/ ctx[14] == "erase") return 1;
    		if (/*tool*/ ctx[14] == "undo") return 2;
    		if (/*tool*/ ctx[14] == "fill") return 3;
    		if (/*tool*/ ctx[14] == "delete") return 4;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[8](/*tool*/ ctx[14]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(button, "data-tool", /*tool*/ ctx[14]);
    			attr_dev(button, "class", "svelte-213hft");
    			add_location(button, file$7, 103, 6, 2158);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(button, null);
    			}

    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(103:4) {#each tools as tool}",
    		ctx
    	});

    	return block;
    }

    // (131:4) {#each brushSizes as size}
    function create_each_block$1(ctx) {
    	let button;
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[9](/*size*/ ctx[11]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			div = element("div");
    			t = space();
    			attr_dev(div, "style", `width: ${/*size*/ ctx[11]}px; height: ${/*size*/ ctx[11]}px`);
    			attr_dev(div, "class", "svelte-213hft");
    			add_location(div, file$7, 138, 8, 3022);
    			attr_dev(button, "brushsize", /*size*/ ctx[11]);
    			attr_dev(button, "class", "svelte-213hft");
    			add_location(button, file$7, 131, 6, 2864);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, div);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(131:4) {#each brushSizes as size}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let section;
    	let div0;
    	let div0_style_value;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let div3;
    	let section_class_value;
    	let current;
    	let each_value_2 = /*brushColors*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = /*tools*/ ctx[5];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*brushSizes*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "tools__colorDisplay svelte-213hft");
    			attr_dev(div0, "style", div0_style_value = `background-color: ${/*currentCol*/ ctx[1]}`);
    			add_location(div0, file$7, 86, 2, 1711);
    			attr_dev(div1, "class", "tools__colors svelte-213hft");
    			add_location(div1, file$7, 88, 2, 1794);
    			attr_dev(div2, "class", "tools__tools svelte-213hft");
    			add_location(div2, file$7, 101, 2, 2097);
    			attr_dev(div3, "class", "tools__size svelte-213hft");
    			add_location(div3, file$7, 129, 2, 2799);
    			attr_dev(section, "class", section_class_value = "" + (null_to_empty(`${/*$$props*/ ctx[6].class} tools`) + " svelte-213hft"));
    			add_location(section, file$7, 85, 0, 1665);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(section, t0);
    			append_dev(section, div1);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(div1, null);
    			}

    			append_dev(section, t1);
    			append_dev(section, div2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(div2, null);
    			}

    			append_dev(section, t2);
    			append_dev(section, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*currentCol*/ 2 && div0_style_value !== (div0_style_value = `background-color: ${/*currentCol*/ ctx[1]}`)) {
    				attr_dev(div0, "style", div0_style_value);
    			}

    			if (dirty & /*brushColors, currentCol, $paint*/ 14) {
    				each_value_2 = /*brushColors*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*tools, $paint*/ 36) {
    				each_value_1 = /*tools*/ ctx[5];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*brushSizes, currentSize, $paint*/ 21) {
    				each_value = /*brushSizes*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*$$props*/ 64 && section_class_value !== (section_class_value = "" + (null_to_empty(`${/*$$props*/ ctx[6].class} tools`) + " svelte-213hft"))) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let currentCol;
    	let $paint;
    	validate_store(paint, "paint");
    	component_subscribe($$self, paint, $$value => $$invalidate(2, $paint = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CanvasTools", slots, []);

    	const brushColors = [
    		"#FFFFFF",
    		"#C1C1C1",
    		"#EF130B",
    		"#FF7100",
    		"#FFE400",
    		"#00CC00",
    		"#00B2FF",
    		"#231FD3",
    		"#A300BA",
    		"#D37CAA",
    		"#A0522D",
    		"#000000",
    		"#4C4C4C",
    		"#740B07",
    		"#C23800",
    		"#E8A200",
    		"#005510",
    		"#00569E",
    		"#0E0865",
    		"#550069",
    		"#A75574",
    		"#63300D"
    	];

    	const brushSizes = [3, 5, 10, 15, 20];
    	const tools = ["brush", "erase", "undo", "fill", "delete"];
    	let currentTool = tools[0];
    	let currentSize = brushSizes[0];

    	const click_handler = color => {
    		$$invalidate(1, currentCol = color);
    		set_store_value(paint, $paint.selectColor = color, $paint);
    	};

    	const click_handler_1 = tool => {
    		if (tool == "undo") {
    			$paint.undoMove();
    			return;
    		}

    		set_store_value(paint, $paint.activeTool = tool, $paint);
    	};

    	const click_handler_2 = size => {
    		$$invalidate(0, currentSize = size);
    		set_store_value(paint, $paint.lineWidth = size, $paint);
    	};

    	$$self.$$set = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({
    		Pencil,
    		Erase,
    		Undo,
    		Bucket,
    		Delete,
    		paint,
    		brushColors,
    		brushSizes,
    		tools,
    		currentTool,
    		currentSize,
    		currentCol,
    		$paint
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
    		if ("currentTool" in $$props) currentTool = $$new_props.currentTool;
    		if ("currentSize" in $$props) $$invalidate(0, currentSize = $$new_props.currentSize);
    		if ("currentCol" in $$props) $$invalidate(1, currentCol = $$new_props.currentCol);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(1, currentCol = brushColors[11]);
    	$$props = exclude_internal_props($$props);

    	return [
    		currentSize,
    		currentCol,
    		$paint,
    		brushColors,
    		brushSizes,
    		tools,
    		$$props,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class CanvasTools extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CanvasTools",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\components\game\GameHeader.svelte generated by Svelte v3.38.2 */

    const file$8 = "src\\components\\game\\GameHeader.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let p0;
    	let t1;
    	let p1;
    	let t3;
    	let p2;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			p0.textContent = "null";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "round 2/3";
    			t3 = space();
    			p2 = element("p");
    			p2.textContent = "Waiting for player";
    			attr_dev(p0, "class", "seconds");
    			add_location(p0, file$8, 10, 2, 171);
    			attr_dev(p1, "class", "round");
    			add_location(p1, file$8, 11, 2, 202);
    			attr_dev(p2, "class", "word");
    			add_location(p2, file$8, 12, 2, 236);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(`${/*$$props*/ ctx[0].class} header`) + " svelte-ke2lah"));
    			add_location(div, file$8, 9, 0, 128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(div, t3);
    			append_dev(div, p2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(`${/*$$props*/ ctx[0].class} header`) + " svelte-ke2lah"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("GameHeader", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class GameHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameHeader",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\game\GamePlayers.svelte generated by Svelte v3.38.2 */
    const file$9 = "src\\components\\game\\GamePlayers.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (37:4) {#each $users as user, i}
    function create_each_block$2(ctx) {
    	let li;
    	let p0;
    	let t0_value = `#${/*i*/ ctx[4] + 1}` + "";
    	let t0;
    	let t1;
    	let div;
    	let p1;
    	let t2_value = /*user*/ ctx[2].username + "";
    	let t2;
    	let t3;
    	let p2;
    	let t4;
    	let t5_value = /*user*/ ctx[2].score + "";
    	let t5;
    	let t6;
    	let img;
    	let img_src_value;
    	let t7;

    	const block = {
    		c: function create() {
    			li = element("li");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			p2 = element("p");
    			t4 = text("Score: ");
    			t5 = text(t5_value);
    			t6 = space();
    			img = element("img");
    			t7 = space();
    			attr_dev(p0, "class", "svelte-1wle780");
    			add_location(p0, file$9, 38, 8, 734);
    			attr_dev(p1, "class", "svelte-1wle780");
    			add_location(p1, file$9, 40, 10, 781);
    			attr_dev(p2, "class", "svelte-1wle780");
    			add_location(p2, file$9, 41, 10, 815);
    			attr_dev(div, "class", "svelte-1wle780");
    			add_location(div, file$9, 39, 8, 764);
    			if (img.src !== (img_src_value = `./img/userImg/user${/*user*/ ctx[2].image}.png`)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-1wle780");
    			add_location(img, file$9, 43, 8, 867);
    			attr_dev(li, "class", "userList__item svelte-1wle780");
    			add_location(li, file$9, 37, 6, 697);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, p0);
    			append_dev(p0, t0);
    			append_dev(li, t1);
    			append_dev(li, div);
    			append_dev(div, p1);
    			append_dev(p1, t2);
    			append_dev(div, t3);
    			append_dev(div, p2);
    			append_dev(p2, t4);
    			append_dev(p2, t5);
    			append_dev(li, t6);
    			append_dev(li, img);
    			append_dev(li, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$users*/ 1 && t2_value !== (t2_value = /*user*/ ctx[2].username + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*$users*/ 1 && t5_value !== (t5_value = /*user*/ ctx[2].score + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*$users*/ 1 && img.src !== (img_src_value = `./img/userImg/user${/*user*/ ctx[2].image}.png`)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(37:4) {#each $users as user, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let ol;
    	let div_class_value;
    	let each_value = /*$users*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ol = element("ol");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ol, "class", "userList svelte-1wle780");
    			add_location(ol, file$9, 35, 2, 637);
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*$$props*/ ctx[1].class) + " svelte-1wle780"));
    			add_location(div, file$9, 34, 0, 606);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ol);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ol, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$users*/ 1) {
    				each_value = /*$users*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ol, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*$$props*/ 2 && div_class_value !== (div_class_value = "" + (null_to_empty(/*$$props*/ ctx[1].class) + " svelte-1wle780"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $users;
    	validate_store(users, "users");
    	component_subscribe($$self, users, $$value => $$invalidate(0, $users = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("GamePlayers", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ users, $users });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$users, $$props];
    }

    class GamePlayers extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GamePlayers",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\Game.svelte generated by Svelte v3.38.2 */
    const file$a = "src\\components\\Game.svelte";

    function create_fragment$a(ctx) {
    	let main;
    	let gameheader;
    	let t0;
    	let gameplayers;
    	let t1;
    	let canvas;
    	let t2;
    	let chat;
    	let t3;
    	let canvastools;
    	let current;

    	gameheader = new GameHeader({
    			props: { class: "game__header" },
    			$$inline: true
    		});

    	gameplayers = new GamePlayers({
    			props: { class: "game__players" },
    			$$inline: true
    		});

    	canvas = new Canvas({
    			props: { class: "game__canvas" },
    			$$inline: true
    		});

    	chat = new Chat({
    			props: { class: "game__chat" },
    			$$inline: true
    		});

    	canvastools = new CanvasTools({
    			props: { class: "game__tools" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(gameheader.$$.fragment);
    			t0 = space();
    			create_component(gameplayers.$$.fragment);
    			t1 = space();
    			create_component(canvas.$$.fragment);
    			t2 = space();
    			create_component(chat.$$.fragment);
    			t3 = space();
    			create_component(canvastools.$$.fragment);
    			attr_dev(main, "class", "grid");
    			add_location(main, file$a, 8, 0, 272);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(gameheader, main, null);
    			append_dev(main, t0);
    			mount_component(gameplayers, main, null);
    			append_dev(main, t1);
    			mount_component(canvas, main, null);
    			append_dev(main, t2);
    			mount_component(chat, main, null);
    			append_dev(main, t3);
    			mount_component(canvastools, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gameheader.$$.fragment, local);
    			transition_in(gameplayers.$$.fragment, local);
    			transition_in(canvas.$$.fragment, local);
    			transition_in(chat.$$.fragment, local);
    			transition_in(canvastools.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gameheader.$$.fragment, local);
    			transition_out(gameplayers.$$.fragment, local);
    			transition_out(canvas.$$.fragment, local);
    			transition_out(chat.$$.fragment, local);
    			transition_out(canvastools.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(gameheader);
    			destroy_component(gameplayers);
    			destroy_component(canvas);
    			destroy_component(chat);
    			destroy_component(canvastools);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Game", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Game> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Chat,
    		Canvas,
    		CanvasTools,
    		GameHeader,
    		GamePlayers
    	});

    	return [];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\lobby\lobbySettings.svelte generated by Svelte v3.38.2 */
    const file$b = "src\\components\\lobby\\lobbySettings.svelte";

    function create_fragment$b(ctx) {
    	let div5;
    	let form;
    	let div0;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div1;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let div2;
    	let label2;
    	let t7;
    	let textarea;
    	let t8;
    	let div3;
    	let input2;
    	let t9;
    	let label3;
    	let t11;
    	let button0;
    	let t13;
    	let h3;
    	let t15;
    	let div4;
    	let input3;
    	let t16;
    	let button1;
    	let div5_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			form = element("form");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Rounds";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Draw Time";
    			t4 = space();
    			input1 = element("input");
    			t5 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Custom Words";
    			t7 = space();
    			textarea = element("textarea");
    			t8 = space();
    			div3 = element("div");
    			input2 = element("input");
    			t9 = space();
    			label3 = element("label");
    			label3.textContent = "Only use custom words";
    			t11 = space();
    			button0 = element("button");
    			button0.textContent = "Start Game";
    			t13 = space();
    			h3 = element("h3");
    			h3.textContent = "Room code:";
    			t15 = space();
    			div4 = element("div");
    			input3 = element("input");
    			t16 = space();
    			button1 = element("button");
    			button1.textContent = "Copy";
    			attr_dev(label0, "for", "rounds");
    			add_location(label0, file$b, 52, 6, 1382);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "name", "rounds");
    			attr_dev(input0, "id", "rounds");
    			input0.value = "3";
    			attr_dev(input0, "min", "1");
    			attr_dev(input0, "max", "25");
    			attr_dev(input0, "maxlength", "3");
    			add_location(input0, file$b, 54, 6, 1428);
    			add_location(div0, file$b, 51, 4, 1369);
    			attr_dev(label1, "for", "drawTime");
    			add_location(label1, file$b, 66, 6, 1621);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "name", "drawTime");
    			attr_dev(input1, "id", "drawTime");
    			input1.value = "30";
    			attr_dev(input1, "min", "1");
    			attr_dev(input1, "max", "120");
    			attr_dev(input1, "maxlength", "3");
    			add_location(input1, file$b, 67, 6, 1669);
    			add_location(div1, file$b, 65, 4, 1608);
    			attr_dev(label2, "for", "customWords");
    			add_location(label2, file$b, 85, 6, 2086);
    			attr_dev(textarea, "name", "customWords");
    			attr_dev(textarea, "cols", "30");
    			attr_dev(textarea, "rows", "10");
    			attr_dev(textarea, "placeholder", "Type your custom words here separated by commas\r\n      ");
    			add_location(textarea, file$b, 86, 6, 2139);
    			attr_dev(div2, "class", "customWords");
    			add_location(div2, file$b, 84, 4, 2053);
    			attr_dev(input2, "class", "checkbox");
    			attr_dev(input2, "name", "customWordsOnly");
    			attr_dev(input2, "type", "checkbox");
    			attr_dev(input2, "id", "customWordsOnly");
    			add_location(input2, file$b, 96, 6, 2361);
    			attr_dev(label3, "for", "customWordsOnly");
    			add_location(label3, file$b, 102, 6, 2498);
    			attr_dev(div3, "class", "customWordsCheck");
    			add_location(div3, file$b, 95, 4, 2323);
    			attr_dev(button0, "type", "submit");
    			attr_dev(button0, "class", "startGame");
    			add_location(button0, file$b, 105, 4, 2576);
    			attr_dev(form, "action", "");
    			add_location(form, file$b, 50, 2, 1347);
    			add_location(h3, file$b, 110, 2, 2687);
    			attr_dev(input3, "class", "roomCode__Text");
    			input3.value = /*roomId*/ ctx[0];
    			attr_dev(input3, "type", "text");
    			input3.readOnly = true;
    			add_location(input3, file$b, 112, 4, 2735);
    			attr_dev(button1, "class", "button button--copyLink");
    			add_location(button1, file$b, 113, 4, 2809);
    			attr_dev(div4, "id", "roomCode");
    			add_location(div4, file$b, 111, 2, 2710);
    			attr_dev(div5, "class", div5_class_value = /*$$props*/ ctx[3].class);
    			add_location(div5, file$b, 49, 0, 1316);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, form);
    			append_dev(form, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			append_dev(form, t2);
    			append_dev(form, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t4);
    			append_dev(div1, input1);
    			append_dev(form, t5);
    			append_dev(form, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t7);
    			append_dev(div2, textarea);
    			append_dev(form, t8);
    			append_dev(form, div3);
    			append_dev(div3, input2);
    			append_dev(div3, t9);
    			append_dev(div3, label3);
    			append_dev(form, t11);
    			append_dev(form, button0);
    			append_dev(div5, t13);
    			append_dev(div5, h3);
    			append_dev(div5, t15);
    			append_dev(div5, div4);
    			append_dev(div4, input3);
    			append_dev(div4, t16);
    			append_dev(div4, button1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*gameStart*/ ctx[1], false, false, false),
    					listen_dev(button1, "click", /*copyLink*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*roomId*/ 1 && input3.value !== /*roomId*/ ctx[0]) {
    				prop_dev(input3, "value", /*roomId*/ ctx[0]);
    			}

    			if (dirty & /*$$props*/ 8 && div5_class_value !== (div5_class_value = /*$$props*/ ctx[3].class)) {
    				attr_dev(div5, "class", div5_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $gameState;
    	validate_store(gameState, "gameState");
    	component_subscribe($$self, gameState, $$value => $$invalidate(4, $gameState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LobbySettings", slots, []);
    	let { roomId } = $$props;

    	// $: roomId = '';
    	// $socket.on('roomValue', (data) => {
    	//   roomId = `${window.location.origin}/?${data}`;
    	// });
    	function gameStart(e) {
    		e.preventDefault();
    		set_store_value(gameState, $gameState = "game", $gameState);
    	}

    	function copyLink() {
    		// copy game room url
    		const text = roomId;

    		// Create a fake textarea
    		const textAreaEle = document.createElement("textarea");

    		// Reset styles
    		textAreaEle.style.border = "0";

    		textAreaEle.style.padding = "0";
    		textAreaEle.style.margin = "0";

    		// Set the absolute position
    		// User won't see the element
    		textAreaEle.style.position = "absolute";

    		textAreaEle.style.left = "-9999px";
    		textAreaEle.style.top = `0px`;

    		// Set the value
    		textAreaEle.value = text;

    		// Append the textarea to body
    		document.body.appendChild(textAreaEle);

    		// Focus and select the text
    		textAreaEle.focus();

    		textAreaEle.select();

    		// Execute the "copy" command
    		try {
    			document.execCommand("copy");
    		} catch(err) {
    			
    		} finally {
    			// Remove the textarea
    			document.body.removeChild(textAreaEle); // Unable to copy
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("roomId" in $$new_props) $$invalidate(0, roomId = $$new_props.roomId);
    	};

    	$$self.$capture_state = () => ({
    		q,
    		socket,
    		gameState,
    		roomId,
    		gameStart,
    		copyLink,
    		$gameState
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
    		if ("roomId" in $$props) $$invalidate(0, roomId = $$new_props.roomId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [roomId, gameStart, copyLink, $$props];
    }

    class LobbySettings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { roomId: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LobbySettings",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*roomId*/ ctx[0] === undefined && !("roomId" in props)) {
    			console.warn("<LobbySettings> was created without expected prop 'roomId'");
    		}
    	}

    	get roomId() {
    		throw new Error("<LobbySettings>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set roomId(value) {
    		throw new Error("<LobbySettings>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\lobby\players.svelte generated by Svelte v3.38.2 */

    const file$c = "src\\components\\lobby\\players.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text("Players");
    			attr_dev(div, "class", div_class_value = /*$$props*/ ctx[0].class);
    			add_location(div, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$props*/ 1 && div_class_value !== (div_class_value = /*$$props*/ ctx[0].class)) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Players", slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class Players extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Players",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\Lobby.svelte generated by Svelte v3.38.2 */
    const file$d = "src\\components\\Lobby.svelte";

    function create_fragment$d(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let settings;
    	let t2;
    	let players;
    	let t3;
    	let chat;
    	let current;

    	settings = new LobbySettings({
    			props: {
    				roomId: /*roomId*/ ctx[0],
    				class: "lobby__settings"
    			},
    			$$inline: true
    		});

    	players = new Players({
    			props: { class: "lobby__players" },
    			$$inline: true
    		});

    	chat = new Chat({
    			props: { class: "lobby__chat" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Lobby";
    			t1 = space();
    			create_component(settings.$$.fragment);
    			t2 = space();
    			create_component(players.$$.fragment);
    			t3 = space();
    			create_component(chat.$$.fragment);
    			attr_dev(h1, "class", "svelte-132hqu5");
    			add_location(h1, file$d, 9, 2, 212);
    			attr_dev(main, "class", "grid svelte-132hqu5");
    			add_location(main, file$d, 8, 0, 189);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			mount_component(settings, main, null);
    			append_dev(main, t2);
    			mount_component(players, main, null);
    			append_dev(main, t3);
    			mount_component(chat, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const settings_changes = {};
    			if (dirty & /*roomId*/ 1) settings_changes.roomId = /*roomId*/ ctx[0];
    			settings.$set(settings_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings.$$.fragment, local);
    			transition_in(players.$$.fragment, local);
    			transition_in(chat.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings.$$.fragment, local);
    			transition_out(players.$$.fragment, local);
    			transition_out(chat.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(settings);
    			destroy_component(players);
    			destroy_component(chat);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Lobby", slots, []);
    	let { roomId } = $$props;
    	const writable_props = ["roomId"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Lobby> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("roomId" in $$props) $$invalidate(0, roomId = $$props.roomId);
    	};

    	$$self.$capture_state = () => ({ Settings: LobbySettings, Players, Chat, roomId });

    	$$self.$inject_state = $$props => {
    		if ("roomId" in $$props) $$invalidate(0, roomId = $$props.roomId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [roomId];
    }

    class Lobby extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { roomId: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lobby",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*roomId*/ ctx[0] === undefined && !("roomId" in props)) {
    			console.warn("<Lobby> was created without expected prop 'roomId'");
    		}
    	}

    	get roomId() {
    		throw new Error("<Lobby>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set roomId(value) {
    		throw new Error("<Lobby>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\atoms\SelectInput.svelte generated by Svelte v3.38.2 */

    const file$e = "src\\components\\atoms\\SelectInput.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (8:2) {#each options as option}
    function create_each_block$3(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[3].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*option*/ ctx[3].value;
    			option.value = option.__value;
    			add_location(option, file$e, 8, 4, 208);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 2 && t_value !== (t_value = /*option*/ ctx[3].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*options*/ 2 && option_value_value !== (option_value_value = /*option*/ ctx[3].value)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(8:2) {#each options as option}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let select;
    	let mounted;
    	let dispose;
    	let each_value = /*options*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			select = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "class", "svelte-yfnwxf");
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[2].call(select));
    			add_location(select, file$e, 6, 0, 154);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*value*/ ctx[0]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[2]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*options*/ 2) {
    				each_value = /*options*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*value, options*/ 3) {
    				select_option(select, /*value*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("SelectInput", slots, []);
    	let { value = "" } = $$props;
    	let { options = [{ name: "Option 1", value: "option1" }] } = $$props;
    	const writable_props = ["value", "options"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SelectInput> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(0, value);
    		$$invalidate(1, options);
    	}

    	$$self.$$set = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("options" in $$props) $$invalidate(1, options = $$props.options);
    	};

    	$$self.$capture_state = () => ({ value, options });

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("options" in $$props) $$invalidate(1, options = $$props.options);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, options, select_change_handler];
    }

    class SelectInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { value: 0, options: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SelectInput",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get value() {
    		throw new Error("<SelectInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<SelectInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get options() {
    		throw new Error("<SelectInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SelectInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\atoms\TextInput.svelte generated by Svelte v3.38.2 */

    const file$f = "src\\components\\atoms\\TextInput.svelte";

    // (12:2) {:else}
    function create_else_block(ctx) {
    	let input;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "id", /*name*/ ctx[1]);
    			attr_dev(input, "placeholder", /*label*/ ctx[2]);
    			attr_dev(input, "type", /*type*/ ctx[0]);
    			input.required = /*req*/ ctx[4];
    			attr_dev(input, "class", "svelte-1ix9y9s");
    			add_location(input, file$f, 12, 4, 303);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) {
    				attr_dev(input, "id", /*name*/ ctx[1]);
    			}

    			if (dirty & /*label*/ 4) {
    				attr_dev(input, "placeholder", /*label*/ ctx[2]);
    			}

    			if (dirty & /*type*/ 1) {
    				attr_dev(input, "type", /*type*/ ctx[0]);
    			}

    			if (dirty & /*req*/ 16) {
    				prop_dev(input, "required", /*req*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(12:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (10:2) {#if type == 'textarea'}
    function create_if_block$1(ctx) {
    	let textarea;

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			attr_dev(textarea, "id", /*name*/ ctx[1]);
    			attr_dev(textarea, "placeholder", /*label*/ ctx[2]);
    			attr_dev(textarea, "rows", /*rows*/ ctx[3]);
    			textarea.required = /*req*/ ctx[4];
    			attr_dev(textarea, "class", "svelte-1ix9y9s");
    			add_location(textarea, file$f, 10, 4, 222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*name*/ 2) {
    				attr_dev(textarea, "id", /*name*/ ctx[1]);
    			}

    			if (dirty & /*label*/ 4) {
    				attr_dev(textarea, "placeholder", /*label*/ ctx[2]);
    			}

    			if (dirty & /*rows*/ 8) {
    				attr_dev(textarea, "rows", /*rows*/ ctx[3]);
    			}

    			if (dirty & /*req*/ 16) {
    				prop_dev(textarea, "required", /*req*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(10:2) {#if type == 'textarea'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let t0;
    	let label_1;
    	let t1;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[0] == "textarea") return create_if_block$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t0 = space();
    			label_1 = element("label");
    			t1 = text(/*label*/ ctx[2]);
    			attr_dev(label_1, "for", /*name*/ ctx[1]);
    			attr_dev(label_1, "class", "svelte-1ix9y9s");
    			add_location(label_1, file$f, 15, 2, 379);
    			attr_dev(div, "class", "textInput svelte-1ix9y9s");
    			add_location(div, file$f, 8, 0, 165);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t0);
    			append_dev(div, label_1);
    			append_dev(label_1, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			}

    			if (dirty & /*label*/ 4) set_data_dev(t1, /*label*/ ctx[2]);

    			if (dirty & /*name*/ 2) {
    				attr_dev(label_1, "for", /*name*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TextInput", slots, []);
    	let { type = "text" } = $$props;
    	let { name = "" } = $$props;
    	let { label = "Sample text" } = $$props;
    	let { rows = 5 } = $$props;
    	let { req = false } = $$props;
    	const writable_props = ["type", "name", "label", "rows", "req"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<TextInput> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    		if ("rows" in $$props) $$invalidate(3, rows = $$props.rows);
    		if ("req" in $$props) $$invalidate(4, req = $$props.req);
    	};

    	$$self.$capture_state = () => ({ type, name, label, rows, req });

    	$$self.$inject_state = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("name" in $$props) $$invalidate(1, name = $$props.name);
    		if ("label" in $$props) $$invalidate(2, label = $$props.label);
    		if ("rows" in $$props) $$invalidate(3, rows = $$props.rows);
    		if ("req" in $$props) $$invalidate(4, req = $$props.req);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, name, label, rows, req];
    }

    class TextInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			type: 0,
    			name: 1,
    			label: 2,
    			rows: 3,
    			req: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextInput",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get type() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get req() {
    		throw new Error("<TextInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set req(value) {
    		throw new Error("<TextInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\Profile.svelte generated by Svelte v3.38.2 */
    const file$g = "src\\components\\Profile.svelte";

    function create_fragment$g(ctx) {
    	let main;
    	let h1;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let form;
    	let textinput;
    	let t3;
    	let selectinput;
    	let updating_value;
    	let t4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	textinput = new TextInput({
    			props: {
    				label: "username",
    				name: "username",
    				req: "true"
    			},
    			$$inline: true
    		});

    	function selectinput_value_binding(value) {
    		/*selectinput_value_binding*/ ctx[3](value);
    	}

    	let selectinput_props = { options: /*imgOptions*/ ctx[1] };

    	if (/*$userImg*/ ctx[0] !== void 0) {
    		selectinput_props.value = /*$userImg*/ ctx[0];
    	}

    	selectinput = new SelectInput({ props: selectinput_props, $$inline: true });
    	binding_callbacks.push(() => bind(selectinput, "value", selectinput_value_binding));

    	const block = {
    		c: function create() {
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "✏️ Draw away";
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			form = element("form");
    			create_component(textinput.$$.fragment);
    			t3 = space();
    			create_component(selectinput.$$.fragment);
    			t4 = space();
    			button = element("button");
    			button.textContent = "Start";
    			attr_dev(h1, "class", "svelte-179tnz2");
    			add_location(h1, file$g, 27, 2, 845);
    			attr_dev(img, "class", "profilePic svelte-179tnz2");
    			if (img.src !== (img_src_value = /*$userImg*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "profile");
    			add_location(img, file$g, 29, 2, 872);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-179tnz2");
    			add_location(button, file$g, 45, 4, 1390);
    			attr_dev(form, "class", "svelte-179tnz2");
    			add_location(form, file$g, 31, 2, 933);
    			attr_dev(main, "class", "svelte-179tnz2");
    			add_location(main, file$g, 26, 0, 835);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t1);
    			append_dev(main, img);
    			append_dev(main, t2);
    			append_dev(main, form);
    			mount_component(textinput, form, null);
    			append_dev(form, t3);
    			mount_component(selectinput, form, null);
    			append_dev(form, t4);
    			append_dev(form, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", /*test*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$userImg*/ 1 && img.src !== (img_src_value = /*$userImg*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			const selectinput_changes = {};

    			if (!updating_value && dirty & /*$userImg*/ 1) {
    				updating_value = true;
    				selectinput_changes.value = /*$userImg*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			selectinput.$set(selectinput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textinput.$$.fragment, local);
    			transition_in(selectinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textinput.$$.fragment, local);
    			transition_out(selectinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(textinput);
    			destroy_component(selectinput);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $gameState;
    	let $username;
    	let $userImg;
    	validate_store(gameState, "gameState");
    	component_subscribe($$self, gameState, $$value => $$invalidate(4, $gameState = $$value));
    	validate_store(username, "username");
    	component_subscribe($$self, username, $$value => $$invalidate(5, $username = $$value));
    	validate_store(userImg, "userImg");
    	component_subscribe($$self, userImg, $$value => $$invalidate(0, $userImg = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Profile", slots, []);
    	let name = "";

    	let imgOptions = [
    		{
    			name: "moffel 1",
    			value: "img/userImg/user0.png"
    		},
    		{
    			name: "moffel 2",
    			value: "img/userImg/user1.png"
    		},
    		{
    			name: "moffel 3",
    			value: "img/userImg/user2.png"
    		},
    		{
    			name: "moffel 4",
    			value: "img/userImg/user3.png"
    		},
    		{
    			name: "moffel 5",
    			value: "img/userImg/user4.png"
    		},
    		{
    			name: "moffel 6",
    			value: "img/userImg/user5.png"
    		},
    		{
    			name: "moffel 7",
    			value: "img/userImg/user6.png"
    		}
    	];

    	function test(e) {
    		e.preventDefault();

    		// add form validity checks
    		set_store_value(gameState, $gameState = "lobby", $gameState);

    		// trim this value if needed
    		set_store_value(username, $username = name.value, $username);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	function selectinput_value_binding(value) {
    		$userImg = value;
    		userImg.set($userImg);
    	}

    	$$self.$capture_state = () => ({
    		gameState,
    		username,
    		userImg,
    		SelectInput,
    		TextInput,
    		name,
    		imgOptions,
    		test,
    		$gameState,
    		$username,
    		$userImg
    	});

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) name = $$props.name;
    		if ("imgOptions" in $$props) $$invalidate(1, imgOptions = $$props.imgOptions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$userImg, imgOptions, test, selectinput_value_binding];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.38.2 */

    const { console: console_1 } = globals;
    const file$h = "src\\App.svelte";

    // (60:31) 
    function create_if_block_2$1(ctx) {
    	let game;
    	let current;
    	game = new Game({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(game.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(game, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(game, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(60:31) ",
    		ctx
    	});

    	return block;
    }

    // (57:32) 
    function create_if_block_1$1(ctx) {
    	let lobby;
    	let current;
    	lobby = new Lobby({ props: { roomId }, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(lobby.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(lobby, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lobby.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lobby.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(lobby, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(57:32) ",
    		ctx
    	});

    	return block;
    }

    // (54:0) {#if $gameState == 'profile' || $gameState == ''}
    function create_if_block$2(ctx) {
    	let profile;
    	let current;
    	profile = new Profile({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(profile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(profile, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(profile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(profile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(profile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(54:0) {#if $gameState == 'profile' || $gameState == ''}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let html;
    	let t;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$gameState*/ ctx[0] == "profile" || /*$gameState*/ ctx[0] == "") return 0;
    		if (/*$gameState*/ ctx[0] == "lobby") return 1;
    		if (/*$gameState*/ ctx[0] == "game") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			html = element("html");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			document.title = "Drawing Game";
    			attr_dev(html, "lang", "en");
    			add_location(html, file$h, 48, 2, 1046);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, html);
    			insert_dev(target, t, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(html);
    			if (detaching) detach_dev(t);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $gameState;
    	validate_store(gameState, "gameState");
    	component_subscribe($$self, gameState, $$value => $$invalidate(0, $gameState = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);

    	onMount(() => {
    		console.log("🚀");
    		const searchRoom = window.location.search.slice(1);
    	}); // $socket.emit('joinRoom', searchRoom);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		users,
    		Game,
    		Lobby,
    		Profile,
    		socket,
    		gameState,
    		$gameState
    	});

    	return [$gameState];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {},
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
