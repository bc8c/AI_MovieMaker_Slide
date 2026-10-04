"use strict";
(() => {
  const prompts = window.LECTURE_ACTUAL_PROMPTS;
  const pages = [...document.querySelectorAll('.slide')];
  const viewer = document.createElement('dialog');
  viewer.className = 'prompt-dialog actual-prompt-dialog';
  viewer.setAttribute('aria-label', '실제 사용 프롬프트');
  viewer.innerHTML = '<header><strong></strong><div class="dialog-actions"><button type="button" class="dialog-copy">COPY · 전체 복사</button><button type="button" class="dialog-close">닫기 · ESC</button></div></header><div class="actual-prompt-meta"></div><pre tabindex="0" aria-label="실제 입력 프롬프트 전문"></pre>';
  document.body.append(viewer);
  const imageViewer = document.createElement('dialog');
  imageViewer.className = 'prompt-dialog reference-screen-dialog';
  imageViewer.setAttribute('aria-label', 'Kling 기준 이미지 화면 크게 보기');
  imageViewer.innerHTML = '<header><strong>Kling · 기준 이미지 화면</strong><button type="button">닫기 · ESC</button></header><img alt="Kling에서 캐릭터 참조 이미지를 등록하고 프롬프트로 장면 이미지를 생성한 실제 화면">';
  document.body.append(imageViewer);
  imageViewer.querySelector('img').src = window.LECTURE_MEDIA['kling-reference-ui'];
  imageViewer.querySelector('button').onclick = () => imageViewer.close();
  imageViewer.addEventListener('click', event => {
    const rect = imageViewer.getBoundingClientRect();
    if (event.target === imageViewer && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) imageViewer.close();
  });
  const referenceScreen = pages[22].querySelector('[data-media-id="kling-reference-ui"]');
  if (referenceScreen?.querySelector('img')) {
    const expand = document.createElement('button');
    expand.type = 'button';
    expand.className = 'reference-screen-expand';
    expand.textContent = '화면 크게 보기 ↗';
    expand.onclick = () => {
      imageViewer.querySelector('img').src = window.LECTURE_MEDIA['kling-reference-ui'];
      imageViewer.showModal();
      imageViewer.style.transform = `scale(${Math.min(1, (innerWidth - 60) / 1480, (innerHeight - 60) / 780)})`;
    };
    referenceScreen.append(expand);
  }
  let current;
  const resize = () => { viewer.style.transform = `scale(${Math.min(1, (innerWidth - 80) / 1180, (innerHeight - 60) / 740)})`; };
  function open(id) {
    current = prompts[id];
    document.querySelectorAll('video').forEach(video => video.pause());
    viewer.querySelector('strong').textContent = current.title;
    viewer.querySelector('.actual-prompt-meta').textContent = `실제 입력 전문 · ${current.tool}`;
    const pre = viewer.querySelector('pre');
    pre.textContent = current.text;
    pre.scrollTop = 0;
    viewer.showModal();
    resize();
    pre.focus();
  }
  viewer.querySelector('.dialog-copy').onclick = () => copyText(current.text);
  viewer.querySelector('.dialog-close').onclick = () => viewer.close();
  viewer.addEventListener('click', event => {
    const rect = viewer.getBoundingClientRect();
    if (event.target === viewer && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) viewer.close();
  });
  window.addEventListener('resize', resize);
  window.addEventListener('keydown', event => { if (viewer.open || imageViewer.open) event.stopImmediatePropagation(); }, true);
  function add(page, ids) {
    const group = document.createElement('div');
    group.className = 'actual-prompt-links';
    group.setAttribute('aria-label', '이 단계에서 실제 사용한 프롬프트');
    const label = document.createElement('span');
    label.textContent = '실제 사용 프롬프트';
    group.append(label);
    ids.forEach(id => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.actualPrompt = id;
      button.textContent = ids.length > 1 ? `SCENE ${id.slice(-1)} ↗` : '전체 보기 ↗';
      button.setAttribute('aria-label', `${prompts[id].title} 실제 사용 프롬프트 보기`);
      button.onclick = () => open(id);
      group.append(button);
    });
    pages[page - 1].append(group);
  }
  add(15, ['story']);
  add(16, ['story']);
  add(20, ['reference']);
  add(21, ['visual']);
  add(25, ['image1', 'image2', 'image3']);
  add(29, ['motion']);
  add(31, ['video1', 'video2', 'video3']);
})();
