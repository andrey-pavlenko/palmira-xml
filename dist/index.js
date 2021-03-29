var __defProp = Object.defineProperty;
var __export = (target2, all) => {
  for (var name in all)
    __defProp(target2, name, {get: all[name], enumerable: true});
};

// build/_snowpack/env.js
var env_exports = {};
__export(env_exports, {
  MODE: () => MODE,
  NODE_ENV: () => NODE_ENV,
  SSR: () => SSR
});
var MODE = "development";
var NODE_ENV = "development";
var SSR = false;

// build/_snowpack/pkg/svelte/internal.js
function noop() {
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
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target2, node) {
  target2.appendChild(node);
}
function insert(target2, node, anchor) {
  target2.insertBefore(node, anchor || null);
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
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
  return function(event) {
    event.preventDefault();
    return fn.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data) {
  data = "" + data;
  if (text2.wholeText !== data)
    text2.data = data;
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var flushing = false;
var seen_callbacks = new Set();
function flush() {
  if (flushing)
    return;
  flushing = true;
  do {
    for (let i = 0; i < dirty_components.length; i += 1) {
      const component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
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
var outroing = new Set();
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function mount_component(component, target2, anchor, customElement) {
  const {fragment, on_mount, on_destroy: on_destroy2, after_update} = component.$$;
  fragment && fragment.m(target2, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy2) {
        on_destroy2.push(...new_on_destroy);
      } else {
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
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal2, props, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    props,
    update: noop,
    not_equal: not_equal2,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(parent_component ? parent_component.$$.context : []),
    callbacks: blank_object(),
    dirty,
    skip_bound: false
  };
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal2($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
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
};

// build/dist/generate-xml.js
function generateXml(barcodes) {
  return barcodes.join("\n");
}

// build/dist/App.svelte.js
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[5] = list[i];
  child_ctx[7] = i;
  return child_ctx;
}
function create_else_block(ctx) {
  let li;
  return {
    c() {
      li = element("li");
      li.textContent = "Пока нет кодов";
    },
    m(target2, anchor) {
      insert(target2, li, anchor);
    },
    d(detaching) {
      if (detaching)
        detach(li);
    }
  };
}
function create_each_block(ctx) {
  let li;
  let code;
  let t0_value = ctx[5] + "";
  let t0;
  let t1;
  let button;
  let t3;
  let mounted;
  let dispose;
  function click_handler() {
    return ctx[4](ctx[7]);
  }
  return {
    c() {
      li = element("li");
      code = element("code");
      t0 = text(t0_value);
      t1 = space();
      button = element("button");
      button.textContent = "Удалить";
      t3 = space();
    },
    m(target2, anchor) {
      insert(target2, li, anchor);
      append(li, code);
      append(code, t0);
      append(li, t1);
      append(li, button);
      append(li, t3);
      if (!mounted) {
        dispose = listen(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && t0_value !== (t0_value = ctx[5] + ""))
        set_data(t0, t0_value);
    },
    d(detaching) {
      if (detaching)
        detach(li);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment(ctx) {
  let div;
  let form;
  let label;
  let span;
  let t1;
  let input0;
  let actionFocus_action;
  let t2;
  let input1;
  let t3;
  let ul;
  let t4;
  let button;
  let mounted;
  let dispose;
  let each_value = ctx[0];
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  let each_1_else = null;
  if (!each_value.length) {
    each_1_else = create_else_block(ctx);
  }
  return {
    c() {
      div = element("div");
      form = element("form");
      label = element("label");
      span = element("span");
      span.textContent = "Сюда попадает штрих-код:";
      t1 = space();
      input0 = element("input");
      t2 = space();
      input1 = element("input");
      t3 = space();
      ul = element("ul");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      if (each_1_else) {
        each_1_else.c();
      }
      t4 = space();
      button = element("button");
      button.textContent = "Подготовить XML";
      attr(input0, "type", "text");
      attr(input0, "name", "barcode");
      input0.required = true;
      attr(input1, "type", "submit");
      input1.value = "Добавить";
      attr(form, "class", "barcode__input");
      attr(ul, "class", "barcodes__list");
      attr(div, "class", "application");
    },
    m(target2, anchor) {
      insert(target2, div, anchor);
      append(div, form);
      append(form, label);
      append(label, span);
      append(label, t1);
      append(label, input0);
      append(form, t2);
      append(form, input1);
      append(div, t3);
      append(div, ul);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(ul, null);
      }
      if (each_1_else) {
        each_1_else.m(ul, null);
      }
      append(div, t4);
      append(div, button);
      if (!mounted) {
        dispose = [
          action_destroyer(actionFocus_action = actionFocus.call(null, input0)),
          listen(form, "submit", prevent_default(ctx[1])),
          listen(button, "click", ctx[3])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 5) {
        each_value = ctx2[0];
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(ul, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
        if (each_value.length) {
          if (each_1_else) {
            each_1_else.d(1);
            each_1_else = null;
          }
        } else if (!each_1_else) {
          each_1_else = create_else_block(ctx2);
          each_1_else.c();
          each_1_else.m(ul, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
      if (each_1_else)
        each_1_else.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function actionFocus(node) {
  node.focus();
}
function instance($$self, $$props, $$invalidate) {
  let barcodes = [];
  function handleBarcodeSubmit(event) {
    if (event.target instanceof HTMLFormElement) {
      const barcodeElement = event.target.elements.namedItem("barcode");
      if (barcodeElement != null) {
        const barcode = barcodeElement.value.trim();
        if (barcode) {
          $$invalidate(0, barcodes = [...barcodes, barcode]);
        } else {
          console.error("barcode пустой");
        }
        barcodeElement.value = "";
        barcodeElement.focus();
      } else {
        console.error("barcodeElement пустой");
      }
    }
  }
  function removeBarcode(index) {
    $$invalidate(0, barcodes = [...barcodes.slice(0, index), ...barcodes.slice(index + 1)]);
  }
  function handleGenerateXml() {
    console.info("handleGenerateXml", barcodes);
    const xml = generateXml(barcodes);
    if (xml) {
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = "data:text/plain;charset=utf-8," + encodeURIComponent(xml);
      a.download = "file.txt";
      a.click();
      document.body.removeChild(a);
    }
  }
  const click_handler = (idx) => removeBarcode(idx);
  return [barcodes, handleBarcodeSubmit, removeBarcode, handleGenerateXml, click_handler];
}
var App = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {});
  }
};
var App_svelte_default = App;

// build/dist/index.js
var import_meta = {};
import_meta.env = env_exports;
var target = document.querySelector("main");
if (target != null) {
  const app = new App_svelte_default({
    target: document.body
  });
  if (void 0) {
    (void 0).accept();
    (void 0).dispose(() => {
      app.$destroy();
    });
  }
} else {
  console.error("No target tag found");
}
//# sourceMappingURL=//dist//index.js.map
