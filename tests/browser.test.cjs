/* Prueba de desarrollo opcional: requiere Playwright; la app no depende de él. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const context=await browser.newContext();const page=await context.newPage();const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const url=pathToFileURL(path.join(__dirname,'..','index.html')).href;
    await page.goto(url);await page.evaluate(()=>localStorage.clear());await page.reload();
    assert.equal(await page.locator('[data-structure]').count(),11);
    await page.locator('[data-mode="build"]').click();await page.selectOption('#buildStyle','written');
    await page.locator('[data-action="start"]').click();await page.fill('#response','An alternative answer');
    await page.reload();await page.locator('[data-action="continue"]').click();assert.equal(await page.inputValue('#response'),'An alternative answer');
    await page.locator('[data-action="reveal"]').click();assert.match(await page.locator('.comparison').innerText(),/podría ser válida/);
    await page.locator('[data-action="again"]').click();assert.match(await page.locator('.study-top').innerText(),/2 \/ 11/);
    await page.locator('[data-action="exit"]').click();
    await page.close();
    const p=await context.newPage();p.on('dialog',d=>d.accept());p.on('pageerror',e=>errors.push(e.message));await p.goto(url);
    await p.evaluate(()=>localStorage.clear());await p.reload();
    await p.locator('[data-mode="usage"]').click();await p.locator('[data-action="start"]').click();
    await p.keyboard.press('Space');assert.equal(await p.locator('.answer').count(),1);await p.keyboard.press('3');
    while(await p.locator('[data-action="reveal"]').count()){await p.locator('[data-action="reveal"]').click();await p.locator('[data-action="easy"]').click();}
    assert.match(await p.locator('h1').innerText(),/Un paso más/);assert.equal(await p.locator('tbody tr').count(),10);
    await p.locator('[data-action="home"]').click();await p.locator('[data-mode="identify"]').click();await p.locator('[data-action="start"]').click();assert.equal(await p.locator('#response').count(),0);
    await p.locator('[data-action="reveal"]').click();await p.locator('[data-action="again"]').click();await p.locator('[data-action="exit"]').click();await p.locator('[data-action="failed"]').click();assert.match(await p.locator('.study-top').innerText(),/1 \/ 1/);
    await p.locator('[data-view="settings"]').click();await p.locator('[data-action="reset"]').click();assert.equal(await p.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('grammar-recall-v1')).progress).length),0);
    await p.evaluate(()=>localStorage.setItem('grammar-recall-v1',JSON.stringify({version:99})));await p.reload();await p.locator('[data-view="home"]').click();await p.locator('[data-action="start"]').click();await p.locator('[data-action="reveal"]').click();await p.locator('[data-action="easy"]').click();assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('grammar-recall-v1')).version),99);
    await p.evaluate(()=>localStorage.clear());await p.reload();await p.locator('[data-view="home"]').click();
    await p.setViewportSize({width:1280,height:900});await p.screenshot({path:path.join(__dirname,'..','preview-desktop.png'),fullPage:true});
    await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:path.join(__dirname,'..','preview-mobile.png'),fullPage:true});
    await p.locator('[data-mode="build"]').click();assert.equal(await p.evaluate(()=>document.activeElement.dataset.mode),'build');await p.selectOption('#buildStyle','written');await p.selectOption('#size','20');await p.locator('[data-action="start"]').click();
    const model=await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('grammar-recall-v1')).session;return Recall.byKey[s.queue[s.index]].answer_en;});
    await p.fill('#response',model.toUpperCase());await p.locator('[data-action="reveal"]').click();assert.match(await p.locator('.comparison').innerText(),/Coincide/);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:path.join(__dirname,'..','preview-study-mobile.png'),fullPage:true});
    await p.locator('[data-action="exit"]').click();
    await context.setOffline(true);await p.reload();assert.equal(await p.locator('[data-structure]').count(),11);
    const blockedPage=await context.newPage();await blockedPage.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked for test')}}));await blockedPage.goto(url);assert.match(await blockedPage.locator('.notice').innerText(),/memoria/);await blockedPage.locator('[data-action="start"]').click();await blockedPage.locator('[data-action="reveal"]').click();await blockedPage.locator('[data-action="easy"]').click();assert.match(await blockedPage.locator('.study-top').innerText(),/2 \/ 10/);
    assert.deepEqual(errors,[]);console.log('Browser checks passed: file://, modes, persistence, ratings, summary, reset, future schema, mobile, offline.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
