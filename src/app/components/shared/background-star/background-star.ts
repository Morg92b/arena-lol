import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-background-star',
  standalone: true,
  template: '',
  styles: [':host { display: none; }'],
})
export class BackgroundStar implements OnInit, OnDestroy {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animId!: number;
  private stars: any[] = [];
  private shooters: any[] = [];
  private W = 0;
  private H = 0;
  private t = 0;
  private boundResize = this.resize.bind(this);

  private COLORS = [
    '#ffffff',
    '#ffffff',
    '#ffffff',
    '#cce0ff',
    '#cce0ff',
    '#ffeedd',
    '#b0d0ff',
    '#aac8ff',
  ];

  ngOnInit() {
    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      position: 'fixed',
      inset: '0',
      width: '100%',
      height: '100%',
      zIndex: '-1',
      pointerEvents: 'none',
      background: `
        radial-gradient(ellipse 80% 60% at 20% 30%, rgba(13,27,62,0.9) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 75% 70%, rgba(5,20,40,0.8) 0%, transparent 55%),
        linear-gradient(170deg, #020b18 0%, #04142e 35%, #060e22 65%, #020a14 100%)
      `,
    });
    document.body.appendChild(this.canvas);

    // Nébuleuses
    const nebulas = [
      {
        width: '600px',
        height: '420px',
        top: '-120px',
        left: '5%',
        background:
          'radial-gradient(ellipse, rgba(30,60,140,.18) 0%, rgba(10,30,90,.07) 50%, transparent 70%)',
        filter: 'blur(40px)',
      },
      {
        width: '500px',
        height: '360px',
        bottom: '-80px',
        right: '5%',
        background:
          'radial-gradient(ellipse, rgba(60,15,100,.2) 0%, rgba(30,8,70,.07) 50%, transparent 70%)',
        filter: 'blur(50px)',
      },
      {
        width: '350px',
        height: '250px',
        top: '38%',
        left: '55%',
        background:
          'radial-gradient(ellipse, rgba(0,60,80,.15) 0%, rgba(0,30,50,.05) 50%, transparent 70%)',
        filter: 'blur(28px)',
      },
    ];
    nebulas.forEach((n) => {
      const div = document.createElement('div');
      Object.assign(div.style, {
        position: 'fixed',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '-1',
        ...n,
      });
      document.body.appendChild(div);
      // Cleanup référence
      (this as any)['_nebulas'] = [...((this as any)['_nebulas'] || []), div];
    });

    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.boundResize);
    this.draw();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animId);
    window.removeEventListener('resize', this.boundResize);
    this.canvas?.remove();
    ((this as any)['_nebulas'] || []).forEach((d: HTMLElement) => d.remove());
  }

  private rand(a: number, b: number) {
    return Math.random() * (b - a) + a;
  }
  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private resize() {
    this.W = this.canvas.width = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    this.initStars();
  }

  private initStars() {
    this.stars = [];
    const count = Math.floor((this.W * this.H) / 900);
    for (let i = 0; i < count; i++) {
      const size =
        Math.random() < 0.6
          ? this.rand(0.4, 1)
          : Math.random() < 0.8
            ? this.rand(1, 1.8)
            : this.rand(1.8, 3);
      this.stars.push({
        x: this.rand(0, this.W),
        y: this.rand(0, this.H),
        size,
        color: this.pick(this.COLORS),
        speed: this.rand(0.03, 0.15) * (size > 1.8 ? 0.5 : 1),
        twinkleSpeed: this.rand(0.005, 0.025),
        twinkleOffset: this.rand(0, Math.PI * 2),
        glow: size > 1.8,
      });
    }
    this.shooters = Array.from({ length: 4 }, () => this.makeShooter(true));
  }

  private makeShooter(randomY = false) {
    return {
      x: this.rand(0, this.W * 0.8),
      y: randomY ? this.rand(0, this.H) : this.rand(-20, this.H * 0.4),
      vx: this.rand(3, 6),
      vy: this.rand(1.5, 3),
      len: this.rand(80, 160),
      opacity: 0,
      phase: 'wait',
      wait: this.rand(0, 600),
      timer: 0,
    };
  }

  private draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);
    this.t += 0.016;

    for (const s of this.stars) {
      s.y -= s.speed;
      if (s.y < -5) {
        s.y = this.H + 5;
        s.x = this.rand(0, this.W);
      }
      const twinkle = 0.5 + 0.5 * Math.sin(this.t * s.twinkleSpeed * 60 + s.twinkleOffset);
      const alpha = s.size > 1.8 ? 0.4 + 0.6 * twinkle : 0.5 + 0.3 * twinkle;
      if (s.glow) {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 4);
        g.addColorStop(0, s.color);
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = alpha * 0.4;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < this.shooters.length; i++) {
      const s = this.shooters[i];
      if (s.phase === 'wait') {
        s.timer++;
        if (s.timer > s.wait) s.phase = 'in';
        continue;
      }
      s.x += s.vx;
      s.y += s.vy;
      if (s.phase === 'in') {
        s.opacity = Math.min(1, s.opacity + 0.08);
        if (s.opacity >= 1) s.phase = 'out';
      } else {
        s.opacity = Math.max(0, s.opacity - 0.04);
      }
      if (s.opacity <= 0 && s.phase === 'out') {
        this.shooters[i] = this.makeShooter();
        continue;
      }
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y - s.len * (s.vy / s.vx));
      grad.addColorStop(0, `rgba(255,255,255,${s.opacity})`);
      grad.addColorStop(0.4, `rgba(200,220,255,${s.opacity * 0.6})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y - s.len * (s.vy / s.vx));
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    this.animId = requestAnimationFrame(() => this.draw());
  }
}
