/* =========================================================
   Thư gửi người yêu anh — 20.10
   GSAP + ScrollTrigger + Lenis + raw WebGL watercolor shader
   ========================================================= */
(() => {
  'use strict';

  // Đổi tên ở đây — "Gửi [Tên em], người phụ nữ của anh"
  const CONFIG = {
    herName: 'em',
  };

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  const isMobile = () => innerWidth < 760;
  const SVGNS = 'http://www.w3.org/2000/svg';

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  $$('[data-name]').forEach((el) => (el.textContent = CONFIG.herName));

  /* -------------------------------------------------------
     Smooth scroll
     ------------------------------------------------------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollToTarget = (target, duration = 2.4) => {
    if (lenis) lenis.scrollTo(target, { duration, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else {
      const y = typeof target === 'number' ? target : $(target).getBoundingClientRect().top + scrollY;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  };

  /* -------------------------------------------------------
     SVG symbol library
     ------------------------------------------------------- */
  function buildDefs() {
    const sakPetal = 'M0,0 C-10,-6 -22,-22 -17,-36 C-14,-44 -7,-47 -3,-44 L0,-39 L3,-44 C7,-47 14,-44 17,-36 C22,-22 10,-6 0,0Z';
    const peoPetal = 'M0,0 C-20,-4 -27,-30 -16,-42 C-9,-50 -3,-46 0,-49 C3,-46 9,-50 16,-42 C27,-30 20,-4 0,0Z';
    const radial = (id, stops) =>
      `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="46">${stops
        .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
        .join('')}</radialGradient>`;
    const linear = (id, stops) =>
      `<linearGradient id="${id}" x1=".5" y1="1" x2=".5" y2="0">${stops
        .map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`)
        .join('')}</linearGradient>`;
    const goldStops = '<stop offset="0" stop-color="#9a6f2a"/><stop offset=".35" stop-color="#e3c27a"/><stop offset=".55" stop-color="#f6e2a8"/><stop offset=".8" stop-color="#b98b3e"/><stop offset="1" stop-color="#8d6424"/>';

    let s = '<defs>';
    s += radial('gs1', [[0, '#a81d55'], [0.2, '#e0588a'], [0.5, '#f5a7c1'], [1, '#fde6ee']]);
    s += radial('gs2', [[0, '#c93a6f'], [0.22, '#ee86a8'], [0.55, '#f9cbda'], [1, '#fff4f7']]);
    s += radial('gs3', [[0, '#8e1446'], [0.2, '#d34479'], [0.55, '#f08fb1'], [1, '#fbd2df']]);
    s += linear('gp1', [[0, '#cf3f76'], [0.55, '#f29abb'], [1, '#fde5ed']]);
    s += linear('gp2', [[0, '#b02560'], [0.6, '#e76f9a'], [1, '#f8c4d5']]);
    s += linear('gp3', [[0, '#e07799'], [0.55, '#f8c1d2'], [1, '#fff1f5']]);
    s += linear('gbud', [[0, '#c2325f'], [1, '#f7a9c2']]);
    s += '<linearGradient id="gleaf" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#55762c"/><stop offset="1" stop-color="#a9c46b"/></linearGradient>';
    s += '<radialGradient id="gshade"><stop offset="0" stop-color="#7d0f3c" stop-opacity=".32"/><stop offset="1" stop-color="#7d0f3c" stop-opacity="0"/></radialGradient>';
    s += '<radialGradient id="gcenter"><stop offset="0" stop-color="#f6d27a"/><stop offset=".55" stop-color="#d98b3d"/><stop offset="1" stop-color="#8e1446"/></radialGradient>';
    s += `<linearGradient id="gGoldU" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="170" y2="120" spreadMethod="reflect">${goldStops}</linearGradient>`;
    s += `<linearGradient id="gGoldW" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="460" y2="140" spreadMethod="reflect">${goldStops}</linearGradient>`;
    s += '</defs>';

    const sym = (id, inner) => `<symbol id="${id}" viewBox="-50 -50 100 100" overflow="visible">${inner}</symbol>`;

    // cherry blossom
    const sakura = (grad) => {
      let g = '';
      for (let i = 0; i < 5; i++) {
        g += `<path d="${sakPetal}" fill="url(#${grad})" stroke="#c45a80" stroke-opacity=".2" stroke-width=".6" transform="rotate(${i * 72})"/>`;
        g += `<path d="M0,-5 L0,-30" stroke="#b33a68" stroke-opacity=".16" stroke-width=".7" transform="rotate(${i * 72})"/>`;
      }
      g += '<circle r="6" fill="url(#gcenter)"/>';
      for (let j = 0; j < 14; j++) {
        const a = (j / 14) * Math.PI * 2 + rand(-0.1, 0.1);
        const l = rand(10, 17);
        const x = (Math.cos(a) * l).toFixed(1), y = (Math.sin(a) * l).toFixed(1);
        g += `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#a3214f" stroke-width=".7"/><circle cx="${x}" cy="${y}" r="1.4" fill="#f4c35a"/>`;
      }
      return g;
    };

    // full peony / rose bloom
    const peony = (outer, inner) => {
      const rings = [[9, 1, 0, outer], [8, 0.84, 22, outer], [7, 0.66, 8, inner], [6, 0.5, 30, inner], [5, 0.34, 14, inner], [4, 0.2, 40, inner]];
      let g = '';
      rings.forEach(([n, sc, off, grad], ri) => {
        if (ri > 0) g += `<circle r="${(44 * sc).toFixed(1)}" fill="url(#gshade)"/>`;
        for (let i = 0; i < n; i++) {
          const a = off + (i * 360) / n + rand(-6, 6);
          g += `<path d="${peoPetal}" fill="url(#${grad})" stroke="#b8325f" stroke-opacity=".22" stroke-width="${(0.7 / sc).toFixed(2)}" transform="rotate(${a.toFixed(1)}) scale(${sc})"/>`;
        }
      });
      for (let i = 0; i < 9; i++) {
        const a = rand(0, Math.PI * 2), r = rand(0, 5);
        g += `<circle cx="${(Math.cos(a) * r).toFixed(1)}" cy="${(Math.sin(a) * r).toFixed(1)}" r="1.5" fill="#f3c766"/>`;
      }
      return g;
    };

    const use = (id, t) => `<use href="#${id}" x="-50" y="-50" width="100" height="100" transform="${t}"/>`;

    s += sym('sak1', sakura('gs1'));
    s += sym('sak2', sakura('gs2'));
    s += sym('sak3', sakura('gs3'));
    s += sym('peo1', peony('gp1', 'gp2'));
    s += sym('peo2', peony('gp3', 'gp1'));
    s += sym('bud',
      '<path d="M0,40 L0,18" stroke="#6b4a2a" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M0,18 C-12,6 -12,-14 0,-28 C12,-14 12,6 0,18Z" fill="url(#gbud)"/>' +
      '<path d="M0,18 C-4,4 -2,-10 2,-22" fill="none" stroke="#fde3ec" stroke-opacity=".6" stroke-width="1.2"/>' +
      '<path d="M0,20 C-9,14 -12,4 -9,-4 C-6,6 -3,12 0,20Z" fill="#6f8f3a"/>' +
      '<path d="M0,20 C9,14 12,4 9,-4 C6,6 3,12 0,20Z" fill="#5f7f34"/>');
    s += sym('leaf',
      '<path d="M0,44 C-22,14 -18,-22 0,-46 C18,-22 22,14 0,44Z" fill="url(#gleaf)"/>' +
      '<path d="M0,40 Q2,0 0,-40" fill="none" stroke="#45602a" stroke-width="1.4" stroke-opacity=".7"/>');
    s += sym('twig',
      '<path d="M-50,34 C-26,22 -6,6 18,-14 C30,-24 40,-34 50,-46" fill="none" stroke="#6b4330" stroke-width="2.8" stroke-linecap="round"/>' +
      '<path d="M-8,4 C-6,-10 -2,-20 6,-34" fill="none" stroke="#6b4330" stroke-width="1.7" stroke-linecap="round"/>' +
      '<path d="M18,-14 C26,-12 34,-6 44,-6" fill="none" stroke="#6b4330" stroke-width="1.5" stroke-linecap="round"/>' +
      use('leaf', 'translate(8,-36) rotate(24) scale(.17)') +
      use('leaf', 'translate(-26,20) rotate(-60) scale(.15)') +
      use('leaf', 'translate(32,-30) rotate(40) scale(.14)') +
      use('bud', 'translate(46,-8) rotate(84) scale(.26)') +
      use('bud', 'translate(-14,-6) rotate(-20) scale(.22)'));

    $('#svgDefs').innerHTML = s;
  }

  const SYM = {
    peo: ['peo1', 'peo2'],
    sak: ['sak1', 'sak2', 'sak3'],
    bud: ['bud'],
    leaf: ['leaf'],
    twig: ['twig'],
  };
  // responsive size in "vmin units" with sensible px clamps
  const sz = (v) => `clamp(${(v * 5).toFixed(0)}px, ${v.toFixed(2)}vmin, ${(v * 11).toFixed(0)}px)`;

  function makeFlower(type, { left, top, size, rot = rand(0, 360), z = 1, depth = rand(0.2, 1) }) {
    const d = document.createElement('div');
    d.className = 'fl';
    d.style.cssText = `left:${left};top:${top};width:${sz(size)};height:${sz(size)};z-index:${z};--sd:${rand(5, 9).toFixed(2)}s;--dl:-${rand(0, 8).toFixed(2)}s`;
    d.innerHTML = `<svg viewBox="-50 -50 100 100"><use href="#${pick(SYM[type])}" x="-50" y="-50" width="100" height="100"/></svg>`;
    d.dataset.rot = rot;
    d.dataset.depth = depth;
    gsap.set(d, { xPercent: -50, yPercent: -50, rotation: rot });
    return d;
  }
  function makeDot(left, top, px) {
    const d = document.createElement('i');
    d.className = 'dot';
    d.style.cssText = `left:${left};top:${top};width:${px}px;height:${px}px;--sd:${rand(1.8, 3.6).toFixed(2)}s;--dl:-${rand(0, 3).toFixed(2)}s`;
    return d;
  }

  /* -------------------------------------------------------
     WebGL watercolor / ink-bloom shader
     ------------------------------------------------------- */
  const U = { intro: 1, bloom: 0, fade: 0, warm: 0 };

  function initGL() {
    const canvas = $('#gl');
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'high-performance' });
    if (!gl) {
      document.documentElement.classList.add('no-gl');
      gsap.ticker.add(() => document.documentElement.style.setProperty('--bloom', (U.bloom * (1 - U.fade)).toFixed(3)));
      return;
    }

    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse;
uniform float uIntro, uBloom, uFade, uWarm;

float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p,p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y);
}
float fbm(vec2 p){
  float v = 0., a = .5; mat2 m = mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<5;i++){ v += a*noise(p); p = m*p; a *= .5; }
  return v;
}
void main(){
  float s = min(uRes.x,uRes.y);
  vec2 p = (gl_FragCoord.xy - .5*uRes)/s;
  float t = uTime*.035;
  vec2 m = (uMouse - .5)*uRes/s;
  float md = exp(-3.*length(p-m));

  // domain-warped pigment field
  vec2 q = vec2(fbm(p*1.3+vec2(0.,t)), fbm(p*1.3+vec2(5.2,1.3)-t));
  vec2 r = vec2(fbm(p*1.1+2.6*q+vec2(1.7,9.2)+t*.7+md*.18), fbm(p*1.1+2.6*q+vec2(8.3,2.8)-t*.6));
  float f = fbm(p*1.05+2.2*r);

  vec3 paper = vec3(1.,.981,.972);
  vec3 blush = vec3(.985,.86,.86);
  vec3 rose  = vec3(.95,.72,.76);
  float wash = smoothstep(.42,.85,f);
  vec3 col = mix(paper, blush, wash*.32);

  // intro: pink marble pooled toward the edges + gold veins
  float edge = smoothstep(.12,.72, length(p*vec2(.72,1.)) + (f-.5)*.8);
  float pinkAmt = clamp(edge*(.85+.5*wash),0.,1.);
  vec3 marble = mix(vec3(.975,.84,.85), vec3(.94,.69,.74), smoothstep(.38,.78,f));
  marble = mix(marble, vec3(.91,.60,.67), smoothstep(.66,.9,f)*.55);
  float bleed = smoothstep(.0,.04, abs(fract(f*5.)-.5)-.44);
  marble = mix(marble, marble*.96, bleed*edge);
  vec3 introCol = mix(col, marble, pinkAmt);
  float g1 = abs(f - .56 - .035*sin(p.x*2.+t*3.));
  float vein = 1. - smoothstep(0., .011, g1);
  vein *= smoothstep(.2,.62, fbm(p*.7+vec2(3.,7.)+t*.3)) * smoothstep(.1,.55,edge+.1);
  vec3 gold = mix(vec3(.70,.51,.22), vec3(.98,.86,.55), .5+.5*sin(p.x*6.+p.y*4.-uTime*.8));
  introCol = mix(introCol, gold, vein*.9);
  col = mix(col, introCol, uIntro);

  // ink bloom rising from the bottom
  vec2 bp = (p - vec2(0., -.95))*vec2(.72,1.);
  float d = length(bp) + (fbm(p*2.2+vec2(t*2.,-t*1.5))-.5)*.55;
  float R = uBloom*2.6;
  float mask = 1. - smoothstep(R-.35, R+.08, d);
  float depth = clamp((R-d)/(.9+R*.45), 0., 1.);
  vec3 rim   = vec3(1.,.82,.85);
  vec3 inner = vec3(.93,.58,.68);
  vec3 deep  = vec3(.80,.36,.53);
  vec3 bcol = mix(rim, inner, smoothstep(0.,.35,depth));
  bcol = mix(bcol, deep, smoothstep(.35,1.,depth)*(.55+.45*f));
  // pigment pooling: darker blooms and lighter backruns inside the wash
  float pool = fbm(p*1.6 + r*1.4 + vec2(-t, t*.5));
  bcol = mix(bcol, deep*.94, smoothstep(.55,.8,pool)*.35*depth);
  bcol = mix(bcol, inner*1.04, smoothstep(.45,.2,pool)*.3*depth);
  float pigEdge = exp(-pow((d-R+.05)/.07, 2.));
  bcol = mix(bcol, vec3(.92,.52,.64), pigEdge*.55*step(.001,uBloom));
  bcol += (f-.5)*.07;
  col = mix(col, bcol, mask*(1.-uFade)*step(.001,uBloom));

  // finale warmth
  col = mix(col, mix(col, vec3(.99,.87,.90), .55 + .2*wash), uWarm);

  col += (hash(gl_FragCoord.xy + fract(uTime)) - .5)*.018;
  gl_FragColor = vec4(col, 1.);
}`;
    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(sh));
      return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      document.documentElement.classList.add('no-gl');
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    const uRes = u('uRes'), uTime = u('uTime'), uMouse = u('uMouse');
    const uIntro = u('uIntro'), uBloom = u('uBloom'), uFade = u('uFade'), uWarm = u('uWarm');

    const resize = () => {
      const scale = Math.min(devicePixelRatio || 1, 1.5) * 0.62;
      canvas.width = Math.round(innerWidth * scale);
      canvas.height = Math.round(innerHeight * scale);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    addEventListener('resize', resize);

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    addEventListener('pointermove', (e) => {
      mouse.tx = e.clientX / innerWidth;
      mouse.ty = 1 - e.clientY / innerHeight;
    }, { passive: true });

    gsap.ticker.add((time) => {
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduced ? 0 : time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uIntro, U.intro);
      gl.uniform1f(uBloom, U.bloom);
      gl.uniform1f(uFade, U.fade);
      gl.uniform1f(uWarm, U.warm);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    });
  }

  /* -------------------------------------------------------
     Falling petals (2D canvas)
     ------------------------------------------------------- */
  const petals = (() => {
    const cv = $('#petals');
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1;
    const state = { density: 0 };
    const MAX = reduced ? 8 : isTouch ? 22 : 40;
    const pointer = { x: -999, y: -999 };

    const sprites = ['#e9688f', '#ec7fa3', '#f4a3bd', '#f7bccd'].map((c) => {
      const s = document.createElement('canvas');
      s.width = s.height = 64;
      const x = s.getContext('2d');
      x.translate(32, 32);
      const g = x.createLinearGradient(0, 28, 0, -28);
      g.addColorStop(0, c);
      g.addColorStop(1, '#fff2f6');
      x.fillStyle = g;
      x.beginPath();
      x.moveTo(0, 28);
      x.bezierCurveTo(-27, 10, -22, -22, -6, -28);
      x.lineTo(0, -21);
      x.lineTo(6, -28);
      x.bezierCurveTo(22, -22, 27, 10, 0, 28);
      x.fill();
      return s;
    });

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
    };
    resize();
    addEventListener('resize', resize);
    addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });

    const spawn = (p, scatter) => {
      p.x = rand(-20, W + 20);
      p.y = scatter ? rand(-H, H) : rand(-90, -20);
      p.s = rand(10, 20);
      p.vx = rand(-0.2, 0.4);
      p.vy = rand(0.35, 0.95);
      p.r = rand(0, 6.28);
      p.vr = rand(-0.015, 0.015);
      p.f = rand(0, 6.28);
      p.vf = rand(0.015, 0.04);
      p.img = pick(sprites);
      p.a = rand(0.55, 0.95);
      return p;
    };
    const P = Array.from({ length: MAX }, () => spawn({ on: false }, false));
    const bursts = [];

    const draw = (p, alpha) => {
      const sc = Math.max(0.2, Math.abs(Math.cos(p.f)));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.scale(1, sc);
      ctx.globalAlpha = alpha;
      ctx.drawImage(p.img, -p.s / 2, -p.s / 2, p.s, p.s);
      ctx.restore();
    };

    gsap.ticker.add((time) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const want = Math.round(MAX * state.density);
      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        if (!p.on) {
          if (i < want) { spawn(p, false); p.on = true; } else continue;
        }
        p.x += p.vx + Math.sin(time * 0.6 + p.f) * 0.35;
        p.y += p.vy;
        p.r += p.vr;
        p.f += p.vf;
        const dx = p.x - pointer.x, dy = p.y - pointer.y, d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) { p.x += (dx / d) * (120 - d) * 0.05; p.y += (dy / d) * (120 - d) * 0.03; }
        if (p.y > H + 30 || p.x < -60 || p.x > W + 60) {
          if (i < want) spawn(p, false); else p.on = false;
        }
        if (p.on) draw(p, p.a);
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.vy += 0.06; b.vx *= 0.985; b.vy *= 0.985;
        b.x += b.vx; b.y += b.vy; b.r += b.vr; b.f += b.vf;
        b.life -= 0.008;
        if (b.life <= 0) { bursts.splice(i, 1); continue; }
        draw(b, Math.min(1, b.life * 1.5));
      }
    });

    return {
      state,
      burst(x, y, n = 10, power = 6) {
        if (reduced) return;
        for (let i = 0; i < n; i++) {
          const a = rand(0, Math.PI * 2), sp = rand(power * 0.3, power);
          bursts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - power * 0.4, s: rand(10, 20), r: rand(0, 6.28), vr: rand(-0.08, 0.08), f: rand(0, 6.28), vf: rand(0.03, 0.08), img: pick(sprites), life: 1 });
        }
      },
    };
  })();

  /* -------------------------------------------------------
     Helpers
     ------------------------------------------------------- */
  function splitWords(el) {
    const words = [];
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(' '));
            else {
              const w = document.createElement('span');
              w.className = 'w';
              w.textContent = part;
              frag.appendChild(w);
              words.push(w);
            }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && !n.hasAttribute('data-nosplit') && n.tagName !== 'BR') {
          walk(n);
        }
      });
    };
    walk(el);
    return words;
  }

  const cubic = (a, b, c, d, t) => {
    const m = 1 - t;
    return [
      m * m * m * a[0] + 3 * m * m * t * b[0] + 3 * m * t * t * c[0] + t * t * t * d[0],
      m * m * m * a[1] + 3 * m * m * t * b[1] + 3 * m * t * t * c[1] + t * t * t * d[1],
    ];
  };
  const cubicAngle = (a, b, c, d, t) => {
    const m = 1 - t;
    const dx = 3 * m * m * (b[0] - a[0]) + 6 * m * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]);
    const dy = 3 * m * m * (b[1] - a[1]) + 6 * m * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1]);
    return (Math.atan2(dy, dx) * 180) / Math.PI;
  };
  const svgEl = (tag, attrs) => {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };

  /* Gold line-art botanical branch (intro) */
  function goldBranch(svg, { stem, leaves = 12, len = [62, 24], twigs = 0 }) {
    const [a, b, c, d] = stem;
    const g = svgEl('g', { fill: 'none', stroke: 'url(#gGoldU)', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    g.appendChild(svgEl('path', { class: 'draw', pathLength: 1, 'stroke-width': 1.8, d: `M${a} C${b} ${c} ${d}` }));

    const addLeaf = (pt, ang, L) => {
      const outer = svgEl('g', { transform: `translate(${pt[0].toFixed(1)},${pt[1].toFixed(1)}) rotate(${ang.toFixed(1)})` });
      const inner = svgEl('g', { class: 'leaf' });
      inner.appendChild(svgEl('path', {
        'stroke-width': 1.2, fill: 'rgba(240,214,150,.13)',
        d: `M0,0 C${L * 0.25},${-L * 0.33} ${L * 0.72},${-L * 0.3} ${L},0 C${L * 0.72},${L * 0.3} ${L * 0.25},${L * 0.33} 0,0Z`,
      }));
      inner.appendChild(svgEl('path', { 'stroke-width': 0.8, d: `M${L * 0.05},0 Q${L * 0.5},${-L * 0.04} ${L * 0.92},0` }));
      for (let k = 0.28; k < 0.8; k += 0.18) {
        inner.appendChild(svgEl('path', { 'stroke-width': 0.6, d: `M${L * k},0 L${L * (k + 0.12)},${-L * 0.15} M${L * k},0 L${L * (k + 0.12)},${L * 0.15}` }));
      }
      outer.appendChild(inner);
      g.appendChild(outer);
    };

    for (let i = 0; i < leaves; i++) {
      const t = 0.08 + (i / leaves) * 0.88;
      const pt = cubic(a, b, c, d, t);
      const side = i % 2 ? 1 : -1;
      const ang = cubicAngle(a, b, c, d, t) + side * rand(38, 62);
      addLeaf(pt, ang, (len[0] + (len[1] - len[0]) * t) * rand(0.85, 1.1));
    }
    addLeaf(d, cubicAngle(a, b, c, d, 1), len[1] * 1.1);

    for (let i = 0; i < twigs; i++) {
      const t = rand(0.15, 0.85);
      const pt = cubic(a, b, c, d, t);
      const ang = ((cubicAngle(a, b, c, d, t) + pick([-1, 1]) * rand(30, 70)) * Math.PI) / 180;
      const L = rand(36, 70);
      const ex = pt[0] + Math.cos(ang) * L, ey = pt[1] + Math.sin(ang) * L;
      const cx = pt[0] + Math.cos(ang + 0.4) * L * 0.5, cy = pt[1] + Math.sin(ang + 0.4) * L * 0.5;
      g.appendChild(svgEl('path', { class: 'draw', pathLength: 1, 'stroke-width': 1, d: `M${pt[0]},${pt[1]} Q${cx},${cy} ${ex},${ey}` }));
      const berry = svgEl('g', { class: 'leaf', transform: `translate(${ex.toFixed(1)},${ey.toFixed(1)})` });
      berry.appendChild(svgEl('circle', { r: rand(3, 5).toFixed(1), 'stroke-width': 1, fill: 'rgba(240,214,150,.25)' }));
      g.appendChild(berry);
    }
    svg.appendChild(g);
  }

  function buildIntroArt() {
    const tr = $('.intro-branch--tr');
    goldBranch(tr, { stem: [[520, -10], [430, 70], [310, 120], [120, 300]], leaves: 13, len: [70, 26] });
    goldBranch(tr, { stem: [[510, 150], [440, 210], [400, 280], [330, 420]], leaves: 9, len: [52, 22] });
    tr.appendChild(svgEl('path', { class: 'draw', pathLength: 1, fill: 'none', stroke: 'url(#gGoldU)', 'stroke-width': 2, d: 'M520,330 C400,380 280,330 290,220 C296,160 340,120 380,110' }));

    const bl = $('.intro-branch--bl');
    goldBranch(bl, { stem: [[-10, 510], [60, 420], [120, 330], [250, 110]], leaves: 12, len: [60, 22], twigs: 6 });
    goldBranch(bl, { stem: [[40, 510], [160, 450], [260, 420], [390, 330]], leaves: 8, len: [46, 20], twigs: 3 });
  }

  /* -------------------------------------------------------
     Flower compositions
     ------------------------------------------------------- */
  function buildGarden() {
    const host = $('#garden');
    const els = [];
    const count = isMobile() ? 70 : 120;
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      const type = r < 0.4 ? 'peo' : r < 0.8 ? 'sak' : r < 0.9 ? 'bud' : pick(['leaf', 'twig']);
      const size = { peo: rand(16, 30), sak: rand(9, 16), bud: rand(6, 10), leaf: rand(8, 12), twig: rand(18, 26) }[type];
      const top = Math.pow(Math.random(), 0.8) * 100;
      const z = { twig: 1, leaf: 2, bud: 3, sak: 4, peo: 5 }[type] + Math.round(rand(0, 3));
      const f = makeFlower(type, { left: `${rand(-6, 106)}%`, top: `${Math.max(3, top)}%`, size, z });
      host.appendChild(f);
      els.push(f);
    }
    for (let i = 0; i < 40; i++) host.appendChild(makeDot(`${rand(0, 100)}%`, `${rand(4, 100)}%`, rand(3, 7)));
    return els;
  }

  function buildGarland() {
    const host = $('#garland');
    const els = [];
    const n = isMobile() ? 13 : 24;
    for (let i = 0; i < n; i++) {
      const x = -4 + 108 * (i / (n - 1)) + rand(-2, 2);
      const edge = Math.abs(x - 50) / 50;
      const peo = i % 3 === 0 || Math.random() < 0.18;
      els.push(makeFlower(peo ? 'peo' : 'sak', {
        left: `${x}%`, top: `${rand(-6, 10) + (1 - edge) * rand(-4, 6)}%`,
        size: peo ? rand(11, 17) : rand(6.5, 10.5), z: peo ? 5 : 4,
      }));
    }
    for (let i = 0; i < n * 0.6; i++) {
      els.push(makeFlower('bud', { left: `${rand(0, 100)}%`, top: `${rand(14, 46)}%`, size: rand(4, 6.5), rot: rand(150, 210), z: 3 }));
    }
    for (let i = 0; i < n * 0.4; i++) {
      els.push(makeFlower(pick(['twig', 'twig', 'leaf']), { left: `${rand(-2, 102)}%`, top: `${rand(-2, 22)}%`, size: rand(9, 15), z: 2 }));
    }
    for (let i = 0; i < n * 0.5; i++) {
      els.push(makeFlower('sak', { left: `${rand(0, 100)}%`, top: `${rand(16, 40)}%`, size: rand(4, 6.5), z: 4 }));
    }
    els.forEach((e) => host.appendChild(e));
    for (let i = 0; i < 26; i++) host.appendChild(makeDot(`${rand(2, 98)}%`, `${rand(6, 95)}%`, rand(3, 6)));
    return els;
  }

  function buildLetterFlowers() {
    const host = $('#letterFlowers');
    const groups = [];
    [[0, 0], [100, 0], [0, 100], [100, 100]].forEach(([cx, cy], ci) => {
      const sx = cx ? -1 : 1, sy = cy ? -1 : 1;
      const at = (dx, dy) => ({ left: `calc(${cx}% + ${(sx * dx).toFixed(1)}vmin)`, top: `calc(${cy}% + ${(sy * dy).toFixed(1)}vmin)` });
      const grp = [];
      grp.push(makeFlower('twig', { ...at(rand(4, 9), rand(-2, 3)), size: rand(16, 22), rot: (ci % 2 ? 140 : 40) + rand(-20, 20), z: 1 }));
      grp.push(makeFlower('leaf', { ...at(rand(9, 13), rand(-3, 1)), size: rand(7, 9), z: 1 }));
      grp.push(makeFlower('peo', { ...at(rand(0, 2.5), rand(0, 2.5)), size: rand(14, 18), z: 3 }));
      grp.push(makeFlower('sak', { ...at(rand(11, 15), rand(-3, 1)), size: rand(7.5, 10), z: 3 }));
      grp.push(makeFlower('sak', { ...at(rand(-3, 0), rand(9, 13)), size: rand(7, 9.5), z: 3 }));
      grp.push(makeFlower('bud', { ...at(rand(18, 22), rand(-2, 2)), size: rand(4.5, 6), z: 2 }));
      grp.push(makeFlower('sak', { ...at(rand(4, 8), rand(-5, -2)), size: rand(4.5, 6), z: 4 }));
      grp.forEach((g) => host.appendChild(g));
      groups.push(grp);
    });
    const sides = [];
    [[0, 34], [100, 56], [0, 72]].forEach(([x, y]) => {
      const f = makeFlower('sak', { left: `calc(${x}% + ${x ? -0.5 : 0.5}vmin)`, top: `${y}%`, size: rand(6, 8), z: 3 });
      host.appendChild(f);
      sides.push(f);
    });
    for (let i = 0; i < 14; i++) {
      const left = pick([rand(-3, 8), rand(92, 103)]);
      host.appendChild(makeDot(`${left}%`, `${rand(0, 100)}%`, rand(3, 6)));
    }
    return { groups, sides };
  }

  function buildEndingFlowers() {
    const host = $('#endingFlowers');
    const els = [];
    const mob = isMobile();
    // card edge sits at ~26% / 74% on desktop, ~10% / 90% on mobile
    const edgeL = mob ? 10 : 26;
    ['l', 'r'].forEach((side) => {
      const mirror = (x) => (side === 'l' ? x : 100 - x);
      const rows = 11;
      for (let i = 0; i < rows; i++) {
        const y = -3 + i * (106 / (rows - 1)) + rand(-2.5, 2.5);
        const peo = i % 2 === 0;
        // big blooms in the side panel, smaller ones spilling over the card edge
        const x = peo ? rand(mob ? -6 : 2, edgeL - (mob ? 0 : 6)) : rand(edgeL - 5, edgeL + (mob ? 3 : 4));
        els.push(makeFlower(peo ? 'peo' : 'sak', { left: `${mirror(x)}%`, top: `${y}%`, size: peo ? rand(13, 19) : rand(7, 10.5), z: peo ? 4 : 5 }));
        if (!mob || i % 2) {
          els.push(makeFlower('sak', { left: `${mirror(rand(-4, edgeL - 4))}%`, top: `${y + rand(4, 8)}%`, size: rand(5, 8), z: 5 }));
        }
        if (Math.random() < 0.7) {
          els.push(makeFlower(pick(['bud', 'twig', 'leaf', 'twig']), { left: `${mirror(rand(0, edgeL))}%`, top: `${y + rand(2, 8)}%`, size: rand(6, 14), z: 2 }));
        }
      }
    });
    els.push(makeFlower('sak', { left: '50%', top: '-1%', size: rand(6, 8), z: 5 }));
    els.forEach((e) => host.appendChild(e));
    for (let i = 0; i < 40; i++) {
      host.appendChild(makeDot(`${pick([rand(0, edgeL), rand(100 - edgeL, 100)])}%`, `${rand(1, 99)}%`, rand(3, 7)));
    }
    return els;
  }

  /* -------------------------------------------------------
     Intro
     ------------------------------------------------------- */
  function introIn() {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from('#gl', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
      .to('.intro .draw', { strokeDashoffset: 0, duration: 2.8, stagger: 0.02, ease: 'power2.inOut' }, 0.2)
      .from('.intro .leaf', { scale: 0, transformOrigin: '0% 50%', duration: 1.1, stagger: 0.025, ease: 'back.out(1.7)' }, 0.8)
      .from('.intro-nav a', { y: -12, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out' }, 0.6)
      .from('.intro-kicker', { y: 24, opacity: 0, filter: 'blur(8px)', duration: 1.2, ease: 'power3.out' }, 0.7)
      .from('.it-line', { y: 50, opacity: 0, filter: 'blur(14px)', letterSpacing: '.25em', duration: 1.8, stagger: 0.25, ease: 'expo.out' }, 0.9)
      .from('.it-and i', { scaleX: 0, duration: 1.2, ease: 'power3.inOut' }, 1.2)
      .from('.it-and em', { opacity: 0, y: 10, duration: 1 }, 1.4)
      .from(['.intro-date', '.intro-sub', '#start'], { y: 20, opacity: 0, duration: 1.1, stagger: 0.14, ease: 'power3.out' }, 1.6);

    // subtle pointer parallax on the gold botanicals
    if (!isTouch) {
      const tr = $('.intro-branch--tr'), bl = $('.intro-branch--bl');
      const trX = gsap.quickTo(tr, 'x', { duration: 1.4, ease: 'power3' }), trY = gsap.quickTo(tr, 'y', { duration: 1.4, ease: 'power3' });
      const blX = gsap.quickTo(bl, 'x', { duration: 1.6, ease: 'power3' }), blY = gsap.quickTo(bl, 'y', { duration: 1.6, ease: 'power3' });
      const move = (e) => {
        if (started) return removeEventListener('pointermove', move);
        const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
        trX(nx * -26); trY(ny * -18); blX(nx * 20); blY(ny * 14);
      };
      addEventListener('pointermove', move, { passive: true });
    }
  }

  /* -------------------------------------------------------
     Hero entrance
     ------------------------------------------------------- */
  let garlandEls = [];
  function heroIn() {
    const H = innerHeight;
    const tl = gsap.timeline();
    tl.fromTo(garlandEls,
      { y: () => -H * rand(0.25, 0.45), opacity: 0, scale: 0.5 },
      { y: 0, opacity: 1, scale: 1, duration: 1.8, ease: 'power3.out', stagger: { each: 0.015, from: 'edges' } }, 0)
      .fromTo('#garland .dot', { opacity: 0 }, { opacity: 1, duration: 1.2, stagger: 0.03 }, 0.6)
      .fromTo('.hero .eyebrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.4)
      .fromTo('.hero-title > *', { opacity: 0, y: 50, filter: 'blur(14px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, stagger: 0.2, ease: 'expo.out' }, 0.55)
      .fromTo(['.hero-sub', '#openLetter', '.scroll-hint'], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out' }, 1);
    return tl;
  }

  /* -------------------------------------------------------
     Opening → transition into the site
     ------------------------------------------------------- */
  let started = false;
  function start() {
    if (started) return;
    started = true;
    const garden = $('#garden');
    const H = innerHeight;
    const flowers = buildGarden();
    gsap.set(garden, { y: H, autoAlpha: 1 });

    const tl = gsap.timeline();
    tl.to(['.intro-inner > *', '.intro-nav'], { y: -30, opacity: 0, filter: 'blur(8px)', duration: 0.9, stagger: 0.05, ease: 'power2.in' }, 0)
      .add(() => petals.burst(innerWidth / 2, innerHeight * 0.8, 26, 9), 0.1)
      .to(garden, { y: -H * 0.3, duration: 2, ease: 'power3.inOut' }, 0.35)
      .fromTo(flowers,
        { y: (i, el) => H * 0.4 * +el.dataset.depth, scale: 0.7 },
        { y: 0, scale: 1, duration: 2.2, ease: 'power3.out', stagger: { each: 0.004, from: 'random' } }, 0.35)
      .to(U, { intro: 0, duration: 0.8 }, 1.6)
      .add(() => {
        $('#intro').remove();
        $('#main').style.visibility = 'visible';
        window.scrollTo(0, 0);
        petals.state.density = 1;
      }, 2.3)
      .to(garden, { y: () => -garden.offsetHeight - H * 0.15, duration: 2.6, ease: 'power2.inOut' }, 2.45)
      .to(flowers, { y: (i, el) => -H * 0.5 * +el.dataset.depth, rotation: '+=30', duration: 2.6, ease: 'power2.in' }, 2.45)
      .add(heroIn(), 3.1)
      .add(() => {
        garden.remove();
        document.documentElement.classList.remove('is-locked');
        if (lenis) lenis.start();
        gsap.to('.progress', { opacity: 1, duration: 1 });
        ScrollTrigger.refresh();
      });
  }

  /* -------------------------------------------------------
     Scroll choreography
     ------------------------------------------------------- */
  function initScroll(letterFlowers, endingEls) {
    // global progress
    gsap.to('.progress span', {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '#main', start: 'top top', end: 'bottom bottom', scrub: true },
    });

    // HERO parallax
    gsap.to('#garland', { yPercent: -28, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-inner', { y: -120, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom 15%', scrub: true } });

    // OPENING — words light up as you read
    const openWords = splitWords($('[data-scrub-words]'));
    gsap.fromTo('.opening .label', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: '.opening', start: 'top 70%' } });
    gsap.fromTo(openWords, { opacity: 0.1, y: 8, filter: 'blur(3px)' }, {
      opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.05, ease: 'none',
      scrollTrigger: { trigger: '.opening-text', start: 'top 78%', end: 'bottom 45%', scrub: 1 },
    });

    // LETTER — corner blooms grow in, then drift
    letterFlowers.groups.forEach((grp, gi) => {
      gsap.fromTo(grp,
        { scale: 0, opacity: 0, rotation: (i, el) => +el.dataset.rot - 70 },
        {
          scale: 1, opacity: 1, rotation: (i, el) => +el.dataset.rot, ease: 'back.out(1.4)', stagger: 0.06,
          scrollTrigger: { trigger: '.letter-wrap', start: gi < 2 ? 'top 85%' : 'bottom 110%', end: gi < 2 ? 'top 35%' : 'bottom 65%', scrub: 1.2 },
        });
    });
    gsap.fromTo(letterFlowers.sides, { scale: 0, opacity: 0 }, {
      scale: 1, opacity: 1, stagger: 0.2,
      scrollTrigger: { trigger: '.letter-wrap', start: 'top 60%', end: 'center 50%', scrub: 1 },
    });
    gsap.from('.letter-card', { y: 80, opacity: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: '.letter-card', start: 'top 85%' } });
    gsap.from('.letter-card .label', { opacity: 0, y: 16, duration: 1, scrollTrigger: { trigger: '.letter-card', start: 'top 70%' } });
    gsap.fromTo('.letter-greet',
      { clipPath: 'inset(-20% 100% -20% -10%)' },
      { clipPath: 'inset(-20% -10% -20% -10%)', duration: 1.8, ease: 'power2.inOut', scrollTrigger: { trigger: '.letter-greet', start: 'top 80%' } });
    $$('.letter-card [data-reveal]').forEach((p) => {
      const words = splitWords(p);
      gsap.fromTo(words, { opacity: 0, y: 14 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.012,
        scrollTrigger: { trigger: p, start: 'top 84%' },
      });
    });
    $$('.letter-card mark').forEach((m) => {
      gsap.to(m, { backgroundSize: '100% 100%', duration: 1.4, delay: 0.7, ease: 'power2.inOut', scrollTrigger: { trigger: m, start: 'top 78%' } });
    });
    gsap.from('.letter-heart', { scale: 0, opacity: 0, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '.letter-heart', start: 'top 90%' } });

    // STAGE — ink bloom, thanks, apology
    const titleLines = $$('.st-title .st-l');
    const thanks = $$('.st-thanks li').map((li) => ({ li, num: $('.n', li), words: splitWords(li) }));
    const sorryKicker = $('.st-sorry .st-kicker');
    const sorryLines = $$('.st-sorry .st-s');
    const promiseLines = $$('.st-promise .st-p');
    const jokeLines = $$('.st-joke .st-p');
    const blurIn = { opacity: 1, y: 0, filter: 'blur(0px)' };

    gsap.set([titleLines, sorryKicker, sorryLines, promiseLines, jokeLines], { opacity: 0 });

    const st = gsap.timeline({
      defaults: { ease: 'power2.out' },
      scrollTrigger: { trigger: '#stage', start: 'top top', end: () => '+=' + innerHeight * 9.5, pin: true, scrub: 1, anticipatePin: 1 },
    });
    st.to(U, { bloom: 1.3, duration: 2.4, ease: 'sine.inOut' }, 0)
      .fromTo(titleLines, { opacity: 0, y: 50, filter: 'blur(14px)' }, { ...blurIn, duration: 1, stagger: 0.3 }, 1.2)
      .to('.st-title', { opacity: 0, y: -70, filter: 'blur(14px)', duration: 1, ease: 'power2.in' }, 3.6);

    thanks.forEach((t, i) => {
      const at = 4.4 + i * 1.5;
      st.fromTo(t.num, { opacity: 0, y: 12 }, { opacity: 0.85, y: 0, duration: 0.6 }, at)
        .fromTo(t.words, { opacity: 0, y: 26, filter: 'blur(10px)' }, { ...blurIn, duration: 0.9, stagger: 0.035 }, at);
      if (i > 0) st.to(thanks[i - 1].li, { opacity: 0.55, duration: 0.6 }, at);
    });

    st.to(U, { bloom: 1.6, duration: 6, ease: 'none' }, 5)
      .to('.st-thanks', { filter: 'blur(14px)', opacity: 0.4, scale: 0.95, duration: 1.4, ease: 'power1.inOut' }, 9.2)
      .fromTo(sorryKicker, { opacity: 0, y: 20, filter: 'blur(8px)' }, { ...blurIn, duration: 0.8 }, 9.6)
      .fromTo(sorryLines, { opacity: 0, y: 40, filter: 'blur(12px)' }, { ...blurIn, duration: 1, stagger: 0.7 }, 9.9)
      .to('.st-thanks', { opacity: 0, duration: 0.8 }, 11.4)
      .to('.st-sorry', { filter: 'blur(12px)', opacity: 0.3, scale: 0.96, duration: 1.2, ease: 'power1.inOut' }, 12.2)
      .fromTo(promiseLines, { opacity: 0, y: 40, filter: 'blur(12px)' }, { ...blurIn, duration: 1.1, stagger: 0.45 }, 12.6)
      .to('.st-sorry', { opacity: 0, duration: 0.8 }, 13.8)
      .to('.st-promise', { filter: 'blur(12px)', opacity: 0.3, scale: 0.96, duration: 1.2, ease: 'power1.inOut' }, 14.6)
      .fromTo(jokeLines, { opacity: 0, y: 40, filter: 'blur(12px)' }, { ...blurIn, duration: 1.1, stagger: 0.45 }, 15.0)
      .to('.st-promise', { opacity: 0, duration: 0.8 }, 16.0)
      .to('.st-joke', { opacity: 0, y: -40, filter: 'blur(10px)', duration: 1, ease: 'power2.in' }, 17.0)
      .to(U, { fade: 1, duration: 1.8, ease: 'power1.inOut' }, 17.2)
      .to({}, { duration: 0.6 });

    // MEMORIES — polaroids fly in one by one and develop like instant film
    const polaroids = $$('.polaroid');
    const mobilePos = [[50, 24], [30, 50], [70, 56], [46, 77]];
    polaroids.forEach((p, i) => {
      const [x, y] = isMobile() ? mobilePos[i % mobilePos.length] : [+p.dataset.x, +p.dataset.y];
      gsap.set(p, { left: `${x}%`, top: `${y}%`, xPercent: -50, yPercent: -50, rotation: +p.dataset.rot, zIndex: i + 1 });
    });
    const mt = gsap.timeline({
      defaults: { ease: 'power3.out' },
      scrollTrigger: { trigger: '#memories', start: 'top top', end: () => '+=' + innerHeight * 5, pin: true, scrub: 1, anticipatePin: 1 },
    });
    mt.fromTo('.mem-title > *', { opacity: 0, y: 60, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.25 }, 0);
    polaroids.forEach((p, i) => {
      const at = 1 + i * 1.7;
      const rot = +p.dataset.rot;
      const fromLeft = i % 2 === 0;
      mt.fromTo(p,
        { y: () => innerHeight * 0.9, x: () => (fromLeft ? -1 : 1) * innerWidth * 0.25, rotation: rot + (fromLeft ? -28 : 28), scale: 1.2, opacity: 0 },
        { y: 0, x: 0, rotation: rot, scale: 1, opacity: 1, duration: 1.1 }, at)
        .fromTo($('img', p),
          { filter: 'sepia(1) brightness(1.7) saturate(0) blur(8px)' },
          { filter: 'sepia(0) brightness(1) saturate(1) blur(0px)', duration: 1.3, ease: 'power1.inOut' }, at + 0.5)
        .fromTo($('figcaption', p),
          { clipPath: 'inset(-20% 100% -20% 0%)' },
          { clipPath: 'inset(-20% 0% -20% 0%)', duration: 0.8, ease: 'power2.inOut' }, at + 1.1);
      // earlier photos settle back a little as the next one lands
      if (i > 0) mt.to(polaroids.slice(0, i), { scale: 0.96, duration: 0.8 }, at + 0.4);
    });
    mt.to('.mem-title', { opacity: 0.5, duration: 1 }, 1 + polaroids.length * 1.7)
      .to({}, { duration: 0.8 });

    // ENDING
    gsap.to(U, { warm: 1, ease: 'none', scrollTrigger: { trigger: '#ending', start: 'top bottom', end: 'top 25%', scrub: true } });
    gsap.set(endingEls, { scale: 0, opacity: 0 });
    gsap.set('#endingFlowers .dot', { opacity: 0 });
    const endCard = $$('.ending-card > *:not(.signature)');
    gsap.set(endCard, { opacity: 0, y: 30 });
    gsap.set('.signature', { clipPath: 'inset(-30% 100% -30% -10%)' });

    ScrollTrigger.create({
      trigger: '.ending-frame',
      start: 'top 65%',
      once: true,
      onEnter: () => {
        const tl = gsap.timeline();
        tl.from('.ending-frame', { y: 60, duration: 1.4, ease: 'power3.out' }, 0)
          .to(endingEls, { scale: 1, opacity: 1, duration: 1.4, ease: 'back.out(1.5)', stagger: { each: 0.03, from: 'random' } }, 0.1)
          .to('#endingFlowers .dot', { opacity: 1, duration: 1, stagger: 0.02 }, 0.6)
          .to(endCard, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.12 }, 0.4)
          .to('.signature', { clipPath: 'inset(-30% -10% -30% -10%)', duration: 2.4, ease: 'power2.inOut' }, 1.6)
          .add(() => {
            for (let i = 0; i < 5; i++) {
              gsap.delayedCall(i * 0.25, () => petals.burst(rand(0.1, 0.9) * innerWidth, rand(0.05, 0.3) * innerHeight, 14, 7));
            }
          }, 1.2);
      },
    });

    // petal density per chapter
    [['#hero', 1], ['#opening', 0.7], ['#letter', 0.55], ['#stage', 0.2], ['#memories', 0.6], ['#ending', 1.15]].forEach(([sel, d]) => {
      ScrollTrigger.create({
        trigger: sel, start: 'top 55%', end: 'bottom 55%',
        onToggle: (self) => self.isActive && gsap.to(petals.state, { density: d, duration: 1.5 }),
      });
    });
  }

  /* -------------------------------------------------------
     Cursor & interactions
     ------------------------------------------------------- */
  function initCursor() {
    if (isTouch) return;
    const c = $('.cursor');
    const xTo = gsap.quickTo(c, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(c, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener('pointermove', (e) => {
      xTo(e.clientX); yTo(e.clientY);
      if (c.style.opacity !== '1') c.style.opacity = '1';
    }, { passive: true });
    document.addEventListener('pointerover', (e) => c.classList.toggle('is-hover', !!e.target.closest('button, a, .polaroid')));
    document.addEventListener('pointerleave', () => (c.style.opacity = '0'));
  }

  function initInteractions() {
    $('#start').addEventListener('click', start);
    $$('.intro-nav a').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); start(); }));
    $('#openLetter').addEventListener('click', () => scrollToTarget('#letter', 2.6));
    $('#replay').addEventListener('click', () => scrollToTarget(0, 4));
    // lightbox for the memory photos
    const lb = $('#lightbox');
    const lbImg = $('img', lb);
    let lastFocus = null;
    const closeLb = () => {
      gsap.to(lb, { opacity: 0, duration: 0.35, onComplete: () => { lb.hidden = true; } });
      if (lenis) lenis.start();
      if (lastFocus) lastFocus.focus();
    };
    $$('.polaroid').forEach((p) => {
      p.tabIndex = 0;
      const open = () => {
        const img = $('img', p);
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lastFocus = p;
        lb.hidden = false;
        if (lenis) lenis.stop();
        gsap.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.4 });
        gsap.fromTo(lbImg, { scale: 0.9, rotation: +p.dataset.rot }, { scale: 1, rotation: 0, duration: 0.6, ease: 'power3.out' });
        $('.lb-close', lb).focus();
      };
      p.addEventListener('click', open);
      p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    lb.addEventListener('click', closeLb);
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

    addEventListener('click', (e) => {
      if (!started || e.target.closest('button, a, .polaroid, .lightbox')) return;
      petals.burst(e.clientX, e.clientY, 9, 5);
    });
    addEventListener('keydown', (e) => {
      if (!started && (e.key === 'Enter' || e.key === ' ') && document.activeElement === document.body) {
        e.preventDefault();
        start();
      }
    });
  }

  /* -------------------------------------------------------
     Boot
     ------------------------------------------------------- */
  buildDefs();
  buildIntroArt();
  initGL();
  garlandEls = buildGarland();
  const letterFlowers = buildLetterFlowers();
  const endingEls = buildEndingFlowers();
  initScroll(letterFlowers, endingEls);
  initCursor();
  initInteractions();

  const fontsReady = document.fonts ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]) : Promise.resolve();
  fontsReady.then(() => {
    introIn();
    ScrollTrigger.refresh();
  });
})();
