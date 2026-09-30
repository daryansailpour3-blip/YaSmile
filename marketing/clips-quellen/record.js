// Nutzung: node record.js clip1.html out.mp4 [fps] [--stills 1.5,5,12]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { spawn } = require('child_process');
const path = require('path');

const [, , file, out, fpsArg, stillsFlag, stillsArg] = process.argv;
const fps = Number(fpsArg || 30);
const FF = process.env.FFMPEG;

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(__dirname, file));
  await page.evaluate(() => window.__ready);
  await page.waitForTimeout(300);
  const duration = await page.evaluate(() => window.DURATION);

  if (stillsFlag === '--stills') {
    for (const s of stillsArg.split(',').map(Number)) {
      await page.evaluate((t) => window.render(t), s);
      await page.screenshot({ path: `${out}-${s}.png` });
    }
    await browser.close();
    return;
  }

  const ff = spawn(FF, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'inherit', 'inherit'] });
  const frames = Math.round(duration * fps);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.render(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await browser.close();
  console.log(`${out}: ${frames} frames`);
})();
